import { database, storage } from '@/firebase'

const clone = obj => JSON.parse(JSON.stringify(obj))

export const saveDataInDatabase = (datakey, data) => {
  let dbref = database.ref(datakey)
  if (data.id) dbref = dbref.child(data.id)
  else dbref = dbref.push()
  delete data.id
  delete data.mediasrc
  return dbref
    .set(data)
    .then(_ => ({ ...data, id: dbref.key }))
    .catch(err => {
      err.originalMessage = err.message
      err.message = 'No tiene permisos para guardar en la base de datos, por favor inicie sesión'
      return err
    })
}

export const saveDataInStorageAndDatabase = (datakey, dat) => {
  try {
    const data = clone(dat)
    const shouldBeSaveFile = data.mediaFiles && data.mediaFiles.length
    if (!(shouldBeSaveFile || data.mediasrc)) throw new Error('Debe pasar una imagen')
    if (shouldBeSaveFile) {
      const file = data.mediaFiles[0]
      delete data.mediaFiles
      return storage
        .ref(`${datakey}/${data.mediaName}`)
        .put(file)
        .then(_ => saveDataInDatabase(datakey, data))
        .catch(err => {
          err.originalMessage = err.message
          err.message = 'No tiene permisos para guardar archivos, por favor inicie sesión'
          return err
        })
    }
    return saveDataInDatabase(datakey, data)
  } catch (e) {
    return Promise.reject(e)
  }
}

export const deleteData = (datakey, id) => database.ref(`${datakey}/${id}`).remove()
