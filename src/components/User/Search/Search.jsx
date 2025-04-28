import React, { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import StarRating from "../../Supporter/StarRating";
import { TbFilterEdit } from "react-icons/tb";
import { FaExclamationCircle } from "react-icons/fa";
import { ACTIVE_VALUE_NAVBAR } from "../../../lib/app-const";
import { useNavbar } from "../../../providers/users/NavBarProvider";
import { Link } from "react-router-dom";

const products = [
    {
        id: 1,
        image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lwpyhqjv0no9f6.webp",
        title: "Đầm dự tiệc siêu xinh",
        price: "1.000",
        discount: 20,
        rating: 5.0,
        inStock: true,
        location: "TP. Hồ Chí Minh",
    },
    {
        id: 2,
        image: "https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m7vn8cikv41f1c.webp",
        title: "Đầm trắng công chúa",
        price: "288.000",
        discount: 2,
        rating: 4.8,
        inStock: true,
        location: "TP. Hồ Chí Minh",
    },
    {
        id: 3,
        image: "https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m7ofd1zr4m9ye8.webp",
        title: "Váy voan nhẹ nhàng",
        price: "204.000",
        discount: 1,
        rating: 5.0,
        inStock: true,
        location: "Hà Nội",
    },
    {
        id: 4,
        image: "https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m7bw1cq8od4m59@resize_w450_nl.webp",
        title: "Set váy nữ xinh xắn",
        price: "159.000",
        discount: 50,
        rating: 4.9,
        inStock: true,
        location: "TP. Hồ Chí Minh",
    },
    {
        id: 5,
        image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lmg9rt07jq3j4e@resize_w450_nl.webp",
        title: "Đầm body gợi cảm",
        price: "99.000",
        rating: 4.7,
        inStock: true,
        location: "Hà Nội",
    },
    {
        id: 6,
        image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lmg9rt07jq3j4e@resize_w450_nl.webp",
        title: "Đầm body gợi cảm",
        price: "99.000",
        discount: 34,
        rating: 4.7,
        location: "Hà Nội",
    },
];

const categories = [
    "Đầm/Váy",
    "Đồ Lễ",
    "Chân Váy",
    "Áo thun",
    "Áo hai dây và ba lỗ",
    "Đồ Bầu",
];


const ProductCard = ({ product }) => {
    return (
        <Link
         to={"/detail/1"}>
            <div className="bg-white border rounded-md p-3 shadow-sm hover:border-[#fecb02] transition relative hover:scale-105 duration-300">
                <img src={product.image} alt={product.title} className="w-full rounded-md mt-4" />
                {product.discount && (
                    <div className="absolute top-2 rounded-md right-2 bg-opacity-80 bg-red-500 text-white px-1 py-1 text-[11px] font-bold-500 shadow-md z-10">
                        -{product.discount}%
                    </div>
                )}

                {!product.inStock && (
                    <div className="absolute top-[100px] left-14 bg-white bg-opacity-70 text-black text-2xs px-2 py-2 text-sm font-bold-300 shadow-md z-10 flex items-center gap-1">
                        <FaExclamationCircle className="text-red-500" /> HẾT HÀNG
                    </div>
                )}
                <h3 className="mt-4 text-md font-semibold">{product.title}</h3>
                <p className="text-red-500 font-bold mt-3">{product.price}</p>
                <div className="flex items-center text-yellow-500 text-sm mt-3">
                    <StarRating rating={product.rating} />
                </div>
                <button
                    className={`w-full border duration-300 text-sm font-sans py-2 px-4 rounded-md mt-3 tracking-wide ${product.inStock ? 'text-[#fecb02] border-[#fecb02] hover:scale-105 hover:text-white hover:bg-[#fecb02]' : 'text-gray-400'}`}
                    disabled={!product.inStock}
                >
                    {product.inStock ? "ADD TO CART" : "OUT OF STOCK"}
                </button>
            </div>
        </Link>
    );
};

const FilterContent = () => (
    <>
        <div className="pb-4 border-b-2 border-gray-200">
            <h4 className="font-medium mb-2">Theo Danh Mục</h4>
            <div className="space-y-3">
                {categories.map((item, idx) => (
                    <label key={idx} className="flex items-center">
                        <input
                            type="checkbox"
                            className="mr-2 relative w-4 h-4 !appearance-none checked:bg-[#fecb02] bg-white border border-gray-300 shadow-sm rounded !outline-none cursor-pointer transition-all duration-300 focus-visible:!outline-offset-2
                            after:w-[40%] after:h-[65%] after:absolute after:opacity-0 after:top-[45%] after:left-[50%] after:-translate-x-2/4 after:-translate-y-2/4 after:rotate-[45deg]
                            after:border-r-[2px] after:border-b-[2px] after:border-white
                            after:transition-all after:duration-200 after:ease-linear
                            checked:after:opacity-100"
                        />
                        {item}
                    </label>
                ))}
            </div>
        </div>

        <div className="py-4 border-b-2 border-gray-200">
            <h4 className="font-medium mb-2">Nơi Bán</h4>
            <div className="text-sm space-y-3">
                <label className="flex items-center">
                    <input type="checkbox" className="mr-2 relative w-4 h-4 !appearance-none checked:bg-[#fecb02] bg-white border border-gray-300 shadow-sm rounded !outline-none cursor-pointer transition-all duration-300 focus-visible:!outline-offset-2
                            after:w-[40%] after:h-[65%] after:absolute after:opacity-0 after:top-[45%] after:left-[50%] after:-translate-x-2/4 after:-translate-y-2/4 after:rotate-[45deg]
                            after:border-r-[2px] after:border-b-[2px] after:border-white
                            after:transition-all after:duration-200 after:ease-linear
                            checked:after:opacity-100" />
                    Hà Nội
                </label>
                <label className="flex items-center">
                    <input type="checkbox" className="mr-2 relative w-4 h-4 !appearance-none checked:bg-[#fecb02] bg-white border border-gray-300 shadow-sm rounded !outline-none cursor-pointer transition-all duration-300 focus-visible:!outline-offset-2
                            after:w-[40%] after:h-[65%] after:absolute after:opacity-0 after:top-[45%] after:left-[50%] after:-translate-x-2/4 after:-translate-y-2/4 after:rotate-[45deg]
                            after:border-r-[2px] after:border-b-[2px] after:border-white
                            after:transition-all after:duration-200 after:ease-linear
                            checked:after:opacity-100" />
                    TP. Hồ Chí Minh
                </label>
            </div>
        </div>

        <div className="py-4 border-b-2 border-gray-200">
            <h4 className="font-medium mb-2">Đánh Giá</h4>
            <div className="text-sm space-y-3">
                {[5, 4, 3, 2, 1].map(star => (
                    <label className="flex items-center" key={star}>
                        <StarRating rating={star} />
                        {star !== 5 && <span className="pl-1">trở lên</span>}
                    </label>
                ))}
            </div>
        </div>

        <div className="py-4 border-b-2 border-gray-200">
            <h4 className="font-medium mb-2">Khoảng Giá</h4>
            <div className="flex items-center gap-2 mb-3">
                <input type="number" placeholder="₫ FROM" className="border px-2 py-1 rounded w-full outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                <span>-</span>
                <input type="number" placeholder="₫ TO" className="border px-2 py-1 rounded w-full outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
            </div>
        </div>
    </>
);

const Search = () => {
    const [page, setPage] = useState(1);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const { setActive } = useNavbar();
    useEffect(() => {
        setActive(ACTIVE_VALUE_NAVBAR.FOOD);
    }, []);

    return (
        <div className="mx-auto px-4 py-8 container">
            <div className="flex justify-between items-center mb-5">
                <div className="lg:hidden">
                    <button onClick={() => setShowFilterModal(true)}
                        className="flex items-center gap-1 px-4 py-1 bg-[#fecb02] text-white text-md rounded">
                        <TbFilterEdit />
                        Filter
                    </button>
                </div>
                <h2 className="text-xl font-bold lg:flex items-center gap-2 hidden">
                    <TbFilterEdit />
                    Search Result
                </h2>
                <div className="flex space-x-3 text-sm">
                    <button className="px-4 py-1 text-md bg-[#fecb02] text-white rounded shadow">Liên Quan</button>
                    <button className="px-4 py-1 text-md bg-white rounded shadow">Mới Nhất</button>
                    <button className="px-4 py-1 text-md bg-white rounded shadow">Bán Chạy</button>
                    <button className="px-4 py-1 text-md bg-white rounded shadow">Giá</button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-3">
                <aside className="hidden lg:block col-span-2 p-4 bg-white border rounded shadow-sm">
                    <FilterContent />
                    <div className="py-4">
                        <button className="bg-[#fecb02] text-white font-semibold py-1.5 w-full rounded">
                            ÁP DỤNG
                        </button>
                    </div>
                </aside>

                <div className="col-span-12 lg:col-span-10 grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-5">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>

            <div className="flex justify-center mt-6">
                <button
                    className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                >
                    <FiChevronLeft />
                </button>
                <span className="px-4 text-sm font-medium pt-2">{page} / 10</span>
                <button
                    className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
                    onClick={() => setPage(page + 1)}
                    disabled={page === 10}
                >
                    <FiChevronRight />
                </button>
            </div>

            {showFilterModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center px-4 overflow-hidden">
                    <div className="bg-white w-full max-w-md p-6 rounded shadow-lg relative max-h-[90vh] overflow-hidden">
                        <button
                            onClick={() => setShowFilterModal(false)}
                            className="absolute top-2 right-4 text-gray-500 hover:text-black text-2xl"
                        >
                            &times;
                        </button>
                        <h2 className="text-lg font-semibold mb-4">Bộ Lọc</h2>
                        <div className="space-y-6 h-[70vh] pr-2 overflow-y-auto scrollbar-hide">
                            <FilterContent />
                        </div>
                        <button
                            onClick={() => setShowFilterModal(false)}
                            className="mt-6 w-full bg-[#fecb02] text-white py-2 rounded"
                        >
                            Áp Dụng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Search;