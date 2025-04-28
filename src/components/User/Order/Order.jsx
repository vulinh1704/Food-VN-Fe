import React, { useEffect } from 'react';
import StepsBar from './StepsBar';
import { CiTrash } from "react-icons/ci";
import { useNavbar } from '../../../providers/users/NavBarProvider';
import { ACTIVE_VALUE_NAVBAR } from '../../../lib/app-const';

const Order = () => {
    const cartItems = [
        {
            name: 'Bàn xoay mặt kính 30cm',
            price: 250000,
            sku: 'B2218',
            quantity: 2,
            total: 500000,
            image: 'https://via.placeholder.com/60x60?text=SP1',
        },
        {
            name: 'Bột matcha Việt Nam 100g',
            price: 65000,
            sku: 'B4962',
            quantity: 1,
            total: 65000,
            image: 'https://via.placeholder.com/60x60?text=SP2',
        },
        {
            name: 'Bánh cracker vị rau AFC Dinh Dưỡng hộp 172g',
            price: 29000,
            sku: 'B6429',
            quantity: 1,
            total: 29000,
            image: 'https://via.placeholder.com/60x60?text=SP3',
        },
    ];

    const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
    const codFee = 20000;
    const total = subtotal + codFee;
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
                            <span className="col-span-3">SẢN PHẨM</span>
                            <span className="text-center">GIÁ</span>
                            <span className="text-center">SỐ LƯỢNG</span>
                            <span className="text-right">TẠM TÍNH</span>
                        </div>

                        {cartItems.map((item, index) => (
                            <div key={index} className="grid grid-cols-6 items-center py-4 border-b text-sm">
                                <div className="col-span-3 flex items-center gap-3">
                                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                                    <div>
                                        <div className="font-medium">{item.name}</div>
                                        <div className="text-xs text-gray-500">SKU: {item.sku}</div>
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
                            <span>{subtotal.toLocaleString()} đ</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                            <span>Phí COD</span>
                            <span>{codFee.toLocaleString()} đ</span>
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
