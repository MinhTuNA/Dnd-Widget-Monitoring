import { fetchTables } from "@/lib/actions/dataAction";
import { createTable, getAllTables } from "@/lib/services/API_service";
import { fetchTablesFailure, fetchTablesStart, fetchTablesSuccess } from "@/lib/slices/dataReducer";
import { Button, notification } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import stylePopupCreate from '@/styles/styleMonitoringBoard/popupCreate.module.css'
interface CreateLineProps {
    close: () => void;
}

const CreateLine: React.FC<CreateLineProps> = ({ close }) => {
    // const [type, setType] = useState("");
    const [tableName, setTableName] = useState("");
    const role = localStorage.getItem("role");
    if (role != "Admin") {
        notification.error({
            message: 'lỗi',
            description: 'bạn không có quyền truy cập',
            duration: 2
        })
        close();
    }
    const dispatch = useDispatch();
    const CreateNewLine = async (e: any) => {
        e.preventDefault();
        try {
            const response = await createTable(tableName);
            // Kiểm tra phản hồi từ server
            notification.success({
                message: 'thành công',
                description: 'tạo thành công',
                duration: 2
            })
            setTableName('')
            dispatch(fetchTablesStart());
            try {
                const response = await getAllTables();
                dispatch(fetchTablesSuccess(response.data));
            } catch (error: any) {
                console.log(error)
                dispatch(fetchTablesFailure(error.message));
            }
            console.log(response.data.message);
            close();
        } catch (error: any) {
            if (error.response) {
                notification.error({
                    message: 'lỗi',
                    description: 'tên bảng không hợp lệ hoặc đã tồn tại',
                    duration: 2
                })
                console.log(error.response.data.message);
            } else {
                console.log("lỗi server");
            }
        }
    };
    return (
        <div >
            <form >
                <p style={{ fontSize: '1.3em' }}>Create new line </p>
                <div className={stylePopupCreate.mainContentCreate}>
                    <table>
                        <tbody>
                            <tr>
                                <td className={stylePopupCreate.headingType}>Type</td>
                                <td>
                                    <input
                                        className={stylePopupCreate.inputType}
                                        type="text"
                                        id="tableName"
                                        value={tableName}
                                        onChange={(e) => setTableName(e.target.value)}
                                        required
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row-reverse', gap: 20 }} >
                    <Button onClick={close} >
                        cancel
                    </Button>
                    <Button type="primary" onClick={CreateNewLine} >
                        OK
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default CreateLine;