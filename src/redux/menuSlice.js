import { createSlice } from "@reduxjs/toolkit";

export const menuSlice = createSlice({
    name: "menuState",
    initialState: {
        isOpen: false
    },
    reducers: {
        toggle: (state) => {
            state.isOpen = !state.isOpen
        }
    }
});

export const {toggle} = menuSlice.actions;
export default menuSlice.reducer;