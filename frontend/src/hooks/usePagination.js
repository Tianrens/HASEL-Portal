import { useEffect, useState } from 'react';
import { authRequest } from './util/authRequest';

export default function usePagination(baseUrl, initialState = null, numPerPage = 10) {
    const [data, setData] = useState(initialState);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            await authRequest(`${baseUrl}?limit=${numPerPage}&page=${page}`, 'GET')
                .then((response) => {
                    setData(response.data);
                    setTotal(response.data.count);
                })
                .catch((err) => {
                    console.log(`GET ERROR: ${err.message}`);
                });
            setLoading(false);
        }
        fetchData();
    }, [baseUrl, page, numPerPage]);

    return {
        data,
        isLoading,
        page,
        total,
        setPage,
    };
}
