import type {AppDispatch, RootState} from "@/app/store"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"
import StorageService from "@/services/storageService";


const authApi: string = 'http://192.168.10.234:8000/api/';
const logInRoute: string = 'login/';
const signUpRoute: string = 'register/';

export interface authState {
    user: { 
        id: string,
        email: string 
    } | null
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null
    isAuthChecked: boolean
}

interface SignUpPostData {
    user_name: string,
    password: string,
    email: string,
}

interface LogInPostData {
    login: string,
    password: string,
}

const initialState: authState = {
    user: StorageService.getItem<{ id: string; email: string }>('user') || null,
    status: 'idle',
    error: null,
    isAuthChecked: false,
};

async function authenticationPost<T>(url: string, data: T): Promise<any> {
    const res = await fetch(url, {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json;charset=utf-8' 
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
    }

    return res.json();
}

export const logIn = createAsyncThunk(
    'auth/logIn',
    async ({login, password}: {login: string; password: string}, {rejectWithValue}) => {
        const url = authApi + logInRoute;
        const data: LogInPostData = {login, password};
        try {
            const credentials = await authenticationPost(url, data);
            return {
                id: credentials.user_name,
                email: credentials.email,
                username: credentials.user_name
            };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const signUp = createAsyncThunk(
    'auth/signUp',
    async ({user_name, email, password}: {user_name: string; email: string; password: string}, {rejectWithValue}) =>{
        const url = authApi+signUpRoute;
        const data: SignUpPostData = {user_name, password, email}
        try{
            const credentials = await authenticationPost(url, data);
            return {id: credentials.user_name, email: credentials.email};
        } catch(error: any) {
            return rejectWithValue(error.message);
        }
    }
)

export const logout = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue}) => {
        try {
            StorageService.removeItem("user");
            console.log('After removeItem:', localStorage.getItem('user')); // должно быть null
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
                console.log('Saving to localStorage:', action.payload);
                state.status = 'succeeded';
                state.user = {
                    id: action.payload.id,
                    email: action.payload.email
                };
                StorageService.setItem('user', state.user);
            })
            .addCase(logIn.pending, state => { state.status = 'loading'; state.error = null; })
            .addCase(logIn.fulfilled, (state, action) => {
                console.log('Saving to localStorage:', action.payload);
                state.status = 'succeeded';
                state.user = {
                    id: action.payload.id, // id нет, можно взять user_name как ключ
                    email: action.payload.email
                };
                StorageService.setItem('user', state.user);
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