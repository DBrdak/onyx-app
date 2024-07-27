import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import HeroImageBackground from "@/assets/images/hero/hero-bg.png";
import HeroImage from "@/assets/images/hero/hero-img.svg";

const Hero = () => {
  return (
    <div className="lg:max-w-1440px lg:ml-122px container relative z-0 m-0 mx-auto ml-0 mt-28 h-auto max-w-full p-0">
      <div className="grid h-auto grid-cols-1 lg:grid-cols-2">
        <div className="lg:max-w-600px h:auto sm:px-30 flex max-w-full flex-col justify-center px-10 md:pt-10 lg:pl-10 lg:pt-0">
          <h1 className="w-full text-center text-4xl font-bold leading-snug text-foreground sm:mx-auto sm:w-10/12 sm:text-6xl lg:mx-0 lg:w-498px lg:text-left">
            The only budget planner you'll ever need.
          </h1>
          <p className="mt-10 w-full text-center text-foreground sm:mx-auto sm:w-10/12 lg:mx-0 lg:w-386px lg:text-left">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae
            perferendis labore quibusdam mollitia quaerat maiores, iste
            reiciendis laudantium laboriosam eveniet!
          </p>
          <Button
            asChild
            className="mx-auto mt-16 h-16 w-56 rounded-full text-base font-semibold lg:mx-0"
          >
            <Link to="/budget"> Get started </Link>
          </Button>
        </div>
        <div className="relative bottom-0 right-0 flex h-518px w-full items-center justify-center lg:-bottom-20 lg:right-56  lg:w-990px xl:-bottom-24">
          <img
            className="absolute right-0 z-10 w-full sm:-bottom-6 sm:w-auto md:-bottom-28 md:right-0 md:h-680px lg:h-auto xl:w-990px"
            src={HeroImageBackground}
            alt="Hero image background"
          />
          <img
            className="lg:h-400px absolute right-0 z-20 h-full sm:-bottom-8 md:-bottom-28 lg:bottom-24 lg:right-64 xl:bottom-20 xl:right-40"
            src={HeroImage}
            alt="Hero Image"
          />
        </div>
      </div>
    </div>
  );
};
export default Hero;
