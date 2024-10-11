import { notification } from 'antd';
import { fetchMembersSuccess, setTotalRedux } from '../slices/memberReducer';
import { fetchAllMember } from '../services/API_service';
import { useDispatch } from 'react-redux';

export const fetchMembers = async (dispatch: any, page: number, limit: number) => {

    try {
        let res = await fetchAllMember(page, limit);
        dispatch(fetchMembersSuccess(res.data.data));
        dispatch(setTotalRedux(res.data.total));
    } catch (error) {
        localStorage.clear();
        notification.error({
            message: 'Phiên đăng nhập hết hạn',
            description: 'Vui lòng đăng nhập lại',
            duration: 4,
        });
        console.error(error);
    }
};
