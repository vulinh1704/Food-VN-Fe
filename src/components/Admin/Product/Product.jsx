import { useEffect, useState } from "react";
import { useSideBar } from "../../../providers/admin/SideBarProvider";
import { SIDE_BAR_SELECTED } from "../Partial/Sidebar/RouteSelect";
import { IoMdSearch } from "react-icons/io";
import AddProduct from "./AddProduct";
import { useNotificationPortal } from "../../Supporter/NotificationPortal";
import { getList, remove } from "../../../services/product-service/product-service";
import { formatNumberWithDots } from "../../../lib/format-hepper";
import DetailProduct from "./DetailProduct";
import EditProduct from "./EditProduct";
import ConfirmDeleteModal from "../../Supporter/ConfirmDeleteModal";
import { NotificationType } from "../../Supporter/Notification";
import { getAllData } from "../../../services/category-service/category-service";

export const Product = () => {
    const { setActive } = useSideBar();
    const [isOpenAddProductPopup, setIsOpenAddProductPopup] = useState(false);
    const [products, setProducts] = useState([]);
    const [isOpeDetailPopup, setIsOpenDetailPopup] = useState(false);
    const [idDetail, setIdDetail] = useState("");
    const { showNotification, NotificationPortal } = useNotificationPortal();
    const [isOpenEditProductPopup, setIsOpenEditProductPopup] = useState(false);
    const [isOpenDeletePopup, setIsOpenDeletePopup] = useState(false);
    const [productDelete, setProductDelete] = useState({});
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [idEdit, setIdEdit] = useState(null);
    const [categories, setCategories] = useState([]);

    const [paramsDefault, setParamsDefault] = useState({
        size: 3,
        sortBy: "createdAt",
        sortDirection: "desc",
        name: '',
        minScore: 1,
        maxScore: 5,
        minPrice: 0,
        maxPrice: 99999999999999
    });

    const searchByName = (value) => {
        setTimeout(() => {
            let params = {
                ...paramsDefault,
                name: value
            };
            getAll(params);
        }, 1000);
    }

    const getAll = async (params) => {
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
        if (value == 'name') {
            params.sortBy = value;
            params.sortDirection = "asc";
        } else {
            params.sortBy = "price";
            params.sortDirection = value;
        }

        getAll(params);
    }

    const filterByScore = (value) => {
        let params = { ...paramsDefault, minScore: value };
        getAll(params);
    }

    const filterByCategoryId = (value) => {
        let params = { ...paramsDefault, categoryIds: value };
        getAll(params);
    }

    const onConfirmDeleted = async () => {
        // try {
        await remove(productDelete.id);
        showNotification(NotificationType.SUCCESS, "Delete food success.");
        await getAll(paramsDefault);
        // } catch (e) {
        //     showNotification(NotificationType.ERROR, e.response.data.message);
        // }
    }

    const searchByMinPrice = (price) => {
        const params = {
            ...paramsDefault,
            minPrice: price
        }
        getAll(params);
    }

    const searchByMaxPrice = (price) => {
        const params = {
            ...paramsDefault,
            maxPrice: price
        }
        getAll(params);
    }

    const getAllCategories = async () => {
        const list = await getAllData();
        setCategories(list);
    }

    useEffect(() => {
        const params = {
            ...paramsDefault
        }
        getAll(params);
        getAllCategories();
    }, [isOpenEditProductPopup, isOpenAddProductPopup]);

    useEffect(() => {
        setActive(SIDE_BAR_SELECTED.FOODS);
    }, []);
    return (
        <>
            <NotificationPortal />
            <AddProduct isOpenAddProductPopup={isOpenAddProductPopup} setIsOpenAddProductPopup={setIsOpenAddProductPopup} />
            <DetailProduct isOpeDetailPopup={isOpeDetailPopup} setIsOpenDetailPopup={setIsOpenDetailPopup} idDetail={idDetail} />
            <EditProduct isOpenEditProductPopup={isOpenEditProductPopup} setIsOpenEditProductPopup={setIsOpenEditProductPopup} idEdit={idEdit} />
            <ConfirmDeleteModal isOpen={isOpenDeletePopup} onClose={() => setIsOpenDeletePopup(false)} onConfirm={onConfirmDeleted}
                title="Delete Food" message={`Are you sure you want to delete ` + productDelete.name + `?`} />
            <div class="p-6 bg-gray-100 min-h-screen space-y-6">
                <div class="bg-white p-6 rounded-xl shadow space-y-4">
                    <div class="flex flex-wrap items-end gap-4">
                        <div class="flex-grow relative">
                            <label class="text-sm font-medium mb-1 block">Search</label>
                            <input type="search" placeholder="Search by food name..." class="w-full px-10 py-2 border rounded-lg focus:outline-none focus:border-[#fecb02]"
                                onChange={(e) => { searchByName(e.target.value) }}
                            />
                            <div class="absolute inset-y-0 left-0 flex items-center pl-3 top-11 pointer-events-none -translate-y-1/2">
                                <IoMdSearch className="text-gray-500 text-xl group-hover:text-[#fecb02] " />
                            </div>
                        </div>

                        <div class="flex flex-col">
                            <h4 className="font-medium mb-2">Price</h4>
                            <div className="flex items-center gap-2">
                                <input type="number" placeholder="₫ From" className="border px-2 py-2 rounded w-60 outline-none focus:border-[#fecb02] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    onChange={e => searchByMinPrice(e.target.value)} />
                                <span>-</span>
                                <input type="number" placeholder="₫ To" className="border px-2 py-2 rounded w-60 outline-none focus:border-[#fecb02] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    onChange={e => searchByMaxPrice(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-wrap gap-4">
                        <div class="flex flex-col">
                            <label class="text-sm font-medium mb-1">Category</label>
                            <select class="w-60 px-3 py-2 border rounded-lg outline-none focus:border-[#fecb02]"
                                onChange={e => { filterByCategoryId(e.target.value) }}
                            >
                                <option value="">All</option>
                                {
                                    categories.map(item => <option value={item.id}>{item.name}</option>)
                                }
                            </select>
                        </div>
                        <div class="flex flex-col">
                            <label class="text-sm font-medium mb-1">Sort by</label>
                            <select class="w-60 px-3 py-2 border rounded-lg outline-none focus:border-[#fecb02]" onChange={(e) => { sort(e.target.value) }}>
                                <option value="default">Default</option>
                                <option value="asc">Price arc</option>
                                <option value="desc">Price desc</option>
                                <option value="name">Name A-Z</option>
                            </select>
                        </div>
                        <div class="flex flex-col">
                            <label class="text-sm font-medium mb-1">Score</label>
                            <select class="w-60 px-3 py-2 border rounded-lg outline-none focus:border-[#fecb02]" onChange={(e) => { filterByScore(e.target.value) }}>
                                <option value="1">Default</option>
                                <option value="5">5</option>
                                <option value="4">4 and up</option>
                                <option value="3">3 and up</option>
                                <option value="2">3 and up</option>
                                <option value="1">3 and up</option>
                            </select>
                        </div>
                        <div class="flex flex-col mt-[21px]">
                            <button class="border-[#fecb02] border text-[#fecb02] px-4 py-2 rounded-lg flex items-center gap-2 focus:bg-[#fecb02] focus:text-white"
                                onClick={() => setIsOpenAddProductPopup(true)}>
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                Add Food
                            </button>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-4 rounded-xl shadow">
                    <table class="w-full text-sm text-left text-gray-700">
                        <thead class="text-xs text-gray-600 uppercase bg-gray-100">
                            <tr>
                                <th class="px-6 py-3">Name</th>
                                <th class="px-6 py-3">Image</th>
                                <th class="px-6 py-3">Category</th>
                                <th class="px-6 py-3">Price</th>
                                <th class="px-6 py-3">Quantity</th>
                                <th class="px-6 py-3">Score</th>
                                <th class="px-6 py-3 text-right">Detail</th>
                                <th class="px-6 py-3 text-right">Edit</th>
                                <th class="px-6 py-3 text-right">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                products.map(item => (
                                    <tr class="border-b hover:bg-gray-50">
                                        <td class="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                                        <td class="px-6 py-4">
                                            <img src={JSON.parse(item.images)[0]} className="w-[50px] h-[50px] object-cover rounded-lg"></img>
                                        </td>
                                        <td class="px-6 py-4">{item.category.name}</td>
                                        <td class="px-6 py-4">{formatNumberWithDots(item.price)} VNĐ</td>
                                        <td class="px-6 py-4">
                                            {
                                                item.quantity
                                            }
                                        </td>
                                        <td class="px-6 py-4">
                                            {
                                                item.score
                                            }
                                        </td>
                                        <td class="px-6 py-4 text-right"><a
                                            onClick={() => {
                                                setIdDetail(item.id);
                                                setIsOpenDetailPopup(true)
                                            }}
                                            class="text-blue-600 hover:underline">Detail</a></td>
                                        <td class="px-6 py-4 text-right"><a class="text-blue-600 hover:underline"
                                            onClick={() => {
                                                setIdEdit(item.id);
                                                setIsOpenEditProductPopup(true)
                                            }}
                                        >Edit</a></td>
                                        <td class="px-6 py-4 text-right"><a class="text-blue-600 hover:underline"
                                            onClick={() => {
                                                setProductDelete(item);
                                                setIsOpenDeletePopup(true);
                                            }}
                                        >Delete</a></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>

                    <div class="flex justify-between items-center mt-4 px-4 text-gray-600">
                        {
                            page && page > 1 ?
                                <button class="flex items-center gap-1 text-sm hover:underline" onClick={prevPage}>
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Prev
                                </button>
                                :
                                <button
                                    class="flex items-center gap-1 text-sm hover:underline opacity-50 cursor-not-allowed pointer-events-none"
                                    disabled
                                >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Prev
                                </button>
                        }
                        <span>Page {page} / {totalPage}</span>
                        {
                            page && page < totalPage ?
                                <button class="flex items-center gap-1 text-sm hover:underline" onClick={nextPage}>
                                    Next
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                                :
                                <button
                                    class="flex items-center gap-1 text-sm hover:underline opacity-50 cursor-not-allowed pointer-events-none"
                                    disabled
                                >
                                    Next
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                        }
                    </div>
                </div>
            </div>

        </>
    );
};