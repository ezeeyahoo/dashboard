<!--
SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company and Gardener contributors

SPDX-License-Identifier: Apache-2.0
-->

<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'App',
  created () {
    // provide the keyboard events for dialogs. Dialogs can't catch keyboard events
    // if any input element of the dialog didn't have the focus.
    window.addEventListener('keyup', ({ keyCode }) => {
      if (keyCode === 27) {
        this.$bus.$emit('esc-pressed')
      }
    })
  }
}
</script>

<style lang="scss">
  [data-app] {
    .v-main > .container {
      min-height: calc(100vh - 156px)
    }
  }
</style>
