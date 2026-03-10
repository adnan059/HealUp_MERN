import { Link } from "react-router-dom";

const PaymentCancelled = () => {
  return (
    <section className="payment">
      <div className="sectionContainer">
        <div className="paymentContent">
          <h1>Payment Cancelled !!!</h1>
          <span>❌</span>
          <p>Please, Book Another Appointment Some times Later</p>
          <Link to={"/"}>Go Back to Home Page</Link>
        </div>
      </div>
    </section>
  );
};

export default PaymentCancelled;
