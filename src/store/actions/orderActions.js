export const getMenuMeals = (id) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore()
    return firestore.collection('menus')
    .doc(id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const menuMeals = doc.data().selectedMeals
        dispatch({ type: 'GOT_MENU_MEALS', menuMeals })    
      } else {
        dispatch({ type: 'MENU_MEALS_NOT_FOUND'})    
      }
    })
    .catch((err) => {
      dispatch({ type: 'GET_MENU_MEALS_ERROR', err })    
    })
  }
}

