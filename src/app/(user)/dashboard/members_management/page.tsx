'use client'
import React, { useState, useEffect } from "react";
import MembersTable from "@/component/membersmanagement/memberTable";
import { fetchAllMember } from "@/lib/services/API_service";
import { Button, message, Modal, notification, Pagination } from "antd";
import CreateMember from "@/component/membersmanagement/popupCreate";
import stylePopupCreate from '@/styles/styleMembersManagement/popupCreate.module.css'
import { fetchMembers } from "@/lib/actions/membersAction";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { fetchMembersSuccess, setTotalRedux } from "@/lib/slices/memberReducer";

const MembersManagement = () => {
    const [members, setMembers] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(15);
    const [total, setTotal] = useState(0)
    const dispatch = useDispatch();
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    if (!members) {
        return <div>loading...</div>
    }

    const fetchData = async (page: number, limit: number) => {
        try {
            let res = await fetchAllMember(page, limit);
            dispatch(fetchMembersSuccess(res.data.data));
            dispatch(setTotalRedux(res.data.total));
            setMembers(res.data.data)
            setTotal(res.data.total)
        } catch (error) {
            localStorage.clear();
            notification.error({
                message: 'Phiên đăng nhập hết hạn',
                description: 'Vui lòng đăng nhập lại',
                duration: 4,
            });
            console.error(error);
        }
    }

    useEffect(() => {
        fetchData(page, limit);

    }, [])

    const showCreateModal = () => {
        setIsCreateOpen(true);
    }

    const handleCancel = () => {
        setIsCreateOpen(false);
    }

    const handleDataChange = () => {
        fetchData(page, limit);
    };

    const handlePageChange = (page: any) => {
        fetchData(page, limit);
    }



    return (
        <div>
            <div>
                <Button style={{ float: 'right', fontSize: 18, marginBottom: 15 }} onClick={showCreateModal} >
                    Create New Member
                </Button>
                <Modal
                    open={isCreateOpen}
                    onCancel={handleCancel}
                    closeIcon={false}
                    footer={null}
                    className={stylePopupCreate.modalCustom}
                    destroyOnClose={true}
                >
                    <CreateMember close={handleCancel} onDataChange={handleDataChange} />
                </Modal>
            </div>
            <MembersTable members={members} onDataChange={handleDataChange} ></MembersTable>
            <Pagination
                style={{ marginTop: 10 }}
                onChange={handlePageChange}
                align="center"
                defaultCurrent={page}
                total={total}
                pageSize={limit}
            />
        </div>
    )
}

export default MembersManagement;