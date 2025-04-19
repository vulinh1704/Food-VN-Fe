import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";

const ImageList = [
  { id: 1, img: "https://cdn.vietnambiz.vn/171464876016439296/2021/11/4/photo-1635997963495-16359979637431751850419.jpg" },
  { id: 2, img: "https://www.minimeinsights.com/wp-content/uploads/2022/10/ShopeeFood-Day-October-KV2.jpg" },
  { id: 3, img: "https://vnn-imgs-f.vgcloud.vn/2021/09/10/17/shopeefood-uu-dai-dac-biet-khach-hang-moi-mien-phi-di-cho-dat-do-an.jpg?width=260&s=kGe28aGz0-W991Q8-IQojA" },
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
        width: "50px",
        height: "50px",
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
      <FaChevronLeft style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "30px" }} />
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
        width: "50px",
        height: "50px",
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
      <FaChevronRight style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "30px" }} />
    </div>
  );
};

const Dot = (props) => {
  const { onClick } = props;
  return (
    <div
      style={{
        color: "black"
      }}
      onClick={onClick}
    >
      <GoDotFill style={{ color: "rgba(37, 21, 21, 0.6)", fontSize: "30px" }} />
    </div>
  );
};

const Hero = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />
  };

  return (
    <div className="w-full max-w-8xl mx-auto px-4 sm:px-8 md:px-16 relative container">
      <Slider {...settings}>
        {ImageList.map((item) => (
          <div key={item.id} className="flex justify-center">
            <img
              src={item.img}
              alt={`Slide ${item.id}`}
              className="w-full h-[200px] sm:h-[300px] md:h-[400px] object-cover mx-auto"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Hero;
