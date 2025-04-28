import { useState, useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import {
    ref,
    uploadBytes,
    getDownloadURL,
} from "firebase/storage";
import { v4 } from "uuid";
import { storage } from "../../../config/fire-base";

let images = [
    "https://i.pinimg.com/236x/ef/94/ac/ef94acbd4781fb2300edced2e07dfec2.jpg",
    "https://i.pinimg.com/474x/11/21/c2/1121c2d225a84a1d80fab7b8432832f5.jpg",
    "https://i.pinimg.com/474x/27/cf/7c/27cf7c3b9fe84725a788e186448715eb.jpg",
    "https://i.pinimg.com/236x/a6/6a/8b/a66a8b16fc035d5d651807e13855d242.jpg",
    "https://i.pinimg.com/236x/20/6b/76/206b76fe5106c1eedfb06eb499f5b2d0.jpg",
    "https://i.pinimg.com/236x/ef/94/ac/ef94acbd4781fb2300edced2e07dfec2.jpg",
    "https://i.pinimg.com/474x/11/21/c2/1121c2d225a84a1d80fab7b8432832f5.jpg",
    "https://i.pinimg.com/474x/27/cf/7c/27cf7c3b9fe84725a788e186448715eb.jpg",
    "https://i.pinimg.com/236x/a6/6a/8b/a66a8b16fc035d5d651807e13855d242.jpg",
    "https://i.pinimg.com/236x/20/6b/76/206b76fe5106c1eedfb06eb499f5b2d0.jpg",
]

const AddCategory = ({ isOpenAddCategoryPopup, setIsOpenAddCategoryPopup }) => {
    const [imageUpload, setImageUpload] = useState(null);
    const [imageUrls, setImageUrls] = useState([]);
    const uploadFile = () => {
        if (imageUpload == null) return;
        const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
        uploadBytes(imageRef, imageUpload).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                setImageUrls((prev) => [...prev, url]);
            });
        });
    };

    return (
        <AnimatePresence>
            {isOpenAddCategoryPopup && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
                >
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -50, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-xl w-full max-w-3xl relative"
                    >
                        <IoCloseOutline
                            className="absolute top-4 right-4 text-2xl cursor-pointer text-gray-600 hover:text-red-500"
                            onClick={() => setIsOpenAddCategoryPopup(false)}
                        />
                        <h2 className="text-2xl font-semibold text-[#fecb02] text-600 mb-6">Add Category</h2>
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <input
                                type="text"
                                placeholder="Name"
                                className="border border-gray-300 col-span-2 p-2 rounded text-sm w-full dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:border-[#fecb02]"
                            />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <input
                                className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                                type="file"
                                id="formFileMultiple"
                                multiple
                                onChange={(event) => {
                                    setImageUpload(event.target.files[0]);
                                }}
                            />
                            {/* <button onClick={uploadFile}> Upload Image</button>
                            {imageUrls.map((url) => {
                                return <img src={url} />;
                            })} */}
                        </div>
                        <div className="grid md:grid-cols-6 gap-4 mb-4">
                            {images.map((img, index) => (
                                <div key={index} className="relative w-full aspect-square">
                                    <img
                                        src={img}
                                        alt={`Uploaded ${index}`}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                    <button
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                        {/* Submit */}
                        <button className="w-full bg-[#fecb02] text-white py-2 rounded hover:opacity-90">
                            Submit
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AddCategory;