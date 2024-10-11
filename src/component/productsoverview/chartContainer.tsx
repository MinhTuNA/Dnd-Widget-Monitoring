// src/Chart.js
import React, { useEffect, useState } from "react";
import styleChartContainer from '@/styles/styleProductsOverview/chartContainer.module.css'
import { Modal, Button } from 'antd';
import PopupCamera from "./popupCamera";
import Chart from "./piechart";
import { getCameraId } from "@/lib/services/API_service";
import { notification } from "antd";
import { FullscreenOutlined } from "@ant-design/icons";

interface DataEntry {
  name: string;
  value: number;
}

interface ChartContainerProps {
  data: DataEntry[],
  title: string,
}

const ChartContainer: React.FC<ChartContainerProps> = ({ data, title }) => {
  const [id, setId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  useEffect(() => {
    const fetchCameraId = async () => {
      try {
        const response = await getCameraId(title);
        setId(response.data);
      } catch (err) {
        notification.error({
          message: 'lỗi',
          description: "lỗi khi lấy dữ liệu",
          placement: 'topRight',
          duration: 1,

        });
      }
    };
    fetchCameraId();
  }, []);

  return (
    <div className={styleChartContainer.chartContainer}>
      <div className={styleChartContainer.headingChart}>
        <div className={styleChartContainer.actionCamera}>
          <FullscreenOutlined
            className={styleChartContainer.expandIcon}
            style={{ fontSize: 23 }}
            onClick={showModal}
          />

          <Modal

            open={isModalOpen}
            onCancel={closeModal}
            closeIcon={false}
            footer={null}
            style={{ top: '10%' }}
            width='80vw'
            className={styleChartContainer.modalContent}
          >
            <PopupCamera closePopup={closeModal} data={data} title={title} id={id} />
          </Modal>
        </div>
      </div>
      <div>
        <Chart data={data} title={title} />
      </div>
    </div>
  );
};

export default ChartContainer;
