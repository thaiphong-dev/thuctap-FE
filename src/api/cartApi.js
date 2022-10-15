import axiosClient from "./axiosClient";
const cartApi = {
  createCart: (param) => {
    const url = "/cart";
    return axiosClient.post(url, param);
  },
  getListCart: (param) => {
    const url = `/cart/${param}`;
    return axiosClient.get(url, { param });
  },
  getCartByID: (id) => {
    const url = `/cart/${id}`;
    return axiosClient.get(url);
  },
  getCartByUserID: (id) => {
    const url = `/cart/get-by-userId/${id}`;
    return axiosClient.get(url);
  },
  updateCartByID: (id, param) => {
    const url = `/cart/${id}`;
    return axiosClient.post(url, { param });
  },

};

export default cartApi;
