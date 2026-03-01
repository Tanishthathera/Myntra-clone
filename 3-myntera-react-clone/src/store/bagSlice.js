import { createSlice } from "@reduxjs/toolkit";

const bagSlice = createSlice({
  name: 'bag',
  initialState: [], // Ab ye [{id: '123', quantity: 1}] aisa dikhega
  reducers: {
    addToBag: (state, action) => {
      const itemIndex = state.findIndex(item => item.id === action.payload);
      if (itemIndex >= 0) {
        // Agar pehle se hai toh quantity badhao
        state[itemIndex].quantity += 1;
      } else {
        // Naya hai toh add karo
        state.push({ id: action.payload, quantity: 1 });
      }
    },
    removeFromBag: (state, action) => {
      return state.filter(item => item.id !== action.payload);
    },
    // Ek specific quantity kam karne ke liye
    decreaseQuantity: (state, action) => {
      const itemIndex = state.findIndex(item => item.id === action.payload);
      if (state[itemIndex].quantity > 1) {
        state[itemIndex].quantity -= 1;
      } else {
        return state.filter(item => item.id !== action.payload);
      }
    },
    clearBag: () => {
      return [];
    }
  }
});

export const bagActions = bagSlice.actions;
export default bagSlice;