import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import {
    ref,
    uploadBytes,
    getDownloadURL,
} from "firebase/storage";
import { v4 } from "uuid";
import { storage } from "../../../config/fire-base";
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from "formik";
import { addCategory } from "../../../services/category-service/category-service";
import { NotificationType } from "../../Supporter/Notification";
import { FaSpinner } from "react-icons/fa";
import { useNotification } from '../../../providers/NotificationProvider';

const CategorySchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Too Short!')
        .max(100, 'Too Long!')
        .required('Name is required!')
});

const AddCategory = ({ isOpenAddCategoryPopup, setIsOpenAddCategoryPopup }) => {
    const { showNotification } = useNotification();
    const [imageUrl, setImageUrl] = useState("");
    const [imageError, setImageError] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    
    const uploadFile = (file) => {
        if (file == null) return;
        setIsUploading(true);
        const imageRef = ref(storage, `images/${file.name + v4()}`);
        uploadBytes(imageRef, file).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                setImageUrl(url);
                showNotification(NotificationType.SUCCESS, "Image uploaded successfully");
                setIsUploading(false);
            }).catch((error) => {
                showNotification(NotificationType.ERROR, "Error uploading image");
                setIsUploading(false);
            });
        }).catch((error) => {
            showNotification(NotificationType.ERROR, "Error uploading image");
            setIsUploading(false);
        });
    };

    const handleRemoveImage = () => {
        setImageUrl("");
    }

    const add = async (values, { setSubmitting }) => {
        try {
            await addCategory(values);
            showNotification(NotificationType.SUCCESS, "Add category success.");
            setIsOpenAddCategoryPopup(false);
        } catch (error) {
            showNotification(NotificationType.ERROR, error.response?.data?.message || "Error adding category");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <>
            <Formik
                initialValues={{
                    name: ''
                }}
                validationSchema={CategorySchema}
                onSubmit={(values, formikBag) => {
                    if (!imageUrl) {
                        setImageError("Image is required!");
                        formikBag.setSubmitting(false);
                        return;
                    }
                    const data = { ...values, image: imageUrl };
                    add(data, formikBag);
                    setImageUrl("");
                    setImageError("");
                    formikBag.resetForm();
                }}
            >
                {({ isSubmitting }) => (
                <AnimatePresence>
                    {isOpenAddCategoryPopup && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
                        >
                            <motion.div
                                initial={{ y: -50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -50, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-xl w-full max-w-xl relative"
                            >
                                <IoCloseOutline
                                    className="absolute top-4 right-4 text-2xl cursor-pointer text-gray-600 hover:text-red-500"
                                    onClick={() => setIsOpenAddCategoryPopup(false)}
                                />
                                <Form>
                                    <h2 className="text-2xl font-semibold text-[#fecb02] text-600 mb-6">Add Category</h2>
                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <div className="col-span-1">
                                            <Field
                                                type="text"
                                                placeholder="Name"
                                                name="name"
                                                className="border border-gray-300 p-2 rounded text-sm w-full dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:border-[#fecb02]"
                                            />
                                            <ErrorMessage name="name">
                                                {(msg) => <div className="mt-1 text-red-500 text-md">{msg}</div>}
                                            </ErrorMessage>
                                        </div>
                                        <div>
                                            <div className="relative">
                                                <input
                                                    className="m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                                                    type="file"
                                                    id="formFile"
                                                    accept="image/*"
                                                    onChange={(event) => {
                                                        uploadFile(event.target.files[0]);
                                                    }}
                                                    disabled={isUploading}
                                                />
                                                {isUploading && (
                                                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                                        <FaSpinner className="animate-spin text-[#fecb02] text-xl" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mt-1 text-red-500 text-md">{imageError}</div>
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                                        {
                                            imageUrl && <div className="relative w-full aspect-square">
                                                <img
                                                    src={imageUrl}
                                                    alt={`Category Image`}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage()}
                                                    className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        }
                                    </div>
                                    {/* Submit */}
                                    <button 
                                        type="submit"
                                        disabled={isSubmitting || isUploading}
                                        className={`w-full bg-[#fecb02] text-white py-2 rounded hover:opacity-90 flex items-center justify-center gap-2 ${(isSubmitting || isUploading) ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        {isSubmitting && <FaSpinner className="animate-spin" />}
                                        {isSubmitting ? 'Đang xử lý...' : 'Submit'}
                                    </button>
                                </Form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
                )}
            </Formik>
        </>
    );
};

export default AddCategory;