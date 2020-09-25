//
// SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company and Gardener contributors
//
// SPDX-License-Identifier: Apache-2.0
//

'use strict'

const { HTTPError } = require('../lib/http-client')
const { createClient } = require('../lib/kubernetes-client')

describe('kubernetes-client', function () {
  /* eslint no-unused-expressions: 0 */

  const sandbox = sinon.createSandbox()

  afterEach(function () {
    sandbox.restore()
  })

  describe('Client', function () {
    const bearer = 'bearer'
    const namespace = 'namespace'
    const name = 'name'

    let testClient
    let getSecretStub

    beforeEach(function () {
      testClient = createClient({ auth: { bearer } })
      getSecretStub = sandbox.stub(testClient.core.secrets, 'get')
    })

    it('should create a client', function () {
      expect(testClient.constructor.name).to.equal('Client')
      expect(testClient.cluster.server.hostname).to.equal('kubernetes')
    })

    it('should read a kubeconfig from a secret', async function () {
      getSecretStub.returns({
        data: {
          kubeconfig: Buffer.from('foo').toString('base64')
        }
      })
      const kubeconfig = await testClient.getKubeconfig({ namespace, name })
      expect(getSecretStub).to.be.calledOnceWith(namespace, name)
      expect(kubeconfig).to.equal('foo')
    })

    it('should not find a kubeconfig in the secret', async function () {
      getSecretStub.returns({
        data: {}
      })
      try {
        await testClient.getKubeconfig({ namespace, name })
        expect.fail('expected "getKubeconfig" to throw not found')
      } catch (err) {
        expect(err).to.be.instanceof(HTTPError)
        expect(err.response.statusCode).to.equal(404)
      }
    })
  })
})
