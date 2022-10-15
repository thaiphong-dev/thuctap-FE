import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import cartApi from "~/api/cartApi";
import ProductsApi from "~/api/productsApi";
import { USER_LOGIN } from "~/util/setting/config";

export default function CartManager() {
  const addCommas = (num) =>
    num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const removeNonNumeric = (num) => num.toString().replace(/[^0-9]/g, "");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { carts } = useSelector((state) => state.CartReducer);
  const mappingSize = {
    1: "S",
    2: "M",
    3: "L",
    4: "XL",
    5: "XXL",
  };
  const mappingStatus = {
    0: "Chờ duyệt",
    1: "Đang giao",
    2: "Đã giao",
    3: "Đã hủy",
    4: "Tất cả",
  };
  const STATUS = [
    {
      label: "Tất cả",
      value: 4,
    },
    {
      label: "Chờ duyệt",
      value: 0,
    },
    {
      label: "Đang giao",
      value: 1,
    },
    {
      label: "Đã giao",
      value: 2,
    },
    {
      label: "Đã hủy",
      value: 3,
    },
  ];
  const handleNumber = (id, boolean) => {

    dispatch({
      type: "TANG_GIAM",
      id,
      boolean,
    });
  };
  const [listCart, setListCart] = useState();
  const [listProduct, setListProduct] = useState();
  const [listCartsRender, setListCartRender] = useState()
  const userLogin = JSON.parse(localStorage.getItem(USER_LOGIN));
  useEffect(() => {
    setListCartRender(listCart)

  }, [listCart]);
  const [statusValue, setStatusValue] = useState("5");
  const handleClick = (e) => {
    let value = e.target.value
    if(value !== "5"){
      setListCartRender(listCart.filter( x => x.trangThai == value))
    }
    else 
    setListCartRender(listCart)

    setStatusValue(e.target.value);
  };

  const getProduct = async () => {
    const response = await ProductsApi.getAllProduct();

    setListProduct(response.data);
  };
  const getCartList = async () => {
    console.log("userLogin", userLogin);
    const res = await cartApi.getListCart(userLogin.maKH);
    setListCart(res.data);
  };
  useEffect(() => {
    // window.scrollTo(0, 0)

    getProduct();
    getCartList();
  }, []);

  useEffect(() => {
    if (listProduct?.length > 0 && listCart?.length > 0) {
      let list = listCart;

      for (let i = 0; i < listProduct?.length; ++i) {
        for (let j = 0; j < listProduct[i].detail.length; ++j) {
          for (let k = 0; k < list.length; ++k) {
            for (let l = 0; l < list[k].detail.length; ++l) {
              if (
                list[k].detail[l].maCTSP === listProduct[i].detail[j].maCTSP
              ) {
                list[k].detail[l].hinhAnh = listProduct[i].hinhAnh;
                list[k].detail[l].tenSP = listProduct[i].tenSP;
                list[k].detail[l].maSize = listProduct[i].detail[j].maSize;
              }
            }
          }
        }
      }
    }
  }, [listProduct, listCart]);
  return (
    <Fragment>
      <div>
        {/* Breadcrumb Start */}
        <div className="container-fluid">
          <div className="row px-xl-5">
            <div className="col-12">
              <nav className="breadcrumb bg-light mb-30">
                <a className="breadcrumb-item text-dark" href="#">
                  Trang chủ
                </a>
                <a className="breadcrumb-item text-dark" href="#">
                  Cửa hàng
                </a>
                <span className="breadcrumb-item active">Đơn hàng của bạn</span>
              </nav>
            </div>
          </div>
        </div>
        {/* Breadcrumb End */}
        {/* Cart Start */}
        <div className="container-fluid">
          <div className="row ">
            <div className="col-lg-11 table-responsive mb-5">
              <p style={{ marginLeft: "11rem" }}>
                {STATUS.map((x, index) => (
                  <button
                    className="btn btn-secondary"
                    style={{ width: "13rem" }}
                    key={index}
                    value={x.value}
                    onClick={handleClick}
                  >
                    {x.label}
                  </button>
                ))}

                {/* <a class="btn btn-primary" data-toggle="collapse" href="#multiCollapseExample1" role="button" aria-expanded="false" aria-controls="multiCollapseExample1">Toggle first element</a>
                <button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#multiCollapseExample2" aria-expanded="false" aria-controls="multiCollapseExample2">Toggle second element</button>
                <button class="btn btn-primary" type="button" data-toggle="collapse" data-target=".multi-collapse" aria-expanded="false" aria-controls="multiCollapseExample1 multiCollapseExample2">Toggle both elements</button> */}
              </p>
              
              {listCartsRender?.map((cart, index) => {
                console.log("cart", cart);
                let giaTong = 0
                return (
                  <>
                    <p style={{ textAlign: "right" }}>
                      {mappingStatus[cart.trangThai]}
                    </p>
                    <table
                      key={index}
                      className="table table-light text-center mb-0"
                      style={{marginLeft: "6rem"}}
                    >
                      <th>Sản phẩm</th>
                      <th>Giá</th>
                      <th>size</th>
                      <th>Số lượng</th>
                      <th>thành tiền</th>
                      {cart.detail.map((item, index) => {
                        giaTong += parseInt(item?.gia * item?.soLuong)
                        return (
                          <tbody className="align">
                            <tr className="border">
                              <td className="align-middle" style={{width: "30rem", textAlign: "left"}}>
                                <img
                                  src={item.hinhAnh}
                                  alt={item.hinhAnh} 
                                  style={{ width: 70 }}
                                />{" "}
                                {item.tenSP}
                              </td>
                              <td className="align-middle">
                              {addCommas(removeNonNumeric(item?.gia))}

                              </td>
                              <td className="align-middle">
                                {mappingSize[item?.maSize]}
                              </td>
                              <td className="align-middle">
                                {addCommas(
                                  removeNonNumeric(item?.soLuong)
                                )}
                              </td>
                              <td className="align-middle" >
                                {addCommas(removeNonNumeric(item?.gia * item?.soLuong))}
                              </td>
                              {/* <td className="align-middle">
                                <button
                                  // onClick={() => deleteCart(cart.id)}
                                  className="btn btn-sm btn-danger"
                                >
                                  <i className="fa fa-times" />
                                </button>
                              </td> */}
                            </tr>
                          </tbody>
                        );
                      })}
                    </table>
                    {/* <div> */}
                    
                    <h4 style={{ textAlign: "right" }}>
                      Tổng tiền:{" "}
                      <span className="text-danger">
                        {addCommas(removeNonNumeric(giaTong))}
                      </span>
                    </h4>
                    {/* </div> */}
                  </>
                );
              })}
              
            </div>
            <div className="col-lg-4"></div>
          </div>
        </div>
        {/* Cart End */}
      </div>
    </Fragment>
  );
}
