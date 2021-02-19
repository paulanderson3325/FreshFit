const initState = {
  meal: {},
  mealError: null
}
  
const mealReducer = (state = initState, action) => {
  switch (action.type) {
    case 'CREATE_MEAL':
      return {
        ...state,
        mealError: null
      }  
    case 'CREATE_MEAL_ERROR':
      return {
        ...state,
        mealError: action.err.message
      }  
    case 'UPDATE_MEAL':
      return {
        ...state,
        mealError: null
      }  
    case 'UPDATE_MEAL_ERROR':
      return {
        ...state,
        mealError: action.err.message
      }  
    case 'GOT_MEAL':
      return {
        ...state,
        mealError: null,
        meal: action.meal
      }  
    case 'MEAL_NOT_FOUND':
      return {
        ...state,
        mealError: 'Meal not found',
      }  
    case 'GET_MEAL_ERROR':
      return {
        ...state,
        mealError: action.err.message,
      }  
    case 'DELETE_MEAL':
      return {
        ...state,
        mealError: null
      }  
    case 'DELETE_MEAL_ERROR':
      return {
        ...state,
        mealError: action.err.message,
      }  
    default:
      return state
  }
}

export default mealReducer