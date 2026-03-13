import { usePaymentStatus } from "@/hooks/usePaymentStatus";
import Loader from "@/components/shared/Loader";
import { Link } from "react-router-dom";

const PaymentCancelled = () => {
  const { isLoading } = usePaymentStatus("unpaid");

  if (isLoading) return <Loader />;

  return (
    <section className="payment">
      <div className="sectionContainer">
        <div className="paymentContent">
          <h1>Payment Cancelled !!!</h1>
          <span>❌</span>
          <p>Please try booking another appointment in a few minutes.</p>
          <Link to={"/"}>Go Back to Home Page</Link>
        </div>
      </div>
    </section>
  );
};

export default PaymentCancelled;
