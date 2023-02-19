import _axios from "axios";

const axios = _axios.create({
  baseURL: process.env.NEXT_PUBLIC_ENDPOINT,
  withCredentials: true,
});

export default axios;
