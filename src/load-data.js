import { database } from '@/firebase'

const getDataInSnapshot = snapshot => {
  const data = snapshot.val()
  return data ? Object.keys(data).map(id => ({ ...data[id], id })) : []
}

export default ({ $store }) => {
  database.ref('configuraciones')
    .on('value', snapshot => {
      $store.dispatch('setConfiguraciones', snapshot.val())
    })

  if (!$store.getters.userSelected) return
  database.ref('contribuyentes')
    .orderByChild('userId')
    .equalTo($store.getters.userSelected.uid)
    .on('value', snapshot => {
      Promise.all(getDataInSnapshot(snapshot)).then(data => $store.dispatch('setContribuyentes', data))
    })

  database.ref('facturas')
    .orderByChild('userId')
    .equalTo($store.getters.userSelected.uid)
    .on('value', snapshot => {
      Promise.all(getDataInSnapshot(snapshot)).then(data => $store.dispatch('setFacturas', data))
    })
}
