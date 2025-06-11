import { FaRegMap } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { PROFILE_MENU, useProfileMenu } from "../../../providers/users/ProfileMenuProvider";
import { useUser } from "../../../providers/users/UserProvider";
import { addAddress, deleteAddress, getAllAddress, getOneAddress } from "../../../services/auth-service/auth-service";
import { AddressModal } from "./AddressModal";

const Address = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [list, setList] = useState([]);
    const [addressUpdate, setAddressUpdate] = useState(null);
    const { setOption } = useProfileMenu();
    const { user } = useUser();

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
        setAddressUpdate(null);
        await getAll();
    }

    useEffect(() => {
        getAll();
    }, []);

    useEffect(() => {
        setOption(PROFILE_MENU.ADDRESS);
    }, []);

    return (
        <>
            <AddressModal 
                isOpen={isOpen}
                onClose={() => {
                    setIsOpen(false);
                    setAddressUpdate(null);
                }}
                addressUpdate={addressUpdate}
                onSubmit={handleSubmit}
            />
            <main className="flex-1 p-10 bg-white">
                <div className="bg-white">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold mb-6">My Address</h2>
                        <button className="border-[#fecb02] border text-[#fecb02] px-4 py-2 rounded-lg flex items-center gap-2 focus:bg-[#fecb02] focus:text-white" onClick={() => { setIsOpen(true) }}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"
                                viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
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
