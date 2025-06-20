import { useState, useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import {
    ref,
    uploadBytes,
    getDownloadURL,
} from "firebase/storage";
import { v4 } from "uuid";
import { storage } from "../../../config/fire-base";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from 'yup';
import { FormattedNumberInput } from "../../Supporter/FormattedNumberInput";
import CategorySelect from "./CategorySelect";
import CouponCheckboxList from "./CouponsCheckbox";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getOneById, saveProduct } from "../../../services/product-service/product-service";
import { useNotificationPortal } from "../../Supporter/NotificationPortal";
import { NotificationType } from "../../Supporter/Notification";
import { FaSpinner } from "react-icons/fa";

const ProductSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Too Short!')
        .max(100, 'Too Long!')
        .required('Name is required!'),
    price: Yup.number()
        .required('Price is required!'),
    quantity: Yup.number()
        .required('Quantity is required!'),
    categoryId: Yup.number().required(
        'Category is required!'
    )
});

const modules = {
    toolbar: {
        container: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
        ],
        handlers: {
            image: imageHandler,
        },
    },
};

async function imageHandler() {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    const loadingSpinner = document.createElement("div");
    loadingSpinner.className = "loading-spinner";
    document.body.appendChild(loadingSpinner);
    input.onchange = async () => {
        const file = input.files[0];

        if (!file) {
            document.body.removeChild(loadingSpinner);
            return;
        }
        const fileRef = ref(storage, `editor-images/${v4()}`);

        try {
            await uploadBytes(fileRef, file);
            const url = await getDownloadURL(fileRef);
            const quill = this.quill;
            const range = quill.getSelection();
            quill.insertEmbed(range.index, "image", url);
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            document.body.removeChild(loadingSpinner);
        }
    };
}

function DescriptionEditor({ value, onChange }) {
    return (
        <div className="mb-6">
            <ReactQuill
                value={value}
                onChange={onChange}
                modules={modules}
                theme="snow"
                className="dark:bg-gray-800 dark:text-white"
                style={{ height: "200px" }}
            />
        </div>
    );
}

const calculateDiscountedPrice = (originalPrice, coupons) => {
    console.log("coupons", coupons);
    console.log("originalPrice", originalPrice);
    if (!coupons || coupons.length === 0) return originalPrice;

    let finalPrice = originalPrice;
    coupons.forEach(coupon => {
        if (coupon.type === "percent") {
            const discountAmount = (finalPrice * coupon.discount) / 100;
            finalPrice -= discountAmount;
        } else {
            finalPrice -= coupon.discount;
        }
    });

    return Math.max(0, finalPrice);
};

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const EditProduct = ({ isOpenEditProductPopup, setIsOpenEditProductPopup, idEdit, setIdEdit }) => {
    const [imageUrls, setImageUrls] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const { showNotification, NotificationPortal } = useNotificationPortal();
    const [product, setProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({});
    const [discountedPrice, setDiscountedPrice] = useState(0);
    const [selectedCouponsWithDetails, setSelectedCouponsWithDetails] = useState([]);

    const getOne = async () => {
        let data = await getOneById(idEdit);
        setProduct(data);
        setImageUrls(JSON.parse(data.images));
        let couponIds = data.coupons.map(item => item.id);
        setNewProduct({ ...data, categoryId: data.category.id, couponIds });
        setSelectedCouponsWithDetails(data.coupons);
    }

    useEffect(() => {
        if (idEdit) getOne();
    }, [idEdit]);

    useEffect(() => {
        if (product && selectedCouponsWithDetails) {
            const newDiscountedPrice = calculateDiscountedPrice(product.price, selectedCouponsWithDetails);
            setDiscountedPrice(newDiscountedPrice);
        }
    }, [selectedCouponsWithDetails, product]);

    const handleCouponsChange = (coupons) => {
        setSelectedCouponsWithDetails(coupons);
    };

    const uploadFiles = async (files) => {
        if (!files || files.length === 0) return;
        setIsUploading(true);
        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                const imageRef = ref(storage, `images/${file.name + v4()}`);
                const snapshot = await uploadBytes(imageRef, file);
                const url = await getDownloadURL(snapshot.ref);
                return url;
            });

            const urls = await Promise.all(uploadPromises);
            setImageUrls(prev => [...prev, ...urls]);
            showNotification(NotificationType.SUCCESS, "Images uploaded successfully");
        } catch (error) {
            showNotification(NotificationType.ERROR, "Failed to upload images");
            console.error("Upload failed", error);
        } finally {
            setIsUploading(false);
        }
    };

    const save = async (values) => {
        try {
            await saveProduct(values);
            showNotification(NotificationType.SUCCESS, "Edit food success.");
            setIsOpenEditProductPopup(false);
        } catch (e) {
            showNotification(NotificationType.ERROR, e.response.data.message);
        }
    }

    const handleRemoveImage = (index) => {
        const newImages = imageUrls.filter((_, i) => i !== index);
        setImageUrls(newImages);
    }

    return (
        <>
            {isOpenEditProductPopup && product && (
                <>
                    <NotificationPortal />
                    <Formik
                        initialValues={newProduct}
                        enableReinitialize
                        validationSchema={ProductSchema}
                        onSubmit={(values, { resetForm, setSubmitting }) => {
                            values = { ...values, images: JSON.stringify(imageUrls) };
                            save(values)
                        }}>
                        <Form>
                            <AnimatePresence>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 overflow-y-auto"
                                >
                                    <motion.div
                                        initial={{ y: -50, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -50, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-xl w-full max-w-3xl relative max-h-full overflow-y-auto"
                                    >
                                        <IoCloseOutline
                                            className="absolute top-4 right-4 text-2xl cursor-pointer text-gray-600 hover:text-red-500"
                                            onClick={() => {
                                                setIsOpenEditProductPopup(false)
                                                setIdEdit(null)
                                            }}
                                        />
                                        <h2 className="text-2xl font-semibold text-[#fecb02] text-600 mb-6">Edit Food</h2>
                                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                                            <div className="col-span-1">
                                                <Field
                                                    type="text"
                                                    name="name"
                                                    placeholder="Name"
                                                    className="border border-gray-300 p-2 rounded text-sm w-full dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:border-[#fecb02]"
                                                />
                                                <ErrorMessage name="name">
                                                    {(msg) => <div className="mt-1 text-red-500 text-xs">{msg}</div>}
                                                </ErrorMessage>
                                            </div>
                                            <div>
                                                <FormattedNumberInput
                                                    name="price"
                                                    placeholder="Price VNĐ"
                                                    className="border border-gray-300 p-2 rounded text-sm w-full dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:border-[#fecb02]"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                                            <div className="flex items-center">
                                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                                    Price after promotion:
                                                    <span className="font-semibold text-red-600 ml-2">
                                                        {formatPrice(discountedPrice)}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                                            <div className="col-span-1">
                                                <CategorySelect />
                                                <ErrorMessage name="categoryId">
                                                    {(msg) => <div className="mt-1 text-red-500 text-xs">{msg}</div>}
                                                </ErrorMessage>
                                            </div>
                                            <div className="col-span-1 relative">
                                                <input
                                                    className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                                                    type="file"
                                                    id="formFileMultiple"
                                                    multiple
                                                    onChange={(e) => uploadFiles(e.target.files)}
                                                    disabled={isUploading}
                                                />
                                                {isUploading && (
                                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                        <FaSpinner className="animate-spin text-[#fecb02] text-xl" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 gap-4 mb-4">
                                            {imageUrls.map((url, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={url}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-full h-24 object-cover rounded-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveImage(index)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <IoCloseOutline className="text-sm" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <FormattedNumberInput
                                                    name="quantity"
                                                    placeholder="Quantity"
                                                    className="border border-gray-300 p-2 rounded text-sm w-full dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:border-[#fecb02]"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-1 gap-4 mb-4">
                                            <div className="col-span-1">
                                                <CouponCheckboxList onCouponsChange={handleCouponsChange} />
                                                <ErrorMessage name="categoryId">
                                                    {(msg) => <div className="mt-1 text-red-500 text-xs">{msg}</div>}
                                                </ErrorMessage>
                                            </div>
                                        </div>
                                        <div className="mb-6">
                                            <Field name="description">
                                                {({ field, form }) => (
                                                    <DescriptionEditor
                                                        value={field.value}
                                                        onChange={(val) => form.setFieldValue(field.name, val)}
                                                    />
                                                )}
                                            </Field>
                                        </div>
                                        <button className="w-full bg-[#fecb02] text-white py-2 rounded hover:opacity-90 mt-7">
                                            Submit
                                        </button>
                                    </motion.div>
                                </motion.div>
                            </AnimatePresence>
                        </Form>
                    </Formik>
                </>
            )}
        </>
    );
};

export default EditProduct;