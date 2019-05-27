<template lang="pug">
  v-app(dark)
    core-snackbar
    v-content
      router-view

</template>

<script>
export default {
  name: 'App',
  components: {
    CoreSnackbar: () => import('@/components/core/Snackbar')
  }
}

</script>
