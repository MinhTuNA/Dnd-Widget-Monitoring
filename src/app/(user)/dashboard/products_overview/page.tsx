'use client'

import React, { useEffect, useMemo, useState } from "react";

import StyleProductsOverview from '@/styles/styleProductsOverview/productsOverview.module.css'
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { getAllTables, getDataNow } from "@/lib/services/API_service";
import ChartContainer from "@/component/productsoverview/chartContainer";
import { notification } from "antd";
const ProductsOverview: React.FC = () => {
    const [data, setData] = useState([]);
    const [totalTarget, setTotalTarget] = useState(0);
    const [totalActual, setTotalActual] = useState(0);

    const tables = useSelector((state: RootState) => state.tableName.tables);
    useEffect(() => {
        const fetchData = async () => {
            if (tables.length === 0) return;
            try {
                const response = await getDataNow(tables);
                const fetchedData = response.data.data;
                const formattedData = fetchedData.map((table: any) => {
                    const targetValue = table.data.reduce(
                        (acc: any, item: any) => acc + (item.Target || 0),
                        0
                    );
                    const actualValue = table.data.reduce(
                        (acc: any, item: any) => acc + (item.Actual || 0),
                        0
                    );

                    return [
                        { name: "Target", value: targetValue },
                        { name: "Actual", value: actualValue },
                    ];
                });

                setData(formattedData);

                const totalTarget = formattedData.reduce(
                    (acc: any, item: any) =>
                        acc + (item.find((data: any) => data.name === "Target").value || 0),
                    0
                );
                const totalActual = formattedData.reduce(
                    (acc: any, item: any) =>
                        acc + (item.find((data: any) => data.name === "Actual").value || 0),
                    0
                );

                setTotalTarget(totalTarget);
                setTotalActual(totalActual);
            } catch (error) {


                console.error("Lỗi khi gọi API:", error);
            }
        };

        fetchData();
        const intervalId = setInterval(fetchData, 1000);

        return () => clearInterval(intervalId);
    }, [tables]);
    /*const data = [
      [
        { name: 'Actual', value: 60 },
        { name: 'Target', value: 100 }
      ],
    ];
    */

    return (
        <div>
            {/* <div className={StyleProductsOverview.titleProducts} >
                <p>PRODUCT MONITORING SYSTEM</p>
            </div> */}

            <div className={StyleProductsOverview.container}>
                <div className={StyleProductsOverview.total}>
                    <div className={StyleProductsOverview.totalContainer}>
                        <p className={StyleProductsOverview.pTotal}>Target </p>
                        <p className={StyleProductsOverview.pValue}>{totalTarget}</p>
                    </div>
                    <div className={StyleProductsOverview.totalContainer}>
                        <p className={StyleProductsOverview.pTotal}>Actual </p>
                        <p className={StyleProductsOverview.pValue}>{totalActual}</p>
                    </div>
                    <div className={StyleProductsOverview.totalContainer}>
                        <p className={StyleProductsOverview.pTotal}>Diff </p>
                        <p className={StyleProductsOverview.pValue}>{totalActual - totalTarget}</p>
                    </div>
                </div>
            </div>
            <div className={StyleProductsOverview.piechartContainer}>
                {data.length === 0 ? (
                    <p>Không có dữ liệu để hiển thị.</p>
                ) : (
                    data.map((chartData, index) => (
                        <div key={index}>
                            <ChartContainer data={chartData} title={tables[index]} />
                        </div>
                    ))
                )}
            </div>

        </div>

    );
};

export default ProductsOverview;
