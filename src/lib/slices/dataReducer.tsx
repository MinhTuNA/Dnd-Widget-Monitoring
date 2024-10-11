import { createSlice } from '@reduxjs/toolkit';

interface DataState {
    tables: string[];
    loading: boolean;
    error: string | null;
}

const initialState: DataState = {
    tables: [],
    loading: false,
    error: null,
};

const dataSlice = createSlice({
    name: 'tableData',
    initialState,
    reducers: {
        fetchTablesStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchTablesSuccess: (state, action) => {
            state.tables = action.payload;
            state.loading = false;
        },
        fetchTablesFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const { fetchTablesStart, fetchTablesSuccess, fetchTablesFailure } = dataSlice.actions;
export default dataSlice.reducer;