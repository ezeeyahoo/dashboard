//
// SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company and Gardener contributors
//
// SPDX-License-Identifier: Apache-2.0
//

import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import WildcardSelect from '@/components/WildcardSelect.vue'
import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuelidate from 'vuelidate'

Vue.use(Vuetify)
Vue.use(Vuelidate)

const sampleWildcardItems = [
  '*Foo',
  'Foo',
  '*',
  'Bar*',
  'BarBla'
]

function createWildcardSelecteComponent (selectedWildcardItem) {
  const propsData = {
    wildcardSelectItems: sampleWildcardItems,
    wildcardSelectLabel: 'FooBar',
    value: selectedWildcardItem
  }
  const wrapper = shallowMount(WildcardSelect, {
    propsData
  })
  const wildcardSelectComponent = wrapper.find(WildcardSelect)

  return wildcardSelectComponent.vm
}

describe('WildcardSelect.vue', function () {
  it('should prefer non wildcard value', function () {
    const wildcardSelect = createWildcardSelecteComponent('Foo')
    const wildcardSelectedValue = wildcardSelect.wildcardSelectedValue
    const wildcardVariablePart = wildcardSelect.wildcardVariablePart
    expect(wildcardSelectedValue.value).to.equal('Foo')
    expect(wildcardSelectedValue.isWildcard).to.be.false
    expect(wildcardVariablePart).to.equal('')
  })

  it('should select start wildcard', function () {
    const wildcardSelect = createWildcardSelecteComponent('TestFoo')
    const wildcardSelectedValue = wildcardSelect.wildcardSelectedValue
    const wildcardVariablePart = wildcardSelect.wildcardVariablePart
    expect(wildcardSelectedValue.value).to.equal('Foo')
    expect(wildcardSelectedValue.isWildcard).to.be.true
    expect(wildcardSelectedValue.startsWithWildcard).to.be.true
    expect(wildcardVariablePart).to.equal('Test')
  })

  it('should select end wildcard', function () {
    const wildcardSelect = createWildcardSelecteComponent('BarTest')
    const wildcardSelectedValue = wildcardSelect.wildcardSelectedValue
    const wildcardVariablePart = wildcardSelect.wildcardVariablePart
    expect(wildcardSelectedValue.value).to.equal('Bar')
    expect(wildcardSelectedValue.isWildcard).to.be.true
    expect(wildcardSelectedValue.endsWithWildcard).to.be.true
    expect(wildcardVariablePart).to.equal('Test')
  })

  it('should select longest match', function () {
    const wildcardSelect = createWildcardSelecteComponent('BarBla')
    const wildcardSelectedValue = wildcardSelect.wildcardSelectedValue
    const wildcardVariablePart = wildcardSelect.wildcardVariablePart
    expect(wildcardSelectedValue.value).to.equal('BarBla')
    expect(wildcardSelectedValue.isWildcard).to.be.false
    expect(wildcardVariablePart).to.equal('')
  })

  it('should select wildcard if inital value is wildcard', function () {
    const wildcardSelect = createWildcardSelecteComponent('Bar*')
    const wildcardSelectedValue = wildcardSelect.wildcardSelectedValue
    const wildcardVariablePart = wildcardSelect.wildcardVariablePart
    expect(wildcardSelectedValue.value).to.equal('Bar')
    expect(wildcardSelectedValue.endsWithWildcard).to.be.true
    expect(wildcardVariablePart).to.equal('')
  })

  it('Should select initial custom wildcard value', function () {
    const wildcardSelect = createWildcardSelecteComponent('*')
    const wildcardSelectedValue = wildcardSelect.wildcardSelectedValue
    const wildcardVariablePart = wildcardSelect.wildcardVariablePart
    expect(wildcardSelectedValue.value).to.equal('')
    expect(wildcardSelectedValue.customWildcard).to.be.true
    expect(wildcardVariablePart).to.equal('')
  })

  it('Should select custom wildcard', function () {
    const wildcardSelect = createWildcardSelecteComponent('RandomValue')
    const wildcardSelectedValue = wildcardSelect.wildcardSelectedValue
    const wildcardVariablePart = wildcardSelect.wildcardVariablePart
    expect(wildcardSelectedValue.value).to.equal('')
    expect(wildcardSelectedValue.customWildcard).to.be.true
    expect(wildcardVariablePart).to.equal('RandomValue')
  })
})
