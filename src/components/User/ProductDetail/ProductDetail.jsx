import React from "react";
import { FaStar } from "react-icons/fa";
import { formatVND } from "../../../lib/format-hepper";
import StarRating from "../../Supporter/StarRating";
const product = {
  id: 2,
  image: "https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m7vn8cikv41f1c.webp",
  title: "Đầm trắng công chúa",
  price: 288000,
  discount: 2,
  rating: 4.8,
  inStock: true,
  location: "TP. Hồ Chí Minh",
}
const ProductDetail = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-12 gap-6 bg-white">
      {/* Image and Pricing */}
      <div className="col-span-12 md:col-span-6 xl:col-span-5">
        <div className="bg-gray-100 aspect-square flex items-center justify-center rounded">
          <span className="text-gray-400 text-6xl">
            <img src="https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-lt6cn4xbl04d32.webp" alt="" />
          </span>
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="w-20 h-20 bg-gray-100 rounded flex-shrink-0">
              <img src="https://down-vn.img.susercontent.com/file/sg-11134201-7rbn0-lm4hzovepexc9e.webp" alt="" />
            </div>
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="col-span-12 md:col-span-6 xl:col-span-7">
        <h1 className="text-2xl font-semibold">
          Linh kiện Thân Máy Flycam - Tay Cầm - Pin - Sạc
        </h1>
        <div className="flex items-center space-x-4 mt-2">
          <div className="flex gap-2 border-r-2 pr-2">
            <span className="text-[16px] border-b border-black">
              {product.rating}
            </span>
            < StarRating rating={product.rating} />
          </div>
          <div className="flex gap-2">
          <span className="text-[16px] border-b border-black">6</span>
          <span >Đánh Giá</span>
          </div>
          
        </div>
        <p className="text-red-600 text-2xl font-bold mt-2">{formatVND(product.price)}</p>
        <div className="mt-6">
          <p className="text-gray-700 text-sm mb-2">Tùy chọn:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
            {['Thân Máy Flycam', 'Tay Cầm RC2', 'Pin', 'Sạc'].map((option, idx) => (
              <button
                key={idx}
                className="border px-3 py-1 rounded hover:border-[#fecb02] hover:text-[#fecb02] transition"
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <button className="w-full bg-[#fecb02] text-white py-2 rounded font-semibold text-sm">
            Thêm Vào Giỏ Hàng
          </button>
        </div>
      </div>

      {/* Product Description & Review */}
      <div className="col-span-12 lg:col-span-8 bg-white border rounded p-4 mt-6">
        <h2 className="text-lg font-semibold mb-2">Mô tả sản phẩm</h2>
        <p className="text-sm text-gray-700">
          Linh kiện DJI RC 2 được sử dụng cho dòng Flycam Mini 4 Pro, RC2 hỗ trợ sử dụng màn hình
          có sẵn điều khiển mượt mà, hỗ trợ O4 video truyền hình ảnh mượt hơn. Pin dung lượng cao
          5200mAh giúp trải nghiệm tốt hơn.
        </p>
      </div>

      {/* Product Reviews */}
      <div className="col-span-12 lg:col-span-8 bg-white border rounded p-4 mt-4">
        <h2 className="text-lg font-semibold mb-4">Đánh giá sản phẩm</h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="border-t pt-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-300" />
                <div>
                  <p className="text-sm font-medium">Người dùng {idx + 1}</p>
                  <div className="flex text-yellow-400 text-xs">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm mt-2 text-gray-700">
                Hàng dùng tốt, shop tư vấn nhiệt tình, giao hàng nhanh.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div className="col-span-12 lg:col-span-4 mt-6 space-y-4">
        {[...Array(6)].map((_, idx) => (
          <div key={idx} className="border rounded p-3 bg-white flex items-center space-x-3">
            <div className="w-16 h-16 bg-gray-100 rounded" />
            <div>
              <h3 className="text-sm font-semibold">Sản phẩm liên quan {idx + 1}</h3>
              <p className="text-red-500 text-sm font-bold">₫1.000.000</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetail;
