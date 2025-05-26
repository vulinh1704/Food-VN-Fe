import { useEffect, useState } from "react";
import { useSideBar } from "../../../providers/admin/SideBarProvider";
import { SIDE_BAR_SELECTED } from "../Partial/Sidebar/RouteSelect";
import { IoMdSearch } from "react-icons/io";
import AddCategory from "./AddCategory";
import { deleteCategory, getAllCategories } from "../../../services/category-service/category-service";
import { parseToVietnamTime } from "../../../lib/format-hepper";
import EditCategory from "./EditCategory";
import ConfirmDeleteModal from "../../Supporter/ConfirmDeleteModal";
import { NotificationType } from "../../Supporter/Notification";
import { useNotificationPortal } from "../../Supporter/NotificationPortal";
export const Category = () => {
    const [categories, setCategories] = useState([]);
    const { setActive } = useSideBar();
    const { showNotification, NotificationPortal } = useNotificationPortal();
    const [isOpenAddCategoryPopup, setIsOpenAddCategoryPopup] = useState(false);
    const [isOpenEditCategoryPopup, setIsOpenEditCategoryPopup] = useState(false);
    const [isOpenDeletePopup, setIsOpenDeletePopup] = useState(false);
    const [categoryDelete, setCategoryDelete] = useState({});
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [idEdit, setIdEdit] = useState(null);;
    const [paramsDefault, setParamsDefault] = useState({
        size: 5,
        sortBy: "createdAt",
        sortDirection: "desc",
        name: ''
    });
    const getAll = async (params) => {
        const data = await getAllCategories(params);
        const { content, totalPages } = data;
        params.page = page - 1;
        setCategories(content);
        setTotalPage(totalPages > 0 ? totalPages: 1);
        setParamsDefault(params);
    }

    const searchByName = (value) => {
        setTimeout(() => {
            let params = {
                ...paramsDefault,
                name: value
            };
            getAll(params);
        }, 2000);
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
            params.sortDirection = value;
        }
        getAll(params);
    }

    const onConfirmDeleted = async () => {
        try {
            await deleteCategory(categoryDelete.id);
            showNotification(NotificationType.SUCCESS, "Delete category success.");
            await getAll(paramsDefault);
        } catch (e) {
            showNotification(NotificationType.ERROR, e.response.data.message);
        }
    }

    useEffect(() => {
        const params = {
            ...paramsDefault
        }
        getAll(params);
    }, [isOpenAddCategoryPopup, isOpenEditCategoryPopup]);

    useEffect(() => {
        setActive(SIDE_BAR_SELECTED.CATEGORIES);
    }, []);

    return (
        <>
            <NotificationPortal />
            <AddCategory isOpenAddCategoryPopup={isOpenAddCategoryPopup} setIsOpenAddCategoryPopup={setIsOpenAddCategoryPopup} />
            <EditCategory isOpenEditCategoryPopup={isOpenEditCategoryPopup} setIsOpenEditCategoryPopup={setIsOpenEditCategoryPopup} idEdit={idEdit} />
            <ConfirmDeleteModal isOpen={isOpenDeletePopup} onClose={() => setIsOpenDeletePopup(false)} onConfirm={onConfirmDeleted}
                title="Delete Category" message={`Are you sure you want to delete ` + categoryDelete.name + `?`} />
            <div class="p-6 bg-gray-100 min-h-screen space-y-6">
                <div class="bg-white p-6 rounded-xl shadow space-y-4">
                    <div class="flex flex-wrap items-end gap-4">
                        <div class="flex-grow relative">
                            <label class="text-sm font-medium mb-1 block">Search</label>
                            <input type="search" placeholder="Search by category name..." class="w-full px-10 py-2 border rounded-lg focus:outline-none focus:border-[#fecb02]"
                                onChange={(e) => { searchByName(e.target.value) }} />
                            <div class="absolute inset-y-0 left-0 flex items-center pl-3 top-11 pointer-events-none -translate-y-1/2">
                                <IoMdSearch className="text-gray-500 text-xl group-hover:text-[#fecb02] " />
                            </div>
                        </div>
                        <div class="flex flex-col">
                            <label class="text-sm font-medium mb-1">Sort by</label>
                            <select class="w-60 px-3 py-2 border rounded-lg outline-none focus:border-[#fecb02]" onChange={(e) => { sort(e.target.value) }}>
                                <option value="desc">Newest</option>
                                <option value="asc">Oldest</option>
                                <option value="name">Name A-Z</option>
                            </select>
                        </div>
                        <div class="flex flex-wrap gap-4">
                            <button class="border-[#fecb02] border text-[#fecb02] px-4 py-2 rounded-lg flex items-center gap-2 focus:bg-[#fecb02] focus:text-white"
                                onClick={() => setIsOpenAddCategoryPopup(true)}>
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                Add Category
                            </button>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-4 rounded-xl shadow">
                    <table class="w-full text-sm text-left text-gray-700">
                        <thead class="text-xs text-gray-600 uppercase bg-gray-100">
                            <tr>
                                <th class="px-6 py-3">Created At</th>
                                <th class="px-6 py-3">Name</th>
                                <th class="px-6 py-3">Image</th>
                                <th class="px-6 py-3 text-right">Edit</th>
                                <th class="px-6 py-3 text-right">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                categories.map(item => (
                                    <tr class="border-b hover:bg-gray-50" key={item.id}>
                                        <td class="px-6 py-4 font-medium text-gray-900">{parseToVietnamTime(item.createdAt)}</td>
                                        <td class="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                                        <td class="px-6 py-4">
                                            <img src={item.image} className="w-[50px] h-[50px] object-cover rounded-lg"></img>
                                        </td>
                                        <td class="px-6 py-4 text-right">
                                            <a class="text-blue-600 hover:underline" onClick={() => {
                                                setIsOpenEditCategoryPopup(true);
                                                setIdEdit(item.id);
                                            }}>Edit</a>
                                        </td>
                                        <td class="px-6 py-4 text-right"><a class="text-blue-600 hover:underline"
                                            onClick={() => {
                                                setIsOpenDeletePopup(true);
                                                setCategoryDelete(item);
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