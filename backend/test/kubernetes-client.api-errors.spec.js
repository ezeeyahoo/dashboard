//
// SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company and Gardener contributors
//
// SPDX-License-Identifier: Apache-2.0
//

'use strict'

const { HTTPError } = require('../lib/http-client')

const {
  StatusError,
  CacheExpiredError,
  isExpiredError,
  isResourceExpired,
  isGone,
  isTooLargeResourceVersionError,
  isGatewayTimeout
} = require('../lib/kubernetes-client/ApiErrors')

describe('kubernetes-client', function () {
  /* eslint no-unused-expressions: 0 */

  const sandbox = sinon.createSandbox()

  afterEach(function () {
    sandbox.restore()
  })

  describe('ApiErrors', function () {
    const code = 'code'
    const message = 'message'
    const reason = 'reason'

    it('should create a StatusError instance', function () {
      const statusError = new StatusError({ code, message, reason })
      expect(statusError).to.be.an.instanceof(Error)
      expect(statusError).to.have.property('stack')
      expect(statusError.code).to.equal(code)
      expect(statusError.message).to.equal(message)
      expect(statusError.reason).to.equal(reason)
    })

    it('should create a CacheExpiredError instance', function () {
      const error = new CacheExpiredError('Cache expired')
      expect(error).to.be.an.instanceof(Error)
      expect(error).to.have.property('stack')
      expect(error.code).to.equal(410)
      expect(error.message).to.equal('Cache expired')
      expect(error.reason).to.equal('Expired')
    })

    it('should check if a status error has code "Gone"', function () {
      const code = 410
      let error = new StatusError({ code })
      expect(isGone(error)).to.be.true
      expect(isExpiredError(error)).to.be.true
      error = new HTTPError({ statusCode: code })
      expect(isGone(error)).to.be.true
      expect(isExpiredError(error)).to.be.true
    })

    it('should check if a status error has reason "Expired"', function () {
      const reason = 'Expired'
      let error = new StatusError({ reason })
      expect(isResourceExpired(error)).to.be.true
      expect(isExpiredError(error)).to.be.true
      error = new HTTPError({ statusMessage: reason })
      expect(isResourceExpired(error)).to.be.true
      expect(isExpiredError(error)).to.be.true
    })

    it('should only consider StatusError or HTTPError instances', function () {
      const error = new Error()
      error.reason = 'Expired'
      expect(isExpiredError(error)).to.be.false
    })

    it('should handle "Resource version too large" errors correctly', function () {
      const code = 504
      const reason = 'Timeout'
      let error = new HTTPError({
        statusCode: code,
        statusMessage: reason
      })
      expect(isGatewayTimeout(error)).to.be.true
      expect(isTooLargeResourceVersionError(error)).to.be.true
      error = new HTTPError({
        body: {
          code,
          reason
        }
      })
      expect(isGatewayTimeout(error)).to.be.true
      expect(isTooLargeResourceVersionError(error)).to.be.true
      error = new HTTPError({
        body: {
          code,
          reason: 'Gateway Timeout',
          details: {
            causes: [{ message: 'Too large resource version' }]
          }
        }
      })
      expect(isGatewayTimeout(error)).to.be.false
      expect(isTooLargeResourceVersionError(error)).to.be.true
      error = new HTTPError({
        body: {
          details: {
            causes: [{ reason: 'ResourceVersionTooLarge' }]
          }
        }
      })
      expect(isGatewayTimeout(error)).to.be.false
      expect(isTooLargeResourceVersionError(error)).to.be.true
    })
  })
})
