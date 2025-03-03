import { createSlice } from "@reduxjs/toolkit";

const bagSlice = createSlice({
  name: "bag",
  initialState: [],
  reducers: {
    addToBag: (state, action) => {
      if (!state.includes(action.payload)) {
        state.push(action.payload); // ✅ Ensure unique `_id` is stored
      }
    },
    removeFromBag: (state, action) => {
      return state.filter((itemId) => itemId !== action.payload); // ✅ Correct filtering
    },
  },
});

export const bagActions = bagSlice.actions;
export default bagSlice;
