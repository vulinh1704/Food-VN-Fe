import React from "react";
import Slider from "react-slick";
import StarRating from "../../../Supporter/StarRating";

const TestimonialData = [
  {
    id: 1,
    name: "John Smith",
    text: "Amazing food delivery service! The quality and taste of the food exceeded my expectations. Will definitely order again!",
    img: "https://picsum.photos/101/101",
  },
  {
    id: 2,
    name: "Emma Wilson",
    text: "Fast delivery and excellent customer service. The app is very user-friendly and the food selection is great!",
    img: "https://picsum.photos/102/102",
  },
  {
    id: 3,
    name: "Michael Brown",
    text: "I love the variety of restaurants available. The prices are reasonable and the delivery is always on time.",
    img: "https://picsum.photos/104/104",
  },
  {
    id: 4,
    name: "Sarah Davis",
    text: "Best food delivery service I've used! The food arrives hot and fresh every time. Highly recommended!",
    img: "https://picsum.photos/103/103",
  },
];

const Testimonials = () => {
  var settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",
    pauseOnHover: true,
    pauseOnFocus: true,
    responsive: [
      {
        breakpoint: 10000,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="w-full">
      {/* header section */}
      <div className="text-center mb-10 w-full mx-auto border-b-2 border-[#fecb02] py-2">
        <h1 data-aos="fade-up" className="text-3xl font-bold">
          TESTIMONIALS
        </h1>
        <p data-aos="fade-up" className="text-sm text-[#fecb02] mt-2">
          What our customers say about us
        </p>
      </div>

      {/* Testimonial cards */}
      <div data-aos="zoom-in" className="px-2">
        <Slider {...settings}>
          {TestimonialData.map((data) => (
            <div key={data.id} className="px-4 py-2">
              <div className="bg-white rounded-xl shadow-md p-6 relative hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start gap-4">
                  <img
                    src={data.img}
                    alt=""
                    className="rounded-full w-16 h-16 object-cover border-2 border-[#fecb02]"
                  />
                  <div className="flex-1">
                    <h1 className="text-lg font-bold text-gray-800 mb-2">
                      {data.name}
                    </h1>
                    <div className="mb-3">
                      <StarRating rating={4} />
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {data.text}
                    </p>
                  </div>
                </div>
                <p className="text-[#fecb02]/20 text-6xl font-serif absolute top-2 right-4">
                  ,,
                </p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Testimonials;
