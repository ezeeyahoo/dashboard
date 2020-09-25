//
// SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company and Gardener contributors
//
// SPDX-License-Identifier: Apache-2.0
//

import { expect } from 'chai'
import { unique, serviceAccountKey } from '@/utils/validators'

describe('utils', function () {
  describe('validators', function () {
    const parentVm = {
      keys: [1, 2, 3, false]
    }
    describe('#unique', function () {
      it('should not validate duplicate values', function () {
        expect(unique('keys')(3, parentVm)).to.be.false
      })
      it('should validate unique values', function () {
        expect(unique('keys')(0, parentVm)).to.be.true
      })
    })

    describe('#serviceAccountKey', function () {
      it('should not validate invalid JSON', function () {
        expect(serviceAccountKey('{"valid": false')).to.be.false
      })
      it('should not validate valid JSON with invalid project_id', function () {
        expect(serviceAccountKey('{"project_id": "inval!dProjectId"}')).to.be.false
      })
      it('should validate valid JSON with project_id', function () {
        expect(serviceAccountKey('{"project_id": "val1d-Pr0ject_ID"}')).to.be.true
      })
    })
  })
})
