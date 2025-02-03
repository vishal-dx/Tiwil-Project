import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import styles from "../styles/Home.module.css";

function Home() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const messages = [
    "Add & Organize Events and Celebrate Moments, Together.",
    "Send invites to friends and family, making every celebration more meaningful.",
    "Create wishlists, view friends' wishes, and mark gifts for purchase.",
    "Join forces with friends to pool money for expensive gifts and make someone's day even more special.",
  ];

  const images = [
    `${process.env.PUBLIC_URL}/assets/Group 38375.png`,
    `${process.env.PUBLIC_URL}/assets/Group 38375 (1).png`,
    `${process.env.PUBLIC_URL}/assets/Group 38375 (2).png`,
    `${process.env.PUBLIC_URL}/assets/Group 38375 (3).png`,
  ];

  // Automatically change slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleProgressClick = (index) => {
    setCurrentMessageIndex(index);
  };

  return (
    <div className={styles.container}>
      <Navbar />

      {/* Hero Section with Carousel Effect */}
      <div className={styles.hero}>
        <div className={styles.carouselContainer}>
          <div
            className={styles.carouselSlide}
            style={{ transform: `translateX(-${currentMessageIndex * 100}%)` }}
          >
            {images.map((image, index) => (
              <div key={index} className={styles.slide}>
                <img src={image} alt={`Slide ${index + 1}`} className={styles.heroImage} />
                <p className={styles.text}>{messages[index]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className={styles.progressBoxContainer}>
        {messages.map((_, index) => (
          <div
            key={index}
            className={`${styles.progressBox} ${currentMessageIndex === index ? styles.active : ""}`}
            onClick={() => handleProgressClick(index)}
          />
        ))}
      </div>

      <Footer />
    </div>
  );
}

export default Home;
