import React, { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiRefreshCw } from "react-icons/fi";
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
import Select from 'react-select';
import Loading from "../../Supporter/Loading";
import { useOrder } from "../../../providers/users/OrderProvider";
import { useUser } from "../../../providers/users/UserProvider";
import { addOrderDetail } from "../../../services/order-service/order-service";

const ProductCard = ({ product }) => {
    const { card } = useOrder();
    const { user, setAuthPopup, setOrderPopup } = useUser();

    const saveOrderDetail = async (product) => {
        if (!user) {
            setAuthPopup(true);
            return;
        }
        let data = {
            orders: {
                id: card.id
            },
            product: {
                id: product.id
            },
            price: product.price,
            quantity: 1
        }
        await addOrderDetail(data);
        setOrderPopup(true);
    }

    return (
        <div className="bg-white border rounded-md p-3 shadow-sm hover:border-[#fecb02] transition relative hover:scale-105 duration-300">
            <Link to={"/detail/" + product.id}>
                <div className="relative">
                    {product.coupons && product.coupons.length > 0 && (
                        <div className="absolute right-2 top-0 flex flex-col gap-1 z-[5]">
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

                <div className="relative">
                    <img src={JSON.parse(product.images)[0]} alt={product.name} className="w-full h-[220px] rounded-md mt-4 object-contain" />
                    {product.quantity == 0 && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-80 text-red-500 px-2 py-1 text-xs font-semibold shadow-md z-20 flex items-center gap-1.5 rounded">
                            <FaExclamationCircle /> SOLD OUT
                        </div>
                    )}
                </div>
                <h3 className="mt-4 text-md font-semibold line-clamp-2 min-h-[48px]">{product.name}</h3>
                <div className="mt-3 min-h-[60px]">
                    {product.coupons && product.coupons.length > 0 ? (
                        <>
                            <p className="text-gray-400 line-through text-sm mb-1">{formatNumberWithDots(product.price)} VNĐ</p>
                            <p className="text-red-500 font-bold text-lg">
                                {formatNumberWithDots(
                                    Math.max(
                                        product.coupons.reduce((price, coupon) => {
                                            if (coupon.type === "percent") {
                                                return price - (price * coupon.discount / 100);
                                            }
                                            return price - coupon.discount;
                                        }, product.price),
                                        0
                                    )
                                )} VNĐ
                            </p>
                        </>
                    ) : (
                        <p className="text-red-500 font-bold text-lg">{formatNumberWithDots(product.price)} VNĐ</p>
                    )}
                </div>
                <div className="flex items-center text-yellow-500 text-sm mt-2">
                    <StarRating rating={product.score} />
                </div>
            </Link>
            <button
                className={`w-full border duration-300 text-sm font-sans py-2 px-4 rounded-md mt-3 tracking-wide ${product.quantity ? 'text-[#fecb02] border-[#fecb02] hover:scale-105 hover:text-white hover:bg-[#fecb02]' : 'text-gray-400'}`}
                onClick={() => saveOrderDetail(product)}
                disabled={product.quantity == 0}
            >
                {product.quantity > 0 ? "ADD TO CART" : "OUT OF STOCK"}
            </button>
        </div>
    );
};

const FilterContent = ({ paramsDefault, setParamsDefault, onReset }) => {
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
                    categoryIds: [],
                    minScore: "1",
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
                {({ values, setFieldValue, resetForm }) => (
                    <Form className="space-y-6">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium text-gray-700">Filters</h4>
                            <button
                                type="button"
                                onClick={() => {
                                    resetForm();
                                    onReset();
                                }}
                                className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#fecb02] transition-colors duration-200"
                            >
                                <FiRefreshCw className="text-lg" />
                                Reset
                            </button>
                        </div>

                        <div className="pb-6 border-b border-gray-200">
                            <h4 className="font-medium mb-4 text-gray-700">Categories</h4>
                            <div className="space-y-3">
                                {categories.map((item) => (
                                    <label key={item.id} className="flex items-center group cursor-pointer">
                                        <Field
                                            name="categoryIds"
                                            type="checkbox"
                                            value={item.id + ""}
                                            className="mr-3 relative w-5 h-5 !appearance-none checked:bg-[#fecb02] bg-white border-2 border-gray-300 rounded !outline-none cursor-pointer transition-all duration-300
                                            after:w-[40%] after:h-[65%] after:absolute after:opacity-0 after:top-[45%] after:left-[50%] after:-translate-x-2/4 after:-translate-y-2/4 after:rotate-[45deg]
                                            after:border-r-[2px] after:border-b-[2px] after:border-white
                                            after:transition-all after:duration-200 after:ease-linear
                                            checked:after:opacity-100 group-hover:border-[#fecb02]"
                                        />
                                        <span className="text-gray-600 group-hover:text-gray-900 transition-colors duration-200">
                                            {item.name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="pb-6 border-b border-gray-200">
                            <h4 className="font-medium mb-4 text-gray-700">Rating</h4>
                            <div className="space-y-2">
                                {[5, 4, 3, 2, 1].map((star) => {
                                    const isSelected = values.minScore === String(star);
                                    return (
                                        <label key={star} className="flex items-center cursor-pointer w-full">
                                            <Field
                                                type="radio"
                                                name="minScore"
                                                value={String(star)}
                                                className="hidden"
                                            />
                                            <div
                                                onClick={() => setFieldValue('minScore', String(star))}
                                                className={`flex items-center px-3 w-full py-2 rounded-lg transition-all duration-200 ${
                                                    isSelected 
                                                    ? 'bg-[#fff7dd] border-2 border-[#fecb02]' 
                                                    : 'hover:bg-gray-50 border-2 border-transparent'
                                                }`}
                                            >
                                                <StarRating rating={star} />
                                                {star !== 5 && (
                                                    <span className={`pl-2 text-sm ${isSelected ? 'text-[#fecb02]' : 'text-gray-500'}`}>
                                                        & up
                                                    </span>
                                                )}
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="pb-6 border-b border-gray-200">
                            <h4 className="font-medium mb-4 text-gray-700">Price Range</h4>
                            <div className="flex items-center gap-3">
                                <Field
                                    type="number"
                                    name="minPrice"
                                    placeholder="$ FROM"
                                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg outline-none focus:border-[#fecb02] transition-colors duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <span className="text-gray-400">-</span>
                                <Field
                                    type="number"
                                    name="maxPrice"
                                    placeholder="$ TO"
                                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg outline-none focus:border-[#fecb02] transition-colors duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#fecb02] text-white font-medium py-3 rounded-lg hover:bg-[#e5b702] transition duration-300"
                        >
                            Apply Filters
                        </button>
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
    const [sortSelected, setSortSelected] = useState({ value: "default", label: "Relevance" });
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const name = searchParams.get('name');

    const sortOptions = [
        { value: "default", label: "Relevance" },
        { value: "createdAt", label: "Newest" },
        { value: "bestSeller", label: "Best Seller" },
        { value: "priceAsc", label: "Price: Low to High" },
        { value: "priceDesc", label: "Price: High to Low" }
    ];

    const defaultParams = {
        size: 12,
        sortBy: "score",
        sortDirection: "desc",
        name: '',
        minScore: 1,
        maxScore: 5,
        minPrice: 0,
        maxPrice: 99999999999999
    };

    const [paramsDefault, setParamsDefault] = useState(defaultParams);

    const getAll = async (params) => {
        try {
            setIsLoading(true);
            if (name != null || name != undefined) params.name = name;
            const data = await getList(params);
            const { content, totalPages } = data;
            params.page = page - 1;
            setProducts(content);
            setTotalPage(totalPages > 0 ? totalPages : 1);
            setParamsDefault(params);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleSort = (option) => {
        let params = { ...paramsDefault };
        setSortSelected(option);
        
        switch(option.value) {
            case 'default':
                params.sortBy = "score";
                params.sortDirection = "desc";
                break;
            case 'createdAt':
                params.sortBy = "createdAt";
                params.sortDirection = "desc";
                break;
            case 'priceAsc':
                params.sortBy = "price";
                params.sortDirection = "asc";
                break;
            case 'priceDesc':
                params.sortBy = "price";
                params.sortDirection = "desc";
                break;
            default:
                break;
        }
        
        getAll(params);
    }

    const handleReset = () => {
        setParamsDefault(defaultParams);
        setSortSelected({ value: "default", label: "Relevance" });
        setPage(1);
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

    useEffect(() => {
        setActive(ACTIVE_VALUE_NAVBAR.FOOD);
    }, []);

    useEffect(() => {
        getAll(paramsDefault);
    }, [paramsDefault, name]);

    return (
        <div className="mx-auto px-4 py-8 container">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div className="w-full md:w-auto flex items-center gap-4">
                    <div className="lg:hidden">
                        <button onClick={() => setShowFilterModal(true)}
                            className="flex items-center gap-2 px-6 py-2 bg-[#fecb02] text-white rounded-lg hover:bg-[#e5b702] transition duration-300">
                            <TbFilterEdit className="text-xl" />
                            <span>Filters</span>
                        </button>
                    </div>
                    <h2 className="text-2xl font-bold lg:flex items-center gap-2 hidden">
                        <TbFilterEdit className="text-[#fecb02]" />
                        Search Results
                    </h2>
                </div>
                
                <div className="w-full md:w-[250px]">
                    <Select
                        value={sortSelected}
                        options={sortOptions}
                        onChange={handleSort}
                        isSearchable={false}
                        className="text-sm"
                        styles={{
                            control: (base) => ({
                                ...base,
                                minHeight: '38px',
                                borderRadius: '0.5rem',
                                borderColor: '#e5e7eb',
                                '&:hover': {
                                    borderColor: '#fecb02'
                                }
                            }),
                            option: (base, state) => ({
                                ...base,
                                backgroundColor: state.isSelected ? '#fecb02' : base.backgroundColor,
                                color: state.isSelected ? 'white' : base.color,
                                '&:hover': {
                                    backgroundColor: state.isSelected ? '#fecb02' : '#f3f4f6'
                                }
                            }),
                            menu: (base) => ({
                                ...base,
                                zIndex: 50
                            })
                        }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                <aside className="hidden lg:block col-span-2 p-6 bg-white border rounded-lg shadow-sm">
                    <FilterContent 
                        paramsDefault={paramsDefault} 
                        setParamsDefault={setParamsDefault}
                        onReset={handleReset}
                    />
                </aside>

                <div className="col-span-12 lg:col-span-10">
                    {isLoading ? (
                        <div className="min-h-[400px] flex items-center justify-center">
                            <Loading size="large" />
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-center items-center mt-10 gap-4">
                <button
                    className={`p-3 rounded-full transition duration-300 ${
                        page === 1 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                    onClick={() => prevPage()}
                    disabled={page === 1}
                >
                    <FiChevronLeft className="text-xl" />
                </button>
                <span className="text-sm font-medium">Page {page} / {totalPage}</span>
                <button
                    className={`p-3 rounded-full transition duration-300 ${
                        page === totalPage 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                    onClick={() => nextPage()}
                    disabled={page === totalPage}
                >
                    <FiChevronRight className="text-xl" />
                </button>
            </div>

            {showFilterModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center px-4 overflow-hidden">
                    <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-xl relative max-h-[90vh] overflow-hidden">
                        <button
                            onClick={() => setShowFilterModal(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl transition duration-300"
                        >
                            &times;
                        </button>
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <TbFilterEdit className="text-[#fecb02]" />
                            Filters
                        </h2>
                        <div className="space-y-6 h-[70vh] pr-2 overflow-y-auto scrollbar-hide">
                            <FilterContent 
                                paramsDefault={paramsDefault} 
                                setParamsDefault={setParamsDefault}
                                onReset={handleReset}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Search;