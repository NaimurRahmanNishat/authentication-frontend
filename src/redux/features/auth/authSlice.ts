import { createSlice } from '@reduxjs/toolkit'

// Define a type for the slice state
export interface CounterState {
    value: number
}

// Define the initial state using that type
const initialState: CounterState = {
    value: 0
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
    }
})


export default authSlice.reducer;