import React from 'react';
import styles from '../styles/EventDetail.module.css';
import Navbar from '../components/navbar/Navbar';

const EventDetail = () => {
  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.eventWrapper}>
        <div className={styles.eventImage}>
          <img src="/path/to/image.jpg" alt="Event" />
        </div>
        <div className={styles.eventContent}>
          <h1>Ayushi's 5<sup>th</sup> Birthday</h1>
          <div className={styles.eventTabs}>
            <span className={styles.active}>Details</span>
            <span>Wishlist</span>
            <span>Guests</span>
            <span>History</span>
          </div>
          <div className={styles.eventInfo}>
            <div className={styles.eventDate}>
              <span>📅 25 July, 2024</span>
            </div>
            <div className={styles.eventLocation}>
              <span>📍 Gala Convention Center</span>
              <p>36 Guild Street London, UK</p>
            </div>
          </div>
          <p className={styles.eventDescription}>
            Enjoy your favorite dishes and a lovely evening with friends and family. Food from local food trucks will be available for purchase. <a href="#">Read More...</a>
          </p>
          <button className={styles.saveButton}>Save →</button>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
