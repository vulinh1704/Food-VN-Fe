import { ErrorMessage, Field, Form, Formik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { FaRegMap } from "react-icons/fa6";
import * as Yup from 'yup';
import { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import axios from "axios";
import { PROFILE_MENU, useProfileMenu } from "../../../providers/users/ProfileMenuProvider";
import { useUser } from "../../../providers/users/UserProvider";
import { addAddress, deleteAddress, getAllAddress, getOneAddress } from "../../../services/auth-service/auth-service";

const AddressSchema = Yup.object().shape({
    fullName: Yup.string()
        .min(2, 'Too Short!')
        .max(100, 'Too Long!')
        .required('Fullname is required!'),
    phone: Yup.string().required('Phone is required!'),
    addressDetail: Yup.string().required('Address detail is required!'),
});
const Popup = ({ isOpen, setIsOpen, addressUpdate, setAddressUpdate }) => {
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [activeTab, setActiveTab] = useState('city');
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);
    const { setOption } = useProfileMenu();
    const { user } = useUser();

    useEffect(() => {
        axios.get('https://provinces.open-api.vn/api/?depth=1').then((res) => {
            setCities(res.data);
        });
        setOption(PROFILE_MENU.ADDRESS);
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

    const handleSubmit = async (values) => {
        const data = {
            fullName: values.fullName,
            phone: values.phone,
            address: values.address,
            addressDetail: values.addressDetail,
            default: values.default,
            user: {
                id: user.id
            }
        }
        if (addressUpdate) data.id = addressUpdate.id;
        await addAddress(data);
        setIsOpen(false);
    }

    return (
        <>
            {
                isOpen && <Formik
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
                        console.log(values);
                        handleSubmit(values);
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
                                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 overflow-y-auto"
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
                                            onClick={() => setIsOpen(false)}
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
                </Formik>
            }
        </>
    )
}

const Address = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [list, setList] = useState([]);
    const [addressUpdate, setAddressUpdate] = useState(null);

    const getAll = async () => {
        let data = await getAllAddress();
        data = [...data].sort((a, b) => (b.default ? 1 : 0) - (a.default ? 1 : 0));
        setList(data);
    }

    const getAddressUpdate = async (id) => {
        let data = await getOneAddress(id);
        const [ward, district, city] = data.address.split(',').map((s) => s.trim());
        data = { ...data, ward, district, city };
        setAddressUpdate(data);
        setIsOpen(true);
    }

    const remove = async (id) => {
        await deleteAddress(id);
        await getAll();
    }

    useEffect(() => {
        getAll();
    }, [isOpen]);
    return (
        <>
            <Popup isOpen={isOpen} setIsOpen={setIsOpen} addressUpdate={addressUpdate} setAddressUpdate={setAddressUpdate} />
            <main className="flex-1 p-10 bg-white">
                <div className="bg-white">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold mb-6">My Address</h2>
                        <button class="border-[#fecb02] border text-[#fecb02] px-4 py-2 rounded-lg flex items-center gap-2 focus:bg-[#fecb02] focus:text-white" onClick={() => { setIsOpen(true) }}>
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            Add Address
                        </button>
                    </div>
                    {
                        list.length == 0 && <div className="flex flex-col items-center justify-center h-[300px] text-gray-500">
                            <FaRegMap className="text-900" />
                            <p className="text-sm">Bạn chưa có địa chỉ.</p>
                        </div>
                    }
                    {
                        list.length != 0 && <div>
                            {
                                list.map(item => <>
                                    <div className="bg-white border rounded-md p-5 flex justify-between items-start mb-5">
                                        <div>
                                            <div className="mb-1">
                                                <span className="font-semibold">{item.fullName}</span>
                                                <span className="mx-2">|</span>
                                                <span>{item.phone}</span>
                                            </div>
                                            <div className="text-sm text-gray-600">{item.addressDetail}</div>
                                            <div className="text-sm text-gray-700">{item.address}</div>

                                            {
                                                item.default && <span className="inline-block mt-2 px-2 py-1 text-xs text-[#fecb02] border border-[#fecb02] rounded">
                                                    Default
                                                </span>
                                            }
                                        </div>

                                        <div className="text-right space-y-2">
                                            <div className="text-sm text-blue-600 space-x-3 cursor-pointer">
                                                <button className="hover:underline" onClick={() => {
                                                    getAddressUpdate(item.id);
                                                }}>Update</button>
                                                <button className="hover:underline" onClick={() => {
                                                    remove(item.id);
                                                }}>Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                </>)
                            }

                        </div>
                    }
                </div>
            </main>
        </>

    );
};

export default Address;
