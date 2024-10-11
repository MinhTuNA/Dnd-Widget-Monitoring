import { UpdateMember, getMember } from "@/lib/services/API_service";
import { Button, notification } from "antd";
import React, { useState, useEffect } from "react";
import stylePopupUpdate from '@/styles/styleMembersManagement/popupUpdate.module.css'

interface UpdateProps {
    membersId: number;
    close: () => void;
    onDataChange: () => void;
}

const Update: React.FC<UpdateProps> = ({ membersId, close, onDataChange }) => {
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [password, setPassword] = useState("");
    useEffect(() => {
        const fetchMember = async () => {
            try {
                const response = await getMember(membersId)
                const member = response.data;
                setName(member.name);
                setEmail(member.email);
                setPhoneNumber(member.phoneNumber);
                setIsAdmin(member.isAdmin);
            } catch (err: any) {
                notification.error({
                    message: 'lỗi',
                    description: err.response?.data?.error || "Lỗi khi lấy dữ liệu",
                    duration: 2
                });
            }
        };

        if (membersId) {
            fetchMember();
        }
    }, [membersId]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (password && password.length > 0 && password.length < 6) {
            notification.error({
                message: 'lỗi',
                description: 'Mật khẩu phải có tối thiểu 6 ký tự.',
                duration: 2
            })
            return;
        }
        if (password.includes(" ")) {
            notification.error({
                message: 'lỗi',
                description: "Mật khẩu không được chứa khoảng trắng.",
                duration: 2
            })
            return;
        }
        try {
            const response = await UpdateMember(membersId, name, phoneNumber, email, isAdmin, password);
            console.log(response.data.message);
            notification.success({
                message: 'thành công',
                duration: 1
            })
            onDataChange();
        } catch (error: any) {
            notification.error({
                message: 'lỗi',
                description: error.response.data.message,
                duration: 2,
            })
        }
    };

    return (
        <div className="d-flex justify-content-center">
            <div className="class-form-change" >
                <form >
                    <p style={{ fontSize: 22 }} >Update Info Members </p>
                    <div className="main-content-change">
                        <table className="table-style">
                            <tbody>
                                <tr>
                                    <td className={stylePopupUpdate.tdStyle}>
                                        <label htmlFor="Name">Name</label>
                                    </td>
                                    <td className={stylePopupUpdate.tdStyle}>
                                        <input
                                            className={stylePopupUpdate.inputMember}
                                            type="text"
                                            id="Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={stylePopupUpdate.tdStyle}>
                                        <label htmlFor="PhoneNumber">Phone </label>
                                    </td>
                                    <td className={stylePopupUpdate.tdStyle}>
                                        <input
                                            className={stylePopupUpdate.inputMember}
                                            type="tel"
                                            pattern="[0-9]{10}"
                                            maxLength={10}
                                            id="PhoneNumber"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            required
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={stylePopupUpdate.tdStyle}>
                                        <label htmlFor="Email">Email</label>
                                    </td>
                                    <td className={stylePopupUpdate.tdStyle}>
                                        <input
                                            className={stylePopupUpdate.inputMember}
                                            type="email"
                                            id="Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </td>
                                </tr>
                                {/* <tr>
                                    <td className={stylePopupUpdate.tdStyle}>Role</td>
                                    <td className={stylePopupUpdate.tdStyle}>
                                        <input
                                            type="radio"
                                            id="Admin"
                                            value="Admin"
                                            name="role"
                                            checked={isAdmin === true}
                                            onChange={(e) => setIsAdmin(true)}
                                            required
                                        />
                                        <label htmlFor="Admin">Admin</label>
                                        <input
                                            type="radio"
                                            id="Employee"
                                            name="role"
                                            value="Member"
                                            checked={isAdmin === false}
                                            onChange={(e) => setIsAdmin(false)}
                                            required
                                        />
                                        <label htmlFor="Employee">Member</label>
                                    </td>
                                </tr> */}
                                <tr>
                                    <td className={stylePopupUpdate.tdStyle}>
                                        <label htmlFor="password">Password</label>
                                    </td>
                                    <td className={stylePopupUpdate.tdStyle}>
                                        <input
                                            className={stylePopupUpdate.inputMember}
                                            type="text"
                                            id="password"
                                            value={password}
                                            placeholder="bỏ trống nếu không đổi mật khẩu"
                                            onChange={(e) => setPassword(e.target.value)}

                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                    </div>

                    <div style={{ display: 'flex', flexDirection: 'row-reverse', gap: 15, marginTop: 20 }}>
                        <Button type="default" onClick={close} >
                            Cancel
                        </Button>
                        <Button type="primary" onClick={handleSubmit} >
                            OK
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Update;