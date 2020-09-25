//
// SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company and Gardener contributors
//
// SPDX-License-Identifier: Apache-2.0
//

'use strict'

const path = require('path')
const util = require('util')
const childProcess = require('child_process')
const exec = util.promisify(childProcess.exec)
const yaml = require('js-yaml')

process.env.NODE_ENV = 'test'

/*!
 * Attach chai to global
 */
global.chai = require('chai')
global.expect = global.chai.expect

async function helmTemplate (template, pathToValues) {
  const cwd = path.resolve(__dirname, '..', '..', template)
  const cmd = [
    '/usr/local/bin/helm',
    'template',
    '.',
    '--values',
    pathToValues
  ]
  const { stdout } = await exec(cmd.join(' '), { cwd })
  return yaml.safeLoadAll(stdout)
}
global.helmTemplate = helmTemplate
