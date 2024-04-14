import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState { 
    name: string;
    email: string;
    gender: string;
    id: number;
}

const initialState: UserState = { 
    id: 0,
    name: "",
    email: "",
    gender: ""
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        changeUserId: (state, action: PayloadAction<number>) => {
            state.id = action.payload;
        },
        changeName: (state, action: PayloadAction<string>) => {
            state.name = action.payload;
        },
        changeEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload;
        },
        changeGender: (state, action: PayloadAction<string>) => {
            state.gender = action.payload;
        }
    }
});

export const { changeUserId, changeName, changeEmail, changeGender } = userSlice.actions;
export default userSlice.reducer;