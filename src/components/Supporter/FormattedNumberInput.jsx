
import { useField, useFormikContext } from "formik";
import { formatNumberWithDots, unFormatNumber } from "../../lib/format-hepper";

export const FormattedNumberInput = ({ name, placeholder }) => {
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();

  const handleChange = (e) => {
    const rawValue = unFormatNumber(e.target.value);
    setFieldValue(name, rawValue);
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        value={formatNumberWithDots(field.value)}
        onChange={handleChange}
        onBlur={field.onBlur}
        className="border border-gray-300 p-2 rounded text-sm w-full dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:border-[#fecb02]"
      />
      {meta.touched && meta.error && (
        <p className="text-red-500 text-xs mt-1">{meta.error}</p>
      )}
    </div>
  );
};
