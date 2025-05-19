import React, { useEffect, useState } from 'react';
import StepsBar from './StepsBar';
import { CiTrash } from "react-icons/ci";
import { useNavbar } from '../../../providers/users/NavBarProvider';
import { ACTIVE_VALUE_NAVBAR } from '../../../lib/app-const';
import { useOrder } from '../../../providers/users/OrderProvider';
import { getAllByOrderId } from '../../../services/order-service/order-service';
import { formatNumberWithDots } from '../../../lib/format-hepper';

const Order = () => {
    const [list, setList] = useState([]);
    const { card } = useOrder();
    const [total, setTotal] = useState(0);

    // const deleteOrderDetail = async (od) => {
    //     await removeOrderDetailByOrderIdAndProductId(od.orderId, od.productId);
    //     await getAll();
    // }

    // const saveOrderDetail = async (od) => {
    //     let data = {
    //         orders: {
    //             id: od.orderId
    //         },
    //         product: {
    //             id: od.productId
    //         },
    //         price: od.price,
    //         quantity: 1
    //     }
    //     await addOrderDetail(data);
    //     await getAll();
    // }

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
    }

    const applyCoupons = (price, coupons) => {
        let finalPrice = price;

        coupons?.forEach(coupon => {
            if (coupon.type === 'percent') {
                finalPrice = finalPrice - (price * coupon.discount / 100);
            } else if (coupon.type === 'fixed') {
                finalPrice = finalPrice - coupon.discount;
            }
        });
        console.log(finalPrice);
        return Math.max(0, finalPrice);
    };

    useEffect(() => {
        if (card) getAll();
    }, [])

    const { setActive } = useNavbar();
    useEffect(() => {
        setActive(ACTIVE_VALUE_NAVBAR.ORDER);
    }, []);

    return (
        <div className='container'>
            <StepsBar />
            <div className="max-w mx-auto px-4 py-8 bg-white mt-4 mb-7">
                {/* Tiêu đề */}
                <h2 className="text-xl font-semibold mb-6">🛒 GIỎ HÀNG</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Bảng sản phẩm */}
                    <div className="md:col-span-2">
                        <div className="grid grid-cols-6 font-semibold text-gray-600 border-b pb-2 mb-4">
                            <span className="col-span-3">Food</span>
                            <span className="text-center">Price</span>
                            <span className="text-center">Quantity</span>
                            <span className="text-right">Estimated total</span>
                        </div>

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

                        {/* Xóa giỏ hàng */}
                        <div className="text-sm mt-4 text-gray-500 underline cursor-pointer hover:text-red-500 flex gap-1"><CiTrash className="text-xl" /> XÓA GIỎ HÀNG</div>
                    </div>

                    {/* Cart Totals */}
                    <div className="border p-6 rounded shadow-sm">
                        <h3 className="text-lg font-semibold mb-4">CART TOTALS</h3>
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

                        <button className="w-full mt-6 bg-[#fecb02] text-white py-2 rounded font-semibold">
                            THANH TOÁN
                        </button>

                        <div className="text-center mt-4 text-sm underline cursor-pointer text-gray-600 hover:text-[#fecb02] transition">
                            TIẾP TỤC MUA SẮM
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Order;
