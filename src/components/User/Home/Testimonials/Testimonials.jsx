import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import StarRating from "../../../Supporter/StarRating";
import { getLatestEvaluations } from "../../../../services/evaluation-service/evaluation-service";
import { parseToVietnamTime } from "../../../../lib/format-hepper";

const UserAvatar = ({ user }) => {
  if (user.avatar) {
    return (
      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#fecb02]">
        <img 
          src={user.avatar} 
          alt={`${user.firstName || ''} ${user.lastName || ''}`}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-medium border-2 border-[#fecb02]">
      <span className="text-lg">
        {user.username?.[0]?.toUpperCase() || 'U'}
      </span>
    </div>
  );
};

const UserInfo = ({ user }) => {
  return (
    <div>
      <p className="text-base text-gray-800 font-semibold">
        {user.username}
      </p>
      {user.email && (
        <p className="text-sm text-gray-500">
          {user.email}
        </p>
      )}
    </div>
  );
};

const NoData = () => (
  <div className="flex flex-col items-center justify-center py-10 bg-gray-50 rounded-xl">
    <div className="text-6xl mb-4">🤔</div>
    <h3 className="text-xl font-semibold text-gray-700 mb-2">Chưa có đánh giá nào</h3>
    <p className="text-gray-500">Hãy là người đầu tiên chia sẻ trải nghiệm của bạn!</p>
  </div>
);

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const params = {
          size: 10,
          sortBy: "createdAt",
          sortDirection: "desc"
        };
        const data = await getLatestEvaluations(params);
        setTestimonials(data || []);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: false,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 10000,
        settings: {
          slidesToShow: Math.min(3, testimonials.length),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, testimonials.length),
          slidesToScroll: 1,
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
    <div className="w-full bg-gray-50 py-12">
      {/* header section */}
      <div className="text-center mb-12 w-full mx-auto border-b-2 border-[#fecb02] pb-4 max-w-7xl">
        <h1 data-aos="fade-up" className="text-4xl font-bold text-gray-800">
          TESTIMONIALS
        </h1>
        <p data-aos="fade-up" className="text-lg text-[#fecb02] mt-3 font-medium">
          What our customers say about us
        </p>
      </div>

      {/* Testimonial cards */}
      <div data-aos="zoom-in" className="px-4 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#fecb02] border-t-transparent"></div>
          </div>
        ) : testimonials.length === 0 ? (
          <NoData />
        ) : (
          <Slider {...settings}>
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="px-4 py-2">
                <div className="bg-white rounded-xl shadow-lg p-6 relative hover:shadow-xl transition-shadow duration-300 min-h-[280px]">
                  <div className="flex items-start gap-4">
                    <UserAvatar user={testimonial.user} />
                    <div className="flex-1">
                      <UserInfo user={testimonial.user} />
                      <div className="mb-4 mt-2">
                        <StarRating rating={testimonial.score} />
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
                        {testimonial.comment}
                      </p>
                      {testimonial.images && (
                        <div className="flex gap-2 mt-4">
                          {JSON.parse(testimonial.images).map((image, idx) => (
                            <img
                              key={idx}
                              src={image}
                              alt={`Review image ${idx + 1}`}
                              className="w-16 h-16 object-cover rounded-md border border-gray-200 hover:scale-105 transition-transform duration-300"
                            />
                          ))}
                        </div>
                      )}
                      <p className="text-gray-400 text-xs mt-4">
                        {parseToVietnamTime(testimonial.createdAt)}
                      </p>
                    </div>
                  </div>
                  <p className="text-[#fecb02]/20 text-7xl font-serif absolute top-2 right-4 select-none">
                    ,,
                  </p>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
};

export default Testimonials;
