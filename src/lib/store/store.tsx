import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import thunk from 'redux-thunk';
import authReducer from '../slices/authReducer';
import dataReducer from '../slices/dataReducer';
import membersReducer from '../slices/memberReducer';

const store = configureStore({
    reducer: {
        user: authReducer,
        tableName: dataReducer,
        members: membersReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

