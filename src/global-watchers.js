export default ({ $store }) => {
  $store.watch(
    rootState => rootState.auth.user,
    () => {
      $store.dispatch('updateSessionInLocalStorage')
    }
  )
}
