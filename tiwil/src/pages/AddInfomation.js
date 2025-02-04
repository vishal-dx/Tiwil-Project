import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/AddInfomation.module.css";
import axios from "axios";

function AddInformation() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    father: { name: "", dob: "" },
    mother: { name: "", dob: "" },
    parentAnniversary: { date: "" },
    marriageAnniversary: { date: "" },
    spouse: { name: "", dob: "" },
    hasChildren: false,
    numberOfChildren: 0,
    children: [],
    siblings: [],
    gender: "",
    maritalStatus: "",
    images: [], // ✅ Initialize images as an empty array
  });
  

  // useEffect(() => {
  //   const fetchFamilyInfo = async () => {
  //     try {
  //       const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/family-info`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });

  //       if (response.data.success) {
  //         const familyData = response.data.data;
  //         setFormData({
  //           ...familyData,
  //           gender: familyData.gender || "",
  //           maritalStatus: familyData.maritalStatus || "",
  //           children: familyData.children || [],
  //           siblings: familyData.siblings || [],
  //         });
  //       }
  //     } catch (error) {
  //       console.error("Error fetching family information:", error);
  //     }
  //   };

  //   fetchFamilyInfo();
  // }, [token]);
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
  const handleImageChange = (file) => {
    if (file) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, file], // ✅ Store File objects, not strings
      }));
    }
  };
  
  
  const handleSave = async () => {
    try {
      const formDataToSend = new FormData();
  
      // ✅ Convert the structured data to a JSON string
      const jsonData = {
        father: formData.father,
        mother: formData.mother,
        parentAnniversary: formData.parentAnniversary,
        spouse: formData.spouse,
        marriageAnniversary: formData.marriageAnniversary,
        hasChildren: formData.hasChildren,
        numberOfChildren: formData.numberOfChildren,
        children: formData.children,
        siblings: formData.siblings,
        gender: formData.gender,
        maritalStatus: formData.maritalStatus,
      };
  
      formDataToSend.append("data", JSON.stringify(jsonData)); // ✅ Properly sending as JSON string
  
      // ✅ Append images separately
      formData.images.forEach((image) => {
        if (image instanceof File) {
          formDataToSend.append("images", image);
        }
      });
  
      console.log("Sending FormData:", Array.from(formDataToSend.entries())); // Debug
  
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/family-info`,
        formDataToSend,
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        }
      );
  
      if (response.data.success) {
        alert("Family information saved successfully!");
        // navigate("/dashboard");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error saving family information:", error);
      alert("Failed to save family information.");
    }
  };
  


  // const handleSave = async () => {
  //   try {
  //     const response = await axios.post(
  //       `${process.env.REACT_APP_BASE_URL}/family-info`,
  //       formData,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     if (response.data.success) {
  //       alert("Family information saved successfully!");
  //       navigate("/dashboard"); // Redirect to the next page
  //     } else {
  //       alert(response.data.message);
  //     }
  //   } catch (error) {
  //     console.error("Error saving family information:", error);
  //     alert("Failed to save family information.");
  //   }
  // };

  return (
    <div className={styles.container}>
      <h2>Family Information</h2>

      {/* Father Information */}
      <div className={styles.section}>
        <h3>Father</h3>
        <label>Full Name</label>
        <input
          type="text"
          placeholder="Father's Name"
          value={formData.father.name}
          onChange={(e) => handleInputChange("name", e.target.value, "father")}
        />

        <label>Date of Birth</label>
        <input
          type="date"
          value={formData.father.dob}
          onChange={(e) => handleInputChange("dob", e.target.value, "father")}
        />
        <label>Image</label>
        <input
          type="file"
          name="fatherImage"
          accept="image/*"
          onChange={(e) => handleImageChange(e.target.files[0])}
        />

      </div>

      {/* Mother Information */}
      <div className={styles.section}>
        <h3>Mother</h3>
        <label>Full Name</label>
        <input
          type="text"
          placeholder="Mother's Name"
          value={formData.mother.name}
          onChange={(e) => handleInputChange("name", e.target.value, "mother")}
        />

        <label>Date of Birth</label>
        <input
          type="date"
          value={formData.mother.dob}
          onChange={(e) => handleInputChange("dob", e.target.value, "mother")}
        />
        <label>Image</label>
        <input
          type="file"
          name="motherImage"
          accept="image/*"
          onChange={(e) => handleImageChange(e.target.files[0])}
        />

      </div>

      {/* Parent Anniversary */}
      <div className={styles.section}>
        <h3>Parent Anniversary</h3>
        <label>Date</label>
        <input
          type="date"
          value={formData.parentAnniversary.date}
          onChange={(e) => handleInputChange("date", e.target.value, "parentAnniversary")}
        />
        <label>Image</label>
        <input
          type="file"
          name="parentAnniversaryImage"
          accept="image/*"
          onChange={(e) => handleImageChange(e.target.files[0])}
        />

      </div>

      {/* Spouse Section */}
      {formData.maritalStatus === "Married" && (
        <>
          <div className={styles.section}>
            <h3>{formData.gender === "Male" ? "Wife" : "Husband"}</h3>
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Spouse's Name"
              value={formData.spouse.name}
              onChange={(e) => handleInputChange("name", e.target.value, "spouse")}
            />

            <label>Date of Birth</label>
            <input
              type="date"
              value={formData.spouse.dob}
              onChange={(e) => handleInputChange("dob", e.target.value, "spouse")}
            />
            <label>Image</label>
            <input
              type="file"
              name="spouseImage"
              accept="image/*"
              onChange={(e) => handleImageChange(e.target.files[0])}
            />

          </div>

          <div className={styles.section}>
            <h3>Marriage Anniversary</h3>
            <label>Date</label>
            <input
              type="date"
              value={formData.marriageAnniversary.date}
              onChange={(e) => handleInputChange("date", e.target.value, "marriageAnniversary")}
            />
            <label>Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e.target.files[0])}
            />

          </div>

          {/* Children Section */}
          <div className={styles.section}>
            <h3>Do you have children?</h3>
            <select
              value={formData.hasChildren}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  hasChildren: e.target.value === "true",
                  numberOfChildren: e.target.value === "true" ? formData.numberOfChildren : 0,
                  children: e.target.value === "true" ? formData.children : [],
                })
              }
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>

          {formData.hasChildren && (
            <>
              <div className={styles.section}>
                <h3>Select Number of Children</h3>
                <select
                  value={formData.numberOfChildren}
                  onChange={(e) => {
                    const count = parseInt(e.target.value, 10) || 0;
                    setFormData({
                      ...formData,
                      numberOfChildren: count,
                      children: Array.from({ length: count }, () => ({ name: "", dob: "", gender: "" })),
                    });
                  }}
                >
                  <option value="0">Select</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>

              {formData.children.map((child, index) => (
                <div key={index} className={styles.childForm}>
                  <label>Child {index + 1} Name</label>
                  <input
                    type="text"
                    placeholder="Child's Name"
                    value={child.name}
                    onChange={(e) => handleInputChange("name", e.target.value, "children", index)}
                  />

                  <label>Date of Birth</label>
                  <input
                    type="date"
                    value={child.dob}
                    onChange={(e) => handleInputChange("dob", e.target.value, "children", index)}
                  />
                  <label>Image</label>
                  <input
                    type="file"
                    name="marriageAnniversaryImage"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e.target.files[0])}
                  />


                  <label>Gender</label>
                  <select
                    value={child.gender}
                    onChange={(e) => handleInputChange("gender", e.target.value, "children", index)}
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              ))}
            </>
          )}
        </>
      )}

      {/* Siblings Section */}
      <div className={styles.section}>
        <h3>Siblings</h3>
        <button
          onClick={() =>
            setFormData({
              ...formData,
              siblings: [...formData.siblings, { name: "", dob: "", gender: "" }],
            })
          }
          className={styles.addButton}
        >
          ➕ Add Sibling
        </button>

        {formData.siblings.map((sibling, index) => (
          <div key={index} className={styles.siblingForm}>
            <label>Sibling's Name</label>
            <input
              type="text"
              placeholder="Sibling's Name"
              value={sibling.name}
              onChange={(e) => handleInputChange("name", e.target.value, "siblings", index)}
            />

            <label>Date of Birth</label>
            <input
              type="date"
              value={sibling.dob}
              onChange={(e) => handleInputChange("dob", e.target.value, "siblings", index)}
            />



            <label>Gender</label>
            <select
              value={sibling.gender}
              onChange={(e) => handleInputChange("gender", e.target.value, "siblings", index)}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <label>Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e.target.files[0])}
            />
            <button
              onClick={() =>
                setFormData({
                  ...formData,
                  siblings: formData.siblings.filter((_, i) => i !== index),
                })
              }
              className={styles.removeButton}
            >
              ❌ Remove
            </button>
          </div>
        ))}
      </div>
      <div className={styles.saveBtnBox}>
        <button onClick={handleSave} className={styles.saveButton}>
          Save
        </button>
      </div>
    </div>
  );
}

export default AddInformation;
