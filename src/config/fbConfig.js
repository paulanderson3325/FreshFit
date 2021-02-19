 import firebase from 'firebase/app'
 import 'firebase/firestore'
 import 'firebase/auth'

 // Initialize Firebase
 var config = {
  apiKey: "NOTPUBLISHED",
  authDomain: "fresh-fit.firebaseapp.com",
  databaseURL: "https://fresh-fit.firebaseio.com",
  projectId: "fresh-fit",
  storageBucket: "fresh-fit.appspot.com",
  messagingSenderId: "372141562847"
}

firebase.initializeApp(config)
//Stripe.setPublishableKey("pk_test_BNEjtp1SJc89IMf697OPPdqJ")

export default firebase
