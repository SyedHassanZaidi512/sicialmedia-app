// import { configureStore,combineReducers } from '@reduxjs/toolkit'
// import userSlice from './redux/userSlice'
// const reducers = combineReducers({
//   user:userSlice
// })
// export const store = configureStore({
//   reducer:reducers
// })

// export default store;



import { configureStore } from '@reduxjs/toolkit';
import indexReducer from './redux/myRedux';




export default configureStore({
  reducer: {
    user:indexReducer,
  }
})