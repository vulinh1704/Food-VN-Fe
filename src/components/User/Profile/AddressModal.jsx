import ReactDOM from "react-dom";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { IoCloseOutline } from "react-icons/io5";
import axios from "axios";
import { useEffect, useState } from "react";
import * as Yup from 'yup';

const AddressSchema = Yup.object().shape({
    fullName: Yup.string()
        .min(2, 'Too Short!')
        .max(100, 'Too Long!')
        .required('Fullname is required!'),
    phone: Yup.string().required('Phone is required!'),
    addressDetail: Yup.string().required('Address detail is required!'),
});

export const AddressModal = ({ isOpen, onClose, addressUpdate, onSubmit }) => {
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [activeTab, setActiveTab] = useState('city');
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);

    useEffect(() => {
        axios.get('https://provinces.open-api.vn/api/?depth=1').then((res) => {
            setCities(res.data);
        });
    }, [addressUpdate]);

    const handleCitySelect = (city) => {
        setSelectedCity(city);
        setSelectedDistrict(null);
        setWards([]);
        axios.get(`https://provinces.open-api.vn/api/p/${city.code}?depth=2`).then((res) => {
            setDistricts(res.data.districts);
            setActiveTab('district');
        });
    };

    const handleDistrictSelect = (district) => {
        setSelectedDistrict(district);
        axios.get(`https://provinces.open-api.vn/api/d/${district.code}?depth=2`).then((res) => {
            setWards(res.data.wards);
            setActiveTab('ward');
        });
    };

    const handleWardSelect = (ward) => {
        setSelectedWard(ward);
    };

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <Formik
            initialValues={addressUpdate ? addressUpdate : {
                fullName: '',
                phone: '',
                city: '',
                district: '',
                address: '',
                ward: '',
                addressDetail: '',
                default: false
            }}
            enableReinitialize
            validationSchema={AddressSchema}
            onSubmit={(values, { resetForm, setSubmitting }) => {
                onSubmit(values);
                resetForm();
                setActiveTab('city');
            }}>
            {({ setFieldValue }) => (
                <Form>
                    <AnimatePresence>
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
                                className="bg-white p-8 rounded-xl shadow-xl w-full max-w-2xl relative max-h-full overflow-y-auto"
                            >
                                <IoCloseOutline
                                    className="absolute top-4 right-4 text-2xl cursor-pointer text-gray-600 hover:text-red-500"
                                    onClick={onClose}
                                />
                                <h2 className="text-2xl font-semibold text-[#fecb02] mb-6">{addressUpdate ? 'Update Address' : 'New Address'}</h2>

                                <div className="grid md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <Field
                                            name="fullName"
                                            placeholder="Fullname"
                                            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:border-[#fecb02]"
                                        />
                                        <ErrorMessage name="fullName" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>
                                    <div>
                                        <Field
                                            name="phone"
                                            placeholder="Phone number"
                                            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:border-[#fecb02]"
                                        />
                                        <ErrorMessage name="phone" component="div" className="text-red-500 text-xs mt-1" />
                                    </div>
                                </div>

                                <Field name="address">
                                    {({ field, form }) => {
                                        const composedAddress = `${form.values.ward || ''}${form.values.ward ? ', ' : ''}${form.values.district || ''}${form.values.district ? ', ' : ''}${form.values.city || ''}`;
                                        if (form.values.address !== composedAddress) {
                                            form.setFieldValue("address", composedAddress);
                                        }
                                        return (
                                            <div>
                                                <input
                                                    {...field}
                                                    readOnly
                                                    placeholder="Tỉnh/ Thành phố, Quận/Huyện, Phường/Xã"
                                                    className="w-full border px-3 py-2 rounded mb-2 bg-gray-50 focus:outline-none focus:border-[#fecb02]"
                                                    value={composedAddress}
                                                />
                                            </div>
                                        );
                                    }}
                                </Field>

                                <div className="border rounded mb-4">
                                    <div className="flex border-b">
                                        <div
                                            className={`flex-1 p-2 text-center ${activeTab === 'city' ? 'text-red-500 border-b-2 border-red-500' : ''}`}
                                            onClick={() => setActiveTab('city')}
                                        >
                                            Tỉnh/Thành phố
                                        </div>
                                        <div
                                            className={`flex-1 p-2 text-center ${activeTab === 'district' ? 'text-red-500 border-b-2 border-red-500 ' : ''}`}
                                            onClick={() => selectedCity && setActiveTab('district')}
                                        >
                                            Quận/Huyện
                                        </div>
                                        <div
                                            className={`flex-1 p-2  text-center ${activeTab === 'ward' ? 'text-red-500 border-b-2 border-red-500' : ''}`}
                                            onClick={() => selectedDistrict && setActiveTab('ward')}
                                        >
                                            Phường/Xã
                                        </div>
                                    </div>

                                    <div className="max-h-48 overflow-y-auto p-2">
                                        {activeTab === 'city' && cities.map((city) => (
                                            <div
                                                key={city.code}
                                                className={`cursor-pointer p-1 rounded ${selectedCity?.code === city.code ? 'bg-red-100 font-semibold' : 'hover:bg-gray-100'}`}
                                                onClick={() => {
                                                    handleCitySelect(city);
                                                    setFieldValue('city', city.name);
                                                    setFieldValue('district', '');
                                                    setFieldValue('ward', '');
                                                }}
                                            >
                                                {city.name}
                                            </div>
                                        ))}
                                        {activeTab === 'district' && districts.map((d) => (
                                            <div
                                                key={d.code}
                                                className={`cursor-pointer p-1 rounded ${selectedDistrict?.code === d.code ? 'bg-red-100 font-semibold' : 'hover:bg-gray-100'}`}
                                                onClick={() => {
                                                    handleDistrictSelect(d);
                                                    setFieldValue('district', d.name);
                                                    setFieldValue('ward', '');
                                                }}
                                            >
                                                {d.name}
                                            </div>
                                        ))}
                                        {activeTab === 'ward' && wards.map((w) => (
                                            <div
                                                key={w.code}
                                                className={`cursor-pointer p-1 rounded ${selectedWard?.code === w.code ? 'bg-red-100 font-semibold' : 'hover:bg-gray-100'}`}
                                                onClick={() => {
                                                    handleWardSelect(w);
                                                    setFieldValue('ward', w.name);
                                                }}
                                            >
                                                {w.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <Field name="city" type="hidden" />
                                <Field name="district" type="hidden" />
                                <Field name="ward" type="hidden" />

                                <ErrorMessage name="city" component="div" className="text-red-500 text-xs mb-1" />
                                <ErrorMessage name="district" component="div" className="text-red-500 text-xs mb-1" />
                                <ErrorMessage name="ward" component="div" className="text-red-500 text-xs mb-1" />

                                <Field name="addressDetail"
                                    placeholder="Address Detail"
                                    className="w-full border px-3 py-2 rounded mb-2 focus:outline-none focus:border-[#fecb02]"
                                />
                                <ErrorMessage name="addressDetail" component="div" className="text-red-500 text-xs mb-1" />

                                <Field
                                    type="checkbox"
                                    name="default"
                                    id="default"
                                    className="mr-2 relative w-4 h-4 !appearance-none checked:bg-[#fecb02] bg-white border border-gray-300 shadow-sm rounded !outline-none cursor-pointer transition-all duration-300 focus-visible:!outline-offset-2
                                after:w-[40%] after:h-[65%] after:absolute after:opacity-0 after:top-[45%] after:left-[50%] after:-translate-x-2/4 after:-translate-y-2/4 after:rotate-[45deg]
                                after:border-r-[2px] after:border-b-[2px] after:border-white
                                after:transition-all after:duration-200 after:ease-linear
                                checked:after:opacity-100"
                                />
                                <label
                                    htmlFor=""
                                    className="text-sm text-gray-700 mb-3"
                                >
                                    Set as default address
                                </label>

                                <div className="flex justify-between mt-6">
                                    <button
                                        type="submit"
                                        className="bg-[#fecb02] text-white py-2 px-6 rounded hover:opacity-90"
                                    >
                                        Done
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                </Form>
            )}
        </Formik>,
        document.body
    );
}; 