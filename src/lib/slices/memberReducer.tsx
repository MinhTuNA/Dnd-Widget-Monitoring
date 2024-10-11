import { createSlice } from '@reduxjs/toolkit';

interface MemberState {
    members: any[];
    total: number;
    loading: boolean;
    error: string | null;
}

const initialState: MemberState = {
    members: [],
    total: 0,
    loading: false,
    error: null,
};

const membersSlice = createSlice({
    name: 'members',
    initialState,
    reducers: {
        fetchMembersStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchMembersSuccess: (state, action) => {
            state.members = action.payload;
            state.loading = false;
        },
        fetchMembersFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        setTotalRedux: (state, action) => {
            state.total = action.payload;
        },
        clearTotalRedux: (state) => {
            state.total = 0;
        }
    },
});

export const { fetchMembersStart, fetchMembersSuccess, fetchMembersFailure, setTotalRedux, clearTotalRedux } = membersSlice.actions;
export default membersSlice.reducer;