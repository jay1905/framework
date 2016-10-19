/* @flow */
/* eslint-disable no-console */
import "./util/polyfill"

import http from "http"

import hostPkg from "./util/host-pkg"

import Logger from "./util/logger"
import MemoryConsole from "./util/memory-console"
import Router from "./router"
import Context from "./context"

import {NotFound, InternalServerError} from "./errors"
import * as middleware from "./middleware"

import type {Next, Stack} from "./middleware"
import type {Request, Response} from "./context"

export type ApplicationOptions = {
  port?: number,
  server?: http.Server,
  logger?: Logger,
  router?: Router,
}

type IdlingSocket = net$Socket & {
  idle?: boolean,
}

type CancellingRequest = Request & {
  cancelled?: boolean,
}

type ClosingServer = http.Server & {
  closing?: boolean,
}

const description = `${hostPkg.name} service ${process.env.HOSTNAME || ""}`.trim()

export class Application {
  port: number = 3000

  router: Router
  logger: Logger
  stack: Stack

  description: string = description
  server: ClosingServer = http.createServer()
  sockets: Set<IdlingSocket> = new Set
  requests: Set<CancellingRequest> = new Set

  /* Start a new application with the given options in next tick. */
  static start(options: ApplicationOptions = {}) {
    const app = new Application(options)
    process.nextTick(() => {app.start()})
    return app
  }

  constructor(options: ApplicationOptions = {}) {
    /* Override properties. */
    Object.assign(this, options)

    /* Assign default env. */
    if (!process.env.NODE_ENV) {
      process.env.NODE_ENV = "development"
    }

    if (!this.router) {
      this.router = new Router
    }

    if (!this.logger) {
      const formatter = process.env.NODE_ENV === "development" ? Logger.PRETTY : Logger.JSON
      const target = process.env.NODE_ENV === "test" ? new MemoryConsole : console
      this.logger = new Logger(target, formatter)
    }

    /* Bare minimum stack to do anything useful. */
    this.stack = [
      middleware.log(this.logger),
      middleware.write(),
      middleware.rescue(),
      middleware.route(this.router),
    ]

    Object.freeze(this)
  }

  start(): Promise<Application> {
    this.server.timeout = 0

    process.on("SIGTERM", async () => {
      await this.stop()
      process.exit(0)
    })

    process.on("SIGINT", async () => {
      await this.stop()
      process.exit(0)
    })

    process.on("uncaughtException", async (err: Error) => {
      this.logger.critical(`uncaught ${err.stack}`)
      await this.stop()
      process.exit(1)
    })

    this.server.on("connection", (socket: IdlingSocket) => {
      socket.idle = true

      socket.on("close", () => {
        this.sockets.delete(socket)
      })

      this.sockets.add(socket)
    })

    this.server.on("request", (request: Request, response: Response) => {
      const socket: IdlingSocket = request.socket
      socket.idle = false

      if (this.server.closing) {
        response.removeHeader("Connection")
        response.setHeader("Connection", "close")
      }

      response.on("finish", () => {
        socket.idle = true

        if (this.server.closing) {
          this.logger.debug(`closing connection ${socket.remoteAddress || "unknown"}:${socket.remotePort}`)
          socket.end()
        }
      })
    })

    // ES7: this.server.on("request", ::this.dispatch)
    this.server.on("request", this.dispatch.bind(this))

    const started = new Promise(resolve => {
      this.server.once("listening", () => {
        resolve(this)
      })
    })

    this.logger.notice(`starting ${this.description}`)

    this.server.listen(this.port)

    return started
  }

  stop(): Promise<Application> {
    this.server.closing = true

    this.logger.notice(`stopping ${this.description}`)

    const stopped = new Promise(resolve => {
      this.server.once("close", () => {
        this.logger.notice(`gracefully stopped ${this.description}`)
        resolve(this)
      })
    })

    for (const request of this.requests) {
      request.cancelled = true
    }

    this.server.close()

    for (const socket of this.sockets) {
      if (socket.idle) {
        this.logger.debug(`closing idle connection ${socket.remoteAddress || "unknown"}:${socket.remotePort}`)
        socket.end()
      }
    }

    return stopped
  }

  dispatch(req: Request, res: Response): void {
    const stack = this.stack.slice(0)
    const context = new Context(this, stack, req, res)
    const handler = compose(stack, context)

    const call = async () => {
      try {
        this.requests.add(context.req)
        await handler()
      } finally {
        this.requests.delete(context.req)
      }
    }

    Promise.resolve(call()).catch(err => {
      process.nextTick(() => {throw err})
    })
  }

  inspect() {
    return {
      router: this.router,
      stack: this.stack,
      server: "<node server>",
    }
  }
}

export default Application

function compose(stack: Stack, context: Context): Next {
  const iterator = stack.values()

  return function next() {
    const handler = iterator.next().value

    /* Check if a handler is present and valid. */
    if (!handler) {
      throw new NotFound("Endpoint does not exist")
    }

    if (typeof handler !== "function") {
      throw new InternalServerError("Bad handler")
    }

    // ES7: return context::handler(next)
    return handler.call(context, next)
  }
}