import React, { useState } from "react";
import axios from "axios";
import styles from "./EditFamilyModel.module.css";

const EditFamilyModal = ({ relation, detail, onClose, onSave }) => {
  const [updatedDetail, setUpdatedDetail] = useState({ ...detail });
  const [selectedImage, setSelectedImage] = useState(null);

  const handleInputChange = (field, value) => {
    setUpdatedDetail((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();

    Object.keys(updatedDetail).forEach((key) => {
      formData.append(key, updatedDetail[key]);
    });

    formData.append("relation", relation);

    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/family-info/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        onSave(); // Trigger re-fetch of family data
        onClose(); // Close modal
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error updating family information:", error);
      alert("Failed to update family information.");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Edit {relation}</h2>

        <div className={styles.formGroup}>
          <label>Name</label>
          <input
            type="text"
            value={updatedDetail.name || ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Date of Birth</label>
          <input
            type="date"
            value={updatedDetail.dob ? updatedDetail.dob.split("T")[0] : ""}
            onChange={(e) => handleInputChange("dob", e.target.value)}
          />
        </div>

        {relation === "Wife" && (
          <div className={styles.formGroup}>
            <label>Anniversary</label>
            <input
              type="date"
              value={updatedDetail.anniversary || ""}
              onChange={(e) => handleInputChange("anniversary", e.target.value)}
            />
          </div>
        )}

        <div className={styles.formGroup}>
          <label>Image</label>
          <input type="file" onChange={handleImageChange} />
        </div>

        <div className={styles.buttonGroup}>
          <button className={styles.saveButton} onClick={handleSave}>
            Save
          </button>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditFamilyModal;
