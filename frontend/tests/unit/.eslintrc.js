// SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company and Gardener contributors
//
// SPDX-License-Identifier: Apache-2.0

module.exports = {
  env: {
    mocha: true
  },
  plugins: [
    'chai-friendly'
  ],
  rules: {
    'no-unused-expressions': 0,
    'chai-friendly/no-unused-expressions': 2
  },
  globals: {
    sinon: true,
    chai: true
  }
}
