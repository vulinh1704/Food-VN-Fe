import React, { useEffect, useState } from 'react';
import StepsBar from './StepsBar';
import { CiTrash } from "react-icons/ci";
import { useNavbar } from '../../../providers/users/NavBarProvider';
import { ACTIVE_VALUE_NAVBAR } from '../../../lib/app-const';
import { useOrder } from '../../../providers/users/OrderProvider';
import { getAllByOrderId, getCard, getListOrders, submitOrder } from '../../../services/order-service/order-service';
import { formatNumberWithDots, parseToVietnamTime } from '../../../lib/format-hepper';
import { getAllAddress } from '../../../services/auth-service/auth-service';
import { FaCheck, FaChevronDown, FaRegMap } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { IoIosCart } from "react-icons/io";
import { GoListOrdered } from "react-icons/go";
import { IoMdArrowForward } from "react-icons/io";
import { TbBasketCancel } from "react-icons/tb";

const CustomSelect = ({ options, selectedAddress, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selected = options.find(opt => opt.id === selectedAddress?.id) || options.find(opt => opt.default);
    useEffect(() => {
        onChange(selected);
    });

    return (
        <div className="relative w-full text-sm">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-2 border rounded flex justify-between items-center"
            >
                <div className="text-left">
                    <p className="font-medium">{selected?.fullName}</p>
                    <p className="text-gray-500">{selected?.phone}</p>
                    <p className="text-gray-500">{selected ? selected?.addressDetail + "," + selected?.address : ""}</p>
                </div>
                <FaChevronDown className="text-gray-400 ml-2" />
            </button>

            {isOpen && (
                <ul className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
                    {options.map(opt => (
                        <li
                            key={opt.id}
                            onClick={() => {
                                onChange(opt);
                                setIsOpen(false);
                            }}
                            className={`p-2 cursor-pointer hover:bg-gray-100 ${selectedAddress?.id === opt.id ? 'bg-yellow-50' : ''}`}
                        >
                            <div className="flex justify-between">
                                <div>
                                    <p className="font-medium">{opt.fullName}</p>
                                    <p className="text-gray-500">{opt.phone}</p>
                                    <p className="text-gray-500">{opt.addressDetail}, {opt.address}</p>
                                    {opt.default && <span className="text-yellow-600 text-xs">(Default)</span>}
                                </div>
                                {selectedAddress?.id === opt.id && <FaCheck className="text-yellow-500 mt-1 ml-2" />}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const Order = () => {
    const [list, setList] = useState([]);
    const { card, setCard } = useOrder();
    const [total, setTotal] = useState(0);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState({});
    const { setActive } = useNavbar();
    const navigate = useNavigate();
    const [isDisablePay, setIsDisablePay] = useState(true);
    const [currentStep, setCurrentStep] = useState(1);
    const [orders, setOrders] = useState([]);

    const getAll = async () => {
        let data = await getAllByOrderId(card.id);
        const cartMap = new Map();
        data.forEach(item => {
            const product = item.product;
            const productId = product.id;
            const firstImage = JSON.parse(product.images)[0];

            if (cartMap.has(productId)) {
                const existing = cartMap.get(productId);
                existing.quantity += item.quantity;
                existing.total = applyCoupons(item.quantity * product.price, product.coupons);
            } else {
                cartMap.set(productId, {
                    productId: product.id,
                    orderId: item.orders.id,
                    name: product.name,
                    price: product.price,
                    quantity: item.quantity,
                    coupons: product.coupons,
                    total: applyCoupons(item.quantity * product.price, product.coupons),
                    image: firstImage
                });
            }
        });
        const cartItems = Array.from(cartMap.values());
        setList(cartItems);
        const totalAmount = cartItems.reduce((sum, item) => sum + item.total, 0);
        setTotal(totalAmount);
        if (cartItems.length > 0) setIsDisablePay(false);
    }

    const getListOds = async () => {
        let data = await getListOrders();
        console.log(data);
        setOrders(data);
    }

    const getUserCard = async () => {
        let data = await getCard();
        setCard(data);
    }

    const applyCoupons = (price, coupons) => {
        let now = new Date();
        let validCoupons = (coupons || []).filter(coupon => {
            const from = coupon.fromDate ? new Date(coupon.fromDate) : null;
            const to = coupon.toDate ? new Date(coupon.toDate) : null;
            return (!from || now >= from) && (!to || now <= to);
        });

        validCoupons.sort((a, b) => new Date(a.fromDate) - new Date(b.fromDate));

        let finalPrice = price;
        validCoupons.forEach(coupon => {
            if (coupon.type === 'percent') {
                finalPrice -= (finalPrice * coupon.discount / 100);
            } else if (coupon.type === 'fixed') {
                finalPrice -= coupon.discount;
            }
            finalPrice = Math.max(finalPrice, 0);
        });

        return finalPrice;
    };

    const getAllAd = async () => {
        let list = await getAllAddress();
        setAddresses(list);
    }

    const buy = async () => {
        setIsDisablePay(true);
        let data = await getAllByOrderId(card.id);
        data = data.map(item => {
            console.log(item)
            item.coupons = JSON.stringify(item.product.coupons);
            return item;
        })
        const orders = {
            id: card.id,
            userId: card.user.id,
            address: JSON.stringify(selectedAddress),
            orderDetails: data
        }
        await submitOrder(orders);
        await getUserCard();
    }

    useEffect(() => {
        if (card) {
            getAll();
            getAllAd();
        }
    }, [card]);

    useEffect(() => {
        setActive(ACTIVE_VALUE_NAVBAR.ORDER);
    }, []);

    return (
        <div className='container'>
            <StepsBar currentStep={currentStep} setCurrentStep={setCurrentStep} getListOds={getListOds} />
            {
                currentStep == 1 ?
                    <div className="max-w mx-auto px-4 py-8 bg-white mt-4 mb-7">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">🛒 CART</h2>
                            {
                                orders.length != 0 && <h2 className="text-md font-semibold flex items-center gap-1 text-[#68adf2]" onClick={() => { setCurrentStep(2) }}>
                                    <IoMdArrowForward />
                                    See your orders ({orders.length})
                                </h2>
                            }

                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-2">
                                <div className="grid grid-cols-6 font-semibold text-gray-600 border-b pb-2 mb-4">
                                    <span className="col-span-3">Food</span>
                                    <span className="text-center">Price</span>
                                    <span className="text-center">Quantity</span>
                                    <span className="text-right">Estimated total</span>
                                </div>
                                {
                                    list.length == 0 && <div className="flex flex-col items-center justify-center h-[300px] text-gray-300">
                                        <IoIosCart size={"40"} color='#d9dde0' />
                                        <p className="text-xl">  Cart is empty</p>
                                    </div>
                                }
                                {list.map((item, index) => (
                                    <div key={index} className="grid grid-cols-6 items-center py-4 border-b text-sm">
                                        <div className="col-span-3 flex items-center gap-3">
                                            <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                                            <div>
                                                <div className="font-medium">{item.name}</div>
                                                <div className="text-xs text-gray-500">Coupons: {item?.coupons.map((e, i) => (<><span className=''>{e.name} - {formatNumberWithDots(e.discount)}{e.type == "percent" ? "%" : "VNĐ"}</span>{i < item?.coupons?.length - 1 ? ", " : ""}</>))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-center text-gray-700">{item.price.toLocaleString()} đ</div>
                                        <div className="text-center">{item.quantity}</div>
                                        <div className="text-right font-semibold">{item.total.toLocaleString()} đ</div>
                                    </div>
                                ))}
                                {
                                    list.length != 0 && <div className="text-sm mt-4 text-gray-500 underline cursor-pointer hover:text-red-500 flex gap-1"><CiTrash className="text-xl" /> CLEAR CART</div>
                                }
                            </div>

                            {/* Cart Totals */}
                            <div className="border p-6 rounded shadow-sm">
                                <h3 className="text-lg font-semibold mb-4">CART TOTALS</h3>

                                {/* Address Selection */}
                                <div className="mb-4">
                                    <CustomSelect
                                        options={addresses.sort((a, b) => (b.default ? 1 : 0) - (a.default ? 1 : 0))}
                                        selectedAddress={selectedAddress}
                                        onChange={setSelectedAddress}
                                    />
                                </div>

                                {/* Totals */}
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Subtotal</span>
                                    <span>{total.toLocaleString()} đ</span>
                                </div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span>COD Fee</span>
                                    <span>{0} đ</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg border-t pt-4 mt-4">
                                    <span>TOTAL</span>
                                    <span>{total.toLocaleString()} đ</span>
                                </div>
                                {
                                    isDisablePay ? <button className="w-full mt-6 bg-[#fcde74] text-white py-2 rounded font-semibold">
                                        PAY NOW
                                    </button> :
                                        <button className="w-full mt-6 bg-[#fecb02] text-white py-2 rounded font-semibold" onClick={() => { buy() }}>
                                            PAY NOW
                                        </button>
                                }

                                <div className="text-center mt-4 text-sm underline cursor-pointer text-gray-600 hover:text-[#fecb02] transition" onClick={() => { navigate("/foods") }}>
                                    CONTINUE SHOPPING
                                </div>
                            </div>

                        </div>
                    </div>
                    :
                    <div className="max-w mx-auto px-4 py-8 bg-white mt-4 mb-7">
                        {
                            orders.length == 0 &&
                            <div className="flex flex-col items-center justify-center h-[300px] text-gray-300">
                                <GoListOrdered size={"40"} color='#d9dde0' />
                                <p className="text-xl">Orders is empty</p>
                            </div>
                        }

                        {orders.map((item) => {
                            const address = JSON.parse(item.address);
                            const orderDetails = item.orderDetails || [];

                            return (
                                <div key={item.id} className="bg-white border rounded-md p-5 mb-5 shadow-sm">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="font-semibold text-base mb-1">
                                                {address.fullName} <span className="mx-2">|</span> {address.phone}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {address.addressDetail}, {address.address}
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-5 py-1 rounded-full shadow-sm">
                                                {item.status === 2 ? "WAITING" : "Unknown status"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="border-t pt-4 space-y-3">
                                        <div>
                                            <div className="font-semibold flex justify-between items-center">
                                                <div className="font-semibold">
                                                    List Foods
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {parseToVietnamTime(item.date)}
                                                </div>
                                            </div>
                                        </div>
                                        {orderDetails.map((detail) => (
                                            <div key={detail.id} className="flex justify-between items-center">
                                                <div className='flex gap-4'>
                                                    <div><img src={JSON.parse(detail.product.images)[0]} alt="" className='w-[50px] h-[50px] object-cover rounded' /></div>
                                                    <div>
                                                        <div className="font-medium">{detail.product.name}</div>
                                                        <div className="text-sm text-gray-500">
                                                            Quantity: {detail.quantity}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right text-sm font-semibold text-gray-700">
                                                    {(detail.price * detail.quantity).toLocaleString()}₫
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Tổng tiền */}
                                    <div className="border-t pt-4 mt-4 flex justify-between text-sm font-semibold text-gray-800">
                                        <span>Total:</span>
                                        <span>{item.total.toLocaleString()}₫</span>
                                    </div>

                                    <div className="mt-4 text-right">
                                       <div className="text-sm mt-4 text-red-500 underline cursor-pointer hover:text-red-600 flex gap-1"><TbBasketCancel className="text-xl" /> Cancel order</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
            }

        </div>
    );
};

export default Order;
