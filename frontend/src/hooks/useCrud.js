import { useEffect, useState } from 'react';
import { authRequest } from './util/authRequest';

export function useCrud(baseUrl, initialState = null, idProp = '_id') {
    const [data, setData] = useState(initialState);
    const [isLoading, setLoading] = useState(false);
    const [version, setVersion] = useState(0);

    useEffect(() => {
        setLoading(true);
        async function fetchData() { 
            await authRequest(baseUrl, 'GET')
                .then(response => {
                    setLoading(false);
                    setData(response.data);
                })
                .catch(err => {
                    setLoading(false);
                    console.log(`GET ERROR: ${err.message}`);
                });
        }
        fetchData();
    }, [baseUrl, version]);

    function reFetch() {
        setVersion(version + 1);
    }

    async function updateDataByReplacement(item) {
        return authRequest(`${baseUrl}/${item[idProp]}`, 'PUT', item)
            .then(() => {
                setData(item);
            })
            .catch(err => {
                console.log(`PUT ERROR: ${err.message}`);
            });
    }

    async function updateDataByModification(item) {
        return authRequest(`${baseUrl}/${item[idProp]}`, 'PATCH', item)
            .then(() => {
                setData(item);
            })
            .catch(err => {
                console.log(`PATCH ERROR: ${err.message}`);
            });
    }

    async function createData(item) {
        return authRequest(baseUrl, 'POST', item)
            .then(response => {
                const newItem = response.data;
                setData(newItem);
            })
            .catch(err => {
                console.log(`POST ERROR: ${err.message}`);
            });
    }

    async function deleteData(id) {
        return authRequest(`${baseUrl}/${id}`, 'DELETE')
            .then(() => {
                setData(data.filter(item => item[idProp] !== id));
            })
            .catch(err => {
                console.log(`DELETE ERROR: ${err.message}`);
            });
    }

    return { data, isLoading, reFetch, updateDataByReplacement, updateDataByModification, createData, deleteData };
}
