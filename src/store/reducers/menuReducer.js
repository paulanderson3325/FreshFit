const initState = {
  menu: {},
  menuError: null
}
  
const menuReducer = (state = initState, action) => {
  switch (action.type) {
    case 'CREATE_MENU':
      return {
        ...state,
        menuError: null
      }  
    case 'CREATE_MENU_ERROR':
      return {
        ...state,
        menuError: action.err.message
      }  
    case 'UPDATE_MENU':
      return {
        ...state,
        menuError: null
      }  
    case 'UPDATE_MENU_ERROR':
      return {
        ...state,
        menuError: action.err.message
      }  
    case 'GOT_MENU':
      return {
        ...state,
        menuError: null,
        menu: action.menu
      }  
    case 'MENU_NOT_FOUND':
      return {
        ...state,
        menuError: 'Menu not found',
      }  
    case 'GET_MENU_ERROR':
      return {
        ...state,
        menuError: action.err.message,
      }  
    case 'DELETE_MENU':
      return {
        ...state,
        menuError: null
      }  
    case 'DELETE_MENU_ERROR':
      return {
        ...state,
        menuError: action.err.message,
      }  
    default:
      return state
  }
}

export default menuReducer