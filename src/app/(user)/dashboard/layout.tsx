'use client'
import Navbar from '@/component/layout/admin.header';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Layout, theme } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import React, { useState } from 'react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [collapsed, setCollapsed] = useState(true);

    return (
        <>

            <Layout>
                <Navbar collapsed={collapsed} ></Navbar>
                <Layout>
                    <Header style={{ padding: 0, background: colorBgContainer }}>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '16px',
                                width: 50,
                                height: 50,
                            }}
                        />
                    </Header>

                    <Content
                        style={{
                            margin: '2vh 1vw',
                            padding: '2vw',
                            minHeight: 600,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <section>{children}</section>
                    </Content>
                </Layout>
            </Layout>

        </>
    )
}