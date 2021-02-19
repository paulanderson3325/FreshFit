export const getMenu = (id) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore()
    return firestore.collection('menus')
    .doc(id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const menu = doc.data()
        dispatch({ type: 'GOT_MENU', menu })    
      } else {
        dispatch({ type: 'MENU_NOT_FOUND'})    
      }
    })
    .catch((err) => {
      dispatch({ type: 'GET_MENU_ERROR', err })    
    })
  }
}

export const createMenu = (menu) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore()
    return firestore.collection('menus')
    .add({ ...menu })
    .then(() => {
      dispatch({ type: 'CREATE_MENU', menu })    
    })
    .catch((err) => {
      dispatch({ type: 'CREATE_MENU_ERROR', err })    
    })
  }
}

export const updateMenu = (menu, id) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore()
    return firestore.collection('menus')
    .doc(id)
    .update({ ...menu })
    .then(() => {
      dispatch({ type: 'UPDATE_MENU', menu })    
    })
    .catch((err) => {
      dispatch({ type: 'UPDATE_MENU_ERROR', err })    
    })
  }
}

export const deleteMenu = (id) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore()
    return firestore.collection('menus')
    .doc(id)
    .delete()
    .then(() => {
      dispatch({ type: 'DELETE_MENU' })    
    })
    .catch((err) => {
      dispatch({ type: 'DELETE_MENU_ERROR', err })    
    })
  }
}
