// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { getStoredVlaues } from "@/utils/getStoredValues";
// import { decrypt } from "@/utils/encryption";
// import type { AxiosError } from "axios";
// import * as SecureStore from "expo-secure-store";



// export const fetchUserDetails = createAsyncThunk(
//     'user/fetchUserDetails',
//     async () => {
//         const { key } = getStoredVlaues();
//         const decrypted = decrypt(SecureStore.getItemAsync("udtl"), key);
//         let userDetails = null;
//         try {
//             userDetails = decrypted
//         } catch (e) {
//             const error = e as AxiosError<any>;
//             console.error("Decryption failed: ", error?.message);
//         }
//         return userDetails;
//     }
// )

// type InitialState = {
//     userDetails: any;
//     loading : boolean;
// }

// const initialState : InitialState = {
//     userDetails: null,
//     loading: false
// }

// export const userSlice = createSlice({
//     name: 'user',
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchUserDetails.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(fetchUserDetails.fulfilled, (state, action) => {
//                 state.userDetails = action.payload;
//                 state.loading = false;
//             })
//             .addCase(fetchUserDetails.rejected, (state, action) => {
//                 state.loading = false;
//                 state.userDetails = action.error
//             })
//     }
// })


// export default userSlice.reducer