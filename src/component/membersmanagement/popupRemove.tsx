import { delMembers } from "@/lib/services/API_service";
import { WarningOutlined } from "@ant-design/icons";
import { Button, notification } from "antd";
import React from "react";

interface RemoveProps {
    memberId: number;
    onDataChange: () => void;
    name: string;
    close: () => void;
}

const Remove: React.FC<RemoveProps> = ({ memberId, onDataChange, name, close }) => {

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        let response = await delMembers(memberId);
        console.log(response.data.message);
        notification.success({
            message: 'thành công',
            description: `xóa ${name} thành công `,
            duration: 1,
        })
        onDataChange();
        close();
    };


    return (
        <div className="del-container">
            <form className="class-form-del" onSubmit={handleSubmit} >
                <p style={{ fontSize: 20, display: 'flex', alignItems: 'center' }}>
                    <WarningOutlined style={{ fontSize: 100 }} /> Confirm remove {name}
                </p>
                <div style={{ display: 'flex', flexDirection: 'row-reverse', gap: 15, marginTop: 20 }}>
                    <Button type="default" onClick={close} >
                        Cancel
                    </Button>
                    <Button type="primary" onClick={handleSubmit} >
                        OK
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default Remove;