import { useFormikContext } from 'formik';
import AsyncSelect from 'react-select/async';
import { getAll } from '../../../services/coupon-service/coupon-service';
import { useEffect, useState } from 'react';
import { formatDateTimeLocal } from '../../../lib/format-hepper';

const CouponCheckboxList = ({ onCouponsChange }) => {
    const { values, setFieldValue } = useFormikContext();
    const [selectedCoupons, setSelectedCoupons] = useState([]);
    const [coupons, setCoupons] = useState([]);

    useEffect(() => {
        const fetchCoupons = async () => {
            const data = await getAll();
            setCoupons(data);

            if (values.couponIds && values.couponIds.length > 0) {
                const matched = data
                    .filter(c => values.couponIds.includes(c.id))
                    .map(c => ({
                        label: `${c.name} | From: ${c.fromDate ? formatDateTimeLocal(c.fromDate) : "_"} - To: ${formatDateTimeLocal(c.toDate)}`,
                        value: c.id,
                        type: c.type,
                        discount: c.discount,
                        name: c.name,
                        fromDate: c.fromDate,
                        toDate: c.toDate,
                        id: c.id
                    }));
                setSelectedCoupons(matched);
                onCouponsChange(matched);
            }
        };
        fetchCoupons();
    }, []);

    const handleCouponChange = (newSelectedCoupons) => {
        setSelectedCoupons(newSelectedCoupons || []);
        setFieldValue('couponIds', (newSelectedCoupons || []).map(c => c.value));
        onCouponsChange(newSelectedCoupons || []);
    };

    const loadOptions = (inputValue, callback) => {
        const filtered = coupons.filter(coupon =>
            coupon.name.toLowerCase().includes(inputValue.toLowerCase())
        );

        const options = filtered.map(coupon => ({
            label: `${coupon.name} | From: ${formatDateTimeLocal(coupon.fromDate)} - To: ${formatDateTimeLocal(coupon.toDate)}`,
            value: coupon.id,
            type: coupon.type,
            discount: coupon.discount,
            name: coupon.name,
            fromDate: coupon.fromDate,
            toDate: coupon.toDate,
            id: coupon.id
        }));

        callback(options);
    };

    return (
        <div>
            <label className="block mb-2 font-medium text-gray-700">Select Coupons</label>
            <AsyncSelect
                isMulti
                cacheOptions
                defaultOptions={coupons.map(coupon => ({
                    label: `${coupon.name} | From: ${coupon.fromDate ? formatDateTimeLocal(coupon.fromDate) : "_"} - To: ${formatDateTimeLocal(coupon.toDate)}`,
                    value: coupon.id,
                    type: coupon.type,
                    discount: coupon.discount,
                    name: coupon.name,
                    fromDate: coupon.fromDate,
                    toDate: coupon.toDate,
                    id: coupon.id
                }))}
                loadOptions={loadOptions}
                value={selectedCoupons}
                onChange={handleCouponChange}
                placeholder="Search coupons..."
            />

            {selectedCoupons.length > 0 && (
                <div className="mt-4">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Selected Coupons:</p>
                    <ul className="list-disc list-inside text-sm text-gray-800">
                        {selectedCoupons.map((c) => (
                            <li key={c.value}>{c.label}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CouponCheckboxList;
