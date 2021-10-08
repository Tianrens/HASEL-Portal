import { useEffect, useState } from 'react';
import { authRequest } from './util/authRequest';

export function useGet(baseUrl, condition=true, requestCallback = () => {}, initialState=null) {
    const [data, setData] = useState(initialState);
    const [isLoading, setLoading] = useState(false);
    const [version, setVersion] = useState(0);

    useEffect(() => {
        setLoading(true);
        async function fetchData() {
            await authRequest(baseUrl, 'GET')
                .then((response) => {
                    setLoading(false);
                    setData(response.data);
                    requestCallback(response.data);
                })
                .catch((err) => {
                    setLoading(false);
                    console.log(`GET ERROR: ${err.message}`);
                });
        }

        if (condition) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [baseUrl, condition, version]);

    function reFetch() {
        setVersion(version + 1);
    }

    return {
        data,
        isLoading,
        reFetch
    };
}
