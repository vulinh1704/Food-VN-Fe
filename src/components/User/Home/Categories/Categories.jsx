import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Img1 from "../../../../assets/women/women.png";
import Img2 from "../../../../assets/women/women2.jpg";
import Img3 from "../../../../assets/women/women3.jpg";
import Img4 from "../../../../assets/women/women4.jpg";
import { getAllData } from "../../../../services/category-service/category-service";
import Loading from "../../../Supporter/Loading";

const ProductsData = [
  { id: 1, img: Img1, title: "Men's Fashion" },
  { id: 2, img: Img2, title: "Phones & Accessories" },
  { id: 3, img: Img3, title: "Electronics" },
  { id: 4, img: Img4, title: "Computers & Laptops" },
  { id: 5, img: Img2, title: "Cameras" },
  { id: 6, img: Img1, title: "Watches" },
  { id: 7, img: Img3, title: "Men's Shoes" },
  { id: 8, img: Img4, title: "Home Appliances" },
];

const Categories = () => {
  const swiperRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [isBeginning, setIsBeginning] = useState(true);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getAllCategories = async () => {
    try {
      setIsLoading(true);
      const list = await getAllData();
      setCategories(list);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setIsMounted(true);
    if (swiperRef.current) {
      swiperRef.current.on('slideChange', () => {
        setIsBeginning(swiperRef.current.isBeginning);
        console.log(swiperRef.current.isEnd)
        setIsEnd(swiperRef.current.isEnd);
      });
    }
    getAllCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <Loading size="large" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="text-center mb-10 w-full mx-auto border-b-2 border-[#fecb02] py-2">
        <h1 data-aos="fade-up" className="text-3xl font-bold">
          CATEGORIES
        </h1>
        <p data-aos="fade-up" className="text-sm text-[#fecb02] mt-2">
          Explore our diverse product categories
        </p>
      </div>

      <div data-aos="fade-up" className="relative">
        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
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
          className="!pb-10 !px-2"
        >
          {categories.map((item) => (
            <SwiperSlide key={item.id} className="flex flex-col items-center transition-transform duration-300 hover:scale-105">
              <div className="w-[160px] h-[160px] flex items-center justify-center bg-white shadow-md rounded-lg p-2 border border-gray-100 hover:border-[#fecb02] transition-all duration-300">
                <img src={item.image} alt={item.name} className="max-w-[140px] max-h-[140px] object-contain" />
              </div>
              <h3 className="text-sm font-medium mt-3 text-center">{item.title}</h3>
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          className={`custom-prev absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white shadow-md text-xl hover:scale-110 transition-all ${isBeginning ? 'text-gray-300 cursor-not-allowed' : 'text-[#fecb02] hover:bg-[#fecb02] hover:text-white'}`}
        >
          ❮
        </button>
        <button
          className={`custom-next absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white shadow-md text-xl hover:scale-110 transition-all ${isEnd ? 'text-gray-300 cursor-not-allowed' : 'text-[#fecb02] hover:bg-[#fecb02] hover:text-white'}`}
        >
          ❯
        </button>
      </div>
    </div>
  );
};

export default Categories;
