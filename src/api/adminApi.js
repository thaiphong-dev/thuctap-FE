import axiosClient from "./axiosClient";
const adminApi = {
  // cart
  getListCartAdmin: (param) => {
    const url = `/admin/cart`;
    return axiosClient.get(url, { param });
  },

  // employee
  getListEmployee: (param) => {
    const url = `/admin/employee`
    return axiosClient.get(url)
  },

  duyetDonHang: (param) => {
    const url = `/cart/update`
    return axiosClient.post(url, param)
  },

  huyDonHang: (param) => {
    const url = `/admin/huy`
    return axiosClient.post(url, param)
  },

  layNgoaiTe: (param) => {
    const url = `/ngoaiTe`
    return axiosClient.get(url)
  },

  layDsKhuyenMai: () => {
    const url = `/promotion`
    return axiosClient.get(url)
  },

  taoKhuyenMai: (param) => {
    const url = `/admin/create-promotion`
    return axiosClient.post(url, param)
  },
  themSanPhamKM: (param) => {
    const url = `/admin/add-product-promotion`
    return axiosClient.post(url, param)
  }
//   inBaoCao: (param) {
//     const url = `/ngoaiTe`
    
//   }
  
// };

// axios.post(`${DOMAIN}/create-pdf`, payload)
//     .then(() => axios.get(`${DOMAIN}/get-pdf`, {responseType: "blob"}))
//     .then((res) => {
//       const pdfBlob = new Blob([res.data], {type: "application/pdf"});
      
//       saveAs(pdfBlob, "baocao.pdf")

//     })
  }

export default adminApi;
