import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/FamilyInformation.module.css";
import EditFamilyModal from "../components/editfamily/EditFamilyModal";
import Navbar from "../components/navbar/Navbar";

const FamilyInformation = () => {
  const [familyInfo, setFamilyInfo] = useState(null);
  const [editModal, setEditModal] = useState({
    isOpen: false,
    relation: null,
    detail: null,
  });

  useEffect(() => {
    fetchFamilyInfo(); // Fetch initial data
  }, []);

  const fetchFamilyInfo = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/family-info`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setFamilyInfo(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching family information:", error);
    }
  };

  const handleOpenEditModal = (relation, detail) => {
    setEditModal({ isOpen: true, relation, detail });
  };

  const handleCloseEditModal = () => {
    setEditModal({ isOpen: false, relation: null, detail: null });
  };

  const handleUpdateFamilyInfo = () => {
    fetchFamilyInfo(); // Re-fetch data from API
    handleCloseEditModal();
  };

  if (!familyInfo) {
    return <div className={styles.loader}>Loading family information...</div>;
  }

  return (
    <div className={styles.container}>
      <Navbar />
      <h1 className={styles.header}>View Detail</h1>
      {familyInfo.father && (
        <FamilyCard
          relation="Father"
          detail={familyInfo.father}
          onEdit={() => handleOpenEditModal("Father", familyInfo.father)}
        />
      )}
      {familyInfo.mother && (
        <FamilyCard
          relation="Mother"
          detail={familyInfo.mother}
          onEdit={() => handleOpenEditModal("Mother", familyInfo.mother)}
        />
      )}
      {familyInfo.spouse && (
        <FamilyCard
          relation="Wife"
          detail={familyInfo.spouse}
          onEdit={() => handleOpenEditModal("Spouse", familyInfo.spouse)}
        />
      )}
      {familyInfo.children &&
        familyInfo.children.map((child, index) => (
          <FamilyCard
            key={`Child-${index}`}
            relation={`Child ${index + 1}`}
            detail={child}
            onEdit={() => handleOpenEditModal("Children", child)}
          />
        ))}
      {familyInfo.siblings &&
        familyInfo.siblings.map((sibling, index) => (
          <FamilyCard
            key={`Sibling-${index}`}
            relation={`Sibling ${index + 1}`}
            detail={sibling}
            onEdit={() => handleOpenEditModal("Siblings", sibling)}
          />
        ))}
      <button className={styles.button}>Let's Go</button>

      {editModal.isOpen && (
        <EditFamilyModal
          relation={editModal.relation}
          detail={editModal.detail}
          onClose={handleCloseEditModal}
          onSave={handleUpdateFamilyInfo} // Re-fetch family data after saving
        />
      )}
    </div>
  );
};

const FamilyCard = ({ relation, detail, onEdit }) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2>{relation.toUpperCase()}</h2>
        <button className={styles.menuButton} onClick={onEdit}>
          ⋮
        </button>
      </div>
      <div className={styles.cardBody}>
        <img
          src={
            detail.image
              ? `${process.env.REACT_APP_BASE_URL}/${detail.image}?timestamp=${new Date().getTime()}`
              : `${process.env.PUBLIC_URL}/assets/default-profile.png`
          }
          alt={relation}
          className={styles.image}
        />
        <div className={styles.info}>
          <p>
            <strong>Name:</strong> {detail.name}
          </p>
          <p>
            <strong>Date of Birth:</strong> {new Date(detail.dob).toLocaleDateString() || "Not Provided"}
          </p>
          {detail.anniversary && (
            <p>
              <strong>Anniversary:</strong> {new Date(detail.anniversary).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FamilyInformation;
