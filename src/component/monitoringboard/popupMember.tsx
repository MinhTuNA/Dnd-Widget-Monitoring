import { fetchMembers } from "@/lib/actions/membersAction";
import { fetchAllMember, getAllMemberInTable, removeMemberInTable, updateMemberInTable } from "@/lib/services/API_service"
import { fetchMembersSuccess, setTotalRedux } from "@/lib/slices/memberReducer";
import { RootState } from "@/lib/store/store";

import { notification, Pagination, Space, Switch, Table, TableColumnsType } from "antd"
import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

interface member {
    key: React.Key;
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    role: string;
}

interface MemberProps {
    tableName: string
}

const Member: React.FC<MemberProps> = ({ tableName }) => {

    const [members, setMembers] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0)
    const [membersInTable, setMembersInTable] = useState<number[]>([])
    const dispatch = useDispatch()
    const getMemberInTable = async () => {
        try {
            const response = await getAllMemberInTable(tableName);
            const memberInTableStr: string = response.data;
            const memberInTable = memberInTableStr.split(',').map(Number);
            setMembersInTable(memberInTable)

        } catch (error) {

        }
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
        getMemberInTable();


    }, [])

    const onChange = async (checked: boolean, id: number) => {
        if (checked) {
            await updateMemberInTable(tableName, id);
            await getMemberInTable();
        } else {
            await removeMemberInTable(tableName, id);
            await getMemberInTable();
        }
    };

    const handlePageChange = (page: any) => {
        fetchData(page, limit);
    }


    interface DataType {
        key: React.Key;
        id: number;
        name: string;
        email: string;
        phoneNumber: string;
        role: string;
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
            title: 'Action',
            key: 'action',
            render: (text: string, record: member) => (
                <Space size="middle">
                    <Switch
                        checked={membersInTable.includes(record.id)}
                        onChange={(checked) => onChange(checked, record.id)}
                    />

                </Space>
            ),
        },
    ];

    if (!membersInTable || !members) {
        return <div>Loading...</div>;  // Hoặc một loading spinner
    }


    return (
        <div>
            <div>Members</div>
            <Table<DataType>
                columns={columns}
                dataSource={members}
                rowKey="id" // Đảm bảo mỗi hàng có một khóa duy nhất
                pagination={false} // Tùy chỉnh theo yêu cầu
                bordered
                size="middle"
                scroll={{ x: 'max-content' }}
            />
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

export default Member