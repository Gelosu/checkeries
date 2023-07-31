"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import the useRouter hook from 'next/router'
import axios from "axios";

export default function UpdatePassword() {
  const router = useRouter();
  const [TUPCID, setTUPCID] = useState("");
  const [PASSWORD, setPASSWORD] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [accountType, setAccountType] = useState(""); // Add a new state for accountType

  // Fetch the TUPCID and accountType from the URL when the component mounts
   // Fetch the TUPCID and accountType from the URL when the component mounts
  useEffect(() => {
    const TUPCIDFromQuery = router.query?.TUPCID;
    const accountTypeFromQuery = router.query?.accountType;

    if (TUPCIDFromQuery) {
      setTUPCID(TUPCIDFromQuery);
    }
    if (accountTypeFromQuery) {
      setAccountType(accountTypeFromQuery);
    }
  }, [router.query]);
  

  // Function to handle password input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    if (name === "newPassword") {
      setPASSWORD(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  // Function to handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if the passwords match
    if (PASSWORD === confirmPassword) {
      // Disable the submit button to prevent multiple submissions
      e.target.disabled = true;

      try {
        // Make a PUT request to update the password based on the accountType
        //await axios.put(
          //`http://localhost:3001/updatepassword/${TUPCID}`,
          //{
        //    PASSWORD: PASSWORD,
         // }
        //);
  
        // If the request is successful, show a success message and redirect to the login page
        console.log('TUPCID:', TUPCID);
        console.log('accountType:', accountType);
        alert("Password updated successfully!");
        // Implement the redirect logic here

      } catch (error) {
        // If there is an error, show an error message
        //console.error("Error updating password:", error);
        //alert("Failed to update password. Please try again.");
      }
    } else {
      setPasswordMatch(false); // Set passwordMatch state to false if passwords don't match
    }
  };

  

  return (
    <main className="container-sm vh-100 d-flex justify-content-center align-items-center">
      <section className="col-sm-5 border border-dark rounded p-3 py-5">
        <p className="text-center fs-5 fw-bold">FORGOT PASSWORD</p>
        <form className="row gap-3 justify-content-center" onSubmit={handleSubmit}>
          <input
            type="password"
            name="newPassword"
            className="w-75 py-1 px-3 border border-dark rounded text-center"
            placeholder="NEW PASSWORD"
            value={PASSWORD}
            onChange={handlePasswordChange}
          />
          <input
            type="password"
            name="confirmPassword"
            className="w-75 py-1 px-3 border border-dark rounded text-center"
            placeholder="CONFIRM PASSWORD"
            value={confirmPassword}
            onChange={handlePasswordChange}
          />
          {!passwordMatch && (
            <small className="text-danger">Password didn't match. Please try again.</small>
          )}
          <div className="text-center mb-3">
            <button
              type="submit"
              className="btn btn-outline-dark"
              disabled={PASSWORD !== confirmPassword} // Disable the button if passwords don't match
            >
              SUBMIT
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}