'use client'
import { getDataDay, getDataNow } from "@/lib/services/API_service";
import { RootState } from "@/lib/store/store";
import { BarChartOutlined, DeleteOutlined, SettingOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import { Modal, notification, Table, TableColumnsType } from "antd";
import { Button } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import StyleProductsOverview from '@/styles/styleProductsOverview/productsOverview.module.css'
import ChartPopup from "@/component/monitoringboard/popupChart";
import Setting from "@/component/monitoringboard/popupSetting";
import CreateLine from "@/component/monitoringboard/popupCreate";
import Remove from "@/component/monitoringboard/popupRemove";
import styleMonitoringBoard from '@/styles/styleMonitoringBoard/monitoringBoard.module.css'
import Member from "@/component/monitoringboard/popupMember";
const MonitoringBoard = () => {
    const [data, setData] = useState([]);
    const [totalTargetsSum, setTotaltargetsSum] = useState(0);
    const [totalActualsSum, setTotalActualsSum] = useState(0);
    const dispatch = useDispatch();
    const tables = useSelector((state: RootState) => state.tableName.tables);
    const [isChartOpen, setIsChartOpen] = useState(false)
    const [isSettingOpen, setIsSettingOpen] = useState(false)
    const [isRemoveOpen, setIsRemoveOpen] = useState(false)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isMemberOpen, setIsMemberOpen] = useState(false)
    const [type, setType] = useState('')
    const [target, setTarget] = useState(0)

    const showModal = (type: string) => {
        switch (type) {
            case "chart":
                setIsChartOpen(true);
                break;
            case "setting":
                setIsSettingOpen(true);
                break;
            case "remove":
                setIsRemoveOpen(true);
                break;
            case "member":
                setIsMemberOpen(true);
                break;
            default:
                break;
        }
    };

    const showCreateModal = () => {
        setIsCreateOpen(true);
    }

    const handleCancel = () => {
        setIsChartOpen(false);
        setIsRemoveOpen(false);
        setIsSettingOpen(false);
        setIsCreateOpen(false);
        setIsMemberOpen(false)
    };
    const fetchData = async () => {
        try {
            // Gọi API để lấy dữ liệu hiện tại
            const responseNow = await getDataNow(tables);
            const fetchedDataNow = responseNow.data.data;

            // Gọi API để lấy dữ liệu theo ngày
            const responseDay = await getDataDay(tables);
            const fetchedDataDay = responseDay.data.data;

            // Định dạng lại dữ liệu
            const formattedData = fetchedDataNow.map((tableNow: any, index: number) => {
                // Tính tổng target trong ngày từ dữ liệu get_data_day
                const dayData = fetchedDataDay.find(
                    (tableDay: any) => tableDay.tableName === tableNow.tableName
                );
                const totalTarget = dayData
                    ? dayData.data.reduce((acc: any, item: any) => acc + (item.Target || 0), 0)
                    : 0;

                const totalActual = dayData
                    ? dayData.data.reduce((acc: any, item: any) => acc + (item.Actual || 0), 0)
                    : 0;

                // Tính target và actual từ dữ liệu hiện tại
                const target = tableNow.data.reduce(
                    (acc: any, item: any) => acc + (item.Target || 0),
                    0
                );
                const actual = tableNow.data.reduce(
                    (acc: any, item: any) => acc + (item.Actual || 0),
                    0
                );

                return {
                    key: index,
                    type: tableNow.tableName, // hoặc tên bảng (tableNow.tableName)
                    totalTarget: totalTarget,
                    totalActual: totalActual,
                    target: target,
                    actual: actual,
                };
            });
            const sumOfTarget = formattedData.reduce(
                (acc: any, item: any) => acc + item.totalTarget,
                0
            );
            const sumOfActual = formattedData.reduce(
                (acc: any, item: any) => acc + item.totalActual,
                0
            );
            setTotaltargetsSum(sumOfTarget);
            setTotalActualsSum(sumOfActual);
            setData(formattedData);

        } catch (error) {


            console.error("Lỗi khi lấy dữ liệu:", error);
        }
    };

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(fetchData, 1000);
        return () => clearInterval(intervalId);
    }, [tables]);

    interface DataType {
        key: React.Key;
        type: string;
        totalTarget: number;
        totalActual: number;
        target: number;
        actual: number;
    }


    const columns: TableColumnsType<DataType> = [
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            fixed: 'left',
            render: (text: any, record: any) => (
                <a style={{ cursor: 'pointer' }}>
                    {text}
                </a>
            ),
        },
        {
            title: 'Total Target',
            dataIndex: 'totalTarget',
            key: 'totalTarget',
        },
        {
            title: 'Total Actual',
            dataIndex: 'totalActual',
            key: 'totalActual',
        },
        {
            title: 'Hourly Target',
            dataIndex: 'target',
            key: 'target',
        },
        {
            title: 'Actual',
            dataIndex: 'actual',
            key: 'actual',
        },
        {
            title: 'Diff',
            key: 'diff',
            render: (text: any, record: any) => record.actual - record.target,
        },
        {
            title: 'Action',
            key: 'action',
            render: (text: string, record: any) => (
                <div className="d-flex justify-content-around">
                    <BarChartOutlined
                        style={{ marginRight: 10 }}
                        onClick={() => { showModal("chart"); setType(record.type) }}
                    >
                        View Chart
                    </BarChartOutlined>
                    <SettingOutlined
                        style={{ marginRight: 10 }}
                        onClick={() => { showModal("setting"); setType(record.type); setTarget(record.target) }}
                    >
                        Settings
                    </SettingOutlined>

                    <DeleteOutlined
                        style={{ marginRight: 10 }}
                        onClick={() => { showModal("remove"); setType(record.type) }}
                    >
                        Delete
                    </DeleteOutlined>
                    <TeamOutlined
                        style={{ marginRight: 10 }}
                        onClick={() => { showModal("member"); setType(record.type) }}
                    />
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className={StyleProductsOverview.container}>
                <div className={StyleProductsOverview.total}>
                    <div className={StyleProductsOverview.totalContainer}>
                        <p className={StyleProductsOverview.pTotal}>Target </p>
                        <p className={StyleProductsOverview.pValue}>{totalTargetsSum}</p>
                    </div>
                    <div className={StyleProductsOverview.totalContainer}>
                        <p className={StyleProductsOverview.pTotal}>Actual </p>
                        <p className={StyleProductsOverview.pValue}>{totalActualsSum}</p>
                    </div>
                    <div className={StyleProductsOverview.totalContainer}>
                        <p className={StyleProductsOverview.pTotal}>Diff </p>
                        <p className={StyleProductsOverview.pValue}>{totalActualsSum - totalTargetsSum}</p>
                    </div>
                </div>
            </div>
            <div >
                <Button color="default" style={{ fontSize: 18, marginBottom: 15, float: 'right', width: 150 }} onClick={showCreateModal} >
                    Create new line
                </Button>
            </div>

            <Modal

                open={isCreateOpen}
                onCancel={handleCancel}
                closeIcon={false}
                footer={null}
                style={{ top: '10%' }}
                className={styleMonitoringBoard.modalCustom}
                destroyOnClose={true}
            >
                <CreateLine close={handleCancel} />
            </Modal>

            <Modal

                open={isChartOpen}
                onCancel={handleCancel}
                closeIcon={false}
                footer={null}
                style={{ top: '10%' }}
                width='80vw'
            >
                <ChartPopup close={handleCancel} tableName={type} />
            </Modal>

            <Modal

                open={isSettingOpen}
                onCancel={handleCancel}
                closeIcon={false}
                footer={null}
                style={{ top: '10%' }}
                className={styleMonitoringBoard.modalCustom}
                destroyOnClose={true}
            >
                <Setting close={handleCancel} tableName={type} Target={target} />
            </Modal>

            <Modal

                open={isRemoveOpen}
                onCancel={handleCancel}
                closeIcon={false}
                footer={null}
                style={{ top: '10%' }}
                className={styleMonitoringBoard.modalCustom}
            >
                <Remove close={handleCancel} tableName={type} />
            </Modal>

            <Modal

                open={isMemberOpen}
                onCancel={handleCancel}
                closeIcon={false}
                footer={null}
                style={{ top: '10%' }}
                className={styleMonitoringBoard.modalMember}
                width={800}
                destroyOnClose={true}
            >
                <Member tableName={type} />
            </Modal>

            <Table<DataType>
                columns={columns}
                dataSource={data}
                rowKey="key"
                pagination={false}
                bordered
                size="middle"
                scroll={{ x: 'max-content' }}
            />
        </div>
    )
}

export default MonitoringBoard;