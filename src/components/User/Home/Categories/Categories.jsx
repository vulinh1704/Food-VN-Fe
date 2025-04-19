import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Img1 from "../../../../assets/women/women.png";
import Img2 from "../../../../assets/women/women2.jpg";
import Img3 from "../../../../assets/women/women3.jpg";
import Img4 from "../../../../assets/women/women4.jpg";

const ProductsData = [
  { id: 1, img: Img1, title: "Thời Trang Nam" },
  { id: 2, img: Img2, title: "Điện Thoại & Phụ Kiện" },
  { id: 3, img: Img3, title: "Thiết Bị Điện Tử" },
  { id: 4, img: Img4, title: "Máy Tính & Laptop" },
  { id: 5, img: Img2, title: "Máy Ảnh & Máy Quay" },
  { id: 6, img: Img1, title: "Đồng Hồ" },
  { id: 7, img: Img3, title: "Giày Dép Nam" },
  { id: 8, img: Img4, title: "Thiết Bị Gia Dụng" },
];

const Categories = () => {
  const swiperRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [isBeginning, setIsBeginning] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    if (swiperRef.current) {
      swiperRef.current.on('slideChange', () => {
        setIsBeginning(swiperRef.current.isBeginning);
        console.log(swiperRef.current.isEnd)
        setIsEnd(swiperRef.current.isEnd);
      });
    }
  }, []);

  return (
    <div className="w-full max-w-8xl mt-20 mb-10 container relative">
      <div className="text-center mb-[90px] w-full mx-auto bg-[#ffffff] border-b-2 border-[#fecb02] py-1">
        <h1 data-aos="fade-up" className="text-2xl font-bold-900">
          CATEGORIES
        </h1>
        <p data-aos="fade-up" className="text-sm text-[#fecb02] py-1">
          Product categories list for you
        </p>
      </div>

      <div data-aos="fade-up">
        <Swiper
          modules={[Navigation]}
          spaceBetween={2}
          breakpoints={{
            500: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 6 },
          }}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          navigation={{
            prevEl: isMounted ? ".custom-prev" : null,
            nextEl: isMounted ? ".custom-next" : null,
          }}
          className="!pb-10"
        >
          {ProductsData.map((data) => (
            <SwiperSlide key={data.id} className="flex flex-col items-center transition-transform duration-300 hover:scale-110">
              <div className="w-[180px] h-[180px] flex items-center justify-center bg-white shadow-lg rounded-lg p-1 transition-transform duration-300 hover:border-2 border-[#f2eddc]">
                <img src={data.img} alt={data.title} className="max-w-[170px] max-h-[170px] object-contain" />
              </div>
              <h3 className="text-sm font-semibold-900 mt-2 text-center">{data.title}</h3>
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          className={`custom-prev absolute left-[-20px] top-1/2 transform -translate-y-1/2 p-3 rounded-full text-2xl hover:scale-110 transition ${isBeginning ? 'text-[#f2eddc]' : 'text-[#fecb02] hover:text-3xl'}`}
        >
          ❮
        </button>
        <button
          className={`custom-next absolute right-[-20px] top-1/2 transform -translate-y-1/2 p-3 rounded-full text-2xl hover:scale-110 transition ${isEnd ? 'text-[#f2eddc]' : 'text-[#fecb02] hover:text-3xl'}`}
        >
          ❯
        </button>
      </div>
    </div>
  );
};

export default Categories;
