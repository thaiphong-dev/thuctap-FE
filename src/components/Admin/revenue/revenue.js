import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { saveAs } from "file-saver";
import { DOMAIN, USER_LOGIN } from "~/util/setting/config";
import adminApi from "~/api/adminApi";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import axios from "axios";

export default function Revenue() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [listCart, setListCart] = useState();
  const [revenue, setRevenue] = useState();
  const [monthRange, setMonthRange] = useState();
  const user = JSON.parse(localStorage.getItem(USER_LOGIN));

  const handlePrint = async () => {
    const payload = {
      data : monthRange,
      name: user.hoTen
    };
    console.log("payload", payload);
    await axios
      .post(`${DOMAIN}/create-baocao-pdf`, payload)
      .then(() =>
        axios.get(`${DOMAIN}/get-baocao-pdf`, { responseType: "blob" })
      )
      .then((res) => {
        const pdfBlob = new Blob([res.data], { type: "application/pdf" });

        saveAs(pdfBlob, "baocaodoanhthu.pdf");
      });
  };

  useEffect(() => {
    let listMonth = [];
    let month = 0;
    if (endDate.getMonth() > startDate.getMonth()) {
      month =
        12 * (endDate.getFullYear() - startDate.getFullYear()) +
        (endDate.getMonth() - startDate.getMonth());
    } else {
      month =
        12 * (endDate.getFullYear() - startDate.getFullYear()) -
        (startDate.getMonth() - endDate.getMonth());
    }
    let count = startDate.getMonth();
    let year = startDate.getFullYear();
    for (let i = 0; i <= month; ++i) {
      if (count <= 12) {
        let price = 0;
        let list = revenue?.filter((x) =>new Date(x?.ngayTao).getMonth() === count && new Date(x?.ngayTao).getFullYear() === year );
        list?.forEach((e) => {
          e.detail?.forEach((x) => {
            price += x?.gia * x?.soLuong;
          });
        });
        listMonth.push({
          month: `${count + 1}-${year} `,
          number: list?.length ?? 0,
          price: price,
        });
        ++count;
      }
      if (count % 12 === 0) {
        count = 0;
        year = year + 1;
      }
    }
    setMonthRange(listMonth);
  }, [startDate, endDate]);

  useEffect(() => {
    setRevenue(listCart?.filter((x) => x.trangThai !== 0));
  }, [listCart]);
  const getAllCart = async () => {
    const response = await adminApi
      .getListCartAdmin()
      .then((data) => {
        console.log("cart", data?.data);
        setListCart(data?.data);
      })
      .catch((err) => {
        console.log("err", err.message);
      });
  };
  useEffect(() => {
    getAllCart();
  }, []);
  const addCommas = (num) =>
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const removeNonNumeric = (num) => num.toString().replace(/[^0-9]/g, "");
  return (
    <>
      <div className="container-fluid">
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            {/* Begin Page Content */}
            <div className="container-fluid">
              {/* Page Heading */}
              <h1 className="h3 mb-2 text-gray-800">Quản Lý Doanh thu</h1>
              {/* DataTales Example */}
              <div className="shadow mb-4 d-flex">
                <div className="card-header py-3 ">
                  <h6 className="m-0 font-weight-bold text-primary">
                    Từ
                    <DatePicker
                     selected={startDate}
                     onChange={(date) => setStartDate(date)}
                     dateFormat="MM/yyyy"
                     showMonthYearPicker
                    />
                    {/* <Button variant="success" onClick={handleShow} style={{ position: "absolute", top: "8px", right: "10px" }}>Thêm Đơn hàng Mới</Button> */}
                  </h6>
                </div>
                <div className="card-header py-3 ">
                  <h6 className="m-0 font-weight-bold text-primary">
                    Đến
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      dateFormat="MM/yyyy"
                      showMonthYearPicker
                    />
                    {/* <Button variant="success" onClick={handleShow} style={{ position: "absolute", top: "8px", right: "10px" }}>Thêm Đơn hàng Mới</Button> */}
                  </h6>
                </div>

                <div className="card-body"></div>
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
                        <th>Tháng</th>
                        <th>Số đơn</th>
                        <th>Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthRange?.map((x) => (
                        <tr>
                          <td>{x.month}</td>
                          <td>{x.number}</td>
                          <td>{addCommas(removeNonNumeric(x.price))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
              <Button
                type="submit"
                onClick={() => handlePrint()}
                variant="success"
                style={{ marginTop: "15px", float: "right" }}
              >
                In báo cáo doanh thu
              </Button>
            </div>
            {/* /.container-fluid */}
          </div>
        </div>
      </div>
    </>
  );
}
