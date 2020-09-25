//
// SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company and Gardener contributors
//
// SPDX-License-Identifier: Apache-2.0
//

'use strict'

class HTTPError extends Error {
  constructor (response) {
    super(`Response code ${response.statusCode} (${response.statusMessage})`)
    this.name = this.constructor.name
    this.response = response
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = HTTPError
