import {createSlice,createAsyncThunk} from "@reduxjs/toolkit"
import jwt_decode from "jwt-decode";
import axios from "axios";
const token = localStorage.getItem('Token');
const user  = localStorage.getItem('User')

export const getData=createAsyncThunk('user/getUser',
  async()  => {
      console.log("apicalled")
      const response=await  axios.get(`http://localhost:5001/user/getUser/${user}`, {
        headers: {
          Authorization: `Bearer ${token}`,
       },
    })
    console.log(response,"response")
    return response.data
})

 export const getAllUser=createAsyncThunk('user/getAllUser',
  async()  => {
    try {
      console.log("apicalled")
      return axios.get(`http://localhost:5001/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
       },
    }).then(res => (res.data ))
    } catch (error) {
      console.log(error,"error")
    }
})

 const initialState = {
    loading:false,
    userData: '',
    allUserData:[],
    users:"",
    error:"null",
    token:""
}

 if(token && token !==  null ){
  console.log("token exists")  
  const decoded = jwt_decode(token);
  const expiresIn = new Date(decoded.exp*10000);
  if(new Date() > expiresIn){
    localStorage.removeItem('Token');
  }else{
    initialState.token = token;
    const {user} = decoded
    initialState.users = user;
  }
}

export const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{},
    extraReducers:{
        [getData.pending]:(state,action) => {
          state.loading=true
          console.log(action,".........action")
        },
        [getData.fulfilled]:(state,action)=>{
          state.loading=false
          state.userData=action.payload
          console.log(action,".........action")
        },
        [getData.rejected]:(state,action)=>
        {
          state.loading= false
          state.error = action.payload
          console.log(action,".........action")
        },
        [getAllUser.pending]:(state,action) => {
          state.loading=true
          console.log(action,".........action")
        },
        [getAllUser.fulfilled]:(state,action)=>{
          state.loading=false
          state.userData=action.payload
          console.log(action,".........action")
        },
        [getAllUser.rejected]:(state,action)=>
        {
          state.loading= false
          state.error = action.payload
          console.log(action,".........action")
        },
     
    }

})

// export const {
//   userCredentials,
//   logOut,
// }=userSlice.actions
export default userSlice.reducer
