//
// SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company and Gardener contributors
//
// SPDX-License-Identifier: Apache-2.0
//

import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import CodeBlock from '@/components/CodeBlock.vue'
import Vue from 'vue'
import Vuetify from 'vuetify'

Vue.use(Vuetify)

describe('CodeBlock.vue', function () {
  it('should render correct contents', function () {
    const propsData = {
      lang: 'yaml',
      content: `
        ---
        foo: true
        bar: 42`
    }
    const wrapper = shallowMount(CodeBlock, {
      propsData
    })
    const vm = wrapper.vm
    return new Promise(resolve => vm.$nextTick(resolve))
      .then(() => {
        const codeElement = vm.$el.querySelector('code.yaml')
        expect(codeElement).to.be.an.instanceof(HTMLElement)
        expect(codeElement.querySelector('.hljs-meta').textContent).to.equal('---')
        expect(codeElement.querySelector('.hljs-literal').textContent).to.equal('true')
        expect(codeElement.querySelector('.hljs-number').textContent).to.equal('42')
        const attrs = Array.prototype.map.call(codeElement.querySelectorAll('.hljs-attr'), el => el.textContent)
        expect(attrs).to.eql(['foo:', 'bar:'])
      })
  })
})
