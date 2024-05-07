import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState { 
    id: number;
    name: string;
    gender: string;
    email: string;
    phone_number: string;
    profile_picture: string;
}

const initialState: UserState = { 
    id: 0,
    name: "",
    gender: "",
    email: "",
    phone_number: "",
    profile_picture: ""
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
        changeGender: (state, action: PayloadAction<string>) => {
            state.gender = action.payload;
        },
        changeEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload;
        },
        changePhoneNumber: (state, action: PayloadAction<string>) => {
            state.phone_number = action.payload;
        },
        changeProfilePicture: (state, action: PayloadAction<string>) => {
            state.profile_picture = action.payload;
        },
    }
});

export const { changeUserId, changeName, changeGender, changeEmail, changePhoneNumber, changeProfilePicture } = userSlice.actions;
export default userSlice.reducer;