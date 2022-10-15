import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import axios from "axios";
import { DOMAIN, USER_LOGIN } from "~/util/setting/config";
import ReactPayPal from "~/components/PayPal/ReactPayPal";
import cartApi from "~/api/cartApi";
import { useNavigate } from "react-router-dom";
export default function Checkout() {
  const addCommas = (num) =>
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const removeNonNumeric = (num) => num.toString().replace(/[^0-9]/g, "");
  const userLogin = JSON.parse(localStorage.getItem(USER_LOGIN));
  console.log("userLogin", userLogin);
  const dispatch = useDispatch();
  const { carts } = useSelector((state) => state.CartReducer);
  console.log("carts", carts);
  const [payment, setPayment] = useState(false);
  const renderArr = () => {
    const arrProduct = [];
    for (let i = 0; i < carts.length; i++) {
      arrProduct.push({
        number: carts[i].number,
        price: (carts[i]?.discount > 0 ? carts[i].discount : carts[i]?.gia),
        discount: 0,
        maSize: carts[i].size,
        maSP: carts[i].maSP,
        maCTSP: carts[i].maCTSP,
      });
    }
    return arrProduct;
  };
  const [checkout, setCheckout] = React.useState(false);
  const [submitValues, setSubmitValues] = React.useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    console.log("pay", payment);
    const pay = async (values) => {
      await cartApi.createCart(values)
      .then((data) => {

            
              navigate('/cartManager')
              dispatch({
                type: "DONE",
                data
            })
          }).catch((err) => {
              console.log("err", err)
          })
    }
    if (payment) {
      pay(submitValues)
    }
  }, [payment]);
  const formik = useFormik({
    initialValues: {
      maKH: userLogin.maKH,
      fullname: userLogin.hoTen,
      email: userLogin.email,
      phone: userLogin.sdt,
      address: userLogin.diaChi,
      note: "",
      ngayTao: new Date(),
      trangThai: 0,
      maNVGiao: "employee01",
      // "password": "",
      arr: renderArr(),
      payment: 1,
    },
    onSubmit: (values) => {
      console.log("values", values);
      setSubmitValues(values)
      // mở paypal
      if (values.payment === "0") {
        setCheckout(true);
      }
      
      // call api thanh toánP
      // axios({
      //     method: 'post',
      //     url: `${DOMAIN}/orderDetails/postOrder`,
      //     data: values
      // }).then((data) => {
      //     dispatch({
      //         type: "DONE",
      //         data
      //     })
      // }).catch((err) => {
      //     console.log("err", err)
      // })
    },
  });
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
                <span className="breadcrumb-item active">Thanh toán</span>
              </nav>
            </div>
          </div>
        </div>
        {/* Breadcrumb End */}
        {/* Checkout Start */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            formik.handleSubmit(e);
          }}
          className="container-fluid"
        >
          <div className="row px-xl-5">
            <div className="col-lg-7">
              <h5 className="section-title position-relative text-uppercase mb-3">
                <span className="bg-secondary pr-3">Thông tin đơn hàng</span>
              </h5>
              <div className="bg-light p-30 mb-5">
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label>Họ và tên</label>
                    <input
                      value={formik.values.fullname}
                      name="fullname"
                      onChange={formik.handleChange}
                      className="form-control"
                      type="text"
                      placeholder="John"
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label>Email</label>
                    <input
                      value={formik.values.email}
                      name="email"
                      onChange={formik.handleChange}
                      className="form-control"
                      type="text"
                      placeholder="example@email.com"
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label>Số điện thoại</label>
                    <input
                      value={formik.values.phone}
                      name="phone"
                      onChange={formik.handleChange}
                      className="form-control"
                      type="text"
                      placeholder="+123 456 789"
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label>Địa chỉ</label>
                    <input
                      value={formik.values.address}
                      name="address"
                      onChange={formik.handleChange}
                      className="form-control"
                      type="text"
                      placeholder="123 Street"
                    />
                  </div>

                  <div className="col-md-6 form-group">
                    <label>Ghi Chú</label>
                    <input
                      value={formik.values.note}
                      name="note"
                      onChange={formik.handleChange}
                      className="form-control"
                      type="text"
                      placeholder={123}
                      height={90}
                    />
                  </div>
                  <div className="col-md-12">
                    <div className="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="shipto"
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="shipto"
                        data-toggle="collapse"
                        data-target="#shipping-address"
                      >
                        AND Create Account
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="collapse mb-5" id="shipping-address">
                <h5 className="section-title position-relative text-uppercase mb-3">
                  <span className="bg-secondary pr-3">Password</span>
                </h5>
                <div className="bg-light p-30">
                  <div className="row">
                    <div className="col-md-6 form-group">
                      <label>Password</label>
                      <input
                        name="password"
                        onChange={formik.handleChange}
                        className="form-control"
                        type="text"
                        placeholder="John"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <h5 className="section-title position-relative text-uppercase mb-3">
                <span className="bg-secondary pr-3">Tổng hóa đơn</span>
              </h5>
              <div className="bg-light p-30 mb-5">
                <div className="border-bottom">
                  <h6 className="mb-3">
                    Sản phẩm (
                    {carts.reduce((total) => {
                      return (total = total + 1);
                    }, 0)}
                    )
                  </h6>
                  {carts.map((item, index) => {
                    return (
                      <div
                        className="d-flex justify-content-between"
                        key={index}
                      >
                        <p>
                          {index + 1}: {item.tenSP} _Số Lượng : {item.number}{" "}
                          _Size: ( {item.sizeName} )
                        </p>
                        <p>
                          {addCommas(removeNonNumeric((item?.discount > 0 ? item.discount * item?.number : item?.gia * item?.number)))}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <div className="border-bottom pt-3 pb-2">
                  <div className="d-flex justify-content-between mb-3">
                    <h6>Tổng tiền thanh toán</h6>
                    <h6>
                      {carts.reduce((total, item) => {
                        total =
                          parseInt(total.toString().replaceAll(",", "")) +
                          (item?.discount > 0 ? item.discount * item?.number : item?.gia * item?.number);
                        return addCommas(removeNonNumeric(total));
                      }, 0)}
                    </h6>
                  </div>
                </div>
                <div className="pt-2">
                  <div className="d-flex justify-content-between mt-2">
                    <h5>Tổng</h5>
                    <h5>
                      {carts.reduce((total, item) => {
                        total =
                          parseInt(total.toString().replaceAll(",", "")) +
                          (item?.discount > 0 ? item.discount * item?.number : item?.gia * item?.number);
                        return addCommas(removeNonNumeric(total));
                      }, 0)}
                    </h5>
                  </div>
                </div>
              </div>
              <div className="mb-5">
                <h5 className="section-title position-relative text-uppercase mb-3">
                  <span className="bg-secondary pr-3">
                    Phương thức thanh toán
                  </span>
                </h5>
                <div className="bg-light p-30">
                  <div className="form-group">
                    <div className="custom-control custom-radio">
                      <input
                        onChange={formik.handleChange}
                        type="radio"
                        className="custom-control-input"
                        name="payment"
                        id="paypal"
                        value={0}
                      />
                      <label className="custom-control-label" htmlFor="paypal">
                        Paypal
                      </label>
                    </div>  
                  </div>
                  {/* <div className="form-group">
                    <div className="custom-control custom-radio">
                      <input
                        onChange={formik.handleChange}
                        type="radio"
                        className="custom-control-input"
                        name="payment"
                        id="directcheck"
                        value={1}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="directcheck"
                      >
                        Thanh toán khi nhận hàng
                      </label>
                    </div>
                  </div> */}

                  <button
                    type="submit"
                    className="btn btn-block btn-primary font-weight-bold py-3"
                  >
                    Thanh Toán
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
        {/* Checkout End */}
      </div>
      {checkout && (
        <div
          className="payment-div"
          style={{
            position: "absolute",
            top: "50vh",
            left: "80vh",
            background: "black",
            width: "270px",
            height: "320px",
          }}
        >
          <ReactPayPal
            setCheckout={setCheckout}
            setPayment={setPayment}
            arr={formik.values.arr}
          />
        </div>
      )}
    </Fragment>
  );
}
