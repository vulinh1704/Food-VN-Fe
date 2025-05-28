import { useEffect, useState } from "react";
import { FaExclamationCircle } from "react-icons/fa";
import { formatNumberWithDots, formatVND } from "../../../../lib/format-hepper";
import StarRating from "../../../Supporter/StarRating";
import { Link } from "react-router-dom";
import { getList } from "../../../../services/product-service/product-service";
import { useOrder } from "../../../../providers/users/OrderProvider";
import { useUser } from "../../../../providers/users/UserProvider";
import { addOrderDetail } from "../../../../services/order-service/order-service";

const TopProducts = () => {
  const [products, setProducts] = useState([]);
  const { card } = useOrder();
  const { user, setAuthPopup, setOrderPopup } = useUser();

  const getTopProducts = async () => {
    const params = {
      size: 12
    };
    const data = await getList(params);
    setProducts(data.content);
  }

  const saveOrderDetail = async (product) => {
    if (!user) {
      setAuthPopup(true);
      return;
    }
    let data = {
      orders: {
        id: card.id
      },
      product: {
        id: product.id
      },
      price: product.price,
      quantity: 1
    }
    await addOrderDetail(data);
    setOrderPopup(true);
  }

  useEffect(() => {
    getTopProducts();
  }, [])

  return (
    <div>
      <div className="container">
        {/* Header section */}
        <div className="text-center mb-[110px] w-full mx-auto bg-[#ffffff] border-b-2 border-[#fecb02] py-1">
          <h1 data-aos="fade-up" className="text-2xl font-bold-900">
            BEST FOOD
          </h1>
          <p data-aos="fade-up" className="text-sm text-[#fecb02] py-1">
            We always bring you the highest quality dishes
          </p>
        </div>
        {/* Body section */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 gap-y-20 place-items-center">
          {products.map((data) => (
            <div
              key={data.id}
              data-aos="zoom-in"
              className="rounded-md bg-white relative shadow-xl duration-300 group min-w-full min-h-full hover:border border-[#fecb02]"
            >
              <div className="relative">
                {data.coupons && data.coupons.length > 0 && (
                  <div className="absolute right-2 top-2 flex flex-col gap-1 z-10">
                    {data.coupons.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-md bg-opacity-80 bg-red-500 text-white px-2 py-1 text-xs font-semibold shadow-md"
                      >
                        -{formatNumberWithDots(item.discount)} {item.type === "percent" ? "%" : "VNĐ"}
                      </div>
                    ))}
                  </div>
                )}

                <Link to={"/detail/" + data.id}>
                  <div className="p-4">
                    <div className="relative">
                      <img
                        src={JSON.parse(data.images)[0]}
                        alt={data.name}
                        className="w-full h-[150px] object-contain group-hover:scale-105 duration-300"
                      />
                      {data.quantity == 0 && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-80 text-red-500 px-2 py-1 text-xs font-semibold shadow-md z-20 flex items-center gap-1.5 rounded">
                          <FaExclamationCircle /> SOLD OUT
                        </div>
                      )}
                    </div>
                    <div className="space-y-2 mt-4">
                      <h3 className="font-semibold text-sm text-center line-clamp-2 min-h-[40px]">
                        {data.name}
                      </h3>
                      <div className="text-center min-h-[60px] flex flex-col justify-center">
                        {data.coupons && data.coupons.length > 0 ? (
                          <>
                            <p className="text-gray-400 line-through text-sm mb-1">{formatNumberWithDots(data.price)} VNĐ</p>
                            <p className="text-red-500 font-bold text-base">
                              {formatNumberWithDots(
                                Math.max(
                                  data.coupons.reduce((price, coupon) => {
                                    if (coupon.type === "percent") {
                                      return price - (price * coupon.discount / 100);
                                    }
                                    return price - coupon.discount;
                                  }, data.price),
                                  0
                                )
                              )} VNĐ
                            </p>
                          </>
                        ) : (
                          <p className="text-red-500 font-bold text-base">{formatNumberWithDots(data.price)} VNĐ</p>
                        )}
                      </div>
                      <div className="flex items-center justify-center">
                        <StarRating rating={data.score} />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="p-3 text-center">
                <button
                  className={`w-full border-2 duration-300 text-sm font-sans py-2 px-4 rounded-md tracking-wide ${data.quantity > 0 ? 'text-[#fecb02] border-[#fecb02] hover:scale-105 hover:bg-[#fecb02] hover:text-white' : 'text-gray-400 border-gray-200'}`}
                  onClick={() => { saveOrderDetail(data) }}
                  disabled={data.quantity == 0}
                >
                  {data.quantity > 0 ? "ADD TO CART" : "OUT OF STOCK"}
                </button>
              </div>
            </div>
          ))}

        </div>
        <div className="text-center mt-10">
          <Link
            to={"/foods"}
            className="px-40 py-3 border border-gray-300 text-gray-300 text-2md font-normal rounded-md hover:scale-105 duration-300 hover:border-gray-600 hover:text-gray-600"
          >
            See more ...
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopProducts;