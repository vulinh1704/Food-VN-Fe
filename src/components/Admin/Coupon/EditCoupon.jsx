import { useState, useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useNotificationPortal } from "../../Supporter/NotificationPortal";
import { NotificationType } from "../../Supporter/Notification";
import { FormattedNumberInput } from "../../Supporter/FormattedNumberInput";
import { addCoupon, getOneCoupon } from "../../../services/coupon-service/coupon-service";
import { formatDateTimeLocal } from "../../../lib/format-hepper";

const CouponSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Too Short!')
        .max(100, 'Too Long!')
        .required('Name is required!'),
    discount: Yup.number()
        .required('Discount is required!'),
    fromDate: Yup.date().nullable(),
    toDate: Yup.date()
        .when('fromDate', {
            is: (fromDate) => fromDate !== null && fromDate !== '',
            then: (schema) => schema.min(Yup.ref("fromDate"), "End date must be after or equal to start date!"),
            otherwise: (schema) => schema.nullable()
        })
});

const EditCoupon = ({ isOpenEditPopup, setIsOpenEditPopup, idEdit }) => {
    const { showNotification, NotificationPortal } = useNotificationPortal();
    const [coupon, setCoupon] = useState({
        name: "",
        type: "percent",
        discount: 0,
        fromDate: "",
        toDate: "",
      });

    const edit = async (values) => {
        await addCoupon(values);
        showNotification(NotificationType.SUCCESS, "Edit coupon success.");
        setIsOpenEditPopup(false);
    }

    const findById = async () => {
        try {
            const data = await getOneCoupon(idEdit);
            setCoupon({
                ...data,
                fromDate: formatDateTimeLocal(data.fromDate),
                toDate: formatDateTimeLocal(data.toDate),
              });
        } catch (e) {
            showNotification(NotificationType.ERROR, e.response.data.message);
        }
    }

    useEffect(() => {
        if (idEdit) findById();
    }, [idEdit]);

    return (
        <>
            <NotificationPortal />
            <Formik
                initialValues={coupon}
                validationSchema={CouponSchema}
                onSubmit={(values, { resetForm, setSubmitting }) => {
                    const data = { ...values };
                    console.log(data);
                    edit(data);
                    resetForm();
                }}
                enableReinitialize
            >

                <AnimatePresence>
                    {isOpenEditPopup && (
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
                                    onClick={() => setIsOpenEditPopup(false)}
                                />
                                <Form>
                                    <h2 className="text-2xl font-semibold text-[#fecb02] text-600 mb-6">Edit Coupon</h2>
                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <div className="col-span-2">
                                            <Field
                                                type="text"
                                                placeholder="Name"
                                                name="name"
                                                className="border border-gray-300 p-2 rounded text-sm w-full dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:border-[#fecb02]"
                                            />
                                            <ErrorMessage name="name">
                                                {(msg) => <div className="mt-1 text-red-500 text-xs">{msg}</div>}
                                            </ErrorMessage>
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <div className="col-span-1">
                                            <Field
                                                as="select"
                                                placeholder="Type"
                                                name="type"
                                                className="border border-gray-300 p-2 rounded text-sm w-full dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:border-[#fecb02]">
                                                <option value="percent">Percent</option>
                                                <option value="fixed">Fixed</option>
                                            </Field>
                                            <ErrorMessage name="type">
                                                {(msg) => <div className="mt-1 text-red-500 text-xs">{msg}</div>}
                                            </ErrorMessage>
                                        </div>
                                        <div className="col-span-1">
                                            <FormattedNumberInput name="discount" placeholder="Discount" className="border border-gray-300 p-2 rounded text-sm w-full dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:border-[#fecb02]" />
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <div className="col-span-1">
                                            <p className="text-gray-500 text-md">From</p>
                                            <Field
                                                type="datetime-local"
                                                name="fromDate"
                                                className="border border-gray-300 p-2 rounded text-sm w-full dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:border-[#fecb02]">
                                            </Field>
                                            <ErrorMessage name="fromDate">
                                                {(msg) => <div className="mt-1 text-red-500 text-xs">{msg}</div>}
                                            </ErrorMessage>
                                        </div>
                                        <div className="col-span-1">
                                            <p className="text-gray-500 text-md">To</p>
                                            <Field
                                                type="datetime-local"
                                                name="toDate"
                                                className="border border-gray-300 p-2 rounded text-sm w-full dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:border-[#fecb02]">
                                            </Field>
                                            <ErrorMessage name="toDate">
                                                {(msg) => <div className="mt-1 text-red-500 text-xs">{msg}</div>}
                                            </ErrorMessage>
                                        </div>
                                    </div>
                                    {/* Submit */}
                                    <button className="w-full bg-[#fecb02] text-white py-2 rounded hover:opacity-90">
                                        Submit
                                    </button>
                                </Form>
                            </motion.div>
                        </motion.div>

                    )}
                </AnimatePresence>
            </Formik >
        </>

    );
};

export default EditCoupon;