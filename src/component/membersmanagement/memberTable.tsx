'use client'

import React, { useEffect, useState } from "react";
import { Table, Button, Space, TableColumnsType, Modal, Pagination, notification } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Update from "./popupUpdate";
import Remove from "./popupRemove";
import stylePopupCreate from '@/styles/styleMembersManagement/popupCreate.module.css'


interface Member {
    key: React.Key;
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    isAdmin: boolean;
}

interface MembersTableProps {
    members: Member[]
    onDataChange: () => void;
}

const MembersTable: React.FC<MembersTableProps> = ({ members, onDataChange }) => {
    const [isRemoveOpen, setIsRemoveOpen] = useState(false);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);

    const [id, setId] = useState(Number);
    const [name, setName] = useState('');
    const showModal = (type: string) => {
        switch (type) {
            case "update":
                setIsUpdateOpen(true);
                break;
            case "remove":
                setIsRemoveOpen(true);
                break;
            default:
                break;
        }
    };


    const handleCancel = () => {
        setIsUpdateOpen(false);
        setIsRemoveOpen(false);
    };

    interface DataType {
        key: React.Key;
        id: number;
        name: string;
        email: string;
        phoneNumber: string;
        isAdmin: boolean;
    }

    const columns: TableColumnsType<DataType> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            fixed: 'left',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            fixed: 'left'
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Role',
            dataIndex: 'isAdmin',
            key: 'isAdmin',
            render: (isAdmin: boolean) => (isAdmin ? 'Admin' : 'Member'),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text: string, record: Member) => (
                <Space size="middle">
                    <EditOutlined
                        style={{ marginRight: 10 }}
                        onClick={() => { showModal("update"); setId(record.id) }}
                    >
                        View Chart
                    </EditOutlined>
                    <DeleteOutlined
                        style={{ marginRight: 10 }}
                        onClick={() => { showModal("remove"); setId(record.id); setName(record.name) }}
                    >
                        Settings
                    </DeleteOutlined>

                </Space>
            ),
        },
    ];

    return (
        <div>
            <Modal
                open={isUpdateOpen}
                onCancel={handleCancel}
                closeIcon={false}
                footer={null}
                style={{ top: '10%' }}
                className={stylePopupCreate.modalCustom}
            >
                <Update close={handleCancel} membersId={id} onDataChange={onDataChange} />
            </Modal>
            <Modal
                open={isRemoveOpen}
                onCancel={handleCancel}
                closeIcon={false}
                footer={null}
                style={{ top: '10%' }}
                className={stylePopupCreate.modalCustom}
            >
                <Remove close={handleCancel} memberId={id} onDataChange={onDataChange} name={name} />
            </Modal>
            <Table<DataType>
                columns={columns}
                dataSource={members}
                rowKey="id" // Đảm bảo mỗi hàng có một khóa duy nhất
                pagination={false} // Tùy chỉnh theo yêu cầu
                bordered
                size="middle"
                scroll={{ x: 'max-content' }}
            />

        </div>
    );
};

export default MembersTable;
