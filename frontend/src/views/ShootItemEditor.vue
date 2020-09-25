<!--
SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company and Gardener contributors

SPDX-License-Identifier: Apache-2.0
 -->

<template>
  <div class="fill-height">
    <shoot-editor
      :modificationWarning="modificationWarning"
      @dismissModificationWarning="onDismissModificationWarning"
      :errorMessage.sync="errorMessage"
      :detailedErrorMessage.sync="detailedErrorMessage"
      :shootContent="shootContent"
      :extraKeys="extraKeys"
      @clean="onClean"
      @conflictPath="onConflictPath"
      ref="shootEditor"
    >
      <template v-slot:modificationWarning>
        By modifying the resource directly you may cause serious problems in your cluster.
        We cannot guarantee that you can solve problems that result from using Cluster Editor incorrectly.
      </template>
      <template v-slot:toolbarItemsRight>
        <v-btn text @click.native.stop="save()" :disabled="clean" color="cyan darken-2">Save</v-btn>
      </template>
    </shoot-editor>
    <confirm-dialog ref="confirmDialog"></confirm-dialog>
  </div>
</template>

<script>
import ConfirmDialog from '@/components/dialogs/ConfirmDialog'
import ShootEditor from '@/components/ShootEditor'
import { mapGetters, mapState } from 'vuex'
import { replaceShoot } from '@/utils/api'

// lodash
import get from 'lodash/get'
import pick from 'lodash/pick'

// js-yaml
import jsyaml from 'js-yaml'

export default {
  components: {
    ShootEditor,
    ConfirmDialog
  },
  name: 'shoot-item-editor',
  data () {
    const vm = this
    return {
      modificationWarning: true,
      clean: true,
      hasConflict: false,
      errorMessage: undefined,
      detailedErrorMessage: undefined,
      isShootCreated: false,
      extraKeys: {
        'Ctrl-S': (instance) => {
          vm.save()
        },
        'Cmd-S': (instance) => {
          vm.save()
        }
      }
    }
  },
  computed: {
    ...mapState([
      'namespace'
    ]),
    ...mapGetters([
      'shootByNamespaceAndName'
    ]),
    shootContent () {
      return this.shootByNamespaceAndName(this.$route.params)
    }
  },
  methods: {
    onDismissModificationWarning () {
      this.modificationWarning = false
      this.$localStorage.setItem('showShootEditorWarning', 'false')
    },
    onClean (clean) {
      this.clean = clean
    },
    onConflictPath (conflictPath) {
      this.hasConflict = !!conflictPath
    },
    async save () {
      try {
        if (this.untouched) {
          return
        }
        if (this.clean) {
          return this.$refs.shootEditor.clearHistory()
        }
        if (this.hasConflict && !(await this.confirmOverwrite())) {
          return
        }

        const paths = ['spec', 'metadata.labels', 'metadata.annotations']
        const data = pick(jsyaml.safeLoad(this.$refs.shootEditor.getContent()), paths)
        const { metadata: { namespace, name } } = this.shootContent
        const { data: value } = await replaceShoot({ namespace, name, data })
        this.$refs.shootEditor.update(value)

        this.snackbarColor = 'success'
        this.snackbarText = 'Cluster specification has been successfully updated'
        this.snackbar = true
      } catch (err) {
        this.errorMessage = get(err, 'response.data.message', err.message)
      }
    },
    confirmEditorNavigation () {
      return this.$refs.confirmDialog.waitForConfirmation({
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        captionText: 'Leave Editor?',
        messageHtml: 'Your changes have not been saved.<br/>Are you sure you want to leave the editor?'
      })
    },
    confirmOverwrite () {
      return this.$refs.confirmDialog.waitForConfirmation({
        confirmButtonText: 'Save',
        captionText: 'Confirm Overwrite',
        messageHtml: 'Meanwhile another user or process has changed the cluster resource.<br/>Are you sure you want to overwrite it?'
      })
    },
    focus () {
      if (this.$refs.shootEditor) {
        this.$refs.shootEditor.focus()
      }
    }
  },
  mounted () {
    const modificationWarning = this.$localStorage.getItem('showShootEditorWarning')
    this.modificationWarning = modificationWarning === null || modificationWarning === 'true'
  },
  async beforeRouteLeave (to, from, next) {
    if (this.clean) {
      return next()
    }
    try {
      if (await this.confirmEditorNavigation()) {
        next()
      } else {
        this.focus()
        next(false)
      }
    } catch (err) {
      next(err)
    }
  }
}
</script>
