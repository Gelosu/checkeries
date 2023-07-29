"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function MatchCode() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [TUPCID, setTUPCID] = useState("");
  const router = useRouter();

  useEffect(() => {
    const TUPCIDFromQuery = router.query?.TUPCID;
    if (TUPCIDFromQuery) {
      setTUPCID(TUPCIDFromQuery);
    }
  }, [router.query]);

  const handleFormSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setIsSubmitting(true);

  try {
    // Make the GET request to fetch the TUPCID based on the code
    const { data } = await axios.get(`http://localhost:3001/getTUPCID?code=${code}`);

    if (data.TUPCID) {
      // Success, TUPCID found, save TUPCID and redirect to reset password page
      setTUPCID(data.TUPCID);
      console.log('code match:', data.TUPCID); // <-- Add this line to log the TUPCID value
      // Include the accountType in the URL query parameter when redirecting
      router.push(`/login/ForgetPassword/UpdatePassword?TUPCID=${data.TUPCID}`);
    } else {
      // Code does not match, show error message
      setError("Invalid code");
      setTUPCID("");
    }
  } catch (error) {
    // Error making the GET request
    console.error("Error occurred while making the GET request:", error);
    setError("Failed to communicate with the server");
    setTUPCID("");
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <main className="container vh-100 d-flex justify-content-center align-items-center">
      <section className="col-lg-5 d-flex justify-content-center align-items-center flex-column border border-dark rounded-3 py-5">
        <p className="mb-0 fw-bold fs-5">MATCH CODE</p>
        <p className="fw-light text-center px-3">
          Please enter the 6-digit code sent to your GSFE Account
        </p>
        <form onSubmit={handleFormSubmit} className="text-center d-flex flex-column">
          <input
            type="text"
            className="py-1 px-3 rounded border border-dark mb-3 text-center"
            placeholder="6-Digit Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          {error && <small className="mb-2 text-danger">{error}</small>}
          <div>
            <button
              type="submit"
              className="px-3 mb-3 btn btn-outline-dark col-5"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}