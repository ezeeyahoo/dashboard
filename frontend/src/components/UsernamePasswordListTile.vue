<!--
SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company and Gardener contributors

SPDX-License-Identifier: Apache-2.0
-->

<template>
  <div v-show="(!!username || !!email) && !!password">
    <v-list-item v-if="username">
      <v-list-item-icon>
        <v-icon color="cyan darken-2">perm_identity</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-subtitle>User</v-list-item-subtitle>
        <v-list-item-title class="pt-1">{{username}}</v-list-item-title>
      </v-list-item-content>
      <v-list-item-action>
        <copy-btn :clipboard-text="username"></copy-btn>
      </v-list-item-action>
    </v-list-item>
    <v-list-item v-if="email">
      <v-list-item-icon>
        <v-icon v-if="!username" color="cyan darken-2">perm_identity</v-icon>
      </v-list-item-icon>
      <v-list-item-content class="pt-0">
        <v-list-item-subtitle>Email</v-list-item-subtitle>
        <v-list-item-title class="pt-1">{{email}}</v-list-item-title>
      </v-list-item-content>
      <v-list-item-action>
        <copy-btn :clipboard-text="email"></copy-btn>
      </v-list-item-action>
    </v-list-item>
    <v-list-item>
      <v-list-item-icon/>
      <v-list-item-content class="pt-0">
        <v-list-item-subtitle>Password</v-list-item-subtitle>
        <v-list-item-title class="pt-1">{{passwordText}}</v-list-item-title>
      </v-list-item-content>
      <v-list-item-action class="mx-0">
        <copy-btn :clipboard-text="password"></copy-btn>
      </v-list-item-action>
      <v-list-item-action class="mx-0">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" icon @click.native.stop="showPassword = !showPassword">
              <v-icon>{{visibilityIcon}}</v-icon>
            </v-btn>
          </template>
          <span>{{passwordVisibilityTitle}}</span>
        </v-tooltip>
      </v-list-item-action>
    </v-list-item>
  </div>
</template>

<script>
import CopyBtn from '@/components/CopyBtn'

export default {
  components: {
    CopyBtn
  },
  props: {
    username: {
      type: String
    },
    email: {
      type: String
    },
    password: {
      type: String
    }
  },
  data () {
    return {
      showPassword: false
    }
  },
  methods: {
    reset () {
      this.showPassword = false
    }
  },
  computed: {
    passwordText () {
      return this.showPassword ? this.password : '****************'
    },
    passwordVisibilityTitle () {
      return this.showPassword ? 'Hide password' : 'Show password'
    },
    visibilityIcon () {
      return this.showPassword ? 'mdi-eye-off' : 'mdi-eye'
    }
  },
  watch: {
    password (value) {
      this.reset()
    }
  }
}
</script>
