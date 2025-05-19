import { useEffect, useState } from "react";
import { getInfo, updateInfo } from "../../../services/auth-service/auth-service";
import { Field, Form, Formik } from "formik";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../config/fire-base";
import { v4 } from "uuid";
import { useNotificationPortal } from "../../Supporter/NotificationPortal";
import { NotificationType } from "../../Supporter/Notification";
import { useUser } from "../../../providers/users/UserProvider";
import { PROFILE_MENU, useProfileMenu } from "../../../providers/users/ProfileMenuProvider";

const Information = () => {
    const [userInfo, setUserInfo] = useState(null);
    const { showNotification, NotificationPortal } = useNotificationPortal();
    const [editingField, setEditingField] = useState('');
    const { setUser } = useUser();
    const { setOption } = useProfileMenu();

    const uploadFile = (file) => {
        if (file == null) return;
        const imageRef = ref(storage, `images/${file.name + v4()}`);
        uploadBytes(imageRef, file).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                let newData = { ...userInfo, avatar: url };
                setUserInfo(newData);
            });
        });
    };

    const handleSubmit = async (values) => {
        try {
            if (userInfo.avatar) values = { ...values, avatar: userInfo.avatar };
            await updateInfo(values);
            await getUserInfo();
            showNotification(NotificationType.SUCCESS, "Updated information success");
        } catch (e) {
            console.log(e);
            showNotification(NotificationType.ERROR, e.response.data.message);
        }
    };

    const getUserInfo = async () => {
        const info = await getInfo();
        setUser(info);
        setUserInfo(info);
    }

    useEffect(() => {
        getUserInfo();
        setOption(PROFILE_MENU.INFO);
    }, []);
    return (
        <>
            <NotificationPortal />
            {
                userInfo && (
                    <main className="flex-1 p-10 bg-white">
                        <h1 className="text-lg font-semibold mb-2">My Information</h1>
                        <p className="text-sm text-gray-500 mb-6">
                            Manage profile information to keep your account secure
                        </p>

                        <Formik initialValues={
                            {
                                username: userInfo.username || '',
                                email: userInfo.email,
                                phoneNumber: userInfo.phoneNumber || '',
                                gender: userInfo.gender || '',
                                dateOfBirth: userInfo.dateOfBirth || ''
                            }
                        }
                            onSubmit={handleSubmit}>
                            {({ setFieldValue, values }) => (
                                <Form className="flex">
                                    {/* Form Fields */}
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center">
                                            <label className="w-40 text-gray-600">Username</label>
                                            <span>{values.username}</span>
                                        </div>

                                        <div className="flex items-center">
                                            <label className="w-40 text-gray-600">Email</label>
                                            {editingField === 'email' ? (
                                                <Field
                                                    name="email"
                                                    type="email"
                                                    className="border px-3 py-1 rounded"
                                                />
                                            ) : (
                                                <>
                                                    <span>{values.email}</span>
                                                    <button
                                                        type="button"
                                                        className="text-[#fecb02] text-500 ml-2"
                                                        onClick={() => setEditingField('email')}
                                                    >
                                                        Change
                                                    </button>
                                                </>
                                            )}
                                        </div>

                                        <div className="flex items-center">
                                            <label className="w-40 text-gray-600">Phone Number</label>
                                            {editingField === 'phoneNumber' ? (
                                                <Field
                                                    name="phoneNumber"
                                                    type="text"
                                                    className="border px-3 py-1 rounded"
                                                />
                                            ) : (
                                                <>
                                                    <span>{values.phoneNumber || 'not yet'}</span>
                                                    <button
                                                        type="button"
                                                        className="text-[#fecb02] text-500 ml-2"
                                                        onClick={() => setEditingField('phoneNumber')}
                                                    >
                                                        Change
                                                    </button>
                                                </>
                                            )}
                                        </div>

                                        <div className="flex items-center">
                                            <label className="w-40 text-gray-600">Gender</label>
                                            <div className="space-x-4">
                                                <label>
                                                    <Field type="radio" name="gender" value="Male" /> Male
                                                </label>
                                                <label>
                                                    <Field type="radio" name="gender" value="Female" /> Female
                                                </label>
                                                <label>
                                                    <Field type="radio" name="gender" value="Other" /> Other
                                                </label>
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            <label className="w-40 text-gray-600">Date Of Birth</label>
                                            <Field
                                                name="dateOfBirth"
                                                type="date"
                                                className="border px-3 py-1 rounded"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="bg-[#fecb02] text-white px-4 py-2 rounded mt-4"
                                        >
                                            Save
                                        </button>
                                    </div>

                                    {/* Avatar Section */}
                                    <div className="w-64 text-center ml-10">
                                        <img
                                            src={
                                                userInfo.avatar ? userInfo.avatar : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                            }
                                            className="w-24 h-24 mx-auto rounded-full mb-3"
                                            alt="avatar"
                                        />
                                        <label className="text-blue-500 cursor-pointer">
                                            Select Image
                                            <input
                                                type="file"
                                                accept="image/png, image/jpeg"
                                                className="hidden"
                                                onChange={(event) => { uploadFile(event.target.files[0]) }}
                                            />
                                        </label>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Maximum file size 1 MB <br />
                                            Format: .JPEG, .PNG
                                        </p>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </main >
                )
            }
        </>
    )

}

export default Information;
