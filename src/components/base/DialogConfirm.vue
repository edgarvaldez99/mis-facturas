<template lang="pug">
v-dialog(:value="active" max-width="500")
  v-card
    v-card-title.headline(primary-title) {{title}}
    v-card-text {{content}}
    v-divider
    v-card-actions
      v-spacer
      v-btn(color="error" flat @click="$emit('confirm', $event)") {{confirmText}}
      v-btn(color="warning" flat @click="$emit('cancel', $event)" v-if="cancelText") {{cancelText}}

</template>

<script>
export default {
  name: 'DialogConfirm',
  props: {
    active: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: null
    },
    content: {
      type: String,
      default: null
    },
    confirmText: {
      type: String,
      default: 'Aceptar'
    },
    cancelText: {
      type: String,
      default: null
    }
  }
}

</script>
