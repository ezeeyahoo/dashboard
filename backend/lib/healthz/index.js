//
// SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company and Gardener contributors
//
// SPDX-License-Identifier: Apache-2.0
//

'use strict'

const { format: fmt } = require('util')
const {
  dashboardClient,
  isHttpError
} = require('../kubernetes-client')

async function healthCheck (transitive = false) {
  if (transitive === true) {
    try {
      await dashboardClient.healthz.get()
    } catch (err) {
      if (isHttpError(err)) {
        const response = err.response
        throw new Error(fmt('Kubernetes apiserver is not healthy. Healthz endpoint returned: %s (Status code: %s)', response.body, response.statusCode))
      }
      throw new Error(fmt('Could not reach Kubernetes apiserver healthz endpoint. Request failed with error: %s', err))
    }
  }
}

module.exports = {
  healthCheck
}
