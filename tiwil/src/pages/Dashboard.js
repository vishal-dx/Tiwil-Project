import React, { useEffect, useState } from "react";
import styles from "../styles/Dashboard.module.css";
import axios from "axios";
import Navbar from "../components/navbar/Navbar";
import { FaHeart, FaRegHeart, FaSearch, FaFilter } from "react-icons/fa"; // Import icons
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate()
  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/events`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          const flatEvents = Object.entries(response.data.data).flatMap(([_, value]) =>
            Array.isArray(value) ? value : [value]
          );
          const eventsWithFavorites = flatEvents.map(event => ({ ...event, isFavorite: false }));
          setEvents(eventsWithFavorites);
          setFilteredEvents(eventsWithFavorites); // Initialize filtered events
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const toggleFavorite = (index) => {
    setFilteredEvents((prevEvents) => {
      const updatedEvents = [...prevEvents];
      updatedEvents[index].isFavorite = !updatedEvents[index].isFavorite;
      return updatedEvents;
    });
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = events.filter((event) =>
      event.name.toLowerCase().includes(query) || event.date.includes(query)
    );
    setFilteredEvents(filtered);
  };



  return (
    <div className={styles.dashboard}>
      <Navbar />
      <div className={styles.container}>

        {/* Search Bar and Filter Icon */}
        <div className={styles.searchBar}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search events by name or date..."
            value={searchQuery}
            onChange={handleSearch}
            />
          <FaFilter className={styles.filterIcon} onClick={() => alert("Filter feature coming soon!")} />
        </div>
        <div className={styles.tabContainer}>
          <button className={styles.activeTab}>Events</button>
          <button>Invitations</button>
          <button>Chat</button>
        </div>

        <div className={styles.eventGrid}>
          {filteredEvents.map((event, index) => (
            <EventCard
              key={index}
              event={event}
              toggleFavorite={() => toggleFavorite(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const EventCard = ({ event, toggleFavorite }) => {
  return (
    <div className={styles.eventCard}>
      <div className={styles.imageWrapper}>
        <img
          src={`${process.env.REACT_APP_BASE_URL}/${event.image}`}
          alt={event.name}
          className={styles.eventImage}
          onError={(e) => (e.target.src = `${process.env.PUBLIC_URL}/ProfilDefaulticon`)} // Fallback for missing images
        />
        <div className={styles.favoriteIcon} onClick={toggleFavorite}>
          {event.isFavorite ? <FaHeart className={styles.heartFilled} /> : <FaRegHeart className={styles.heartEmpty} />}
        </div>
      </div>
      <div className={styles.eventDetails}>
        <h3>{event.name}</h3>
        <p className={styles.date}>📅 {new Date(event.date).toLocaleDateString()}</p>
        <div className={styles.plnbox} >
        <button className={styles.planButton} >🎉 Plan Celebration</button>
        <span className={styles.relationTag}>{event.relation}</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
