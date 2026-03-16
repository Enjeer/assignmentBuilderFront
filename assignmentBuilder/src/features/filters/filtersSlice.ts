import type {AppDispatch, RootState} from "@/app/store"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"
import StorageService from "@/services/storageService";


export interface filterState {
    q: string,
    status: 'idle' | 'updating' | 'success',
    error: null,
    docs:{} | null;
}

const initialState: filterState = {
    q: '',
    status: 'idle',
    error: null,
    docs: {},
};

export const useFilter = createAsyncThunk(
    'filter/filterProjects',
    async ({q}: {q: string}, {rejectWithValue}) =>{
        try{
            // short Version - later from DB
            const documentJson = {
                key: 'document key',
                uid: 'user_uid',
                content: {
                    header: 'document name',
                    hashedContent: 'hash', //TODO: evaluate the idea of total HASH-ing of content. Ideas for image caching / CDN
                }
            }
            const results = 
            [
                {
                
                }, {

                }, {

                }, {

                }
            ];
            return {result: results};
        } catch(error: any) {
            return rejectWithValue(error.message);
        }
    }
)


export const filterSlice = createSlice({
    name: 'filter',
    initialState,

    reducers: {
        setFilter(state, action) {
            state.q = action.payload;
        },
        // clearFilter(state) {
        //     state.q = '';
        // },
    },
    extraReducers: builder => {
        builder
            .addCase(useFilter.pending, state => { state.status = 'updating'; state.error = null; })
            .addCase(useFilter.fulfilled, (state, action) => {
                state.status = 'success';
                state.docs = {};
                StorageService.setDocs('user', action.payload);
            })
            .addCase(signUp.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string; })
        }
    })

export const { 
    setUser, 
    clearUser, 
    setAuthChecked 
} = authSlice.actions;
export default authSlice.reducer;