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

              {data.quantity == 0 && (
                <div className="absolute top-4 left-14 bg-white bg-opacity-70 text-black text-2xs px-2 py-2 text-sm font-bold-300 shadow-md z-10 flex items-center gap-1">
                  <FaExclamationCircle className="text-red-500" /> HẾT HÀNG
                </div>
              )}

              <div className="relative">
                {data.coupons && data.coupons.length > 0 && (
                  <div className="absolute right-2 top-[-38px] flex flex-col gap-1 z-10">
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
              </div>



              {/* image section */}
              <div className="h-[150px]">
                <Link to={"/detail/1"}>
                  <img
                    src={JSON.parse(data.images)[0]}
                    alt=""
                    className="w-[180px] h-[180px] block mx-auto transform -translate-y-10 group-hover:scale-105 duration-300 drop-shadow-md object-contain"
                  />
                </Link>
              </div>
              {/* details section */}
              <div className="p-3 text-center">
                {/* star rating */}
                <div className="w-full flex items-center justify-center gap-1">
                  <StarRating rating={data.score} />
                </div>
                <h1 className="text-md font-bold-500 py-1 line-clamp-1 px-2">{data.name}</h1>
                <p className="text-gray-600 duration-300 text-1/2xl line-clamp-2 py-1/2">
                  {formatVND(data.price)}
                </p>
                <button
                  className={`w-[180px] border-2 duration-300 text-sm font-sans py-2 px-4 rounded-md mt-4 tracking-wide ${data.quantity > 0 ? 'text-[#fecb02] border-[#fecb02] hover:scale-105 hover:text-md' : 'text-gray-400'}`}
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