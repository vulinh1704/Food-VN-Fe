import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAllByOrderId } from '../../services/order-service/order-service';
const OrderContext = createContext({});

export const OrderProvider = ({ children }) => {
    const [card, setCard] = useState(null);
    const [totalDetail, setTotalDetail] = useState(0);

    const value = {
        card,
        setCard,
        totalDetail,
        setTotalDetail
    };

    const getTotal = async () => {
        let data = await getAllByOrderId(card.id);
        const cartMap = new Map();
        data.forEach(item => {
            const product = item.product;
            const productId = product.id;
            if (!cartMap.has(productId)) {
                cartMap.set(productId, {
                    productId: product.id
                });
            }
        });
        const cartItems = Array.from(cartMap.values());
        setTotalDetail(cartItems.length);
    }

    useEffect(() => {
        if (card) getTotal();
    }, [card])

    return (
        <OrderContext.Provider value={value}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrder = () => {
    return useContext(OrderContext);
};