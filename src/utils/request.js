import axios from "axios";

// create an axios instance
const service = axios.create({});

// 请求拦截器
service.interceptors.request.use();

// 相应拦截器
service.interceptors.response.use();
export default service;
