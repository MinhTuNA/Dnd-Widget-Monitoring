import { fetchTablesStart, fetchTablesSuccess, fetchTablesFailure } from '../slices/dataReducer'
import { getAllTables } from '@/lib/services/API_service';
import { AppDispatch } from '../store/store';

export const fetchTables = () => async (dispatch: AppDispatch) => {
    return async (dispatch: AppDispatch) => {
        dispatch(fetchTablesStart());
        try {
            const response = await getAllTables();
            dispatch(fetchTablesSuccess(response.data));
        } catch (error) {
            dispatch(fetchTablesFailure(error));
        }
    };
};