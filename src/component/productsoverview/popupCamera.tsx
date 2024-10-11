import React, { useState, useEffect, useRef, MouseEventHandler } from "react";

import Chart from "./piechart";
import { CloseOutlined, DownOutlined, ExpandOutlined, FullscreenOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';
import stylePopupCamera from '@/styles/styleProductsOverview/popupCamera.module.css'
import styleChartContainer from '@/styles/styleProductsOverview/chartContainer.module.css'

interface DataEntry {
  name: string;
  value: number;
}

interface PopupCameraProps {
  closePopup: () => void;
  data: DataEntry[],
  title: string,
  id: string,
}


const PopupCamera: React.FC<PopupCameraProps> = ({ closePopup, data, title, id }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [quality, setQuality] = useState(480);
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  const items: MenuProps['items'] = [
    {
      label: '360p',
      key: '0',
      onClick: () => handleSettingQuality(360),
    },
    {
      label: '480p',
      key: '1',
      onClick: () => handleSettingQuality(480),
    },
    {
      label: '720p',
      key: '2',
      onClick: () => handleSettingQuality(720),
    },
    {
      label: '1080p',
      key: '3',
      onClick: () => handleSettingQuality(1080),
    },
  ];
  const handleFullscreen = () => {
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.style.zoom =
        quality === 1080
          ? "1"
          : quality === 720
            ? "1.5"
            : quality === 480
              ? "2.24"
              : "3"; // Cho 360p, tăng tỉ lệ để vừa fullscreen
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      }
      setIsFullscreen(true);
    }
  };


  const handleFullscreenChange = () => {

    const iframe = iframeRef.current;
    setIsFullscreen(false); // Reset fullscreen state
    if (!document.fullscreenElement) {
      if (iframe) {
        handleSettingQuality(480);
        iframe.style.width = "854px";
        iframe.style.height = "480px";
        iframe.style.zoom = "0.9";
        iframe.style.border = "none";
      }
    }
  };
  const handleSettingQuality = (newQuality: number) => {
    setQuality(newQuality);
    setShowQualityMenu(false); // Đóng menu sau khi chọn chất lượng
  };
  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const camera_url = process.env.NEXT_PUBLIC_HOST_NAME;
  return (
    <div className={stylePopupCamera.cameraContainer}>
      <div className="d-flex justify-content-end mb-2">
        <Dropdown menu={{ items }} trigger={['click']}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <SettingOutlined style={{ fontSize: 20, marginRight: 15, marginTop: 2 }} />
            </Space>
          </a>
        </Dropdown>
        <div className={stylePopupCamera.zoomCameraContainer}>
          <FullscreenOutlined
            className={stylePopupCamera.zoomCameraIcon}
            onClick={handleFullscreen}
          />
        </div>
        <div className={stylePopupCamera.exiCameraContainer}>
          <CloseOutlined
            className={stylePopupCamera.exitCameraIcon}
            onClick={closePopup}
          />
        </div>
      </div>

      <div className="d-flex flex-column flex-xl-row">
        <div className={styleChartContainer.chartContainer}>
          <Chart data={data} title={title} />
        </div>
        <div className={stylePopupCamera.videoContainer}>
          <iframe
            ref={iframeRef}
            className={`video-feed ${isFullscreen ? "fullscreen" : ""
              } quality-${quality}p`}
            src={`${camera_url}/video_feed/${id}/${quality}p`}
            title={`camera ${title}`}
            style={{
              width:
                quality === 1080
                  ? "1920px"
                  : quality === 720
                    ? "1280px"
                    : quality === 480
                      ? "854px"
                      : "640px", // cho 360p
              height:
                quality === 1080
                  ? "1080px"
                  : quality === 720
                    ? "720px"
                    : quality === 480
                      ? "480px"
                      : "360px", // cho 360p
              border: "none",
              zoom:
                quality === 1080
                  ? 0.4
                  : quality === 720
                    ? 0.6
                    : quality === 480
                      ? 0.9
                      : 1.2,
            }}
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default PopupCamera;
