<template lang="pug">
v-menu(
    v-model='menu'
    :close-on-content-click='false'
    :nudge-right='40'
    lazy
    transition='scale-transition'
    offset-y
    full-width
    min-width='290px'
  )
  template(v-slot:activator='{ on }')
    v-text-field(
      v-model='model'
      :label='label'
      :color='color'
      :disabled='disabled'
      :prepend-icon='prependIcon'
      :rules='rules'
      :error-messages="errorMessages"
      :clearable='clearable'
      :required='required'
      readonly
      v-on='on'
    )
  v-date-picker(
    v-model='model'
    :disabled='disabled'
    :multiple='multiple'
    @input='menu = false'
  )

</template>

<script>
import vmodelMixin from '@/mixins/v-model-for-custom-input-controls.js'

export default {
  name: 'Datepicker',
  mixins: [ vmodelMixin ],
  props: {
    multiple: Boolean,
    prependIcon: {
      type: String,
      default: 'insert_invitation'
    },
    errorMessages: {
      type: Array,
      default: () => ([])
    }
  },
  data: () => ({
    menu: false
  })
}
</script>

<style lang="stylus">
.v-menu__content.menuable__content__active
  z-index: 1001 !important

</style>
