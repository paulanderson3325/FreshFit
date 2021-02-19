import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { compose } from 'recompose'
import { reduxFirestore, getFirestore } from 'redux-firestore'
import { reactReduxFirebase, getFirebase } from 'react-redux-firebase'

import App from './App'
import rootReducer from './store/reducers/rootReducer'
import fbConfig from './config/fbConfig'

const store = createStore(rootReducer,
  compose(
    applyMiddleware(thunk.withExtraArgument({
        getFirebase,
        getFirestore  
      })
    ),
    reduxFirestore(fbConfig),
    reactReduxFirebase(fbConfig, { 
      useFirestoreForProfile: true,
      userProfile: 'users',
      attachAuthIsReady: true })
  )
)

store.firebaseAuthIsReady.then(() => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>
    , document.getElementById('root'))  
})
