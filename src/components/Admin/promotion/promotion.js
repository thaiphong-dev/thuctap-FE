import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";
import { Formik, useFormik } from "formik";
import * as yup from "yup";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import ProductsApi from "~/api/productsApi";
import adminApi from "~/api/adminApi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import { USER_LOGIN } from "~/util/setting/config";
import { useNavigate } from "react-router-dom";

export default function Promotion() {
  const user = JSON.parse(localStorage.getItem(USER_LOGIN));

  const [listPromotion, setListPromotion] = useState([]);
  const [nameCategory, setNameCategory] = useState();
  const [products, setProducts] = useState([]);
  const [productList, setProductList] = useState([]);
  const [promotion, setPromotion] = useState([]);
  const [productListMore, setProductListMore] = useState([]);
  const [statusProduct, setStatusProduct] = useState("1");
  const [infoProduct, setInfoProduct] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState();
  const [show, setShow] = useState(false);
  // const [promotion, setpromotion] = useState();

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const addCommas = (num) =>
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const removeNonNumeric = (num) => num.toString().replace(/[^0-9]/g, "");

  const [productOptions, setProductptions] = useState([]);
  const handleAddProduct = async () => {
    const payload = {
      maKM: idPromo,
      phanTramGiam: 10,
      dssp: productListMore,
    };
    console.log("product");

    await adminApi.themSanPhamKM(payload);
  };
  const phanTramGiam = [
    { label: "5", value: 5 },
    { label: "10", value: 10 },
    { label: "15", value: 15 },
    { label: "20", value: 20 },
  ];
  const [idPromo, setIdPromo] = useState();
  const [promo, setPromo] = useState();
  const [promotionDetail, setPromotionDetail] = useState([]);
  const [show1, setShow1] = useState(false);
  const handleShow1 = (item) => {
    setIdPromo(item.maKM);
    setPromo(item?.ctkhuyenMais[0]?.phanTramGiam);
    let list = [];
    for (let i = 0; i < products?.length; ++i) {
      for (let j = 0; j < item.ctkhuyenMais?.length; ++j) {
        if (products[i].ctkhuyenMais[0].maCTSP === item.ctkhuyenMais[j].maCTSP) {
          list.push(products[i]);
        }
      }
    }

    setPromotionDetail(list);
    setShow1(true);

    let list1 = products;
    for (let i = 0; i < list.length; i++) {
      list1 = list1.filter((x) => x.maSP !== list[i].maSP);
    }
    setProductptions(list1);
  };
  const handleClose1 = () => {
    setShow1(false);
    setPromotionDetail([]);
  };

  const [minDate, setMinDate] = useState();
  const [nvDuyet, setNvDuyet] = useState([]);

  const getAllPromotion = async () => {
    const response = await adminApi
      .layDsKhuyenMai()
      .then((data) => {
        setStartDate(new Date(data?.data[0].ngayKetThuc));
        setMinDate(new Date(data?.data[0].ngayKetThuc));
        setListPromotion(data?.data);
      })
      .catch((err) => {
        console.log("err", err.message);
      });
  };

  const getAllEmployee = async () => {
    const response = await adminApi
      .getListEmployee()
      .then((data) => {
        setNvDuyet(data?.data.nvDuyet);
      })
      .catch((err) => {
        console.log("err", err.message);
      });
  };

  const getProduct = async () => {
    const response = await ProductsApi.getAllProduct().then((data) => {
      let list = data?.data?.map((x) => ({
        ...x,
        label: x.tenSP,
        value: x.maSP,
      }));
      setProducts(list);
    });
  };
  const navigate = useNavigate();

  useEffect(() => {
    getAllPromotion();
    getAllEmployee();
    getProduct();
  }, [listPromotion?.length, show]);
  const [des, setDes] = useState();
  const formik = useFormik({
    initialValues: {},
    onSubmit: () => {
      const payload = {
        ngayApDung: startDate,
        ngayKetThuc: endDate,
        dssp: productList,
        moTa: des,
        maNV: user.maNV,
        phanTramGiam: promotion,
      };
      adminApi.taoKhuyenMai(payload);
      console.log("user", user);

      setShow(false);
      setStartDate(new Date());
      setEndDate(new Date());
      getAllPromotion();
    },
  });

  const layTenNV = (maNV) => {
    let employee = nvDuyet?.find((x) => x?.ctkhuyenMais[0]?.maNV == maNV);
    return employee?.ctkhuyenMais[0]?.hoTen ?? "";
  };

  function formattedDate(d = new Date()) {
    return [d?.getDate(), d?.getMonth() + 1, d?.getFullYear()]
      .map((n) => (n < 10 ? `0${n}` : `${n}`))
      .join("/");
  }
  const [field, setField] = useState([]);
  return (
    <>
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          {/* Begin Page Content */}
          <div className="container-fluid">
            {/* Page Heading */}
            <h1 className="h3 mb-2 text-gray-800">Quản Lý khuyến mãi</h1>
            {/* DataTales Example */}
            <div className="card shadow mb-4">
              <div className="card-header py-3" style={{ marginBottom: "5px" }}>
                <h6 className="m-0 font-weight-bold text-primary">
                  <Button
                    variant="success"
                    onClick={handleShow}
                    style={{ float: "right" }}
                  >
                    Thêm khuyến mãi Mới
                  </Button>
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
                    style={{ color: "black" }}
                  >
                    <thead>
                      <tr>
                        <th>Mã khuyến mãi</th>
                        <th>Nhân viên tạo</th>
                        <th>Ngày bắt đầu</th>
                        <th>Ngày kết thúc</th>
                        <th>Phần trăm giảm</th>
                        <th>Mô tả</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {listPromotion?.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>{item.maKM}</td>
                            <td>{layTenNV(item.maNV)}</td>
                            <td>{formattedDate(new Date(item.ngayApDung))}</td>
                            <td>{formattedDate(new Date(item.ngayKetThuc))}</td>
                            <td>{item?.ctkhuyenMais[0]?.phanTramGiam}</td>
                            <td>{item.mota}</td>
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
      <Modal show={show} onHide={handleClose} size={"xl"} fullscreen={true}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm khuyến mãi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* style={{ color: "black", fontSize: "18px" }} */}
          <form
            onSubmit={formik.handleSubmit}
            style={{ color: "black", fontSize: "18px" }}
          >
            <Row>
              <Col>
                <Form.Label>Ngày bắt đầu</Form.Label>
                <DatePicker
                  name="startDate"
                  dateFormat="dd/MM/yyyy"
                  selected={startDate}
                  minDate={minDate}
                  //   onChange={(date) => setStartDate(date)}
                  onChange={(date) => {
                    setStartDate(date);
                  }}
                />
              </Col>
              <Col>
                <Form.Label>Ngày kết thúc</Form.Label>
                <DatePicker
                  selected={endDate ?? startDate}
                  name="endDate"
                  dateFormat="dd/MM/yyyy"
                  minDate={startDate}
                  //   onChange={(date) => setStartDate(date)}
                  onChange={(date) => {
                    setEndDate(date);
                  }}
                />
              </Col>
              <Col>
                <Form.Label>Loại sản Phẩm</Form.Label>
                <Select
                  isMulti
                  options={products}
                  onChange={(e) => setProductList(e)}
                ></Select>
              </Col>
              <Col>
                <Form.Label>Phần trăm giảm</Form.Label>
                <Select
                  
                  options={phanTramGiam}
                  onChange={(e) =>{ setPromotion(e.value)}}
                ></Select>
              </Col>
              <Col>
                <Form.Label>Mô Tả</Form.Label>
                <Form.Control
                  name="moTa"
                  onChange={(e) => setDes(e.target.value)}
                  as="textarea"
                  aria-label="With textarea"
                />
              </Col>
            </Row>

            <Button type="submit" style={{ marginTop: "2rem", float: "right" }}>
              Thêm khuyến mãi
            </Button>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Huỷ
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={show1} onHide={handleClose1} size={"xl"} fullscreen={true}>
        <Modal.Header closeButton>
          <Modal.Title>Sản phẩm trong đợt khuyến mãi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <Form.Label>Loại sản Phẩm</Form.Label>
              <Select
                isMulti
                options={productOptions}
                onChange={(e) => setProductListMore(e)}
              ></Select>
            </Col>
          </Row>

          <Button
            style={{ marginTop: "2rem", float: "right" }}
            variant="success"
            onClick={handleAddProduct}
          >
            Thêm sản phẩm khuyến mãi
          </Button>
          <Formik>
            {({ handleSubmit }) => (
              <Form
                onSubmit={handleSubmit}
                style={{ color: "black", fontSize: "18px" }}
              >
                <table className="table table-light text-center mb-0">
                  <th>Sản phẩm </th>
                  <th>Phần trăm giảm</th>

                  {promotionDetail?.map((item, index) => {
                    console.log("item", item);
                    return (
                      <tbody key={index} className="align">
                        <tr className="border">
                          <td
                            className="align-middle"
                            style={{ width: "30rem", textAlign: "left" }}
                          >
                            <img
                              src={item.hinhAnh}
                              alt={item.hinhAnh}
                              style={{ width: 70 }}
                            />
                            {item.tenSP}
                          </td>
                          <td  className="align-middle"
                            >{promo}</td>
                        </tr>
                      </tbody>
                    );
                  })}
                </table>
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
