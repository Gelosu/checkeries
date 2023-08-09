"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Import the useRouter hook from 'next/router'
import axios from "axios";
import { useTupcid } from "@/app/provider";

export default function FacultyAside() {
  const {tupcids} = useTupcid();
  const [accountType, setAccountType] = useState("");
  const [FIRSTNAME, setFIRSTNAME] = useState("");
  const [SURNAME, setSURNAME] = useState("");
  const [SUBJECTDEPT, setSUBJECTDEPT] = useState("");
  const [navs, setNavs] = useState(false);
  

  // useEffect(() => {
    
  //   const tupcidsFromQuery = searchParams.get("tupcids");
  //   const accountTypeFromQuery = searchParams.get("accountType");
  //   console.log("tupcidsFromQuery:", tupcidsFromQuery);
  //   console.log("accountTypeFromQuery:", accountTypeFromQuery);

  //   if (tupcidsFromQuery) {
  //     settupcids(tupcidsFromQuery);
  //   }
  //   if (accountTypeFromQuery) {
  //     setAccountType(accountTypeFromQuery);
  //   }
  // }, [router.query]);

  useEffect(() => {
    const fetchFacultyInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/facultyinfo/${tupcids}`
        );
        const { FIRSTNAME, SURNAME, SUBJECTDEPT } = response.data;
        setFIRSTNAME(FIRSTNAME);
        setSURNAME(SURNAME);
        setSUBJECTDEPT(SUBJECTDEPT);
  
        console.log(response.data);
      } catch (error) {
        console.log("Error fetching FACULTY data:", error);
      }
    };
    if (tupcids) {
      fetchFacultyInfo();
    }
  }, [tupcids]);



  const animate = () => {
    setNavs(!navs)
  }
  return (
      <aside className={navs? "custom-con2 w-50 px-0 bg-danger":"custom-con1 col-1 col-sm-2 px-sm-2 px-0 bg-danger"}>
        <div className="d-flex flex-column align-items-center justify-content-between pt-2 text-white vh-100">
          <div className={navs ? "custom-hov2 flex-column text-center" : "custom-hov1 d-md-flex flex-column text-center"}>
            <div className="Circle2 align-self-center"></div>
            <p className="my-2">{tupcids}</p>
            <p className="my-2">{SURNAME}, {FIRSTNAME}</p>
            <small>{SUBJECTDEPT}</small>
          </div>
          <input type="checkbox" className={navs ? "custom-c" : "custom-v"} onClick={animate}/>
          <div className={navs ? "custom-hov2 flex-column align-self-start px-2" : "custom-hov1 d-md-flex flex-column align-self-start px-2"}>
            <p className="my-2">SETTINGS</p>
            <p className="my-2">REPORT PROBLEM</p>
            <Link
              href="/login"
              className="text-decoration-none link-light"
            >
              <p className="fw-100 my-2">LOGOUT</p>
            </Link>
          </div>
        </div>
      </aside>
  );
}