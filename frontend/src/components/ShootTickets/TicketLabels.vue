<!--
SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company and Gardener contributors

SPDX-License-Identifier: Apache-2.0
-->

<template>
  <span v-if="labels.length">
    <span v-for="label in labels" :key="label.id" class="label-color" :style="labelStyle(label)">
      {{ label.name }}
    </span>
  </span>

</template>

<script>
import contrast from 'get-contrast'
import get from 'lodash/get'

export default {
  props: {
    labels: {
      type: Array,
      required: true
    }
  },
  computed: {
    labelStyle () {
      return (label) => {
        const bgColor = `#${get(label, 'color')}`
        const textColor = contrast.isAccessible(bgColor, '#fff') ? '#fff' : '#000'
        return `background-color: ${bgColor}; color: ${textColor};`
      }
    }
  }
}
</script>

<style lang="scss" scoped>

  .label-color {
      margin-left: 4px;
      padding: 2px 4px;
      font-size: 12px;
      font-weight: 600;
      border-radius: 2px;
      box-shadow: inset 0 -1px 0 rgba(27,31,35,0.12);
  }

</style>
