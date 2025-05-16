import React, { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import StarRating from "../../Supporter/StarRating";
import { TbFilterEdit } from "react-icons/tb";
import { FaExclamationCircle } from "react-icons/fa";
import { ACTIVE_VALUE_NAVBAR } from "../../../lib/app-const";
import { useNavbar } from "../../../providers/users/NavBarProvider";
import { Link } from "react-router-dom";
import { getList } from "../../../services/product-service/product-service";
import { formatNumberWithDots } from "../../../lib/format-hepper";
import { getAllData } from "../../../services/category-service/category-service";
import { Field, Form, Formik } from "formik";
import { useSearchParams } from 'react-router-dom';

const ProductCard = ({ product }) => {
    return (
        <Link
            to={"/detail/" + product.id}>
            <div className="bg-white border rounded-md p-3 shadow-sm hover:border-[#fecb02] transition relative hover:scale-105 duration-300">
                <div className="relative">
                    {product.coupons && product.coupons.length > 0 && (
                        <div className="absolute right-2 top-0 flex flex-col gap-1 z-10">
                            {product.coupons.map((item, index) => (
                                <div
                                    key={index}
                                    className="rounded-md bg-opacity-80 bg-red-500 text-white px-2 py-1 text-xs font-semibold shadow-md"
                                >
                                    -{formatNumberWithDots(item.discount)} {item.type === "percent" ? "%" : "VNĐ"}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <img src={JSON.parse(product.images)[0]} alt={product.name} className="w-full h-[220px] rounded-md mt-4 object-contain" />
                {product.quantity == 0 && (
                    <div className="absolute top-[100px] left-14 bg-white bg-opacity-70 text-black text-2xs px-2 py-2 text-sm font-bold-300 shadow-md z-10 flex items-center gap-1">
                        <FaExclamationCircle className="text-red-500" /> HẾT HÀNG
                    </div>
                )}
                <h3 className="mt-4 text-md font-semibold">{product.name}</h3>
                <p className="text-red-500 font-bold mt-3">{formatNumberWithDots(product.price)} VNĐ</p>
                <div className="flex items-center text-yellow-500 text-sm mt-3">
                    <StarRating rating={product.score} />
                </div>
                <button
                    className={`w-full border duration-300 text-sm font-sans py-2 px-4 rounded-md mt-3 tracking-wide ${product.quantity ? 'text-[#fecb02] border-[#fecb02] hover:scale-105 hover:text-white hover:bg-[#fecb02]' : 'text-gray-400'}`}
                    disabled={product.quantity == 0}
                >
                    {product.quantity > 0 ? "ADD TO CART" : "OUT OF STOCK"}
                </button>
            </div>
        </Link>
    );
};

const FilterContent = ({ paramsDefault, setParamsDefault }) => {
    const [categories, setCategories] = useState([]);
    const getAllCategories = async () => {
        const list = await getAllData();
        setCategories(list);
    }

    useEffect(() => {
        getAllCategories();
    }, []);

    return (
        <>
            <Formik
                initialValues={{
                    categoryIds: null,
                    minScore: 1,
                    minPrice: '',
                    maxPrice: '',
                }}
                onSubmit={(values) => {
                    if (!values.categoryIds || values.categoryIds.length === 0) {
                        delete paramsDefault.categoryIds;
                        delete values.categoryIds;
                    }
                    setParamsDefault({ ...paramsDefault, ...values })
                }}>
                {({ values, setFieldValue }) => (
                    <Form>
                        <div className="pb-4 border-b-2 border-gray-200">
                            <h4 className="font-medium mb-2">Categories</h4>
                            <div className="space-y-3">
                                {categories.map((item, idx) => (
                                    <label key={idx} className="flex items-center">
                                        <Field
                                            name="categoryIds"
                                            type="checkbox"
                                            className="mr-2 relative w-4 h-4 !appearance-none checked:bg-[#fecb02] bg-white border border-gray-300 shadow-sm rounded !outline-none cursor-pointer transition-all duration-300 focus-visible:!outline-offset-2
                            after:w-[40%] after:h-[65%] after:absolute after:opacity-0 after:top-[45%] after:left-[50%] after:-translate-x-2/4 after:-translate-y-2/4 after:rotate-[45deg]
                            after:border-r-[2px] after:border-b-[2px] after:border-white
                            after:transition-all after:duration-200 after:ease-linear
                            checked:after:opacity-100"
                                            value={item.id + ""}
                                        />
                                        {item.name}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="py-4 border-b-2 border-gray-200">
                            <h4 className="font-medium mb-2">Đánh Giá</h4>
                            <div className="text-sm space-y-3">
                                {[5, 4, 3, 2, 1].map((star) => {
                                    const isSelected = values.minScore === String(star);

                                    return (
                                        <label key={star} className="flex items-center cursor-pointer">
                                            <Field
                                                type="radio"
                                                name="minScore"
                                                value={String(star)}
                                                className="hidden"
                                            />
                                            <div
                                                onClick={() => setFieldValue('minScore', String(star))}
                                                className={`flex items-center px-2 w-full py-1 rounded transition-colors ${isSelected ? 'bg-yellow-200' : 'hover:bg-gray-100'
                                                    }`}
                                            >
                                                <StarRating rating={star} />
                                                {star !== 5 && <span className="pl-1">trở lên</span>}
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="py-4 border-b-2 border-gray-200">
                            <h4 className="font-medium mb-2">Khoảng Giá</h4>
                            <div className="flex items-center gap-2 mb-3">
                                <Field type="number" name="minPrice" placeholder="₫ FROM" className="border px-2 py-1 rounded w-full outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                                <span>-</span>
                                <Field type="number" name="maxPrice" placeholder="₫ TO" className="border px-2 py-1 rounded w-full outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                            </div>
                        </div>

                        <div className="py-4">
                            <button className="bg-[#fecb02] text-white font-semibold py-1.5 w-full rounded">
                                ÁP DỤNG
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    )
};

const Search = () => {
    const [page, setPage] = useState(1);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const { setActive } = useNavbar();
    const [products, setProducts] = useState([]);
    const [totalPage, setTotalPage] = useState(1);
    const [sortSelected, setSortSelected] = useState("default");
    const [searchParams] = useSearchParams();
    const name = searchParams.get('name');

    const [paramsDefault, setParamsDefault] = useState({
        size: 10,
        sortBy: "score",
        sortDirection: "desc",
        name: '',
        minScore: 1,
        maxScore: 5,
        minPrice: 0,
        maxPrice: 99999999999999
    });


    const getAll = async (params) => {
        if (name != null || name != undefined) params.name = name;
        const data = await getList(params);
        const { content, totalPages } = data;
        params.page = page - 1;
        setProducts(content);
        setTotalPage(totalPages > 0 ? totalPages : 1);
        setParamsDefault(params);
    }

    const nextPage = () => {
        const next = page + 1;
        setPage(next);
        const params = {
            page: next,
            ...paramsDefault,
        }
        getAll(params);
    }

    const prevPage = () => {
        const prev = page - 1;
        setPage(prev);
        const params = {
            page: prev,
            ...paramsDefault
        }
        getAll(params);
    }

    const sort = (value) => {
        let params = { ...paramsDefault };
        setSortSelected(value)
        if (value == 'default') {
            params.sortBy = "score";
            params.sortDirection = "desc";
        }
        if (value == 'createdAt') {
            params.sortBy = value;
            params.sortDirection = "desc";
        }
        getAll(params);
    }

    const sortPrice = (value) => {
        if (!value) return;
        let params = { ...paramsDefault };
        params.sortBy = "price";
        params.sortDirection = value;
        getAll(params);
    }

    useEffect(() => {
        setActive(ACTIVE_VALUE_NAVBAR.FOOD);
    }, []);

    useEffect(() => {
        getAll(paramsDefault);
    }, [paramsDefault, name]);

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
                    <button className={`px-4 py-1 text-md rounded shadow ${sortSelected == "default" ? "text-white bg-[#fecb02]" : "bg-white"}`} value={"default"} onClick={(e) => { sort(e.target.value) }}>Liên Quan</button>
                    <button className={`px-4 py-1 text-md rounded shadow ${sortSelected == "createdAt" ? "text-white bg-[#fecb02]" : "bg-white"}`} value={"createdAt"} onClick={(e) => { sort(e.target.value) }}>Mới Nhất</button>
                    <button className="px-4 py-1 text-md bg-white rounded shadow">Bán Chạy</button>
                    <select class="px-4 py-1 border rounded-lg outline-none focus:border-[#fecb02]" onChange={(e) => { sortPrice(e.target.value) }}>
                        <option value="">Price</option>
                        <option value="asc">Price arc</option>
                        <option value="desc">Price desc</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-3">
                <aside className="hidden lg:block col-span-2 p-4 bg-white border rounded shadow-sm">
                    <FilterContent paramsDefault={paramsDefault} setParamsDefault={setParamsDefault} />

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
                    onClick={() => prevPage()}
                    disabled={page === 1}
                >
                    <FiChevronLeft />
                </button>
                <span className="px-4 text-sm font-medium pt-2">{page} / {totalPage}</span>
                <button
                    className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
                    onClick={() => nextPage()}
                    disabled={page === totalPage}
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