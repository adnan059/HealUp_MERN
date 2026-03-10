import { usePaymentStatus } from "@/hooks/usePaymentStatus";
import Loader from "@/components/shared/Loader";
import { Link } from "react-router-dom";

const PaymentSuccessful = () => {
  const { isLoading } = usePaymentStatus("paid");

  if (isLoading) return <Loader />;

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
