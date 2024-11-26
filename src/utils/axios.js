/*eslint-disable*/
import axios from 'axios'; // 引入axios

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */
const BASE_URL = 'http://123.56.230.79:6060';

const NEW_URL = 'http://47.95.192.6:30566/api/sense';

export const concatParams = (params) => {
    if (!params) {
        return '';
    }
    if (Object.keys(params).length === 0) {
        return '';
    }
    let res = '?';
    Object.entries(params).forEach(([key, value]) => {
        if (res !== '?') {
            res = `${res}&`
        }
        res = `${res}${key}=${value}`
    })
    return res;
};
export function get(url, params = {}) {
    return new Promise((resolve, reject) => {
        const regex = /^\/(q|c)\//;
        const _url = regex.test(url) ? NEW_URL + url : url;
        axios
            .get(_url, {
                params,
            })
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
}


export function post(url, data = {}) {
    return new Promise((resolve, reject) => {
        const regex = /^\/(q|c)\//;
        const _url = regex.test(url) ? NEW_URL + url : BASE_URL + url + concatParams(data);
        // axios.post(BASE_URL + url + concatParams(data), data).then(
        axios.post(_url, data).then(
            (response) => {
                resolve(response.data);
            },
            (err) => {
                reject(err);
            }
        ).catch((err) => {
            reject(err);
        });
    });
}
