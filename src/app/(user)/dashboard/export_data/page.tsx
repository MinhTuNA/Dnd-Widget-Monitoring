'use client'

import { getDataInRange } from "@/lib/services/API_service";
import { RootState } from "@/lib/store/store";
import dayjs from "dayjs";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import * as XLSX from "xlsx";
import { Button, DatePicker, Space } from 'antd';
import styleExportData from '@/styles/styleExportData/styleExportData.module.css'

const ExportData = () => {
    const dispatch = useDispatch();
    const tables = useSelector((state: RootState) => state.tableName.tables);
    const [tableName, setSelectedTablename] = useState(tables[0]);
    const [dateTimeStart, setDateTimeStart] = useState(dayjs().subtract(1, 'month').minute(0).toDate());
    const [dateTimeEnd, setDateTimeEnd] = useState(dayjs().minute(0).toDate());
    const { RangePicker } = DatePicker;
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    const fetchData = async () => {
        if (dateTimeStart && dateTimeEnd) {
            try {
                const response = await getDataInRange(
                    tableName,
                    dateTimeStart,
                    dateTimeEnd
                );
                exportToExcel(response.data, tableName);
            } catch (error) {
                localStorage.clear();
                console.error("Lỗi khi lấy dữ liệu:", error);
            }
        }
    };

    const exportToExcel = (data: any, fileName: string) => {
        // Tạo workbook và worksheet
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

        // Chuyển đổi workbook thành file Excel
        const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });

        // Tạo Blob và lưu file
        const blob = new Blob([wbout], { type: "application/octet-stream" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.xlsx`;  // Đặt tên file Excel
        a.click();

        window.URL.revokeObjectURL(url);
    };

    const handleDateStartChange = (date: any) => {
        setDateTimeStart(date.toDate());
    };

    const handleDateEndChange = (date: any) => {
        setDateTimeEnd(date.toDate());
    };
    const handleSelect = (event: any) => {
        setSelectedTablename(event.target.value);
    };
    const handleExport = async () => {
        await fetchData();
    };


    return (
        <div>
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
            <div suppressHydrationWarning={true} className={styleExportData.selectContainer} >
                <label htmlFor="options">* Select type</label>

                <select suppressHydrationWarning={true} id="options" value={tableName} onChange={handleSelect}  >

                    {tables.map((table, index) => (
                        <option suppressHydrationWarning={true} key={index} value={table} >
                            {table}
                        </option>
                    ))}
                </select>
            </div>

            <Button style={{ marginTop: 20 }} type="primary" onClick={handleExport}>
                EXPORT
            </Button>

        </div>
    )
}

export default ExportData;