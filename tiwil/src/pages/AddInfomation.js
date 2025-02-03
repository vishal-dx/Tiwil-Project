import React, { useEffect } from "react";
import styles from "../styles/AddInfomation.module.css";
import axios from "axios";

function AddInformation({ formData, setFormData }) {
  // Handle Input Change
  const handleInputChange = (field, value, type, index = null) => {
    setFormData((prev) => {
      if (index !== null) {
        // Update sibling or child data
        const updatedArray = [...prev[type]];
        updatedArray[index] = { ...updatedArray[index], [field]: value };
        return { ...prev, [type]: updatedArray };
      }
      return { ...prev, [type]: { ...prev[type], [field]: value } };
    });
  };

  // Dynamically update spouse label when gender or marital status changes
  useEffect(() => {
    if (formData.maritalStatus === "Married" && !formData.spouse) {
      setFormData((prev) => ({
        ...prev,
        spouse: { name: "", dob: "", image: null },
      }));
    }
  }, [formData.maritalStatus, formData.spouse, setFormData]);

  // Add Sibling
  const handleSiblingAdd = () => {
    setFormData((prev) => ({
      ...prev,
      siblings: [...(prev.siblings || []), { name: "", dob: "", gender: "", image: null }],
    }));
  };

  // Handle Number of Children Selection
  const handleNumberOfChildrenChange = (number) => {
    const count = parseInt(number, 10) || 0;
    setFormData((prev) => ({
      ...prev,
      numberOfChildren: count,
      children: Array.from({ length: count }, () => ({ name: "", dob: "", image: null })),
    }));
  };

  // File Upload
  const handleFileUpload = async (file, type, index = null) => {
    const token = localStorage.getItem("token");
    const uploadFormData = new FormData();
    uploadFormData.append("image", file);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/upload-image`, uploadFormData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        setFormData((prev) => {
          if (index !== null) {
            const updatedArray = [...prev[type]];
            updatedArray[index] = { ...updatedArray[index], image: response.data.imageUrl };
            return { ...prev, [type]: updatedArray };
          }
          return { ...prev, [type]: { ...prev[type], image: response.data.imageUrl } };
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleSiblingRemove = (index) => {
    setFormData((prev) => ({
      ...prev,
      siblings: prev.siblings.filter((_, i) => i !== index), // Remove the selected sibling
    }));
  };

  return (
    <div className={styles.container}>
      <h2>Family Information</h2>

      {/* Father Information */}
      <div className={styles.section}>
        <h3>Father</h3>
        <input type="text" placeholder="Full Name" value={formData.father?.name || ""} onChange={(e) => handleInputChange("name", e.target.value, "father")} />
        <input type="date" value={formData.father?.dob || ""} onChange={(e) => handleInputChange("dob", e.target.value, "father")} />
        <input type="file" onChange={(e) => handleFileUpload(e.target.files[0], "father")} />
      </div>

      {/* Mother Information */}
      <div className={styles.section}>
        <h3>Mother</h3>
        <input type="text" placeholder="Full Name" value={formData.mother?.name || ""} onChange={(e) => handleInputChange("name", e.target.value, "mother")} />
        <input type="date" value={formData.mother?.dob || ""} onChange={(e) => handleInputChange("dob", e.target.value, "mother")} />
        <input type="file" onChange={(e) => handleFileUpload(e.target.files[0], "mother")} />
      </div>

      {/* Parent Anniversary */}
      <div className={styles.section}>
        <h3>Parent Anniversary</h3>
        <input type="date" value={formData.parentAnniversary?.date || ""} onChange={(e) => handleInputChange("date", e.target.value, "parentAnniversary")} />
        <input type="file" onChange={(e) => handleFileUpload(e.target.files[0], "parentAnniversary")} />
      </div>

      {/* If Married, Show Spouse & Marriage Anniversary */}
      {formData.maritalStatus === "Married" && (
        <>
          <div className={styles.section}>
            <h3>{formData.gender === "Male" ? "Wife" : "Husband"}</h3>
            <input type="text" placeholder="Full Name" value={formData.spouse?.name || ""} onChange={(e) => handleInputChange("name", e.target.value, "spouse")} />
            <input type="date" value={formData.spouse?.dob || ""} onChange={(e) => handleInputChange("dob", e.target.value, "spouse")} />
            <input type="file" onChange={(e) => handleFileUpload(e.target.files[0], "spouse")} />
          </div>

          <div className={styles.section}>
            <h3>Marriage Anniversary</h3>
            <input type="date" value={formData.marriageAnniversary?.date || ""} onChange={(e) => handleInputChange("date", e.target.value, "marriageAnniversary")} />
            <input type="file" onChange={(e) => handleFileUpload(e.target.files[0], "marriageAnniversary")} />
          </div>

          {/* Ask about children */}
          <div className={styles.section}>
            <h3>Do you have children?</h3>
            <select value={formData.hasChildren} onChange={(e) => setFormData({ ...formData, hasChildren: e.target.value === "true" })}>
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>

          {/* If User has children, show selection for number of children */}
          {formData.hasChildren && (
            <>
              <div className={styles.section}>
                <h3>Select Number of Children</h3>
                <select value={formData.numberOfChildren} onChange={(e) => handleNumberOfChildrenChange(e.target.value)}>
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
                {formData.children?.map((child, index) => (
                  <div key={index} className={styles.childForm}>
                    <input type="text" placeholder="Child's Name" value={child.name} onChange={(e) => handleInputChange("name", e.target.value, "children", index)} />
                    <input type="date" value={child.dob} onChange={(e) => handleInputChange("dob", e.target.value, "children", index)} />
                    <input type="file" onChange={(e) => handleFileUpload(e.target.files[0], "children", index)} />
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
        <button onClick={handleSiblingAdd} className={styles.addButton}>➕ Add Sibling</button>
        {formData.siblings?.map((sibling, index) => (
          <div key={index} className={styles.siblingForm}>
            <input type="text" placeholder="Sibling's Name" value={sibling.name} onChange={(e) => handleInputChange("name", e.target.value, "siblings", index)} />
            <input type="date" value={sibling.dob} onChange={(e) => handleInputChange("dob", e.target.value, "siblings", index)} />
            <select value={sibling.gender} onChange={(e) => handleInputChange("gender", e.target.value, "siblings", index)}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input type="file" onChange={(e) => handleFileUpload(e.target.files[0], "siblings", index)} />
            {/* Remove Button ❌ */}
            <button onClick={() => handleSiblingRemove(index)} className={styles.removeButton}>❌ Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AddInformation;
