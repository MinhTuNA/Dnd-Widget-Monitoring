import { getAuthToken, getCameraId, sendTarget, setCameraId } from "@/lib/services/API_service";
import { Button, notification } from "antd";
import React, { useEffect, useState } from "react";
import stylePopupSetting from '@/styles/styleMonitoringBoard/popupSetting.module.css'

interface SettingProps {
    close: () => void;
    Target: number;
    tableName: string;
}


const Setting: React.FC<SettingProps> = ({ close, Target, tableName }) => {
    const role = localStorage.getItem("role");
    if (role !== "Admin") {
        notification.error({
            message: 'lỗi',
            description: 'bạn không có quyền truy cập',
            duration: 2
        })
        close();
    }

    const [target, setTarget] = useState(Target);
    const [authToken, setAuthToken] = useState("");
    const [id, setId] = useState("");

    useEffect(() => {
        const fetchAuthToken = async () => {
            try {
                let res = await getAuthToken(tableName);
                setAuthToken(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        const fetchCameraId = async () => {
            try {
                const response = await getCameraId(tableName);
                setId(response.data);
            } catch (err: any) {
                notification.error({
                    message: 'lỗi',
                    description: err.response?.data?.error || "Lỗi khi lấy dữ liệu",
                    duration: 2
                })

            }
        };
        fetchAuthToken();
        fetchCameraId();
    }, []);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const response = await sendTarget(tableName, target);
        } catch (error: any) {
            console.log(
                `Lỗi: ${error.response ? error.response.data.error : error.message}`
            );
        }

        try {
            const res = await setCameraId(tableName, id);
            notification.success({
                message: "thành công",
                description: res.data.message,
                duration: 3
            })

        } catch (error: any) {
            notification.error({
                message: error,
                duration: 2
            })
        }

        close();
    };

    const handleClick = (e: any) => {
        e.preventDefault();
        setTarget(0);
    };

    return (
        <div className={stylePopupSetting.contentSetting}>
            <form className="form-setting" onSubmit={handleSubmit}>
                <p style={{ fontSize: '1.2em' }} >{tableName} </p>
                <div className={stylePopupSetting.mainContent}>
                    <p className="label-input">Target Hourly</p>
                    <div className={stylePopupSetting.inputTargetContainer}>
                        <input
                            className={stylePopupSetting.inputTarget}
                            type="number"
                            id="target"
                            value={target}
                            onChange={(e) => setTarget(Number(e.target.value))}
                            required
                        />

                        <Button type="default" className={stylePopupSetting.btnReset} onClick={handleClick} >
                            Reset target hourly
                        </Button>


                    </div>
                    <p className="label-input" style={{ marginTop: 10 }} >Camera Id - Token </p>
                    <div className={stylePopupSetting.inputTargetContainer}>
                        <input
                            className={stylePopupSetting.inputCameraId}
                            type="text"
                            id="camera-id"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                        />
                        <input type="text" className={stylePopupSetting.authToken} value={authToken} readOnly />
                    </div>

                </div>

                <div className={stylePopupSetting.btnSettingTargetContainer}>
                    <Button type="default" onClick={close}>
                        cancel
                    </Button>
                    <Button type="primary" onClick={handleSubmit}  >
                        OK
                    </Button>
                    {/* <input className="btn-submit-setting" type="submit" value="OK" /> */}
                </div>
            </form>
        </div>
    );
}

export default Setting;