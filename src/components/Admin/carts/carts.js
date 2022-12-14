import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckSquare,
  faPenToSquare,
  faPrint,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";
import { Formik, useFormik } from "formik";
import * as yup from "yup";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import AdminApi from "~/api/adminApi";
import ProductsApi from "~/api/productsApi";
import { USER_LOGIN } from "~/util/setting/config";
import adminApi from "~/api/adminApi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {saveAs} from "file-saver"
import { DOMAIN } from '~/util/setting/config'

let giaTong = 0;
let cartinfo = [];
export default function Carts() {
  const [startDate, setStartDate] = useState(new Date());
  const [listCart, setListCart] = useState([]);
  const [listCartsRender, setListCartRender] = useState([]);

  const [cate, setCate] = useState([]);
  const [statusCart, setStatusCart] = useState(5);
  const [maNVDuyet, setMaNVDuyet] = useState(null);
  const [infoCart, setInfoCart] = useState();
  const [nvDuyet, setNvDuyet] = useState([]);
  const [nvGiao, setNvGiao] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [refresh, setRefresh] = useState(false);
  const [show1, setShow1] = useState(false);
  const handleShow1 = (item) => {
    // getInfoCart(item);
    setInfoCart(item);
    cartinfo = item;
    giaTong = 0;
    setShow1(true);
  };

  const handlePrint = async (item) => {
    const payload = {
      
      ...item
      
    }

    console.log("hoa dơn", payload);
    await axios.post(`${DOMAIN}/create-hoadon-pdf`, payload)
    .then(() => axios.get(`${DOMAIN}/get-hoadon-pdf`, {responseType: "blob"}))
    .then((res) => {
      const pdfBlob = new Blob([res.data], {type: "application/pdf"});
      
      saveAs(pdfBlob, "hoadon.pdf")

    })
  }
  const handleClose1 = () => {
    cartinfo = [];
    setShow1(false);
  };
  const user = JSON.parse(localStorage.getItem(USER_LOGIN));
  console.log("user", user);
  const [maNVGiao, setMaNVGiao] = useState()
  const handlecart = async (item) => {
    var targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 5);

    if (item.trangThai === 0) {
      const payload = {
        trangThai: 1,
        idGio: item.idGio,
        maNVGiao: maNVGiao,
        maNVDuyet: user.maNV,
        ngayGiao: targetDate,
      };
      let res = await adminApi.duyetDonHang(payload);
      if (res) {
        setShow1(false);
        setRefresh(!refresh);
      }
    }  else if(item.trangThai === 1) {
      const payload = {
        trangThai: 2,
        idGio: item.idGio,
        maNVGiao: maNVGiao,
        maNVDuyet: user.maNV,
        ngayGiao: targetDate,
      }
      let res = await adminApi.huyDonHang(payload);
      if (res) {
        setShow1(false);
        setRefresh(!refresh);
      }
    
    }
       else {
      const payload = {
        trangThai: 3,
        idGio: item.idGio,
        maNVGiao: maNVGiao,
        maNVDuyet: user.maNV,
        ngayGiao: targetDate,
      };
      let res = await adminApi.huyDonHang(payload);
      if (res) {
        setShow1(false);
        setRefresh(!refresh);
      }
    }
  };
  const getAllCart = async () => {
    const response = await AdminApi.getListCartAdmin()
      .then((data) => {
        console.log("cart", data?.data);
        if(user.maQuyen !== 1) {
        setListCart(data?.data?.filter(x => x.maNVGiao === user.maNV && (x.trangThai === 1 || x.trangThai === 2 )));

        }
        else
        setListCart(data?.data);
      })
      .catch((err) => {
        console.log("err", err.message);
      });
  };

  const getAllEmployee = async () => {
    const response = await AdminApi.getListEmployee()
      .then((data) => {
        setNvDuyet(data?.data?.filter(x => x?.maQuyen !==4 ));
        setNvGiao(data?.data?.filter(x => x?.maQuyen == 3 ));
        setMaNVGiao(data?.data.filter(x => x?.maQuyen == 3 )?.[0]?.maNV)
      })
      .catch((err) => {
        console.log("err", err.message);
      });
  };

  const getInfoCart = async (maSP) => {
    console.log(maSP);
    // await CartsApi.getCartDetail({ maSP: maSP })
    // .then((data) => {
    //     setInfoCart(data.data[0])
    //     console.log("infoCart",infoCart)
    // }).catch((err) => {
    //     console.log("err")
    // })
  };

  const activateCart = async (maSP) => {
    const response = await axios({
      method: "post",
      url: `http://localhost:3001/cart/activate`,
      data: {
        maSP: maSP,
      },
    })
      .then((data) => {
        getAllCart();
      })
      .catch((err) => {
        console.log("err");
      });
  };

  const formatPrice = (price) => {
    return Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  useEffect(() => {
    setListCartRender(listCart);
  }, [listCart]);

  useEffect(() => {
    getAllCart();
    getProduct();
    getAllEmployee();
  }, [refresh]);
  const [listProduct, setListProduct] = useState();
  const getProduct = async () => {
    const response = await ProductsApi.getAllProduct();

    setListProduct(response.data);
  };
  useEffect(() => {
    if (listProduct?.length > 0 && listCart?.length > 0) {
      let list = listCart;

      for (let i = 0; i < listProduct?.length; ++i) {
        for (let j = 0; j < listProduct[i].ctGioHangs?.length; ++j) {
          for (let k = 0; k < list.length; ++k) {
            for (let l = 0; l < list[k].ctGioHangs?.length; ++l) {
              if (
                list[k].ctGioHangs[l].maCTSP === listProduct[i].ctGioHangs?.[j].maCTSP
              ) {
                list[k].ctGioHangs[l].hinhAnh = listProduct[i].hinhAnh;
                list[k].ctGioHangs[l].tenSP = listProduct[i].tenSP;
                list[k].ctGioHangs[l].maSize = listProduct[i].ctGioHangs?.[j].maSize;
              }
            }
          }
        }
      }
    }
  }, [listProduct, listCart]);

  const [renderList, setRenderList] = useState();
  const filter = () => {
    console.log("statusCart", statusCart);
    if (statusCart !== "5") {
      setListCartRender(listCart.filter((x) => x.trangThai == statusCart));
    } else setListCartRender(listCart);
  };
  useEffect(() => {
    filter();
  }, [statusCart]);

  useEffect(() => {
    console.log("render", renderList);
  }, [renderList]);
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

  const formik = useFormik({
    initialValues: {
      tenSP: "",
      maTL: "",
      hinhAnh: "",
      maNV: "",

      SLSizeS: null,
      SLSizeM: null,
      SLSizeL: null,
      SLSizeXL: null,
      SLSizeXXL: null,

      giaSizeS: null,
      giaSizeM: null,
      giaSizeL: null,
      giaSizeXL: null,
      giaSizeXXL: null,

      moTa: "Không có mô tả.",
    },
    onSubmit: (values) => {
      var index = cate.map((item) => item.tenTL).indexOf(`${values.maTL}`);
      if (index === -1) {
        alert("Vui Lòng Chọn Thể Loại !!!");
      } else {
        values.maTL = cate[index].maTL;
        axios({
          method: "post",
          url: `http://localhost:3001/cart/add`,
          data: values,
        })
          .then((data) => {
            handleClose();
            getAllCart();
            formik.resetForm();
          })
          .catch((err) => {
            console.log("err", err);
          });
      }
    },
  });
  const layTenNV = (maNV) => {
    let employee = nvDuyet?.find((x) => x?.maNV == maNV);
    return employee?.hoTen ?? "";
  };
  const mappingSize = {
    1: "S",
    2: "M",
    3: "L",
    4: "XL",
    5: "XXL",
  };
  const addCommas = (num) =>
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const removeNonNumeric = (num) => num.toString().replace(/[^0-9]/g, "");

  function formattedDate(d = new Date()) {
    return [d?.getDate(), d?.getMonth()+1, d?.getFullYear()]
        .map(n => n < 10 ? `0${n}` : `${n}`).join('/');
  }


  return (
    <>
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          {/* Begin Page Content */}
          <div className="container-fluid">
            {/* Page Heading */}
            <h1 className="h3 mb-2 text-gray-800">Quản Lý Đơn hàng</h1>
            {/* DataTales Example */}
            <div className="card shadow mb-4">
              <div className="card-header py-3 ">
                <h6 className="m-0 font-weight-bold text-primary">
                  {" "}
                  Trạng thái
                  <Form.Select
                    onChange={(e) => setStatusCart(e.target.value)}
                    name="status"
                    style={{ width: "300px", marginLeft: "1rem" }}
                  >
                    {STATUS.map((x, index) => (
                      <option key={index} value={x.value}>
                        {x.label}
                      </option>
                    ))}
                  </Form.Select>
                  {/* <Button variant="success" onClick={handleShow} style={{ position: "absolute", top: "8px", right: "10px" }}>Thêm Đơn hàng Mới</Button> */}
                </h6>
              </div>

              <div className="card-body">
                <div className="table-responsive">
                  <Table
                    striped
                    bordered
                    hover
                    className="table table-bordered"
                    id="dataTable"
                    width="100%"
                    cellSpacing={0}
                    style={{ color: "black", textAlign: "center" }}
                  >
                    <thead>
                      <tr>
                        <th>Mã đơn hàng</th>
                        <th>Ngày tạo</th>
                        <th>Ngày giao</th>
                        <th>Trạng thái</th>
                        <th>Nhân viên duyệt</th>
                        <th>Nhân viên giao</th>
                        <th>Hóa đơn</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {listCartsRender?.map((item, index) => {
                        console.log("item", item);
                        return (
                          <tr key={index}>
                            <td>{item.idGio}</td>
                            <td>
                              {formattedDate(new Date(item.ngayTao))}
                            </td>
                            <td>
                              {user?.maQuyen !== 1 ? <>
                                {formattedDate(new Date(item.ngayGiao))}
                              </>: 
                              <DatePicker
                              dateFormat="dd/MM/yyyy"
                              selected={item.ngayGiao ? new Date(item.ngayGiao) : startDate}
                              minDate={new Date()}
                              onChange={(date) => setStartDate(date)}
                            />
                              }
                              
                              {/* {item.ngayGiao?.substring(0, 10).substring(0, 10)} */}
                            </td>
                            <td>{mappingStatus[item.trangThai]}</td>
                            <td>{layTenNV(item.maNVDuyet)}</td>
                            <td>

                              {item.trangThai === 0 ? <Form.Select
                                onChange={(e) => setMaNVGiao(e.target.value)}
                                name="status"
                                style={{ width: "200px", marginLeft: "1rem" }}
                              >
                                
                                {nvGiao?.map((x, index) => (
                                  <option key={index} value={x.maNV}>
                                    {x.hoTen}
                                  </option>
                                ))}
                              </Form.Select> : <>{layTenNV(item?.maNVGiao)}</>}
                              
                              {/* {layTenNV(item.maNVGiao)} */}
                            </td>
                            <td>
                              {item.trangThai !== 0 && item.trangThai !== 3 && <button
                                onClick={() => handlePrint(item)}
                                style={{ marginRight: "10px" }}
                              >
                                <FontAwesomeIcon
                                  icon={faPrint}
                                  style={{ color: "green", cursor: "pointer" }}
                                />
                              </button> }
                              
                            </td>
                            <td>
                              <button
                                onClick={() => handleShow1(item)}
                                style={{ marginRight: "10px" }}
                              >
                                <FontAwesomeIcon
                                  icon={faPenToSquare}
                                  style={{ color: "green", cursor: "pointer" }}
                                />
                              </button>
                              {user?.maQuyen === 1 && 
                              <button
                                onClick={() => handleShow1(item)}
                                style={{ marginRight: "10px" }}
                              >
                               
                                <FontAwesomeIcon
                                  icon={faCheckSquare}
                                  style={{ color: "green", cursor: "pointer" }}
                                />
                              </button>}

                              {/* <button ><FontAwesomeIcon icon={faTrash} style={{ color: "red", cursor: "pointer" }} /></button></> */}
                              {/* <Button variant="success" onClick={() => activateCart(`${item.maSP}`)}>Bán Lại</Button> */}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
          {/* /.container-fluid */}
        </div>
      </div>

      <Modal show={show1} onHide={handleClose1} size={"xl"} fullscreen={true}>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết Đơn hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            onSubmit={(values) => {
              if (typeof values.maTL === "string") {
                var index = cate
                  .map((item) => item.tenTL)
                  .indexOf(`${values.maTL}`);
                values.maTL = cate[index].maTL;
              }

              axios({
                method: "post",
                url: `http://localhost:3001/cart/edit`,
                data: values,
              })
                .then((data) => {
                  handleClose1();
                  getAllCart();
                })
                .catch((err) => {
                  console.log("err", err);
                });
            }}
            enableReinitialize={true}
            initialValues={{}}
          >
            {({
              handleSubmit,
              handleChange,

              values,
              touched,
              isValid,
              errors,
            }) => (
              <Form
                onSubmit={handleSubmit}
                style={{ color: "black", fontSize: "18px" }}
              >
                <>
                <div className="bg-light p-30 mb-5">
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label>Họ và tên</label>
                    <input
                      disabled
                      value={infoCart?.hoTen}
                      name="hoTen"
                      className="form-control"
                      type="text"
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label>Email</label>
                    <input
                      disabled
                      value={infoCart?.email}
                      name="email"
                      className="form-control"
                      type="text"
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label>Số điện thoại</label>
                    <input
                      disabled
                      value={infoCart.sdt}
                      name="sdt"
                      className="form-control"
                      type="text"
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label>Địa chỉ</label>
                    <input
                      disabled
                      value={"70 Nguyễn Sỹ Sách"}
                      name="diaChi"
                      className="form-control"
                      type="text"
                    />
                  </div>

                  <div className="col-md-6 form-group">
                    <label>Ghi Chú</label>
                    <input
                      disabled
                      value={infoCart.note}
                      name="moTa"
                      className="form-control"
                      type="text"
                      height={90}
                    />
                  </div>
                </div>
              </div>
                  <table className="table table-light text-center mb-0">
                    <th>Sản phẩm</th>
                    <th>Size</th>
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                    {infoCart?.ctGioHangs?.map((item, index) => {
                      giaTong += parseInt(item?.gia * item?.soLuong);
                      return (
                        <tbody key={index} className="align">
                          <tr className="border">
                            <td
                              className="align-middle"
                              style={{ width: "30rem", textAlign: "left"}}
                            >
                              <img
                                src={item.hinhAnh}
                                alt={item.hinhAnh}
                                style={{ width: 70 }}
                              />{" "}
                              {item.tenSP}
                            </td>

                            <td className="align-middle">
                              {mappingSize[item?.maSize]}
                            </td>
                            <td className="align-middle">
                              {addCommas(removeNonNumeric(item?.soLuong))}
                            </td>
                            <td className="align-middle">
                              {addCommas(removeNonNumeric(item?.gia))}
                            </td>
                          </tr>
                        </tbody>
                      );
                    })}
                  </table>
                  <h4 style={{ textAlign: "right" }}>
                    Tổng tiền:{" "}
                    <span className="text-danger">
                      {addCommas(removeNonNumeric(giaTong / 2))}
                    </span>
                  </h4>
                </>
                {cartinfo.trangThai !== 2 && cartinfo.trangThai !== 3 && (
                  <Button
                    // type="submit"
                    onClick={() => handlecart(cartinfo)}
                    variant="success"
                    style={{ marginTop: "15px", float: "right" }}
                  >
                    {cartinfo.trangThai === 1
                      ? "Đã giao hàng"
                      : "Duyệt Đơn hàng"}
                  </Button>
                )}
              </Form>
            )}
          </Formik>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose1}>
            Huỷ
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
