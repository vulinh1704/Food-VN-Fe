import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";
import { formatNumberWithDots, formatVND } from "../../../lib/format-hepper";
import StarRating from "../../Supporter/StarRating";
import { IoCartOutline } from "react-icons/io5";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavbar } from "../../../providers/users/NavBarProvider";
import { ACTIVE_VALUE_NAVBAR } from "../../../lib/app-const";
import { useParams, useNavigate } from "react-router-dom";
import { getOneById, get20ByCategoryOrNewest } from "../../../services/product-service/product-service";
import { getProductEvaluations } from "../../../services/evaluation-service/evaluation-service";
import { addOrderDetail } from "../../../services/order-service/order-service";
import EvaluationForm from "./EvaluationForm";
import { useNotificationPortal } from "../../Supporter/NotificationPortal";
import { NotificationType } from "../../Supporter/Notification";
import { useOrder } from "../../../providers/users/OrderProvider";
import { useUser } from "../../../providers/users/UserProvider";

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
const ImageGallery = ({ product }) => {
  const [mainImage, setMainImage] = useState(JSON.parse(product.images)[0]);

  // Reset mainImage when product changes
  useEffect(() => {
    setMainImage(JSON.parse(product.images)[0]);
  }, [product]);

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
          {JSON.parse(product.images).map((src, idx) => (
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

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const UserAvatar = ({ user }) => {
  if (user.avatar) {
    return (
      <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
        <img 
          src={user.avatar} 
          alt={`${user.firstName} ${user.lastName}`}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-medium">
      <span className="text-base">
        {user.firstName?.[0]?.toUpperCase() || user.lastName?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || 'U'}
      </span>
    </div>
  );
};

const UserInfo = ({ user }) => {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');
  
  return (
    <div>
      <p className="text-base text-gray-800 font-medium">
        {fullName}
      </p>
      {user.username && (
        <p className="text-sm text-gray-500">
          @{user.username}
        </p>
      )}
    </div>
  );
};

const ProductDetail = () => {
  const { setActive } = useNavbar();
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [evaluations, setEvaluations] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const { showNotification, NotificationPortal } = useNotificationPortal();
  const { card } = useOrder();
  const { user, setAuthPopup, setOrderPopup } = useUser();
  const [relatedProducts, setRelatedProducts] = useState([]);

  const getOne = async () => {
    let data = await getOneById(id);
    setProduct(data);
    // Fetch related products after getting product details
    if (data?.category?.id) {
      const relatedData = await get20ByCategoryOrNewest({ categoryId: data.category.id });
      // Filter out the current product from related products
      setRelatedProducts(relatedData.filter(p => p.id !== data.id).slice(0, 6));
    }
  }

  const fetchEvaluations = async () => {
    try {
      const data = await getProductEvaluations(id);
      setEvaluations(data);
    } catch (error) {
      console.error("Error fetching evaluations:", error);
    }
  };

  useEffect(() => {
    setActive(ACTIVE_VALUE_NAVBAR.FOOD);
    if (id) {
      getOne();
      fetchEvaluations();
      // Reset quantity when changing product
      setQuantity(1);
    }
  }, [id]); // Add id as dependency to rerender when it changes

  const handleEvaluationSubmitted = () => {
    fetchEvaluations();
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.quantity || 0)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      setAuthPopup(true);
      return;
    }

    try {
      let data = {
        orders: {
          id: card.id
        },
        product: {
          id: product.id
        },
        price: product.price,
        quantity: quantity
      }
      await addOrderDetail(data);
      showNotification(NotificationType.SUCCESS, "Successfully added to cart!");
      setOrderPopup(true);
    } catch (error) {
      showNotification(NotificationType.ERROR, "Failed to add to cart");
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      setAuthPopup(true);
      return;
    }

    try {
      let data = {
        orders: {
          id: card.id
        },
        product: {
          id: product.id
        },
        price: product.price,
        quantity: quantity
      }
      await addOrderDetail(data);
      navigate("/order");
    } catch (error) {
      showNotification(NotificationType.ERROR, "Failed to process order");
    }
  };

  const isOutOfStock = product?.quantity === 0;

  return (
    product && <div className="mx-auto px-4 py-8 grid grid-cols-12 gap-6 bg-white mb-8 container">
      <NotificationPortal />
      <ImageGallery product={product} />
      {/* Product Info */}
      <div className="col-span-12 md:col-span-6 xl:col-span-7">
        <h1 className="text-2xl font-semibold">
          {product.name}
        </h1>
        <div className="flex items-center space-x-4 mt-2">
          <div className="flex gap-2 border-r-2 pr-2">
            <span className="text-[16px] border-b border-black">
              {product.score}
            </span>
            <StarRating rating={product.score} />
          </div>
          <div className="flex gap-2">
            <span className="text-[16px] border-b border-black">{evaluations.length}</span>
            <span>Reviews</span>
          </div>
        </div>
        <div className="w-full flex items-center bg-gray-100 mt-4 p-4 rounded-lg">
          <div className="flex-1">
            {product.coupons && product.coupons.length > 0 ? (
              <div>
                <p className="text-gray-400 line-through text-lg">{formatNumberWithDots(product.price)} VNĐ</p>
                <p className="text-red-600 text-3xl font-semibold mt-1">
                  {formatNumberWithDots(
                    Math.max(
                      product.coupons.reduce((price, coupon) => {
                        if (coupon.type === "percent") {
                          return price - (price * coupon.discount / 100);
                        }
                        return price - coupon.discount;
                      }, product.price),
                      1000
                    )
                  )} VNĐ
                </p>
              </div>
            ) : (
              <p className="text-red-600 text-3xl font-semibold">{formatNumberWithDots(product.price)} VNĐ</p>
            )}
          </div>
          {product.coupons && product.coupons.length > 0 && (
            <div className="flex flex-col gap-2">
              {product.coupons.map((item, index) => (
                <p key={index} className="rounded-md bg-red-100 px-3 py-1 text-sm font-medium text-red-600">
                  -{formatNumberWithDots(item.discount)} {item.type == "percent" ? "%" : "VNĐ"}
                </p>
              ))}
            </div>
          )}
        </div>
        <div className="mt-6">
          <p className="text-gray-700 text-sm mb-2">Options:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
            {['Add Egg', 'Add Noodles', 'Pin', 'Charger'].map((option, idx) => (
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
          <p className="text-gray-700 text-sm mb-2">Category: <span className="text-md">{product.category.name}</span></p>
        </div>
        <div className="mt-6">
          <p className="text-gray-700 text-sm mb-2">Quantity: ({product.quantity} available)</p>
          <div className="flex-1">
            <div className="flex items-center gap-2 border w-[200px] justify-between rounded-sm">
              <button 
                className={`border-r px-3 py-2 hover:text-[#fecb02] ${(quantity <= 1 || isOutOfStock) ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1 || isOutOfStock}
              >
                -
              </button>
              <span>{quantity}</span>
              <button 
                className={`border-l px-3 py-2 hover:text-[#fecb02] ${(quantity >= product.quantity || isOutOfStock) ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= product.quantity || isOutOfStock}
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button 
            className={`w-full text-[#fecb02] font-normal border border-[#fecb02] bg-[#ffffff] hover:bg-[#f9f5e3] flex items-center justify-center gap-1 ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            <IoCartOutline className="text-2xl text-[#fecb02]" />
            <span>Add to Cart</span>
          </button>
          <button 
            className={`w-full bg-[#fecb02] text-white py-4 rounded font-semibold text-sm ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleBuyNow}
            disabled={isOutOfStock}
          >
            Buy Now
          </button>
        </div>
        {isOutOfStock && (
          <p className="text-red-500 text-sm mt-2 text-center">This product is currently out of stock</p>
        )}
      </div>

      {/* Product Description & Review */}
      <div className="col-span-12 lg:col-span-8 bg-white">
        <div className="border rounded p-6 mt-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-4">Product Description</h2>
          <p className="text-base text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description }}></p>
        </div>

        {/* Product Reviews */}
        <div className="bg-white border rounded p-6 mt-4">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-4">Product Reviews</h2>
          
          {/* Evaluation Form */}
          <div className="mb-8 border-b pb-6">
            <h3 className="text-xl font-medium mb-4 text-gray-700">Write Your Review</h3>
            <EvaluationForm productId={id} onEvaluationSubmitted={handleEvaluationSubmitted} />
          </div>

          {/* Evaluations List */}
          <div className="space-y-6">
            {evaluations.map((evaluation, idx) => (
              <div key={idx} className="border-t pt-4">
                <div className="flex items-start space-x-3">
                  <UserAvatar user={evaluation.user} />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <UserInfo user={evaluation.user} />
                        <div className="flex items-center space-x-2">
                          <div className="flex text-yellow-400">
                            <StarRating rating={evaluation.score} />
                          </div>
                          <span className="text-sm text-gray-500">
                            {formatDate(evaluation.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-base mt-3 text-gray-700">{evaluation.comment}</p>
                    {evaluation.images && evaluation.images.length > 0 && (
                      <div className="flex gap-3 mt-3">
                        {JSON.parse(evaluation.images).map((image, imageIdx) => (
                          <img
                            key={imageIdx}
                            src={image}
                            alt={`Review ${idx + 1} image ${imageIdx + 1}`}
                            className="w-24 h-24 object-cover rounded-md border border-gray-300"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {evaluations.length === 0 && (
              <p className="text-center text-gray-500 py-6 text-lg">
                No reviews yet for this product
              </p>
            )}
          </div>
        </div>
      </div>
      {/* Sidebar - Related Products */}
      <div className="col-span-12 lg:col-span-4 mt-6 space-y-4">
        <h3 className="text-lg font-semibold mb-4">Related Products</h3>
        {relatedProducts.map((item) => (
          <div 
            key={item.id} 
            className="border rounded p-3 bg-white flex items-center space-x-3 cursor-pointer hover:border-[#fecb02] transition-all duration-300"
            onClick={() => navigate(`/detail/${item.id}`)}
          >
            <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
              <img src={JSON.parse(item.images)[0]} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold line-clamp-2">{item.name}</h3>
              <div>
                {item.coupons && item.coupons.length > 0 ? (
                  <>
                    <p className="text-gray-400 line-through text-xs">{formatNumberWithDots(item.price)} VNĐ</p>
                    <p className="text-red-600 text-sm font-bold">
                      {formatNumberWithDots(
                        Math.max(
                          item.coupons.reduce((price, coupon) => {
                            if (coupon.type === "percent") {
                              return price - (price * coupon.discount / 100);
                            }
                            return price - coupon.discount;
                          }, item.price),
                          1000
                        )
                      )} VNĐ
                    </p>
                  </>
                ) : (
                  <p className="text-red-600 text-sm font-bold">{formatNumberWithDots(item.price)} VNĐ</p>
                )}
              </div>
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
