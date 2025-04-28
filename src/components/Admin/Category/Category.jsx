import { useEffect, useState } from "react";
import { useSideBar } from "../../../providers/admin/SideBarProvider";
import { SIDE_BAR_SELECTED } from "../Partial/Sidebar/RouteSelect";
import { IoMdSearch } from "react-icons/io";
import AddCategory from "./AddCategory";

export const Category = () => {
    const { setActive } = useSideBar();
    const [isOpenAddCategoryPopup, setIsOpenAddCategoryPopup] = useState(false);
    useEffect(() => {
        setActive(SIDE_BAR_SELECTED.CATEGORIES);
    }, []);
    return (
        <>
            <AddCategory isOpenAddCategoryPopup={isOpenAddCategoryPopup} setIsOpenAddCategoryPopup={setIsOpenAddCategoryPopup} />
            <div class="p-6 bg-gray-100 min-h-screen space-y-6">
                <div class="bg-white p-6 rounded-xl shadow space-y-4">
                    <div class="flex flex-wrap items-end gap-4">
                        <div class="flex-grow relative">
                            <label class="text-sm font-medium mb-1 block">Search</label>
                            <input type="search" placeholder="Search by category name..." class="w-full px-10 py-2 border rounded-lg focus:outline-none focus:border-[#fecb02]" />
                            <div class="absolute inset-y-0 left-0 flex items-center pl-3 top-11 pointer-events-none -translate-y-1/2">
                                <IoMdSearch className="text-gray-500 text-xl group-hover:text-[#fecb02] " />
                            </div>
                        </div>
                        <div class="flex flex-col">
                            <label class="text-sm font-medium mb-1">Sort by</label>
                            <select class="w-40 px-3 py-2 border rounded-lg outline-none focus:border-[#fecb02]">
                                <option value="default">Default</option>
                                <option value="price-asc">Giá tăng dần</option>
                                <option value="price-desc">Giá giảm dần</option>
                                <option value="name">Tên A-Z</option>
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
                                <th class="px-6 py-3">Name</th>
                                <th class="px-6 py-3">Image</th>
                                <th class="px-6 py-3 text-right">Edit</th>
                                <th class="px-6 py-3 text-right">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="border-b hover:bg-gray-50">
                                <td class="px-6 py-4 font-medium text-gray-900">MacBook Pro 17"</td>
                                <td class="px-6 py-4">
                                    <img src="https://i.pinimg.com/236x/ef/94/ac/ef94acbd4781fb2300edced2e07dfec2.jpg" className="w-[50px] h-[50px] object-cover rounded-lg"></img>
                                </td>
                                <td class="px-6 py-4 text-right"><a href="#" class="text-blue-600 hover:underline">Sửa</a></td>
                                <td class="px-6 py-4 text-right"><a href="#" class="text-blue-600 hover:underline">Delete</a></td>
                            </tr>
                            <tr class="border-b hover:bg-gray-50">
                                <td class="px-6 py-4 font-medium text-gray-900">Surface Pro</td>
                                <td class="px-6 py-4">
                                    <img src="https://i.pinimg.com/474x/11/21/c2/1121c2d225a84a1d80fab7b8432832f5.jpg" className="w-[50px] h-[50px] object-cover rounded-lg"></img>
                                </td>
                                <td class="px-6 py-4 text-right"><a href="#" class="text-blue-600 hover:underline">Sửa</a></td>
                                <td class="px-6 py-4 text-right"><a href="#" class="text-blue-600 hover:underline">Delete</a></td>
                            </tr>
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 font-medium text-gray-900">Magic Mouse 2</td>
                                <td class="px-6 py-4">
                                    <img src="https://i.pinimg.com/474x/27/cf/7c/27cf7c3b9fe84725a788e186448715eb.jpg" className="w-[50px] h-[50px] object-cover rounded-lg"></img>
                                </td>
                                <td class="px-6 py-4 text-right"><a href="#" class="text-blue-600 hover:underline">Sửa</a></td>
                                <td class="px-6 py-4 text-right"><a href="#" class="text-blue-600 hover:underline">Delete</a></td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="flex justify-between items-center mt-4 px-4 text-gray-600">
                        <button class="flex items-center gap-1 text-sm hover:underline">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                            Prev
                        </button>
                        <span>Page 1 / 5</span>
                        <button class="flex items-center gap-1 text-sm hover:underline">
                            Next
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

        </>
    );
};