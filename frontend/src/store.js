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
import allUserSlice  from './redux/allUserSlice';
import userSlice from './redux/userSlice';
import postSlice from './redux/postSlice';


export default configureStore({
  reducer: {
    user:userSlice,
    allUser:allUserSlice,
    post:postSlice
  }
})

