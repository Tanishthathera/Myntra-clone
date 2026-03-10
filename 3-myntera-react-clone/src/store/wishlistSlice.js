import { createSlice } from "@reduxjs/toolkit";


const wishlistSlice = createSlice({
    name: "wishlist",
    initialState: [],
    reducers: {
        addToWishlist: (state, action) => {
            if (!state.find(id => id === action.payload)) {
                state.push(action.payload);
            }
        },
        removeFromWishlist: (state, action) => {
            return state.filter(itemId => itemId !== action.payload);
        }
    }
});


export const wishlistActions = wishlistSlice.actions;
export default wishlistSlice;