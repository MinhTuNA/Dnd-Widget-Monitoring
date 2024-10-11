import { getDataInRange } from "@/lib/services/API_service";
import React, { useState, useEffect } from "react";
import stylePopupChart from "@/styles/styleMonitoringBoard/popupChart.module.css"
import type { TimeRangePickerProps } from 'antd';
import { DatePicker, Space } from 'antd';
import dayjs from 'dayjs'
import {
    ComposedChart,
    Line,
    Area,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';;
import { CloseOutlined } from "@ant-design/icons";

interface ChartPopupProps {
    close: () => void,
    tableName: string,
}

interface ChartData {
    Name: Date;
    Time: Date;
    Actual: number | null;
    Target: number | null;
}


const ChartPopup: React.FC<ChartPopupProps> = ({ close, tableName }) => {
    const utcDate = new Date();
    const [dataChart, setDataChart] = useState<ChartData[]>([]);
    const [datarcv, setDatarcv] = useState([]);
    const { RangePicker } = DatePicker;
    const dateFormat = 'YYYY-MM-DD HH:00:00'; // Hoặc định dạng bạn đang sử dụng
    const [dateTimeStart, setDateTimeStart] = useState(dayjs().subtract(1, 'month').minute(0).toDate());
    const [dateTimeEnd, setDateTimeEnd] = useState(dayjs().minute(0).toDate());
    useEffect(() => {
        const fetchData = async () => {
            if (dateTimeStart && dateTimeEnd) {
                try {
                    const response = await getDataInRange(
                        tableName,
                        dateTimeStart,
                        dateTimeEnd
                    );
                    setDatarcv(response.data);
                } catch (error: any) {
                    console.error("Lỗi khi lấy dữ liệu:", error);
                }
            }
        };
        fetchData();

        const intervalId = setInterval(fetchData, 1000);
        return () => clearInterval(intervalId);
    }, [dateTimeStart, dateTimeEnd, tableName]);

    useEffect(() => {

        setDataChart(
            datarcv.map((item: any) => ({
                Name: new Date(item.Time),
                Time: new Date(item.Time),
                Actual: item.Actual ?? 0, // Đặt giá trị mặc định là 0 nếu Actual là null
                Target: item.Target ?? 0, // Đặt giá trị mặc định là 0 nếu Target là null
            }))
        );
    }, [datarcv]);

    const handleDateStartChange = (date: any) => {
        setDateTimeStart(date.toDate());
    };

    const handleDateEndChange = (date: any) => {
        setDateTimeEnd(date.toDate());
    };


    const now = new Date(
        utcDate.getFullYear(),
        utcDate.getMonth(),
        utcDate.getDate(),
        utcDate.getHours(),
        0,
        0,
        0
    );

    const handleZoom6h = () => {
        setDateTimeStart(
            new Date(
                utcDate.getFullYear(),
                utcDate.getMonth(),
                utcDate.getDate(),
                utcDate.getHours() - 6,
                0,
                0,
                0
            )
        );
        setDateTimeEnd(now);
    };

    const handleZoom1d = () => {
        setDateTimeStart(
            new Date(
                utcDate.getFullYear(),
                utcDate.getMonth(),
                utcDate.getDate() - 1,
                utcDate.getHours(),
                0,
                0,
                0
            )
        );
        setDateTimeEnd(now);
    };

    const handleZoom1Mth = () => {
        setDateTimeStart(
            new Date(
                utcDate.getFullYear(),
                utcDate.getMonth() - 1,
                utcDate.getDate(),
                utcDate.getHours(),
                0,
                0,
                0
            )
        );
        setDateTimeEnd(now);
    };

    const icons = {
        exitIcon: "/img/icons/exit.png",
    };

    /*
    const data = [
      { name: "time", Actual: 590, Target: 800 },
      { name: "time", Actual: 868, Target: 967 },
      { name: "time", Actual: 1397, Target: 1098 },
      { name: "time", Actual: 1480, Target: 1200 },
      { name: "time", Actual: 1520, Target: 1108 },
      { name: "time", Actual: 1400, Target: 680 },
    ];
    */

    return (
        <div className={stylePopupChart.contentHistory}>
            <div className={stylePopupChart.containerHistory}>
                <div className={stylePopupChart.headingPopup}>
                    <p style={{ fontSize: '1.2em' }}>History {tableName} </p>
                    <p >
                        <CloseOutlined onClick={close} style={{ fontSize: 16, cursor: 'pointer' }} />
                    </p>
                </div>
                <div >
                    <div className={stylePopupChart.timeContain}>
                        <div className={stylePopupChart.zoomSelect}>
                            <p>Zoom: </p>
                            <p className={stylePopupChart.classSelect} onClick={handleZoom6h}>
                                6h
                            </p>
                            <p className={stylePopupChart.classSelect} onClick={handleZoom1d}>
                                1d
                            </p>
                            <p className={stylePopupChart.classSelect} onClick={handleZoom1Mth}>
                                1Mth
                            </p>
                        </div>
                        <div className="">
                            <RangePicker
                                defaultValue={[
                                    dayjs(dateTimeStart),
                                    dayjs(dateTimeEnd)
                                ]}
                                showTime={{
                                    format: 'HH:mm',
                                    defaultValue: [dayjs().hour(0).minute(0), dayjs().hour(23).minute(0)]
                                }}
                                showHour
                                showMinute
                                onCalendarChange={(dates) => {
                                    if (dates && dates.length > 0) {
                                        handleDateStartChange(dates[0]);
                                        if (dates[1]) {
                                            handleDateEndChange(dates[1]);
                                        }
                                    }
                                }}
                                allowClear={false}
                            />
                        </div>
                    </div>
                    <div className={stylePopupChart.colChartContainer}>
                        <ResponsiveContainer width='100%' height={350}>
                            <ComposedChart
                                data={dataChart}
                                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                            >
                                <CartesianGrid stroke="#f5f5f5" />
                                <XAxis
                                    dataKey="Name"
                                    tick={false}
                                    label={{
                                        value: "Thời gian",
                                        position: "insideBottomRight",
                                        offset: 0,
                                    }}
                                />

                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Actual" barSize={20} fill="#000" />
                                <Line
                                    type="monotone"
                                    dataKey="Target"
                                    stroke="#000"
                                    strokeWidth={3}
                                    animationDuration={1}
                                    animationEasing="linear"
                                />
                            </ComposedChart>
                        </ResponsiveContainer>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChartPopup;