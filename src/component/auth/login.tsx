'use client';

import React, { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import loginStyle from '@/styles/common/Login.module.css'
import { useDispatch } from "react-redux"
import { setEmail, setPhoneNumber, setName, setRole, setAuth, setId } from "../../lib/slices/authReducer"
import { login } from '@/lib/services/API_service';
import { Button, Form, FormProps, Input, notification } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';


type FieldType = {
    username?: string;
    password?: string;
};

const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

// import { useDispatch } from 'react-redux';
// import { setRole, setToken } from '../redux/reducers/authReducer';
const Login = () => {
    const [emailInput, setEmailInput] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loadingAPI, setLoadingAPI] = useState(false)
    const dispatch = useDispatch();
    const router = useRouter();
    const [api, contextHolder] = notification.useNotification();
    const handleClearEmail = () => setEmailInput("");
    const handleTogglePassword = () => setPasswordVisible(!passwordVisible);


    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!emailInput || !password) {
            api.error(
                {
                    message: "Email/Password is required!",
                    placement: 'topLeft',
                }
            )
            return;
        }
        try {
            setLoadingAPI(true)
            let res = await login(emailInput, password);
            if (res.data.auth && res.data.token) {
                localStorage.setItem('token', res.data.token)
                if (res.data.isAdmin) {
                    localStorage.setItem('role', 'Admin')
                }
                // localStorage.setItem('isAdmin', res.data.isAdmin)
                dispatch(setAuth())
                dispatch(setId(res.data.id));
                dispatch(setRole(res.data.isAdmin));
                dispatch(setEmail(res.data.email));
                dispatch(setPhoneNumber(res.data.phoneNumber));
                dispatch(setName(res.data.name))
                console.log(res.data.id)
                setTimeout(() => {
                    router.push('/dashboard/products_overview');
                }, 100);
            }

        } catch (error) {
            console.error("Lỗi không xác định:", error);
            notification.error({
                message: "lỗi",
                description: "lỗi không xác định",
                placement: 'topRight',
                duration: 1,
            })
        }
        setLoadingAPI(false)
    }


    return (
        <div className={loginStyle["App"]}>
            <img className={loginStyle["logo"]} src="/img/logo-deltax.png" alt="deltax" />
            <p className={loginStyle["deltaxiot"]}>DELTA X ROBOT IOT</p>
            <div className={loginStyle["form-login"]} >
                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    style={{ maxWidth: 360 }}
                    onSubmitCapture={handleLogin}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your Username!' }]}
                    >
                        <Input prefix={<UserOutlined />}
                            style={{ width: 350 }}
                            placeholder="Username"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)} />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input prefix={<LockOutlined />}
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} />
                    </Form.Item>


                    <Form.Item>
                        <Button block type="primary" htmlType="submit">
                            Log in
                        </Button>

                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Login;