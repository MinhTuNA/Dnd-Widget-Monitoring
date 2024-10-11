import React, { useEffect, useState } from 'react';
import { DashboardOutlined, ExportOutlined, ProductOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Menu, Modal, notification, theme } from 'antd';
import Sider from 'antd/es/layout/Sider';
import styleSider from '@/styles/common/Sider.module.css'
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllMember, getAllTables, getUser } from '@/lib/services/API_service';
import { fetchTablesStart, fetchTablesSuccess, fetchTablesFailure } from '@/lib/slices/dataReducer';
import { setEmail, setAuth, setId, setName, setPhoneNumber, setRole } from '@/lib/slices/authReducer';
import { clearEmail, clearAuth, clearId, clearName, clearPhoneNumber, clearRole } from '@/lib/slices/authReducer';
import Update from './popupUpdateInfo';
import styleUpdateUser from '@/styles/common/UpdateUser.module.css'
import { fetchMembers } from '@/lib/actions/membersAction';


type MenuItem = Required<MenuProps>['items'][number];

interface NavbarProps {
    collapsed: boolean,
}

const Navbar: React.FC<NavbarProps> = ({ collapsed }) => {
    const [current, setCurrent] = useState('overview');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    const showModal = () => {
        setIsModalOpen(true);
    }

    const cancelModal = () => {
        setIsModalOpen(false);
    }

    const user = {
        id: useSelector((state: any) => state.user.id),
        name: useSelector((state: any) => state.user.name),
        email: useSelector((state: any) => state.user.email),
        phoneNumber: useSelector((state: any) => state.user.phoneNumber),
        isAdmin: useSelector((state: any) => state.user.isAdmin),
    };

    const dispatch = useDispatch();


    useEffect(() => {
        const fetchTables = async () => {
            dispatch(fetchTablesStart());
            try {
                const response = await getAllTables();
                dispatch(fetchTablesSuccess(response.data));
            } catch (error: any) {
                console.log(error)
                dispatch(fetchTablesFailure(error.message));
            }
        }
        fetchTables();

        fetchMembers(dispatch, 1, 10);
    }, [])

    useEffect(() => {
        const fetchAccount = async () => {
            try {
                const res = await getUser();
                if (res) {
                    dispatch(setAuth());
                    dispatch(setId(res.data.id));
                    dispatch(setEmail(res.data.email));
                    dispatch(setName(res.data.name));
                    dispatch(setPhoneNumber(res.data.phoneNumber));
                    dispatch(setRole(res.data.isAdmin));
                }
            } catch (error) {
                // router.push('/');
                console.log(error)
            }

        }
        fetchAccount();
    }, [])


    const handleLogout = () => {
        localStorage.clear();
        dispatch(clearId());
        dispatch(clearEmail());
        dispatch(clearName());
        dispatch(clearPhoneNumber());
        dispatch(clearRole());
        dispatch(clearAuth());
        router.push('/')
        notification.success(
            {
                message: 'logout successfully',
                duration: 1,
            }
        )
    }

    const items: MenuItem[] = [
        {
            label: 'Products Overview',
            key: 'overview',
            icon: <DashboardOutlined />,
            onClick: () => router.push('/dashboard/products_overview')
        },
        {
            label: 'Monitoring Board',
            key: 'board',
            icon: <ProductOutlined />,
            onClick: () => router.push('/dashboard/monitoring_board')
        },
        {
            label: 'Members',
            key: 'Members',
            icon: <UserOutlined />,
            onClick: () => router.push('/dashboard/members_management')
        },
        {
            label: 'Export Data',
            key: 'export',
            icon: <ExportOutlined />,
            onClick: () => router.push('/dashboard/export_data')
        },
        {
            label: `${user.name}`,
            key: 'SubMenu',
            icon: <SettingOutlined />,
            children: [
                {
                    type: 'group',
                    children: [
                        { label: 'Change Info', key: 'changeInfo', onClick: showModal },
                        { label: 'Logout', key: 'logout', onClick: handleLogout },
                    ],
                },

            ],
        },
    ];


    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
    };
    return (
        <>
            <Sider className={styleSider.customSider} collapsedWidth={50} trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical" />
                <Menu theme="light"
                    className={`${styleSider.customSider} ${collapsed ? styleSider.collapsed : styleSider.expanded}`}
                    mode="inline"
                    defaultSelectedKeys={['overview']}
                    onClick={onClick}
                    selectedKeys={[current]}
                    items={items}
                />;
            </Sider >

            <Modal
                open={isModalOpen}
                onCancel={cancelModal}
                closeIcon={false}
                footer={null}
                style={{ top: '10%' }}
                className={styleUpdateUser.modalCustom}
            >
                <Update close={cancelModal} user={user} />
            </Modal>

        </>

    )
};

export default Navbar;



