import { IoCartOutline, IoCloseOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { formatVND } from "../../../lib/format-hepper";
import { useEffect, useState } from "react";
import { addOrderDetail, getAllByOrderId, removeOrderDetailByOrderIdAndProductId } from "../../../services/order-service/order-service";
import { useOrder } from "../../../providers/users/OrderProvider";


const Popup = ({ orderPopup, setOrderPopup }) => {
  const [list, setList] = useState([]);
  const { card } = useOrder();
  const [total, setTotal] = useState(0);
  const { setTotalDetail } = useOrder();

  const deleteOrderDetail = async (od) => {
    await removeOrderDetailByOrderIdAndProductId(od.orderId, od.productId);
    await getAll();
  }

  const saveOrderDetail = async (od) => {
    let data = {
      orders: {
        id: od.orderId
      },
      product: {
        id: od.productId
      },
      price: od.price,
      quantity: 1
    }
    await addOrderDetail(data);
    await getAll();
  }

  const getAll = async () => {
    let data = await getAllByOrderId(card.id);
    const cartMap = new Map();
    data.forEach(item => {
      const product = item.product;
      const productId = product.id;
      const firstImage = JSON.parse(product.images)[0];

      if (cartMap.has(productId)) {
        const existing = cartMap.get(productId);
        existing.quantity += item.quantity;
        existing.total = existing.quantity * existing.price;
      } else {
        cartMap.set(productId, {
          productId: product.id,
          orderId: item.orders.id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          total: item.quantity * product.price,
          image: firstImage
        });
      }
    });
    const cartItems = Array.from(cartMap.values());
    setList(cartItems);
    const totalAmount = cartItems.reduce((sum, item) => sum + item.total, 0);
    setTotal(totalAmount);
    setTotalDetail(cartItems.length);
  }

  useEffect(() => {
    if (card) getAll();
  }, [orderPopup])

  return (
    <AnimatePresence>
      {orderPopup && (
        <motion.div
          className="popup"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          <motion.div
            className="h-screen w-screen fixed top-0 left-0 bg-black/50 z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="fixed top-0 right-0 h-screen w-[350px] bg-white shadow-lg z-50"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2 ">
                  <IoCartOutline className="text-4xl text-[#fecb02]" />
                  <h1 className="text-lg font-bold text-[#fecb02]">CART</h1>
                </div>
                <IoCloseOutline
                  className="text-2xl cursor-pointer hover:text-[#fecb02]"
                  onClick={() => setOrderPopup(false)}
                />
              </div>
              <div className="p-4 overflow-y-auto max-h-[70vh]">
                {list.length > 0 ? (
                  list.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 mb-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <h2 className="text-sm font-medium line-clamp-1 py-1">{item.name}</h2>
                        <div className="flex items-center gap-2">
                          <button className="border px-2 py-1 rounded hover:text-[#fecb02]" onClick={() => deleteOrderDetail(item)}>-</button>
                          <span>{item.quantity}</span>
                          <button className="border px-2 py-1 rounded hover:text-[#fecb02]" onClick={() => saveOrderDetail(item)}>+</button>
                        </div>
                      </div>
                      <span className="text-sm font-semibold">{formatVND(item.total)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">Card is empty</p>
                )}
              </div>
              <div className="p-4 border-t">
                <div className="flex justify-between mb-4">
                  <span className="font-semibold">SUBTOTAL:</span>
                  <span className="font-semibold">{formatVND(total)}</span>
                </div>
                <button className="w-full  bg-[#fecb02] text-white py-2 rounded">
                  PAY NOW
                </button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Popup;
