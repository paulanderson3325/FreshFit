import authReducer from './authReducer'
import mealReducer from './mealReducer'
import menuReducer from './menuReducer';
import { combineReducers } from 'redux'
import { firestoreReducer } from 'redux-firestore'
import { firebaseReducer } from 'react-redux-firebase'
import orderReducer from './orderReducer'

const rootReducer = combineReducers({
  auth: authReducer,
  meal: mealReducer,
  menu: menuReducer,
  order: orderReducer,
  firestore: firestoreReducer,
  firebase: firebaseReducer
})

export default rootReducer