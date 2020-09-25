//
// SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company and Gardener contributors
//
// SPDX-License-Identifier: Apache-2.0
//

'use strict'

const HTTPClient = require('./HTTPClient')
const HTTPError = require('./HTTPError')

module.exports = {
  HTTPError,
  HTTPClient,
  extend (options) {
    return new HTTPClient(options)
  }
}
