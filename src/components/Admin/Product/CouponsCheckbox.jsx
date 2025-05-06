import { useFormikContext } from 'formik';
import AsyncSelect from 'react-select/async';
import { getAll } from '../../../services/coupon-service/coupon-service';
import { useEffect, useRef, useState } from 'react';
import { formatDateTimeLocal } from '../../../lib/format-hepper';

const CouponCheckboxList = () => {
    const { values, setFieldValue } = useFormikContext();
    const [selectedCoupons, setSelectedCoupons] = useState([]);
    const [coupons, setCoupons] = useState([]);

    useEffect(() => {
        setFieldValue('couponIds', selectedCoupons.map((c) => c.value));
    }, [selectedCoupons]);

    useEffect(() => {
        const fetchCoupons = async () => {
            const data = await getAll();
            setCoupons(data);
        };
        fetchCoupons();
    }, [])

    const loadOptions = (inputValue, callback) => {
        const filtered = allCoupons.current.filter(coupon =>
            coupon.name.toLowerCase().includes(inputValue.toLowerCase())
        );

        const options = filtered.map(coupon => ({
            label: `${coupon.name} | From: ${formatDateTimeLocal(coupon.fromDate)} - To: ${formatDateTimeLocal(coupon.toDate)}`,
            value: coupon.id,
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
                    label: `${coupon.name} | From: ${coupon.fromDate ? formatDateTimeLocal(coupon.fromDate): "_"} - To: ${formatDateTimeLocal(coupon.toDate)}`,
                    value: coupon.id,
                }))}
                loadOptions={loadOptions}
                value={selectedCoupons}
                onChange={setSelectedCoupons}
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
