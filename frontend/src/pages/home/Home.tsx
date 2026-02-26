import FeaturedDoctors from "@/components/sections/homeSections/featuredDoctors/FeaturedDoctors";
import Hero from "@/components/sections/homeSections/hero/Hero";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedDoctors />
    </div>
  );
};

export default Home;
