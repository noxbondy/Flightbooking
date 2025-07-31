import React, { useState, useEffect } from "react";
import '../Styles/SliderBanner.css' // Custom CSS if needed


const slides = [
  {
    image: "/banner.jpg",
    quote: "Book your Flight .",
  },
  {
    image: "/banner2.jpg",
    quote: "Secure. Fast. Reliable.",
  },
  {
    image: "/banner3.jpg",
    quote: "Low Price and Flexible.",
  },
];
const SliderBanner = () => {
  
 const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000); // auto slide every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => setCurrent(index);
  return (
    <div className="banner-container">
      <div
        className="slide"
        style={{ backgroundImage: `url(${slides[current].image})` }}
      >
        <div className="quote-box">
          <p>“{slides[current].quote}”</p>
        </div>
        <div className="nav-dots">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`dot ${current === index ? "active" : ""}`}
              onClick={() => goToSlide(index)}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SliderBanner;