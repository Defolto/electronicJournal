import { existsSync, readFileSync, writeFileSync } from 'fs'
import jsBeautify from 'js-beautify'
import * as log4js from 'log4js'
import { sendError } from './telegram'

export default class Logger {
   private static instance: Logger | null = null
   private _logger

   private constructor() {
      const logger = log4js.getLogger('helpfront')
      logger.level = 'debug'
      this._logger = logger
   }

   private fullMessage(message: any, fileName: string = '', params: {} = {}) {
      return `FileName: ${fileName}, error ${message}, params: ${jsBeautify(JSON.stringify(params), { indent_size: 4 })}`
   }

   public static getInstance(): Logger {
      if (!Logger.instance) {
         Logger.instance = new Logger()
      }
      return Logger.instance
   }

   public trace(message: any, fileName: string = '', params: {} = {}): void {
      const fullMessage = this.fullMessage(message, fileName, params)
      this._logger.trace(fullMessage)
   }

   public debug(message: any, fileName: string = '', params: {} = {}): void {
      const fullMessage = this.fullMessage(message, fileName, params)
      this._logger.debug(fullMessage)
   }

   public info(message: any, fileName: string = '', params: {} = {}): void {
      const fullMessage = this.fullMessage(message, fileName, params)
      this._logger.info(fullMessage)
   }

   public warn(message: any, fileName: string = '', params: {} = {}): void {
      const fullMessage = this.fullMessage(message, fileName, params)
      this._logger.warn(fullMessage)
      const data = `[${new Date().toString()}] [warn] ${fullMessage}`
      if (!existsSync('warn.txt')) {
         writeFileSync('warn.txt', data)
      }
      const lastData = readFileSync('warn.txt').toString()
      writeFileSync('warn.txt', `${lastData}\n${data}`)
   }

   public error(message: any, fileName: string = '', params: {} = {}): void {
      const fullMessage = this.fullMessage(message, fileName, params)
      this._logger.error(fullMessage)
      const data = `[${new Date().toString()}] [error] ${fullMessage}`
      sendError(data)
      if (!existsSync('error.txt')) {
         writeFileSync('error.txt', data)
      }
      const lastData = readFileSync('error.txt').toString()
      writeFileSync('error.txt', `${lastData}\n${data}`)
   }

   public fatal(message: any, fileName: string = '', params: {} = {}): void {
      const fullMessage = this.fullMessage(message, fileName, params)
      this._logger.fatal(fullMessage)
      const data = `[${new Date().toString()}] [fatal] ${fullMessage}`
      sendError(data)
      if (!existsSync('error.txt')) {
         writeFileSync('error.txt', data)
      }
      const lastData = readFileSync('error.txt').toString()
      writeFileSync('error.txt', `${lastData}\n${data}`)
   }

   public mark(message: any, fileName: string = '', params: {} = {}): void {
      const fullMessage = this.fullMessage(message, fileName, params)
      this._logger.mark(fullMessage)
   }
}
