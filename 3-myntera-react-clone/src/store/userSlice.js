import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: 'user',
  initialState: null, 
  reducers: {
    // Yahan 'state' aur 'action' parameters hain
    loginUser: (state, action) => {
      return action.payload; // Naya data return karna hi state update hai
    },
    logoutUser: () => {
      return null; 
    }
  }
});

export const userActions = userSlice.actions;
export default userSlice;