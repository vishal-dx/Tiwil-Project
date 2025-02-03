import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/AddInfomation.module.css";
import axios from "axios";

function AddInformation() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    father: { name: "", dob: "", image: null },
    mother: { name: "", dob: "", image: null },
    parentAnniversary: { date: "", image: null },
    marriageAnniversary: { date: "", image: null },
    spouse: { name: "", dob: "", image: null },
    hasChildren: false,
    numberOfChildren: 0,
    children: [],
    siblings: [],
    gender: "",
    maritalStatus: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/user-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          const userData = response.data.data;
          setFormData((prev) => ({
            ...prev,
            gender: userData.gender,
            maritalStatus: userData.maritalStatus,
          }));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [token]);

  const handleInputChange = (field, value, type, index = null) => {
    setFormData((prev) => {
      if (index !== null) {
        const updatedArray = [...prev[type]];
        updatedArray[index] = { ...updatedArray[index], [field]: value };
        return { ...prev, [type]: updatedArray };
      }
      return { ...prev, [type]: { ...prev[type], [field]: value } };
    });
  };

  return (
    <div className={styles.container}>
      <h2>Family Information</h2>

      {/* Father Information */}
      <div className={styles.section}>
        <h3>Father</h3>
        <input type="text" placeholder="Full Name" value={formData.father.name}
          onChange={(e) => handleInputChange("name", e.target.value, "father")} />
        <input type="date" value={formData.father.dob}
          onChange={(e) => handleInputChange("dob", e.target.value, "father")} />
      </div>

      {/* Mother Information */}
      <div className={styles.section}>
        <h3>Mother</h3>
        <input type="text" placeholder="Full Name" value={formData.mother.name}
          onChange={(e) => handleInputChange("name", e.target.value, "mother")} />
        <input type="date" value={formData.mother.dob}
          onChange={(e) => handleInputChange("dob", e.target.value, "mother")} />
      </div>

      {/* Parent Anniversary */}
      <div className={styles.section}>
        <h3>Parent Anniversary</h3>
        <input type="date" value={formData.parentAnniversary.date}
          onChange={(e) => handleInputChange("date", e.target.value, "parentAnniversary")} />
      </div>

      {/* If Married, Show Spouse & Marriage Anniversary */}
      {formData.maritalStatus === "Married" && (
        <>
          <div className={styles.section}>
            <h3>{formData.gender === "Male" ? "Wife" : "Husband"}</h3>
            <input type="text" placeholder="Full Name" value={formData.spouse.name}
              onChange={(e) => handleInputChange("name", e.target.value, "spouse")} />
            <input type="date" value={formData.spouse.dob}
              onChange={(e) => handleInputChange("dob", e.target.value, "spouse")} />
          </div>

          <div className={styles.section}>
            <h3>Marriage Anniversary</h3>
            <input type="date" value={formData.marriageAnniversary.date}
              onChange={(e) => handleInputChange("date", e.target.value, "marriageAnniversary")} />
          </div>

          {/* Ask about children */}
          <div className={styles.section}>
            <h3>Do you have children?</h3>
            <select value={formData.hasChildren} onChange={(e) => setFormData({
              ...formData,
              hasChildren: e.target.value === "true",
              numberOfChildren: e.target.value === "true" ? formData.numberOfChildren : 0,
              children: e.target.value === "true" ? formData.children : []
            })}>
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>

          {/* If User has children, show selection for number of children */}
          {formData.hasChildren && (
            <>
              <div className={styles.section}>
                <h3>Select Number of Children</h3>
                <select value={formData.numberOfChildren} onChange={(e) => {
                  const count = parseInt(e.target.value, 10) || 0;
                  setFormData({
                    ...formData,
                    numberOfChildren: count,
                    children: Array.from({ length: count }, () => ({ name: "", dob: "" }))
                  });
                }}>
                  <option value="0">Select</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>

              {/* Display child sections dynamically */}
              <div className={styles.section}>
                <h3>Children</h3>
                {formData.children.map((child, index) => (
                  <div key={index} className={styles.childForm}>
                    <input type="text" placeholder="Child's Name" value={child.name}
                      onChange={(e) => handleInputChange("name", e.target.value, "children", index)} />
                    <input type="date" value={child.dob}
                      onChange={(e) => handleInputChange("dob", e.target.value, "children", index)} />
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Siblings */}
      <div className={styles.section}>
        <h3>Siblings</h3>
        <button onClick={() => setFormData({
          ...formData,
          siblings: [...formData.siblings, { name: "", dob: "" }]
        })} className={styles.addButton}>➕ Add Sibling</button>
        {formData.siblings.map((sibling, index) => (
          <div key={index} className={styles.siblingForm}>
            <input type="text" placeholder="Sibling's Name" value={sibling.name}
              onChange={(e) => handleInputChange("name", e.target.value, "siblings", index)} />
            <button onClick={() => setFormData({
              ...formData,
              siblings: formData.siblings.filter((_, i) => i !== index)
            })} className={styles.removeButton}>❌ Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AddInformation;
