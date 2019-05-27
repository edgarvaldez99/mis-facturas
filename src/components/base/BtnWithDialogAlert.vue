<template lang="pug">
  v-btn(dark :color="color" :icon="icon" @click.stop="setShowDeleteDialog(true)")
    slot
    dialog-confirm(
      :active="showDeleteDialog"
      :title="title"
      :content="message"
      :confirm-text="confirmText"
      :cancel-text="cancelText"
      @confirm="onConfirm"
      @cancel="onCancel"
    )
</template>

<script>
export default {
  name: 'BtnWithDialogAlert',
  components: {
    DialogConfirm: _ => import('@/components/base/DialogConfirm')
  },
  props: {
    title: {
      type: String,
      default: 'Eliminar'
    },
    message: {
      type: String,
      default: '¿Está seguro?'
    },
    confirmText: {
      type: String,
      default: 'Si'
    },
    cancelText: {
      type: String,
      default: 'No'
    },
    color: {
      type: String,
      default: 'error'
    },
    icon: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    showDeleteDialog: false
  }),
  methods: {
    setShowDeleteDialog (val) {
      this.showDeleteDialog = val
    },
    setEvent (type, event) {
      this.setShowDeleteDialog(false)
      this.$emit(type, event)
    },
    onConfirm (event) {
      this.setEvent('on-confirm', event)
    },
    onCancel (event) {
      this.setEvent('on-cancel', event)
    }
  }
}

</script>
