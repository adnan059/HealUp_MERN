import { Link } from "react-router-dom";

const PaymentFailed = () => {
  return (
    <section className="payment">
      <div className="sectionContainer">
        <div className="paymentContent">
          <h1>Payment Failed !!!</h1>
          <span>⛔</span>
          <p>Please, Try Again Later</p>
          <Link to={"/"}>Go Back to Home Page</Link>
        </div>
      </div>
    </section>
  );
};

export default PaymentFailed;
