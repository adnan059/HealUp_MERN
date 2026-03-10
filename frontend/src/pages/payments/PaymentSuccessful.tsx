import { Link } from "react-router-dom";

const PaymentSuccessful = () => {
  return (
    <section className="payment">
      <div className="sectionContainer">
        <div className="paymentContent">
          <h1>Payment Successful !!!</h1>
          <span>🎉</span>
          <Link to={"/"}>Go Back to Home Page</Link>
        </div>
      </div>
    </section>
  );
};

export default PaymentSuccessful;
