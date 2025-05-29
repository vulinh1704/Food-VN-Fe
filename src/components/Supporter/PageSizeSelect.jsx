import Select from 'react-select';

const pageSizeOptions = [
    { value: 5, label: '5 bản ghi' },
    { value: 10, label: '10 bản ghi' },
    { value: 20, label: '20 bản ghi' },
    { value: 50, label: '50 bản ghi' },
    { value: 100, label: '100 bản ghi' }
];

export const PageSizeSelect = ({ value, onChange }) => {
    const selectedOption = pageSizeOptions.find(option => option.value === value);

    return (
        <div className="w-[150px]">
            <Select
                value={selectedOption}
                onChange={(selected) => onChange?.(selected.value)}
                options={pageSizeOptions}
                styles={{
                    control: (base) => ({
                        ...base,
                        borderRadius: 6,
                        borderColor: "#ccc",
                    }),
                    option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isFocused ? "#f0f0f0" : "white",
                    }),
                }}
                classNamePrefix="react-select"
            />
        </div>
    );
} 