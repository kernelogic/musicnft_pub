import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/database'
import 'firebase/auth'
import 'firebase/analytics'

const env = import.meta.env;
const config = {
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID
}
const firebaseApp = firebase.initializeApp(config)
firebase.analytics()
export { firebase, firebaseApp }
export default firebaseApp
