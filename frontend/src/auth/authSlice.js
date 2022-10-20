import {createSlice} from "@reduxjs/toolkit"
import jwt_decode from "jwt-decode";
const initialState = {
    user:"",token:""
}

const token = localStorage.getItem('Token');
// console.log(token)
if(token && token !==  null ){
  console.log("token exists")  
  const decoded = jwt_decode(token);
  const expiresIn = new Date(decoded.exp*1000);
  if(new Date() > expiresIn){
    localStorage.removeItem('myToken');
  }else{
    initialState.token = token;
    const {user} = decoded
    initialState.user = user;
  }
}
// console.log(initialState.token);
const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        userCredentials:(state,action)=>{
            // console.log(action);
            const {token,user}=action.payload
            // console.log(token);
            state.user=user
            state.token=token
            console.log(state.token,"token in auth");
        },
        logOut:(state)=>
        {
            state.user=null
            state.token=null
            console.log("now data is removed ");
        }
    }

})

export const {userCredentials,logOut}=authSlice.actions
export default authSlice.reducer
