"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Import the useRouter hook from 'next/router'
import axios from "axios";

export default function StudentAside() {
  const [FIRSTNAME, setFIRSTNAME] = useState("");
  const [SURNAME, setSURNAME] = useState("");
  const [COURSE, setCOURSE] = useState("");
  const [YEAR, setYEAR] = useState("");
  const [navs, setNavs] = useState(false);
  const [TUPCID, setTUPCID] = useState("");
  const [accountType, setAccountType] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const TUPCIDFromQuery = searchParams.get("TUPCID");
    const accountTypeFromQuery = searchParams.get("accountType");
    console.log("TUPCIDFromQuery:", TUPCIDFromQuery);
    console.log("accountTypeFromQuery:", accountTypeFromQuery);

    if (TUPCIDFromQuery) {
      setTUPCID(TUPCIDFromQuery);
    }
    if (accountTypeFromQuery) {
      setAccountType(accountTypeFromQuery);
    }
  }, [router.query]);
  console.log(FIRSTNAME)
  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/studinfo/${TUPCID}`
        );
        const { FIRSTNAME, SURNAME, COURSE, YEAR } = response.data;
        setFIRSTNAME(FIRSTNAME);
        setSURNAME(SURNAME);
        setCOURSE(COURSE);
        setYEAR(YEAR);
        console.log(response.data); // This will show the fetched student data
      } catch (error) {
        console.log("Error fetching student data:", error);
      }
    };
  
    if (TUPCID && accountType) {
      fetchStudentInfo();
    }
  }, [TUPCID, accountType]);

  const animate = () => {
    setNavs(!navs);
  };

  return (
    <aside
      className={
        navs
          ? "custom-con2 w-50 px-0 bg-danger"
          : "custom-con1 col-1 col-sm-2 px-sm-2 px-0 bg-danger"
      }
    >
      <div className="d-flex flex-column align-items-center justify-content-between pt-2 text-white vh-100">
        <div
          className={
            navs
              ? "custom-hov2 flex-column text-center"
              : "custom-hov1 d-md-flex flex-column text-center"
          }
        >
          <div className="Circle2 align-self-center"></div>
          <p className="my-2">{TUPCID}</p>
          <p className="my-2">
            {SURNAME}, {FIRSTNAME}
          </p>
          <small>
            &#123;{COURSE}, {YEAR}&#125;
          </small>
        </div>
        <input
          type="checkbox"
          className={navs ? "custom-c" : "custom-v"}
          onClick={animate}
        />
        <div
          className={
            navs
              ? "custom-hov2 flex-column align-self-start px-2"
              : "custom-hov1 d-md-flex flex-column align-self-start px-2"
          }
        >
          <p className="my-2">SETTINGS</p>
          <p className="my-2">REPORT PROBLEM</p>
          <Link href="/login" className="text-decoration-none link-light">
            <p className="fw-100 my-2">LOGOUT</p>
          </Link>
        </div>
      </div>
    </aside>
  );
}
