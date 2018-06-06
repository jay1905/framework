/* @flow */
import "./util/polyfill"

import AbstractTask from "./util/abstract-task"
import Logger from "./util/logger"

/* $Shape<T> makes every property optional. */
export type TaskOptions = $Shape<{
  logger: Logger,
}>

export class Task extends AbstractTask {
  /* Start a new task with the given options in next tick. */
  static start(options: TaskOptions = {}) {
    const task = new this(options)
    process.nextTick(() => {task.start()})
    return task
  }

  constructor(options: TaskOptions = {}) {
    super()

    const {
      logger = new Logger(this.description),
    } = options

    this.logger = logger

    Object.freeze(this)
  }

  async start(): Promise<void> {
    await super.start()
    await this.run()
    await this.stop()
  }

  async run(): Promise<void> {}
}

export default Task
