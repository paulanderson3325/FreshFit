const initState = {
  menuMeals: [],
  orderError: null
}
  
const orderReducer = (state = initState, action) => {
  switch (action.type) {
    case 'GOT_MENU_MEALS':
      return {
        ...state,
        orderError: null,
        menuMeals: action.menuMeals
      }  
    case 'MENU_MEALS_NOT_FOUND':
      return {
        ...state,
        orderError: 'Menu Meals not found',
      }  
    case 'GET_MENU_MEALS_ERROR':
      return {
        ...state,
        orderError: action.err.message,
      }  
    case 'CLEAR_MENU_MEALS':
      return {
        ...state,
        orderError: null,
        menuMeals: []
      }  
    default:
      return state
  }
}

export default orderReducer