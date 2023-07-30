"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import the useRouter hook from 'next/router'
//import axios from "axios";

export default function UpdatePassword() {
  const router = useRouter();
  const [TUPCID, setTUPCID] = useState("");
  const [PASSWORD, setPASSWORD] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [accountType, setAccountType] = useState(""); // Add a new state for accountType

  useEffect(() => {
    console.log("useEffect triggered");
    console.log("Router Query:", router.query);
    if (router.query && router.query.TUPCID) {
      setTUPCID(router.query.TUPCID);
    }

    // Retrieve the accountType from the router query and set it to the state
    if (router.query && router.query.accountType) {
      setAccountType(router.query.accountType);
    }
  }, [router.query]);

  console.log("TUPCID:", TUPCID);
  console.log("accountType:", accountType);


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
        // Make a PUT request to the server to update the password
      //const response = await axios.put(
        //`http://localhost:3001/updatepassword/${TUPCID}`,
        //{
        //  PASSWORD: PASSWORD,
        //}
      //);
      console.log('TUPCID:',TUPCID)
      console.log('ACCOUNTTYPE:',accountType)
        // If the request is successful, show a success message and redirect to the login page
        alert(response.data.message);
        
        // Redirect to the login page after successful password update
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