import { IoCloseOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import "react-quill/dist/quill.snow.css";
import { useEffect, useState } from "react";
import { getOneById } from "../../../services/product-service/product-service";
import { formatDateTimeLocal, formatNumberWithDots } from "../../../lib/format-hepper";

const DetailProduct = ({ idDetail, isOpeDetailPopup, setIsOpenDetailPopup }) => {
    const [product, setProduct] = useState(null);

    const getOne = async () => {
        let data = await getOneById(idDetail);
        console.log("data", data)
        setProduct(data);
    }

    const calculateDiscountedPrice = (price, coupons) => {
        if (!coupons || coupons.length === 0) return null;
        
        // Get the highest discount
        const highestDiscount = coupons.reduce((max, coupon) => {
            const currentDiscount = coupon.type === "percent" 
                ? price * (coupon.discount / 100)
                : coupon.discount;
            return currentDiscount > max ? currentDiscount : max;
        }, 0);

        return price - highestDiscount;
    };

    useEffect(() => {
        if (idDetail) getOne();
    }, [idDetail]);
    return (
        <>
            {isOpeDetailPopup && product && (
                <>
                    <AnimatePresence>

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
                                className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-xl w-full max-w-3xl relative max-h-full overflow-y-auto"
                            >
                                <IoCloseOutline
                                    className="absolute top-4 right-4 text-2xl cursor-pointer text-gray-600 hover:text-red-500"
                                    onClick={() => setIsOpenDetailPopup(false)}
                                />
                                <h2 className="text-2xl font-semibold text-[#fecb02] text-600 mb-6">Detail Food</h2>
                                <div className="grid md:grid-cols-2 gap-4 mb-4">
                                    <div className="flex gap-2">
                                        <p className="font-semibold text-black-900 dark:text-black-300">Name:</p>
                                        <p>{product.name}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <p className="font-semibold text-black-900">Price:</p>
                                        {product.coupons && product.coupons.length > 0 ? (
                                            <div className="flex items-center gap-2">
                                                <p className="line-through text-gray-500">{formatNumberWithDots(product.price)} VNĐ</p>
                                                <span className="text-gray-500">→</span>
                                                <p className="text-red-500 font-medium">{formatNumberWithDots(calculateDiscountedPrice(product.price, product.coupons))} VNĐ</p>
                                            </div>
                                        ) : (
                                            <p>{formatNumberWithDots(product.price)} VNĐ</p>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <p className="font-semibold text-black-900 dark:text-gray-300">Category:</p>
                                        <p className="flex gap-2"> <img src={product?.category?.image} alt="" className="w-[30px] h-[30px] object-cover rounded-lg" />{product?.category?.name}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <p className="font-semibold text-black-900 dark:text-gray-300">Score:</p>
                                        <p>{product.score}</p>
                                    </div>
                                </div>
                                {product.coupons && product.coupons.length > 0 && (
                                    <div>
                                        <p className="font-semibold text-black-900 dark:text-gray-300">Coupons:</p>
                                        <table className="w-full text-left table-auto min-w-max">
                                            <tr>
                                                <th className="p-4 transition-colors cursor-pointer border-b border-slate-300 bg-slate-50 hover:bg-slate-100">Name</th>
                                                <th className="p-4 transition-colors cursor-pointer border-b border-slate-300 bg-slate-50 hover:bg-slate-100">Discount</th>
                                                <th className="p-4 transition-colors cursor-pointer border-b border-slate-300 bg-slate-50 hover:bg-slate-100">From</th>
                                                <th className="p-4 transition-colors cursor-pointer border-b border-slate-300 bg-slate-50 hover:bg-slate-100">To</th>
                                            </tr>
                                            {
                                                product?.coupons?.map(item => (
                                                    <tr >
                                                        <td class="p-4 border-b border-slate-200">{item.name}</td>
                                                        <td class="p-4 border-b border-slate-200">{formatNumberWithDots(item.discount)} {item.type === "percent" ? "%" : "VNĐ"}</td>
                                                        <td class="p-4 border-b border-slate-200">{item.fromDate ? formatDateTimeLocal(item.fromDate) : "_"}</td>
                                                        <td class="p-4 border-b border-slate-200">{item.toDate ? formatDateTimeLocal(item.toDate) : "_"}</td>
                                                    </tr>
                                                ))
                                            }
                                        </table>
                                    </div>
                                )}
                                <div className="md:col-span-2 mt-2">
                                    <p className="font-semibold text-black-900 dark:text-gray-300 mb-2">Images</p>
                                    <div className="grid md:grid-cols-6 gap-4 mb-3">
                                        {JSON.parse(product?.images).map((img, index) => (
                                            <div key={index} className="relative w-full aspect-square">
                                                <img
                                                    src={img}
                                                    alt={`Uploaded ${index}`}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="md:col-span-2 mt-2">
                                    <p className="font-semibold text-black-900">Description:</p>
                                    <div className="border p-2 rounded-md overflow-y-scroll h-[300px] mt-1" dangerouslySetInnerHTML={{ __html: product.description }} />
                                </div>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                </>
            )}
        </>


    );
};

export default DetailProduct;