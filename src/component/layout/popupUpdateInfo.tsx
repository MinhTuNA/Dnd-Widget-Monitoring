import { UpdateInfo } from "@/lib/services/API_service";
import { Button, notification } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setEmail, setPhoneNumber } from "@/lib/slices/authReducer";
import styleUpdateUser from '@/styles/common/UpdateUser.module.css'
interface UpdateProps {
    user: any;
    close: () => void;
}

const Update: React.FC<UpdateProps> = ({ user, close }) => {
    const id = user.id;
    const [name, setName] = useState(user.name);
    const [userPhoneNumber, setUserPhoneNumber] = useState(user.phoneNumber);
    const [userEmail, setUserEmail] = useState(user.email);
    const [isAdmin, setIsAdmin] = useState(user.isAdmin);
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (password && password.length > 0 && password.length < 6) {
            notification.error({
                message: 'lỗi',
                description: "Mật khẩu phải có tối thiểu 6 ký tự.",
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
            const response = await UpdateInfo(id, userPhoneNumber, userEmail, password);
            console.log(response.data.message);
            notification.success({
                message: 'thành công',
                description: "thay đổi thông tin thành công.",
                duration: 2
            })
            dispatch(setEmail(userEmail));
            dispatch(setPhoneNumber(userPhoneNumber));

            close();
        } catch (error: any) {
            console.error("Error:", error.response.data.message);
            notification.error({
                message: 'lỗi',
                description: error.response.data.message,
                duration: 2
            })
        }
    };

    return (
        <div className="d-flex justify-content-center">
            <div className="class-form-change">
                <form onSubmit={handleSubmit}>
                    <p style={{ fontSize: 22 }} >Update Info </p>
                    <div className="main-content-change">
                        <table className="table-style">
                            <tbody>
                                <tr>
                                    <td className={styleUpdateUser.tdStyle}>
                                        <label htmlFor="Name">Name</label>
                                    </td>
                                    <td className={styleUpdateUser.tdStyle}>
                                        <input
                                            className={styleUpdateUser.inputMember}
                                            type="text"
                                            id="Name"
                                            value={name}
                                            readOnly
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={styleUpdateUser.tdStyle}>
                                        <label htmlFor="PhoneNumber">Phone </label>
                                    </td>
                                    <td className={styleUpdateUser.tdStyle}>
                                        <input
                                            className={styleUpdateUser.inputMember}
                                            type="tel"
                                            pattern="[0-9]{10}"
                                            maxLength={10}
                                            id="PhoneNumber"
                                            value={userPhoneNumber}
                                            onChange={(e) => setUserPhoneNumber(e.target.value)}
                                            required
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={styleUpdateUser.tdStyle}>
                                        <label htmlFor="Email">Email</label>
                                    </td>
                                    <td className={styleUpdateUser.tdStyle}>
                                        <input
                                            className={styleUpdateUser.inputMember}
                                            type="email"
                                            id="Email"
                                            value={userEmail}
                                            onChange={(e) => setUserEmail(e.target.value)}
                                            required
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className={styleUpdateUser.tdStyle}>Role</td>
                                    <td className={styleUpdateUser.tdStyle}>
                                        <input
                                            type="radio"
                                            id="Admin"
                                            value="Admin"
                                            name="role"
                                            checked={isAdmin == true}
                                            disabled
                                            required
                                        />
                                        <label htmlFor="Admin">Admin</label>
                                        <input
                                            type="radio"
                                            id="member"
                                            name="role"
                                            value="Member"
                                            checked={isAdmin == false}
                                            disabled
                                            required
                                        />
                                        <label htmlFor="Member">Member</label>
                                    </td>
                                </tr>
                                <tr>
                                    <td className={styleUpdateUser.tdStyle}>
                                        <label htmlFor="password">Password</label>
                                    </td>
                                    <td className={styleUpdateUser.tdStyle}>
                                        <input
                                            className={styleUpdateUser.inputMember}
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
        </div >
    );
}

export default Update;