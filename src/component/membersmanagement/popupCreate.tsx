import { CreateMemberAPI } from "@/lib/services/API_service";
import { Button, notification } from "antd";
import React, { useState } from "react";
import stylePopupCreate from "@/styles/styleMembersManagement/popupCreate.module.css"

interface CreateMemberProps {
    close: () => void;
    onDataChange: () => void;
}

const CreateMember: React.FC<CreateMemberProps> = ({ close, onDataChange }) => {
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (password && password.length > 0 && password.length < 6) {
            notification.error({
                message: 'lỗi',
                description: 'mật khẩu phải có tối thiểu 6 ký tự',
                duration: 3
            })
            return;
        }
        if (password.includes(" ")) {
            notification.error({
                message: 'lỗi',
                description: 'mật khẩu không chứa khoảng trắng',
                duration: 3
            })
            return;
        }
        try {
            const response = await CreateMemberAPI(name, phoneNumber, email, isAdmin, password)
            console.log(response.data.message);
            notification.success({
                message: 'Thành công',
                description: `thêm ${name} thành công`,
                duration: 3
            })
            setName("");
            setEmail("");
            setPhoneNumber("");
            setIsAdmin(false)
            setPassword("")

            onDataChange();
        } catch (error: any) {
            console.error('Error:', error.response.data.message);
            notification.error({
                message: 'Lỗi',
                description: error.response.data.message,
                duration: 3
            })

        }
    };

    return (
        <div className="d-flex justify-content-center ">
            <form className="class-form" onSubmit={handleSubmit}>
                <p style={{ fontSize: 20 }} >Create New Member </p>
                <div >
                    <table className="table-style">
                        <tbody>
                            <tr>
                                <td className={stylePopupCreate.tdStyle}>
                                    <label htmlFor="Name">Name</label>
                                </td>
                                <td className={stylePopupCreate.tdStyle}>
                                    <input
                                        className={stylePopupCreate.inputMember}
                                        type="text"
                                        id="Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className={stylePopupCreate.tdStyle}>
                                    <label htmlFor="PhoneNumber">Phone </label>
                                </td>
                                <td className={stylePopupCreate.tdStyle}>
                                    <input
                                        className={stylePopupCreate.inputMember}
                                        type="tel"
                                        pattern="[0-9]{10}"
                                        maxLength={10}
                                        value={phoneNumber}
                                        id="PhoneNumber"
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        required
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className={stylePopupCreate.tdStyle}>
                                    <label htmlFor="Email">Email</label>
                                </td>
                                <td className={stylePopupCreate.tdStyle}>
                                    <input
                                        className={stylePopupCreate.inputMember}
                                        type="email"
                                        id="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </td>
                            </tr>
                            {/* <tr>
                                <td className={stylePopupCreate.tdStyle}>Role</td>
                                <td className={stylePopupCreate.tdStyle}>
                                    <input
                                        type="radio"
                                        id="Admin"
                                        value='Admin'
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
                                <td className={stylePopupCreate.tdStyle}>
                                    <label htmlFor="password">Password</label>
                                </td>
                                <td className={stylePopupCreate.tdStyle}>
                                    <input
                                        className={stylePopupCreate.inputMember}
                                        type="text"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
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
    );
}

export default CreateMember;