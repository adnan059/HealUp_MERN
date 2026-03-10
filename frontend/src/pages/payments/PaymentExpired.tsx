import { Link } from "react-router-dom";

const PaymentExpired = () => {
  return (
    <section className="payment">
      <div className="sectionContainer">
        <div className="paymentContent">
          <h1>Payment Session Expired !!!</h1>
          <span>⚠️</span>
          <p>Please, Book Another Appointment Some Times Later</p>
          <Link to={"/"}>Go Back to Home Page</Link>
        </div>
      </div>
    </section>
  );
};

export default PaymentExpired;
