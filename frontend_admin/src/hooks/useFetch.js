import { useState, useEffect } from 'react';
import axios from 'axios';

export const useFetch = (url) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(url)
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [url]);

    return { data, loading };
};
