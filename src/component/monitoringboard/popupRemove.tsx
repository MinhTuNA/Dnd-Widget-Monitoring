import React from "react";
import { Button, notification } from "antd";
import { useDispatch } from "react-redux";
import { deleteTable, getAllTables } from "@/lib/services/API_service";
import { fetchTablesFailure, fetchTablesStart, fetchTablesSuccess } from "@/lib/slices/dataReducer";
import { WarningOutlined } from "@ant-design/icons";

interface RemoveProps {
    close: () => void;
    tableName: string;

}

const Remove: React.FC<RemoveProps> = ({ close, tableName }) => {
    const role = localStorage.getItem("role");
    if (role !== "Admin") {
        notification.error({
            message: 'lỗi',
            description: 'bạn không có quyền truy cập',
            duration: 2
        })
        close();
    }


    const dispatch = useDispatch();
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        let response = await deleteTable(tableName);
        console.log(response.data.message);
        notification.success({
            message: 'thành công',
            description: 'xóa thành công',
            duration: 2
        })
        dispatch(fetchTablesStart());
        try {
            const response = await getAllTables();
            dispatch(fetchTablesSuccess(response.data));
        } catch (error: any) {
            console.log(error)
            dispatch(fetchTablesFailure(error.message));
        }

        close();
    };

    return (
        <div>
            <form>
                <p style={{ fontSize: 20, display: 'flex', alignItems: 'center' }}>
                    <WarningOutlined style={{ fontSize: 100 }} /> Confirm
                    remove {tableName}
                </p>
                <div style={{ display: 'flex', flexDirection: 'row-reverse', gap: 20 }} >
                    <Button onClick={close}>
                        NO
                    </Button>
                    <Button type="primary" danger onClick={handleSubmit}>
                        YES
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default Remove;