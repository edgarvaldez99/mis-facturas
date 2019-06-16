const functions = require('firebase-functions')
const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccountKey.json')

admin.initializeApp({
  ...process.env.FIREBASE_CONFIG,
  credential: admin.credential.cert(serviceAccount)
})

// Get adminEmail
let adminEmail
admin.database().ref('configuraciones/adminEmail').on('value', snapshot => {
  adminEmail = snapshot.val()
})

exports.processSignUp = functions.auth.user().onCreate(event => {
  // The Firebase user.
  const user = event.data
  // Check if user meets role criteria.
  if (user.email && user.emailVerified && user.email.endsWith(adminEmail)) {
    const customClaims = { admin: true }
    // Set custom user claims on this newly created user.
    return admin.auth().setCustomUserClaims(user.uid, customClaims)
      .then(() => {
        // Update real-time database to notify client to force refresh.
        const metadataRef = admin.database().ref(`metadata/${user.uid}`)
        // Set the refresh time to the current UTC timestamp.
        // This will be captured on the client to force a token refresh.
        return metadataRef.set({refreshTime: new Date().getTime()})
      })
      .catch(error => {
        console.log(error)
      })
  }
  return undefined
})
