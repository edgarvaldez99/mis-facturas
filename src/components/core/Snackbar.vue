<template lang="pug">
  v-snackbar(v-model="show", :top="true") {{message}}
    v-btn(color="pink" flat @click="show = false") Cerrar

</template>

<script>
export default {
  data: () => ({
    show: false,
    message: ''
  }),
  created: function () {
    this.$store.watch(state => state.snackbar.snack, () => {
      const msg = this.$store.state.snackbar.snack
      if (msg !== '') {
        this.show = true
        this.message = this.$store.state.snackbar.snack
        this.$store.commit('setSnack', '')
      }
    })
  }
}

</script>
