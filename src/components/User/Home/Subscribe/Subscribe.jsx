import React from "react";
import Banner from "../../../../assets/website/orange-pattern.jpg";

const BannerImg = {
  backgroundImage: `url(${Banner})`,
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  height: "100%",
  width: "100%",
};

const Subscribe = () => {
  return (
    <div
      data-aos="zoom-in"
      className="rounded-2xl overflow-hidden shadow-lg"
      style={BannerImg}
    >
      <div className="backdrop-blur-sm py-16 px-4">
        <div className="space-y-8 max-w-xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white">
            Get Notified About New Products
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <input
              data-aos="fade-up"
              type="email"
              placeholder="Enter your email"
              className="w-full sm:w-2/3 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fecb02]"
            />
            <button className="w-full sm:w-auto px-8 py-3 bg-[#fecb02] text-white rounded-lg hover:bg-[#e5b702] transition-colors duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
