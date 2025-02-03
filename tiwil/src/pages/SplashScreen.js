import React, { useEffect, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useNavigate } from "react-router-dom";
import styles from "../styles/SplashScreen.module.css";

function SplashScreen() {
  const navigate = useNavigate();
  const [showLogo, setShowLogo] = useState(false);

  // Logo Animation: Smooth scale-up with a bounce effect
  const logoAnimation = useSpring({
    opacity: showLogo ? 1 : 0,
    transform: showLogo ? "scale(1)" : "scale(0.5)",
    config: { tension: 200, friction: 10 }, // Bounce effect
  });

  // Background Animation: Soft gradient transition
  const backgroundAnimation = useSpring({
    from: { backgroundPosition: "0% 50%" },
    to: { backgroundPosition: "100% 50%" },
    config: { duration: 2000 },
    loop: true, // Infinite gradient animation
  });

  useEffect(() => {
    setShowLogo(true); // Trigger animation

    // Navigate to Info Screen after 3 seconds
    const timer = setTimeout(() => {
      navigate("/signup");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <animated.div style={backgroundAnimation} className={styles.container}>
      <animated.div style={logoAnimation} className={styles.logo}>
        <img
          src={`${process.env.PUBLIC_URL}/assets/TiwilLOGO 1.png`}
          className={styles.image}
          alt="Logo"
        />
      </animated.div>
    </animated.div>
  );
}

export default SplashScreen;
