//
// SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company and Gardener contributors
//
// SPDX-License-Identifier: Apache-2.0
//

'use strict'

const chalk = require('chalk')
const util = require('util')

const LEVELS = {
  trace: 1,
  debug: 2,
  info: 3,
  warn: 4,
  error: 5
}

class Logger {
  constructor ({ logLevel = 'debug', logHttpRequestBody = false } = {}) {
    this.logLevel = LEVELS[logLevel] || 3
    this.logHttpRequestBody = logHttpRequestBody === true
    this.silent = /^test/.test(process.env.NODE_ENV)
    this.console = console
  }

  inspect (obj) {
    return util.inspect(obj, { depth: Infinity, colors: true })
  }

  isDisabled (level) {
    return this.silent || level < this.logLevel
  }

  get ts () {
    const ts = new Date().toISOString().replace(/T/, ' ').replace(/Z/, '')
    return chalk.whiteBright(ts)
  }

  get stream () {
    const logger = this
    return {
      write (msg, encoding) {
        if (msg) {
          logger.http(msg.replace(/[\n\s]*$/, ''))
        }
      }
    }
  }

  connect ({ url, user, headers }) {
    if (!this.isDisabled(LEVELS.trace + 1)) {
      const ident = user && typeof user === 'object' ? `${user.type}=${user.id}` : '-'
      const host = headers.host || url.host || '-'
      const path = url.path || (url.pathname + url.search)
      const msg = `CONNECT ${path} ${ident} ${host}`
      this.console.log(this.ts + ' ' + chalk.black.bgMagenta('ws') + '   : ' + msg)
    }
  }

  request ({ id, url, method, httpVersion = '1.1', user, headers, body }) {
    if (!this.isDisabled(LEVELS.debug)) {
      const ident = user && typeof user === 'object' ? `${user.type}=${user.id}` : '-'
      const host = headers.host || url.host || '-'
      const path = url.path || (url.pathname + url.search)
      id = id || headers['x-request-id']
      let msg = `${method} ${path} HTTP/${httpVersion} [${id}] ${ident} ${host}`
      if (this.logHttpRequestBody && body) {
        msg += ' ' + body.toString('utf8')
      }
      this.console.log(this.ts + ' ' + chalk.black.bgGreen('req') + '  : ' + msg)
    }
  }

  response ({ id, url, method, statusCode, statusMessage = '', httpVersion = '1.1', headers, duration, body }) {
    if (!this.isDisabled(LEVELS.debug)) {
      let msg = `HTTP/${httpVersion} ${statusCode} ${statusMessage} [${id}]`
      if (method && url) {
        msg += ` ${method} ${url.path || (url.pathname + url.search)}`
      }
      if (duration) {
        msg += ` ${duration}ms`
      }
      if (body && statusCode >= 300 && !this.isDisabled(LEVELS.trace)) {
        msg += '\n' + this.inspect(body)
      }
      this.console.log(this.ts + ' ' + chalk.black.bgBlue('res') + '  : ' + msg)
    }
  }

  http (msg, ...args) {
    if (!this.isDisabled(LEVELS.info)) {
      this.console.log(this.ts + ' ' + chalk.magenta('http') + ' : ' + msg, ...args)
    }
  }

  log (msg, ...args) {
    if (!this.isDisabled(LEVELS.warn)) {
      this.console.log(this.ts + ' ' + chalk.whiteBright('log') + '  : ' + msg, ...args)
    }
  }

  trace (msg, ...args) {
    if (!this.isDisabled(LEVELS.trace)) {
      this.console.log(this.ts + ' ' + chalk.cyan('trace') + ': ' + msg, ...args)
    }
  }

  debug (msg, ...args) {
    if (!this.isDisabled(LEVELS.debug)) {
      this.console.debug(this.ts + ' ' + chalk.blue('debug') + ': ' + msg, ...args)
    }
  }

  info (msg, ...args) {
    if (!this.isDisabled(LEVELS.info)) {
      this.console.info(this.ts + ' ' + chalk.green('info') + ' : ' + msg, ...args)
    }
  }

  warn (msg, ...args) {
    if (!this.isDisabled(LEVELS.warn)) {
      this.console.warn(this.ts + ' ' + chalk.yellow('warn') + ' : ' + msg, ...args)
    }
  }

  error (msg, ...args) {
    if (!this.isDisabled(LEVELS.error)) {
      this.console.error(this.ts + ' ' + chalk.red('error') + ': ' + msg, ...args)
    }
  }
}

Logger.prototype.LEVELS = Logger.LEVELS = LEVELS

module.exports = Logger
