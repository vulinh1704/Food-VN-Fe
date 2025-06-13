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
import { getProductEvaluations, isEvaluated } from "../../../services/evaluation-service/evaluation-service";
import { addOrderDetail, getAllByOrderId, getCard, submitOrder } from "../../../services/order-service/order-service";
import EvaluationForm from "./EvaluationForm";
import { useNotificationPortal } from "../../Supporter/NotificationPortal";
import { NotificationType } from "../../Supporter/Notification";
import { useOrder } from "../../../providers/users/OrderProvider";
import { useUser } from "../../../providers/users/UserProvider";
import { getAllAddress } from "../../../services/auth-service/auth-service";

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

const LoadingSkeleton = () => {
  return (
    <div className="mx-auto px-4 py-12 grid grid-cols-12 gap-8 bg-white mb-8 container animate-pulse">
      {/* Main Image Skeleton */}
      <div className="col-span-12 md:col-span-6 xl:col-span-5">
        <div className="bg-gray-200 aspect-square rounded-xl"></div>
        <div className="mt-4 grid grid-cols-5 gap-4">
          {[...Array(5)].map((_, idx) => (
            <div key={idx} className="bg-gray-200 aspect-square rounded-lg"></div>
          ))}
        </div>
      </div>

      {/* Product Info Skeleton */}
      <div className="col-span-12 md:col-span-6 xl:col-span-7 space-y-6">
        <div className="h-10 bg-gray-200 rounded-lg w-3/4"></div>
        <div className="flex items-center space-x-6">
          <div className="h-6 bg-gray-200 rounded w-24"></div>
          <div className="h-6 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="w-full p-6 rounded-xl bg-gray-100">
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="flex gap-4">
          <div className="h-12 bg-gray-200 rounded flex-1"></div>
          <div className="h-12 bg-gray-200 rounded flex-1"></div>
        </div>
      </div>

      {/* Description Skeleton */}
      <div className="col-span-12 lg:col-span-8">
        <div className="border rounded-xl p-8 mt-6">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>

      {/* Related Products Skeleton */}
      <div className="col-span-12 lg:col-span-4 mt-6 space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        {[...Array(3)].map((_, idx) => (
          <div key={idx} className="border rounded-xl p-4 flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
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
  const { card, setCard } = useOrder();
  const { user, setAuthPopup, setOrderPopup } = useUser();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [canEvaluate, setCanEvaluate] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const getOne = async () => {
    try {
      setIsLoading(true);
      let data = await getOneById(id);
      setProduct(data);
      if (data?.category?.id) {
        const relatedData = await get20ByCategoryOrNewest({ categoryId: data.category.id });
        setRelatedProducts(relatedData.filter(p => p.id !== data.id).slice(0, 6));
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setIsLoading(false);
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

  const checkEvaluationPermission = async () => {
    if (!user) {
      setCanEvaluate(false);
      return;
    }
    try {
      const hasPermission = await isEvaluated(id);
      setCanEvaluate(hasPermission);
    } catch (error) {
      console.error("Error checking evaluation permission:", error);
      setCanEvaluate(false);
    }
  };

  const getAllAddresses = async () => {
    try {
      const list = await getAllAddress();
      setAddresses(list);
      // Set default address or first address
      const defaultAddress = list.find(addr => addr.default) || list[0];
      setSelectedAddress(defaultAddress);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  useEffect(() => {
    setActive(ACTIVE_VALUE_NAVBAR.FOOD);
    if (id) {
      getOne();
      fetchEvaluations();
      setQuantity(1);
      checkEvaluationPermission();
      getAllAddresses();
    }
  }, [id, user]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const handleEvaluationSubmitted = async () => {
    await fetchEvaluations();
    await checkEvaluationPermission();
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

  const getUserCard = async () => {
    let data = await getCard();
    setCard(data);
  }

  const handleBuyNow = async () => {
    if (!user) {
      setAuthPopup(true);
      return;
    }

    if (!selectedAddress) {
      showNotification(NotificationType.ERROR, "Please add a delivery address first");
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

      // Prepare order data for submission
      let dataOrder = await getAllByOrderId(card.id);
      dataOrder = dataOrder.map(item => {
        item.coupons = JSON.stringify(item.product.coupons);
        return item;
      })

      const orderData = {
        id: card.id,
        userId: card.user.id,
        address: JSON.stringify(selectedAddress),
        orderDetails: dataOrder
      };
      console.log(orderData);
      await submitOrder(orderData);
      await getUserCard();
      showNotification(NotificationType.SUCCESS, "Order placed successfully!");
      navigate("/orders");
    } catch (error) {
      console.log(error);
      showNotification(NotificationType.ERROR, "Failed to process order");
    }
  };

  const isOutOfStock = product?.quantity === 0;

  return (
    product && <div className="mx-auto px-4 py-12 grid grid-cols-12 gap-8 bg-white mb-8 container">
      <NotificationPortal />
      <ImageGallery product={product} />
      {/* Product Info */}
      <div className="col-span-12 md:col-span-6 xl:col-span-7 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {product.name}
        </h1>
        <div className="flex items-center space-x-6 mt-2">
          <div className="flex gap-2 border-r-2 border-gray-200 pr-6">
            <span className="text-lg font-medium border-b-2 border-[#fecb02]">
              {product.score}
            </span>
            <StarRating rating={product.score} />
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-lg font-medium border-b-2 border-[#fecb02]">{evaluations.length}</span>
            <span className="text-gray-600">Reviews</span>
          </div>
        </div>
        <div className="w-full flex items-center bg-gray-50 p-6 rounded-xl shadow-sm">
          <div className="flex-1">
            {product.coupons && product.coupons.length > 0 ? (
              <div>
                <p className="text-gray-400 line-through text-lg">{formatNumberWithDots(product.price)} VNĐ</p>
                <p className="text-red-600 text-4xl font-bold mt-2">
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
              <p className="text-red-600 text-4xl font-bold">{formatNumberWithDots(product.price)} VNĐ</p>
            )}
          </div>
          {product.coupons && product.coupons.length > 0 && (
            <div className="flex flex-col gap-2">
              {product.coupons.map((item, index) => (
                <p key={index} className="rounded-lg bg-red-100 px-4 py-2 text-sm font-semibold text-red-600">
                  -{formatNumberWithDots(item.discount)} {item.type == "percent" ? "%" : "VNĐ"}
                </p>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-gray-600 font-medium min-w-[100px]">Category:</span>
            <span className="text-gray-800 font-semibold">{product.category.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-600 font-medium min-w-[100px]">Availability:</span>
            <span className="text-gray-800 font-semibold">{product.quantity} items</span>
          </div>
        </div>
        <div className="pt-2">
          <p className="text-gray-600 font-medium mb-3">Quantity:</p>
          <div className="flex-1">
            <div className="flex items-center gap-2 border w-[200px] justify-between rounded-lg border-gray-300">
              <button
                className={`border-r px-4 py-3 hover:text-[#fecb02] transition-colors ${(quantity <= 1 || isOutOfStock) ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1 || isOutOfStock}
              >
                -
              </button>
              <span className="font-medium text-lg">{quantity}</span>
              <button
                className={`border-l px-4 py-3 hover:text-[#fecb02] transition-colors ${(quantity >= product.quantity || isOutOfStock) ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= product.quantity || isOutOfStock}
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            className={`flex-1 py-4 text-[#fecb02] font-semibold border-2 border-[#fecb02] bg-white hover:bg-[#fff9e6] transition-colors rounded-lg flex items-center justify-center gap-2 ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            <IoCartOutline className="text-2xl text-[#fecb02]" />
            <span>Add to Cart</span>
          </button>
          <button
            className={`flex-1 py-4 bg-[#fecb02] text-white rounded-lg font-semibold text-base hover:bg-[#e5b700] transition-colors ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleBuyNow}
            disabled={isOutOfStock}
          >
            Buy Now
          </button>
        </div>
        {isOutOfStock && (
          <p className="text-red-500 text-sm mt-2 text-center font-medium">This product is currently out of stock</p>
        )}
      </div>

      {/* Product Description & Review */}
      <div className="col-span-12 lg:col-span-8">
        <div className="border rounded-xl p-8 mt-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">Product Description</h2>
          <div className="prose max-w-none text-base text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description }}></div>
        </div>

        {/* Product Reviews */}
        <div className="border rounded-xl p-8 mt-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">Product Reviews</h2>

          {/* Evaluation Form */}
          {user ? (
            canEvaluate ? (
              <div className="mb-8 border-b pb-8">
                <h3 className="text-xl font-semibold mb-6 text-gray-800">Write Your Review</h3>
                <EvaluationForm productId={id} onEvaluationSubmitted={handleEvaluationSubmitted} />
              </div>
            ) : (
              <div className="mb-8 border-b pb-8">
                <p className="text-center text-gray-500 py-4">
                  You can only review products that you have purchased and received.
                </p>
              </div>
            )
          ) : (
            <div className="mb-8 border-b pb-8">
              <p className="text-center text-gray-500 py-4">
                Please <button onClick={() => setAuthPopup(true)} className="text-[#fecb02] font-medium hover:underline">login</button> to write a review.
              </p>
            </div>
          )}

          {/* Evaluations List */}
          <div className="space-y-8">
            {evaluations.map((evaluation, idx) => (
              <div key={idx} className="border-t pt-6">
                <div className="flex items-start space-x-4">
                  <UserAvatar user={evaluation.user} />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <UserInfo user={evaluation.user} />
                        <div className="flex items-center space-x-3">
                          <div className="flex text-yellow-400">
                            <StarRating rating={evaluation.score} />
                          </div>
                          <span className="text-sm text-gray-500 font-medium">
                            {formatDate(evaluation.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-base mt-4 text-gray-700">{evaluation.comment}</p>
                    {evaluation.images && evaluation.images.length > 0 && (
                      <div className="flex gap-4 mt-4">
                        {JSON.parse(evaluation.images).map((image, imageIdx) => (
                          <img
                            key={imageIdx}
                            src={image}
                            alt={`Review ${idx + 1} image ${imageIdx + 1}`}
                            className="w-24 h-24 object-cover rounded-lg border border-gray-200 hover:border-[#fecb02] transition-colors"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {evaluations.length === 0 && (
              <p className="text-center text-gray-500 py-8 text-lg">
                No reviews yet for this product
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar - Related Products */}
      <div className="col-span-12 lg:col-span-4 mt-6 space-y-4">
        <h3 className="text-xl font-bold mb-6 text-gray-800">Related Products</h3>
        {relatedProducts.map((item) => (
          <div
            key={item.id}
            className="border rounded-xl p-4 bg-white flex items-center space-x-4 cursor-pointer hover:border-[#fecb02] hover:shadow-md transition-all duration-300"
            onClick={() => navigate(`/detail/${item.id}`)}
          >
            <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
              <img src={JSON.parse(item.images)[0]} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold line-clamp-2 mb-1 text-gray-800">{item.name}</h3>
              <div>
                {item.coupons && item.coupons.length > 0 ? (
                  <>
                    <p className="text-gray-400 line-through text-sm">{formatNumberWithDots(item.price)} VNĐ</p>
                    <p className="text-red-600 text-base font-bold">
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
                  <p className="text-red-600 text-base font-bold">{formatNumberWithDots(item.price)} VNĐ</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetail;
