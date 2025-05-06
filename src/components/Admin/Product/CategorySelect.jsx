import { useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { getAll } from '../../../services/category-service/category-service';

const CategorySelect = () => {
    const [categories, setCategories] = useState([]);
    const [displayedCategories, setDisplayedCategories] = useState([]);
    const [searchCate, setSearchCate] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 20;
    const { values, setFieldValue } = useFormikContext();
    useEffect(() => {
        const filtered = categories.filter(cat =>
            cat?.label?.toLowerCase().includes(searchCate.toLowerCase())
        );
        setDisplayedCategories(filtered.slice(0, page * pageSize));
    }, [searchCate, page, categories]);

    const handleScroll = (e) => {
        const bottom =
            e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (bottom) setPage(prev => prev + 1);
    };

    const handleSearchCate = (inputValue) => {
        setSearchCate(inputValue);
        setPage(1);
    };

    const getAllCategories = async () => {
        const list = await getAll({});
        const mapped = list.map((cat) => ({
            value: cat.id,
            label: cat.name,
        }));
        setCategories(mapped);
    }

    useEffect(() => {
        getAllCategories();
    }, []);

    return (
        <Select
            name="categoryId"
            value={displayedCategories.find(c => c.value === values.categoryId) || null}
            options={categories}
            onInputChange={handleSearchCate}
            onMenuScrollToBottom={handleScroll}
            onChange={(option) => setFieldValue("categoryId", option?.value)}
            placeholder="Select category..."
            isClearable
        />
    );
};

export default CategorySelect;
