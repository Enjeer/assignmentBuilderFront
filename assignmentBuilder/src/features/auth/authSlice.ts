import type {AppDispatch, RootState} from "@/app/store"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"
import { auth, googleProvider} from '@/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import StorageService from "@/services/storageService";
import { onAuthStateChanged, signOut } from "firebase/auth";


export interface authState {
    user: { 
        uid: string,
        email: string 
    } | null
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null
    isAuthChecked: boolean
}

const initialState: authState = {
    user: StorageService.getItem<{ uid: string; email: string }>('user') || null,
    status: 'idle',
    error: null,
    isAuthChecked: false,
};

export const signUp = createAsyncThunk(
    'auth/signUp',
    async ({email, password}: {email: string; password: string}, {rejectWithValue}) =>{
        try{
            const credentials = await createUserWithEmailAndPassword(auth, email, password);
            return {uid: credentials.user.uid, email: credentials.user.email};
        } catch(error: any) {
            return rejectWithValue(error.message);
        }
    }
)

export const signIn = createAsyncThunk(
    'auth/signIn',
    async ({email, password}: {email: string; password: string}, {rejectWithValue}) =>{
        try{
            const credentials = await signInWithEmailAndPassword(auth, email, password);
            return {uid: credentials.user.uid, email: credentials.user.email};
        } catch(error: any) {
            return rejectWithValue(error.message);
        }
    }
)

export const googleAuth = createAsyncThunk(
    'auth/googleAuth',
    async (_, { rejectWithValue }) => {
        try {
            const credentials = await signInWithPopup(auth, googleProvider);
            const user = { uid: credentials.user.uid, email: credentials.user.email! };
            StorageService.setItem('user', user);
            return user;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const logout = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
        await signOut(auth);          // 🔹 разлогиниваем в Firebase
        StorageService.removeItem("user");
        return null;
        } catch (error: any) {
        return rejectWithValue(error.message);
        }
    }
);


export const authSlice = createSlice({
    name: 'auth',
    initialState,

    reducers: {
        setUser(state, action) {
            state.user = action.payload;
        },
        clearUser(state) {
            state.user = null;
        },
        setAuthChecked(state, action) {
            state.isAuthChecked = action.payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(signUp.pending, state => { state.status = 'loading'; state.error = null; })
            .addCase(signUp.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
                StorageService.setItem('user', action.payload);
            })
            .addCase(signUp.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string; })
            .addCase(signIn.pending, state => { state.status = 'loading'; state.error = null; })
            .addCase(signIn.fulfilled, (state, action) => { 
                state.status = 'succeeded'; 
                state.user = action.payload;
                StorageService.setItem('user', action.payload); 
            })
            .addCase(signIn.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string; })
            .addCase(googleAuth.pending, state => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(googleAuth.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
            })
            .addCase(googleAuth.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.status = 'idle';
                state.error = null;
            })
        }
    })

export const { 
    setUser, 
    clearUser, 
    setAuthChecked 
} = authSlice.actions;
export default authSlice.reducer;