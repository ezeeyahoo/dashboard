//
// SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company and Gardener contributors
//
// SPDX-License-Identifier: Apache-2.0
//

'use strict'

const pEvent = require('p-event')
const http = require('http')
const express = require('express')
const WebSocket = require('ws')

const HttpClient = require('../lib/kubernetes-client/HttpClient')
const {
  http: httpSymbols,
  ws: wsSymbols
} = require('../lib/kubernetes-client/symbols')

describe('kubernetes-client', function () {
  /* eslint no-unused-expressions: 0 */

  const sandbox = sinon.createSandbox()

  afterEach(function () {
    sandbox.restore()
  })

  describe('HttpClient', function () {
    let server
    let wss
    let origin
    let client

    const app = express()
    app.get('/foo', (req, res) => {
      res.send('bar')
    })

    class TestClient extends HttpClient {
      constructor (url, options) {
        super({
          url,
          throwHttpErrors: true,
          resolveBodyOnly: true,
          ...options
        })
      }

      get () {
        return this[httpSymbols.request]('foo', { method: 'get' })
      }

      echo (options) {
        const searchParams = new URLSearchParams(options)
        return this[wsSymbols.connect]('echo', { searchParams })
      }
    }

    beforeEach(async function () {
      server = http.createServer(app)
      wss = new WebSocket.Server({ server, path: '/echo' })
      wss.on('connection', socket => {
        socket.on('message', message => socket.send(message))
      })
      server.listen(0, 'localhost')
      await pEvent(server, 'listening', {
        timeout: 200
      })
      const { address, port } = server.address()
      origin = `http://${address}:${port}`
    })

    afterEach(function () {
      wss.close()
      server.close()
      client[httpSymbols.agent].destroy()
    })

    it('should assert "beforeRequest" hook parameters', async function () {
      client = new TestClient(origin, {
        headers: {
          foo: 'bar'
        },
        hooks: {
          beforeRequest: [
            options => {
              const { url, method, headers } = options
              expect(url).to.be.instanceof(URL)
              expect(url.origin).to.equal(origin)
              expect(method).to.equal('GET')
              expect(headers.foo).to.equal('bar')
            }
          ]
        }
      })
      const body = await client.get()
      expect(body).to.equal('bar')
    })

    it('should open a websocket echo socket', async function () {
      client = new TestClient(origin)
      const echoSocket = client.echo()
      await pEvent(echoSocket, 'open')
      echoSocket.send('foobar')
      const message = await pEvent(echoSocket, 'message')
      expect(message).to.equal('foobar')
    })
  })
})
