//
// SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company and Gardener contributors
//
// SPDX-License-Identifier: Apache-2.0
//

import axios from 'axios'
import get from 'lodash/get'

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

/* General Purpose */

function getResource (url) {
  return axios.get(url)
}

function deleteResource (url) {
  return axios.delete(url)
}

function createResource (url, data) {
  return callResourceMethod(url, data)
}

function updateResource (url, data) {
  return axios.put(url, data)
}

function patchResource (url, data) {
  return axios.patch(url, data)
}

function callResourceMethod (url, data) {
  return axios.post(url, data)
}

/* Configuration */

export function getConfiguration () {
  return getResource('/config.json')
}

/* Infrastructures Secrets */

export function getInfrastructureSecrets ({ namespace }) {
  namespace = encodeURIComponent(namespace)
  return getResource(`/api/namespaces/${namespace}/infrastructure-secrets`)
}

export function updateInfrastructureSecret ({ namespace, name, data }) {
  namespace = encodeURIComponent(namespace)
  name = encodeURIComponent(name)
  return updateResource(`/api/namespaces/${namespace}/infrastructure-secrets/${name}`, data)
}

export function createInfrastructureSecret ({ namespace, data }) {
  namespace = encodeURIComponent(namespace)
  return createResource(`/api/namespaces/${namespace}/infrastructure-secrets`, data)
}

export function deleteInfrastructureSecret ({ namespace, name }) {
  namespace = encodeURIComponent(namespace)
  name = encodeURIComponent(name)
  return deleteResource(`/api/namespaces/${namespace}/infrastructure-secrets/${name}`)
}

/* Shoot Clusters */

export function createShoot ({ namespace, data }) {
  namespace = encodeURIComponent(namespace)
  return createResource(`/api/namespaces/${namespace}/shoots`, data)
}

export function deleteShoot ({ namespace, name }) {
  namespace = encodeURIComponent(namespace)
  name = encodeURIComponent(name)
  return deleteResource(`/api/namespaces/${namespace}/shoots/${name}`)
}

export function replaceShoot ({ namespace, name, data }) {
  namespace = encodeURIComponent(namespace)
  name = encodeURIComponent(name)
  return updateResource(`/api/namespaces/${namespace}/shoots/${name}`, data)
}

export function addShootAnnotation ({ namespace, name, data }) {
  namespace = encodeURIComponent(namespace)
  name = encodeURIComponent(name)
  return patchResource(`/api/namespaces/${namespace}/shoots/${name}/metadata/annotations`, data)
}

export function getShootInfo ({ namespace, name }) {
  namespace = encodeURIComponent(namespace)
  name = encodeURIComponent(name)
  return getResource(`/api/namespaces/${namespace}/shoots/${name}/info`)
}

export function getShootSeedInfo ({ namespace, name }) {
  namespace = encodeURIComponent(namespace)
  name = encodeURIComponent(name)
  return getResource(`/api/namespaces/${namespace}/shoots/${name}/seed-info`)
}

export function updateShootVersion ({ namespace, name, data }) {
  namespace = encodeURIComponent(namespace)
  name = encodeURIComponent(name)
  return updateResource(`/api/namespaces/${namespace}/shoots/${name}/spec/kubernetes/version`, data)
}

export function updateShootMaintenance ({ namespace, name, data }) {
  namespace = encodeURIComponent(namespace)
  name = encodeURIComponent(name)
  return updateResource(`/api/namespaces/${namespace}/shoots/${name}/spec/maintenance`, data)
}

export function updateShootHibernationSchedules ({ namespace, name, data }) {
  namespace = encodeURIComponent(namespace)
  name = encodeURIComponent(name)
  return updateResource(`/api/namespaces/${namespace}/shoots/${name}/spec/hibernation/schedules`, data)
}

export function updateShootHibernation ({ namespace, name, data }) {
  namespace = encodeURIComponent(namespace)
  name = encodeURIComponent(name)
  return updateResource(`/api/namespaces/${namespace}/shoots/${name}/spec/hibernation/enabled`, data)
}

export function patchShootProvider ({ namespace, name, data }) {
  namespace = encodeURIComponent(namespace)
  name = encodeURIComponent(name)
  return patchResource(`/api/namespaces/${namespace}/shoots/${name}/spec/provider`, data)
}

export function updateShootAddons ({ namespace, name, data }) {
  namespace = encodeURIComponent(namespace)
  name = encodeURIComponent(name)
  return updateResource(`/api/namespaces/${namespace}/shoots/${name}/spec/addons`, data)
}

export async function getShootSchemaDefinition () {
  const definitions = await getResource('/api/openapi')
  return get(definitions, ['data', 'com.github.gardener.gardener.pkg.apis.core.v1beta1.Shoot'])
}

export function updateShootPurpose ({ namespace, name, data }) {
  namespace = encodeURIComponent(namespace)
  name = encodeURIComponent(name)
  return updateResource(`/api/namespaces/${namespace}/shoots/${name}/spec/purpose`, data)
}

/* Cloud Profiles */

export function getCloudprofiles () {
  return getResource('/api/cloudprofiles')
}

/* Seeds */

export function getSeeds () {
  return getResource('/api/seeds')
}

/* Projects */

export function getProjects () {
  return getResource('/api/namespaces')
}

export function createProject ({ data }) {
  return createResource('/api/namespaces', data)
}

export function patchProject ({ namespace, data }) {
  namespace = encodeURIComponent(namespace)
  return patchResource(`/api/namespaces/${namespace}`, data)
}

export function updateProject ({ namespace, data }) {
  namespace = encodeURIComponent(namespace)
  return updateResource(`/api/namespaces/${namespace}`, data)
}

export function deleteProject ({ namespace }) {
  namespace = encodeURIComponent(namespace)
  return deleteResource(`/api/namespaces/${namespace}`)
}

/* Members */

export function getMembers ({ namespace }) {
  namespace = encodeURIComponent(namespace)
  return getResource(`/api/namespaces/${namespace}/members`)
}

export function addMember ({ namespace, data }) {
  namespace = encodeURIComponent(namespace)
  return createResource(`/api/namespaces/${namespace}/members`, data)
}

export function updateMember ({ namespace, name, data }) {
  namespace = encodeURIComponent(namespace)
  name = encodeURIComponent(name)
  return updateResource(`/api/namespaces/${namespace}/members/${name}`, data)
}

export function getMember ({ namespace, name }) {
  namespace = encodeURIComponent(namespace)
  name = encodeURIComponent(name)
  return getResource(`/api/namespaces/${namespace}/members/${name}`)
}

export function deleteMember ({ namespace, name }) {
  namespace = encodeURIComponent(namespace)
  name = encodeURIComponent(name)
  return deleteResource(`/api/namespaces/${namespace}/members/${name}`)
}

export function rotateServiceAccountSecret ({ namespace, name }) {
  namespace = encodeURIComponent(namespace)
  name = encodeURIComponent(name)
  return callResourceMethod(`/api/namespaces/${namespace}/members/${name}`, {
    method: 'rotateSecret'
  })
}

/* User */
export function createTokenReview (data) {
  return createResource('/auth', data)
}

export function getPrivileges () {
  return getResource('/api/user/privileges')
}

export function getSubjectRules ({ namespace = 'default' }) {
  return callResourceMethod('/api/user/subjectrules/', {
    namespace
  })
}

export function getToken () {
  return getResource('/api/user/token')
}

export function getKubeconfigData () {
  return getResource('/api/user/kubeconfig')
}

/* Info */
export function getInfo () {
  return getResource('/api/info')
}

/* Terminals */

export function createTerminal ({ namespace, name, target, body = {} }) {
  body.coordinate = {
    name,
    namespace,
    target
  }
  return invokeTerminalMethod('create', body)
}

export function fetchTerminalSession ({ namespace, name, target, body = {} }) {
  body.coordinate = {
    name,
    namespace,
    target
  }
  return invokeTerminalMethod('fetch', body)
}

export function listTerminalSessions ({ namespace, body = {} }) {
  body.coordinate = {
    namespace
  }
  return invokeTerminalMethod('list', body)
}

export function deleteTerminal ({ namespace, name, target, body = {} }) {
  body.coordinate = {
    name,
    namespace,
    target
  }
  return invokeTerminalMethod('remove', body)
}

export function heartbeat ({ namespace, name, target, body = {} }) {
  body.coordinate = {
    name,
    namespace,
    target
  }
  return invokeTerminalMethod('heartbeat', body)
}

export function terminalConfig ({ namespace, name, target, body = {} }) {
  body.coordinate = {
    name,
    namespace,
    target
  }
  return invokeTerminalMethod('config', body)
}

function invokeTerminalMethod (method, body) {
  return callResourceMethod('/api/terminals', {
    method,
    params: body
  })
}

/* Terminal Shortcuts */

export function listProjectTerminalShortcuts ({ namespace, body = {} }) {
  body.coordinate = {
    namespace
  }
  return invokeTerminalMethod('listProjectTerminalShortcuts', body)
}

/* Controller Registrations */

export function getGardenerExtensions () {
  return getResource('/api/gardener-extensions')
}

export function getNetworkingTypes () {
  return getResource('/api/networking-types')
}
