import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

const firebaseConfig = {
  appId: process.env.VUE_APP_FIREBASE_API_ID,
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID
}

const firebaseInstance = firebase.initializeApp(firebaseConfig)

export const database = firebaseInstance.database()
export const storage = firebaseInstance.storage()
export const auth = firebaseInstance.auth()

export default firebase
