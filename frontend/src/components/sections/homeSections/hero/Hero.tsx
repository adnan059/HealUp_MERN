import heroImg from "@/assets/images/heroImg.jpg";

const Hero = () => {
  return (
    <section id="home" className="hero">
      <div className="sectionContainer">
        <div className="heroTextContent">
          <h1 className="heroTitle">
            Healthcare Made <span>Simple & Accessible</span>
          </h1>
          <h2 className="heroSubtitle">
            Find trusted doctors and schedule visits in minutes.
          </h2>
          <button></button>
        </div>
        <div className="heroImageContainer">
          <img className="heroImg" src={heroImg} alt="" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
