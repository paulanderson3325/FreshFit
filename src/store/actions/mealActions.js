export const getMeal = (id) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore()
    return firestore.collection('meals')
    .doc(id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const meal = doc.data()
        dispatch({ type: 'GOT_MEAL', meal })    
      } else {
        dispatch({ type: 'MEAL_NOT_FOUND'})    
      }
    })
    .catch((err) => {
      dispatch({ type: 'GET_MEAL_ERROR', err })    
    })
  }
}

export const createMeal = (meal) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore()
    return firestore.collection('meals')
    .add({
      ...meal,
      sprice: meal.sprice * 100,
      lprice: meal.lprice * 100
    })
    .then(() => {
      dispatch({ type: 'CREATE_MEAL', meal })    
    })
    .catch((err) => {
      dispatch({ type: 'CREATE_MEAL_ERROR', err })    
    })
  }
}

export const updateMeal = (meal, id) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore()
    return firestore.collection('meals')
    .doc(id)
    .update({
      ...meal,
      sprice: meal.sprice * 100,
      lprice: meal.lprice * 100
    })
    .then(() => {
      dispatch({ type: 'UPDATE_MEAL', meal })    
    })
    .catch((err) => {
      dispatch({ type: 'UPDATE_MEAL_ERROR', err })    
    })
  }
}

export const deleteMeal = (id) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore()
    return firestore.collection('meals')
    .doc(id)
    .delete()
    .then(() => {
      dispatch({ type: 'DELETE_MEAL' })    
    })
    .catch((err) => {
      dispatch({ type: 'DELETE_MEAL_ERROR', err })    
    })
  }
}
