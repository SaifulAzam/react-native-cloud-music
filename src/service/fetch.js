import { AsyncStorage } from 'react-native';

// const URL_PREFIX = 'http://192.168.1.3:3000';
const URL_PREFIX = 'http://10.0.1.232:3000';
const SUCCESS_CODE = 200;

function queryParams(params) {
  return Object.keys(params)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join('&');
}

export default function _fetch(url, method) { // eslint-disable-line no-underscore-dangle
  return async data => {
    let completeUrl = URL_PREFIX + url;
    const reqOptions = {
      method
    };

    let userInfo = await AsyncStorage.getItem('USER_INFO');
    userInfo = JSON.parse(userInfo);
    if (userInfo && userInfo.cookie) {
      reqOptions.headers = {
        Cookie: userInfo.cookie
      };
    }

    if (reqOptions.method === 'GET' && data) {
      completeUrl += (completeUrl.indexOf('?') === -1 ? '?' : '&') + queryParams(data);
    } else if (data) {
      reqOptions.body = JSON.stringify(data);
    }

    const res = {};
    try {
      const response = await fetch(completeUrl, reqOptions);
      console.log(response)
      res.status = response.status;
      res.ok = response.ok;
      // res.headers = response.headers;
      if (!res.ok) return Promise.reject(res);
      return response.json()
        .then(josnData => {
          if (res.data.code && res.data.code !== SUCCESS_CODE) {
            return Promise.reject(res.data);
          }
          return josnData;
        });
    } catch (err) {
      return Promise.reject(err)
    }
  };
}
