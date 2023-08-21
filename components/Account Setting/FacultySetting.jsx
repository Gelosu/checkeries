import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";

export default function FacultySetting() {
  const searchParams = useSearchParams();
  const TUPCID = searchParams.get("TUPCID");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [surName, setSurName] = useState("");
  const [gsfeacc, setGsfeacc] = useState("");
  const [subjectdept, setSubjectdept] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {
    const fetchFacultyInfo = async () => {
      try{
      const response = await axios.get(
        `http://localhost:3001/facultyinfos/${TUPCID}`
      );
      const {
        FIRSTNAME,
        MIDDLENAME,
        SURNAME,
        GSFEACC,
        SUBJECTDEPT,
        PASSWORD,
      } = response.data;
      setFirstName(FIRSTNAME);
      setMiddleName(MIDDLENAME);
      setSurName(SURNAME);
      setGsfeacc(GSFEACC);
      setSubjectdept(SUBJECTDEPT);
      setPassword(PASSWORD);
    } catch(error){
      console.log(error)
    }
  };
  fetchFacultyInfo();
  }, [TUPCID]);

  return (
    <main className="custom-m col-11 col-md-10 p-0">
      <section className="container-fluid p-sm-4 py-3 ">
        <div className="d-flex align-items-center">
          <Link href="">
            <img src="/back-arrow.svg" height={30} width={40} />
          </Link>
          <h2 className="m-0">Settings</h2>
        </div>
        <h3 className="text-center pt-3 m-0 ">UPDATE PERSONAL INFO</h3>
        <div className="d-flex justify-content-center flex-column container col-md-10 col-lg-7 rounded border border-dark bg-lightgray">
          <p className="text-end pt-2">EDIT</p>
          <form className="p-3 pt-0 col-sm-10 text-sm-start text-center align-self-center">
            <div className="row p-3 pt-1 pb-2">
              <p className="col-sm-6 p-0 m-0 align-self-center">TUPC ID</p>
              <input
                type="text"
                value={TUPCID}
                className="col-sm-6 rounded py-1 px-3 border border-dark bg-secondary"
                readOnly
              />
            </div>
            <div className="row p-3 pt-1 pb-2">
              <p className="col-sm-6 p-0 m-0 align-self-center">FIRST NAME</p>
              <input
                type="text"
                value={firstName}
                className="col-sm-6 rounded py-1 px-3 border border-dark"
              />
            </div>
            <div className="row p-3 pt-1 pb-2">
              <p className="col-sm-6 p-0 m-0 align-self-center">MIDDLE NAME</p>
              <input
                type="text"
                value={middleName}
                className="col-sm-6 rounded py-1 px-3 border border-dark"
              />
            </div>
            <div className="row p-3 pt-1 pb-2">
              <p className="col-sm-6 p-0 m-0 align-self-center">SURNAME</p>
              <input
                type="text"
                value={surName}
                className="col-sm-6 rounded py-1 px-3 border border-dark"
              />
            </div>
            <div className="row p-3 pt-1 pb-2">
              <p className="col-sm-6 p-0 m-0 align-self-center">GSFE ACCOUNT</p>
              <input
                type="text"
                value={gsfeacc}
                className="col-sm-6 rounded py-1 px-3 border border-dark"
              />
            </div>
            <div className="row p-3 pt-1 pb-2">
              <p className="col-sm-6 p-0 m-0 align-self-center">
                SUBJECT DEPARTMENT
              </p>
              <select
                type="text"
                value={subjectdept}
                className="col-sm-6 rounded py-1 px-3 border border-dark"
              >
                <option value="none" selected disabled hidden>
                  Choose...
                </option>
                <option value="A">A</option>
                <option value="B">B</option>
              </select>
            </div>
            <div className="row p-3 pt-1 pb-2">
              <p className="col-sm-6 p-0 m-0 align-self-center">PASSWORD</p>
              <input
                type="text"
                value={password}
                className="col-sm-6 rounded py-1 px-3 border border-dark"
              />
            </div>
            <div className="pt-3 text-center col-12">
              <button className="btn btn-light col-md-5 col-lg-2 border border-dark rounded text-center">
                SAVE
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
