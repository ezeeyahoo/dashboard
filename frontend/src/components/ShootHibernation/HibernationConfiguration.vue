<!--
SPDX-FileCopyrightText: 2020 SAP SE or an SAP affiliate company and Gardener contributors

SPDX-License-Identifier: Apache-2.0
-->

<template>
  <action-button-dialog
    :shootItem="shootItem"
    :valid="hibernationScheduleValid"
    @dialogOpened="onConfigurationDialogOpened"
    ref="actionDialog"
    caption="Configure Hibernation Schedule">
    <template v-slot:actionComponent>
      <manage-hibernation-schedule
        ref="hibernationSchedule"
        :isHibernationPossible="isHibernationPossible"
        :hibernationPossibleMessage="hibernationPossibleMessage"
        @valid="onHibernationScheduleValid"
      ></manage-hibernation-schedule>
    </template>
  </action-button-dialog>
</template>

<script>
import ActionButtonDialog from '@/components/dialogs/ActionButtonDialog'
import ManageHibernationSchedule from '@/components/ShootHibernation/ManageHibernationSchedule'
import { updateShootHibernationSchedules, addShootAnnotation } from '@/utils/api'
import { errorDetailsFromError } from '@/utils/error'
import get from 'lodash/get'
import { shootItem } from '@/mixins/shootItem'

export default {
  name: 'hibernation-configuration',
  components: {
    ActionButtonDialog,
    ManageHibernationSchedule
  },
  props: {
    shootItem: {
      type: Object
    }
  },
  mixins: [shootItem],
  data () {
    return {
      hibernationScheduleValid: false
    }
  },
  methods: {
    async onConfigurationDialogOpened () {
      this.reset()
      const confirmed = await this.$refs.actionDialog.waitForDialogClosed()
      if (confirmed) {
        this.updateConfiguration()
      }
    },
    async updateConfiguration () {
      try {
        const noScheduleAnnotation = {
          'dashboard.garden.sapcloud.io/no-hibernation-schedule': this.$refs.hibernationSchedule.getNoHibernationSchedule() ? 'true' : null
        }
        await updateShootHibernationSchedules({
          namespace: this.shootNamespace,
          name: this.shootName,
          data: this.$refs.hibernationSchedule.getScheduleCrontab()
        })
        await addShootAnnotation({
          namespace: this.shootNamespace,
          name: this.shootName,
          data: noScheduleAnnotation
        })
      } catch (err) {
        const errorMessage = 'Could not save hibernation configuration'
        const errorDetails = errorDetailsFromError(err)
        const detailedErrorMessage = errorDetails.detailedMessage
        this.$refs.actionDialog.setError({ errorMessage, detailedErrorMessage })
        console.error(this.errorMessage, errorDetails.errorCode, errorDetails.detailedMessage, err)
      }
    },
    reset () {
      this.hibernationScheduleValid = false

      const noScheduleAnnotation = !!get(this.shootItem, 'metadata.annotations', {})['dashboard.garden.sapcloud.io/no-hibernation-schedule']
      this.$refs.hibernationSchedule.setScheduleData({
        hibernationSchedule: this.shootHibernationSchedules,
        noHibernationSchedule: noScheduleAnnotation,
        purpose: this.shootPurpose
      })
    },
    onHibernationScheduleValid (value) {
      this.hibernationScheduleValid = value
    },
    showDialog () { // called from ShootLifeCycleCard
      this.$refs.actionDialog.showDialog()
    }
  }
}
</script>
