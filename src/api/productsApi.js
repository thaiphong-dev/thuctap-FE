import axiosClient from "./axiosClient";

const ProductsApi = {
  getAllProduct: (param) => {
    const url = "/products";
    return axiosClient.get(url, { param });
  },
  getHotProduct: (param) => {
    const url = "/hotProducts";
    return axiosClient.get(url, { param });
  },
  getNewProduct: (param) => {
    const url = "/newProducts";
    return axiosClient.get(url, { param });
  },
  getProductType: () => {
    const url = "/productType";
    return axiosClient.get(url);
  },
  filterProduct: (param) => {
    const url = "/products/filter";
    return axiosClient.post(url,  param );
  },
  filterProductbyName: (param) => {
    const url = "/products/filterName";
    return axiosClient.post(url,  param );
  },
  getProductDetail: (param) => {
    const url = "/productdetail";
    return axiosClient.get(url, { param });
  },
  getProductById: (id) => {
    const url = `/product/${id}`;
    return axiosClient.get(url);
  },
};

export default ProductsApi;
