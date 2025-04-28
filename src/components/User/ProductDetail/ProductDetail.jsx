import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";
import { formatVND } from "../../../lib/format-hepper";
import StarRating from "../../Supporter/StarRating";
import { IoCartOutline } from "react-icons/io5";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavbar } from "../../../providers/users/NavBarProvider";
import { ACTIVE_VALUE_NAVBAR } from "../../../lib/app-const";

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

const thumbnails = [
  'https://down-vn.img.susercontent.com/file/sg-11134201-7rbn0-lm4hzovepexc9e.webp',
  'https://down-vn.img.susercontent.com/file/sg-11134201-7rep3-m2xxxf4uww1l95@resize_w450_nl.webp',
  'https://down-vn.img.susercontent.com/file/sg-11134201-7reoo-m2xxxi8edohaf5@resize_w450_nl.webp',
  'https://down-vn.img.susercontent.com/file/sg-11134201-7rbn0-lm4hzovepexc9e.webp',
  'https://down-vn.img.susercontent.com/file/sg-11134201-7reoo-m2xxxi8edohaf5@resize_w450_nl.webp',
  'https://down-vn.img.susercontent.com/file/sg-11134201-7rbn0-lm4hzovepexc9e.webp',
  'https://down-vn.img.susercontent.com/file/sg-11134201-7rep3-m2xxxf4uww1l95@resize_w450_nl.webp'
];
const CustomPrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      style={{
        position: "absolute",
        left: "15px",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 2,
        width: "40px",
        height: "40px",
        backgroundColor: "rgba(254, 203, 2, 0.2)",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)"
      }}
      onClick={onClick}
    >
      <FaChevronLeft style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "20px" }} />
    </div>
  );
};

const CustomNextArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      style={{
        position: "absolute",
        right: "15px",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 2,
        width: "40px",
        height: "40px",
        backgroundColor: "rgba(254, 203, 2, 0.2)",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)"
      }}
      onClick={onClick}
    >
      <FaChevronRight style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "20px" }} />
    </div>
  );
};
const ImageGallery = () => {

  const [mainImage, setMainImage] = useState(thumbnails[0]);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />
  };

  return (
    <div className="col-span-12 md:col-span-6 xl:col-span-5">
      {/* Ảnh chính */}
      <div className="bg-gray-100 aspect-square flex items-center justify-center rounded overflow-hidden">
        <img src={mainImage} alt="Main" className="object-contain w-full h-full" />
      </div>

      {/* Slider ảnh nhỏ */}
      <div className="mt-4">
        <Slider {...settings}>
          {thumbnails.map((src, idx) => (
            <div key={idx}>
              <div
                onMouseEnter={() => setMainImage(src)}
                className="w-20 h-20 mx-auto bg-gray-100 rounded cursor-pointer overflow-hidden border-2 border-transparent hover:border-[#fecb02] transition"
              >
                <img src={src} alt={`Thumb ${idx}`} className="object-cover w-full h-full" />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

const ProductDetail = () => {
  const { setActive } = useNavbar();
  useEffect(() => {
    setActive(ACTIVE_VALUE_NAVBAR.FOOD);
  }, []);

  return (
    <div className="mx-auto px-4 py-8 grid grid-cols-12 gap-6 bg-white mb-8 container">
      <ImageGallery />
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
        <div className="w-full h-[70px] flex items-center bg-gray-100 mt-4 gap-4">
          <p className="text-red-600 text-3xl font-normal pl-2">{formatVND(product.price)}</p>
          <p className="rounded-md right-2 bg-opacity-80 bg-red-100 px-1 text-sm text-red-600 mt-1">-{'50%'}</p>
        </div>
        <div className="mt-6">
          <p className="text-gray-700 text-sm mb-2">Tùy chọn:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
            {['Thân Máy Flycam', 'Tay Cầm RC2', 'Pin', 'Sạc'].map((option, idx) => (
              <button
                key={idx}
                className="border px-3 py-1 rounded hover:border-[#fecb02] hover:text-[#fecb02] transition flex items-center gap-2"
              >
                <img src="https://down-vn.img.susercontent.com/file/sg-11134201-7reoi-m2xxxg07mz2eb6@resize_w450_nl.webp" alt="" className="w-[30px] h-[30px]" />
                {option}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <p className="text-gray-700 text-sm mb-2">Số lượng:</p>
          <div className="flex-1">
            <div className="flex items-center gap-2 border w-[200px] justify-between rounded-sm">
              <button className="border-r px-3 py-2 hover:text-[#fecb02]">-</button>
              <span>{1}</span>
              <button className="border-l px-3 py-2 hover:text-[#fecb02]">+</button>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button className="w-full text-[#fecb02] font-normal border border-[#fecb02] bg-[#ffffff] hover:bg-[#f9f5e3] flex items-center justify-center gap-1">
            <IoCartOutline className="text-2xl text-[#fecb02]" />
            <span>Thêm Vào Giỏ Hàng</span>
          </button>
          <button className="w-full bg-[#fecb02] text-white py-4 rounded font-semibold text-sm">
            Mua Ngay
          </button>
        </div>
      </div>

      {/* Product Description & Review */}
      <div className="col-span-12 lg:col-span-8 bg-white">
        <div className="border rounded p-4 mt-6">
          <h2 className="text-xl font-semibold mb-5">Mô tả sản phẩm</h2>
          <p className="text-sm text-gray-700">
            Linh kiện DJI RC 2 được sử dụng cho dòng Flycam Mini 4 Pro, RC2 hỗ trợ sử dụng màn hình
            có sẵn điều khiển mượt mà, hỗ trợ O4 video truyền hình ảnh mượt hơn. Pin dung lượng cao
            5200mAh giúp trải nghiệm tốt hơn.Linh kiện DJI RC 2 được sử dụng cho dòng Flycam Mini 4 Pro, RC2 hỗ trợ sử dụng màn hình
            có sẵn điều khiển mượt mà, hỗ trợ O4 video truyền hình ảnh mượt hơn. Pin dung lượng cao
            5200mAh giúp trải nghiệm tốt hơn.Linh kiện DJI RC 2 được sử dụng cho dòng Flycam Mini 4 Pro, RC2 hỗ trợ sử dụng màn hình
            có sẵn điều khiển mượt mà, hỗ trợ O4 video truyền hình ảnh mượt hơn. Pin dung lượng cao
            5200mAh giúp trải nghiệm tốt hơn.Linh kiện DJI RC 2 được sử dụng cho dòng Flycam Mini 4 Pro, RC2 hỗ trợ sử dụng màn hình
            có sẵn điều khiển mượt mà, hỗ trợ O4 video truyền hình ảnh mượt hơn. Pin dung lượng cao
            5200mAh giúp trải nghiệm tốt hơn.
          </p>
        </div>
        {/* Product Reviews */}
        <div className="bg-white border rounded p-4 mt-4">
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

      <div className="col-span-12 lg:col-span-8 ">

      </div>


    </div >
  );
};

export default ProductDetail;
