import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { USER_LOGIN } from "~/util/setting/config";

export default function Cart() {
  const addCommas = (num) =>
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const removeNonNumeric = (num) => num.toString().replace(/[^0-9]/g, "");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { carts } = useSelector((state) => state.CartReducer);
  const handleNumber = (id, boolean) => {
    console.log("id", id, boolean);
    dispatch({
      type: "TANG_GIAM",
      id,
      boolean,
    });
  };
  const deleteCart = (num) => {
    dispatch({
      type: "DELETE_CART",
      num,
    });
  };

  const handleChange = (id, e) => {
    // const id = parseInt(idSelect)
    const value = parseInt(e.target.value);
    console.log("e.target.value", value, id);

    dispatch({
      type: "ADD_SIZE",
      id,
      value,
    });
  };
  const userLogin = JSON.parse(localStorage.getItem(USER_LOGIN));
  const handleClick = () => {
    if(userLogin !== null)
    navigate("/checkout");
    else 
    {
      localStorage.setItem("nextPage", "checkout")
      navigate("/login");
    }

  };
  useEffect(() => {
    // window.scrollTo(0, 0)
  }, []);

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
                <span className="breadcrumb-item active">Giỏ hàng</span>
              </nav>
            </div>
          </div>
        </div>
        {/* Breadcrumb End */}
        {/* Cart Start */}
        <div className="container-fluid">
          <div className="row px-xl-5">
            <div className="col-lg-8 table-responsive mb-5">
              <table className="table table-light table-borderless table-hover text-center mb-0">
                <thead className="thead-dark">
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Giá</th>
                    <th>Size</th>
                    <th>Chọn Lại Size</th>
                    <th>Số lượng</th>
                    <th>Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="align-middle">
                  {carts?.map((cart, index) => {
                    console.log("loop", cart);
                    return (
                      <tr key={index}>
                        <td className="align-middle">
                          <img
                            src={cart.hinhAnh}
                            alt="true"
                            style={{ width: 50 }}
                          />{" "}
                          {cart.tenSP}
                        </td>
                        <td className="align-middle">{addCommas(removeNonNumeric(cart?.discount > 0 ? cart.discount : cart?.gia))}</td>
                        <td className="align-middle">{cart?.sizeName}</td>
                        <td className="form-group">
                          <select
                            onChange={(e) => handleChange(cart.id, e)}
                            className="form-control"
                          >
                            <option id={cart.id} value={1}>
                              S
                            </option>
                            <option id={cart.id} value={2}>
                              M
                            </option>
                            <option id={cart.id} value={3}>
                              L
                            </option>
                            <option id={cart.id} value={4}>
                              XL
                            </option>
                            <option id={cart.id} value={5}>
                              XXL
                            </option>
                          </select>
                        </td>
                        <td className="align-middle">
                          <div
                            className="input-group quantity mx-auto"
                            style={{ width: 100 }}
                          >
                            <div className="input-group-btn">
                              <button
                                onClick={() => handleNumber(cart.id, false)}
                                className="btn btn-sm btn-primary btn-minus"
                              >
                                <i className="fa fa-minus" />
                              </button>
                            </div>
                            <p
                              className="form-control form-control-sm bg-secondary border-0 text-center"
                              style={{
                                color: "white",
                                fontWeight: "bold",
                                fontSize: "14px",
                              }}
                            >
                              {cart.number}
                            </p>
                            <div className="input-group-btn">
                              <button
                                onClick={() => handleNumber(cart.id, true)}
                                className="btn btn-sm btn-primary btn-plus"
                              >
                                <i className="fa fa-plus" />
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="align-middle">
                          {addCommas(removeNonNumeric(cart?.discount > 0 ? cart.discount * cart?.number : cart?.gia  * cart?.number))}
                        </td>
                        <td className="align-middle">
                          <button
                            onClick={() => deleteCart(cart.id)}
                            className="btn btn-sm btn-danger"
                          >
                            <i className="fa fa-times" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="col-lg-4">
              {/* <form className="mb-30">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control border-0 p-4"
                    placeholder="Coupon Code"
                  />
                  <div className="input-group-append">
                    <button className="btn btn-primary">
                      Nhập mã khuyễn mãi
                    </button>
                  </div>
                </div>
              </form> */}
              <h5 className="section-title position-relative text-uppercase mb-3">
                <span className="bg-secondary pr-3">Tổng hóa đơn</span>
              </h5>
              <div className="bg-light p-30 mb-5">
                <div className="border-bottom pb-2">
                  <div className="d-flex justify-content-between mb-3">
                    <h6>Tổng tiền thanh toán</h6>
                    <h6>
                      {carts.reduce((total, item) => {
                        total = parseInt(total.toString().replaceAll(",", "")) +  (item?.discount > 0 ? item.discount * item?.number : item?.gia * item?.number)
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
                        total = parseInt(total.toString().replaceAll(",", "")) +  (item?.discount > 0 ? item.discount * item?.number : item?.gia * item?.number)
                        return addCommas(removeNonNumeric(total));
                      }, 0)}
                    </h5>
                  </div>
                  <button
                    onClick={() => handleClick()}
                    className="btn btn-block btn-primary font-weight-bold my-3 py-3"
                  >
                    Thanh toán
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Cart End */}
      </div>
    </Fragment>
  );
}
