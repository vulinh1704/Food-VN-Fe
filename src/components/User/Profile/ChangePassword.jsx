import React, { useState } from 'react';
import { useProfileMenu, PROFILE_MENU } from '../../../providers/users/ProfileMenuProvider';
import { changePassword } from '../../../services/auth-service/auth-service';
import { useNotificationPortal } from '../../Supporter/NotificationPortal';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const ChangePassword = () => {
    const { setOption } = useProfileMenu();
    const { showNotification, NotificationPortal } = useNotificationPortal();
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: ""
    });
    const [showPasswords, setShowPasswords] = useState({
        oldPassword: false,
        newPassword: false
    });

    React.useEffect(() => {
        setOption(PROFILE_MENU.CHANGE_PASSWORD);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await changePassword(formData);
            console.log(response);
            showNotification(
                "success",
                response.message
            );
            setFormData({
                oldPassword: "",
                newPassword: ""
            });
        } catch (error) {
            showNotification(
                "error",
                error.response?.data?.message || error.message || "Có lỗi xảy ra khi thay đổi mật khẩu!"
            );
        }
    };

    return (
        <>
            <NotificationPortal />
            <main className="flex-1 p-10 bg-white">
                <h2 className="text-2xl font-semibold mb-6">Change Password</h2>
                <form onSubmit={handleSubmit} className="max-w-md">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Current Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.oldPassword ? "text" : "password"}
                                name="oldPassword"
                                value={formData.oldPassword}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#fecb02] focus:border-[#fecb02] pr-10"
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                onClick={() => togglePasswordVisibility('oldPassword')}
                            >
                                {showPasswords.oldPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                            </button>
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.newPassword ? "text" : "password"}
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#fecb02] focus:border-[#fecb02] pr-10"
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                onClick={() => togglePasswordVisibility('newPassword')}
                            >
                                {showPasswords.newPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#fecb02] text-white py-2 px-4 rounded-md hover:bg-[#e6b800] transition duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-[#fecb02] focus:ring-opacity-50"
                    >
                        Submit
                    </button>
                </form>
            </main>
        </>
    );
};

export default ChangePassword; 