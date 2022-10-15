import React, { useEffect, useState } from "react";
import adminApi from "~/api/adminApi";

let moneya= 1
export default function ReactPayPal(props) {
  const [money, setMoney] = useState(1)
  const layNgoaiTe = async () => {
    let res = await adminApi.layNgoaiTe()
    console.log("res", res);
    setMoney(res?.data?.menhGia)
    moneya = res?.data?.menhGia

  }
  useEffect(() => {
    layNgoaiTe()
  }, []);

  const [paid, setPaid] = React.useState(false);
  const [error, setError] = React.useState(null);
  const paypalRef = React.useRef();
  let sum = 0
  props.arr.forEach(ele => {
    sum +=  ele.price
  });
  // console.log("sum", );
  // To show PayPal buttons once the component loads
  React.useEffect(() => {
    window.paypal
      .Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                description: "Your description",
                amount: {
                  currency_code: "USD",
                  value: parseFloat(((sum)/moneya).toFixed(1)),
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          setPaid(true);
          console.log(order);
        },
        onError: (err) => {
        //   setError(err),
          console.error(err);
        },
      })
      .render(paypalRef.current);
  }, []);

  // If the payment has been made
  if (paid) {
      props.setPayment(true)
      props.setCheckout(false);
    return <div>Thanh toán thành công</div>;
  }

  // If any error occurs
  if (error) {
    return <div>Thanh toán không thành công! Vui lòng thử lại</div>;
  }

  // Default Render
  return (
    <div>
      {/* <h4>Total Amount in Rs. : 500 /-</h4> */}
      <div ref={paypalRef} />
    </div>
  );
}

