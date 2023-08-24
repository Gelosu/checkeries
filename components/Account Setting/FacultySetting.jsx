import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import bcryptjs from "bcryptjs";

export default function FacultySetting() {
  const searchParams = useSearchParams();
  const TUPCID = searchParams.get("TUPCID");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [surName, setSurName] = useState("");
  const [gsfeacc, setGsfeacc] = useState("");
  const [subjectdept, setSubjectdept] = useState("");
  const [password, setPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [initialFacultyInfo, setInitialInfo] = useState({
    firstName: "",
    middleName: "",
    surName: "",
    gsfeacc: "",
    subjectdept: "",
    password: "",
  });
  
  

  useEffect(() => {
    const fetchFacultyInfo = async () => {
      try {
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

        // Store initial faculty information
        const initialFacultyInfo = {
          firstName: FIRSTNAME,
          middleName: MIDDLENAME,
          surName: SURNAME,
          gsfeacc: GSFEACC,
          subjectdept: SUBJECTDEPT,
          password: PASSWORD,
        };

        // Set state with fetched data
        setFirstName(FIRSTNAME);
        setMiddleName(MIDDLENAME);
        setSurName(SURNAME);
        setGsfeacc(GSFEACC);
        setSubjectdept(SUBJECTDEPT);
        setPassword(PASSWORD);

        // Set initial faculty information
        setInitialInfo(initialFacultyInfo);
      } catch (error) {
        console.log(error);
      }
    };

    // Call the function to fetch data
    fetchFacultyInfo();
  }, [TUPCID]);

  const handleSave = async () => {
    
    try {
      const updatedData = {
        FIRSTNAME: firstName,
        MIDDLENAME: middleName,
        SURNAME: surName,
        GSFEACC: gsfeacc,
        SUBJECTDEPT: subjectdept,
        PASSWORD: password,
      };

      // If a new password is provided, hash it
      if (password) {
        bcryptjs.hash(password, 10, async (err, hashedPassword) => {
          if (err) {
            console.error("Error hashing password:", err);
          } else {
            updatedData.PASSWORD = hashedPassword;
            await updateFacultyDataOnServer(TUPCID, updatedData);
          }
        });
      } else {
        await updateFacultyDataOnServer(TUPCID, updatedData);
      }

      // Update initial faculty information
      setInitialInfo(updatedData);

      // Exit editing mode
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  const updateFacultyDataOnServer = async (TUPCID, updatedData) => {
    try {
      await axios.put(`http://localhost:3001/facultyinfos/${TUPCID}`, updatedData);
      
      // Update state with new values
      setFirstName(updatedData.FIRSTNAME);
      setMiddleName(updatedData.MIDDLENAME);
      setSurName(updatedData.SURNAME);
      setGsfeacc(updatedData.GSFEACC);
      setSubjectdept(updatedData.SUBJECTDEPT);
      // Password is not updated here since it might be hashed
    } catch (error) {
      console.error("Error updating faculty data:", error);
    }
  };

  return (
    <main className="custom-m col-11 col-md-10 p-0">
      <section className="container-fluid p-sm-4 py-3 ">
        <div className="d-flex align-items-center">
          <Link href="http://localhost:3000/Classroom/F">
            <img src="/back-arrow.svg" height={30} width={40} />
          </Link>
          <h2 className="m-0">Settings</h2>
        </div>
        <h3 className="text-center pt-3 m-0 ">UPDATE PERSONAL INFO</h3>
        <div className="d-flex justify-content-center flex-column container col-md-10 col-lg-7 rounded border border-dark bg-lightgray">
          <button
            className="btn btn-secondary col-md-1 col-lg-1 border border-dark rounded text-center"
            onClick={() => {
              if (isEditing) {
                setFirstName(initialFacultyInfo.FIRSTNAME);
                setMiddleName(initialFacultyInfo.MIDDLENAME);
                setSurName(initialFacultyInfo.SURNAME);
                setGsfeacc(initialFacultyInfo.GSFEACC);
                setSubjectdept(initialFacultyInfo.SUBJECTDEPT);
                setPassword(initialFacultyInfo.PASSWORD);
              }
              setIsEditing(prevEditing => !prevEditing);
            }}
          >
            {isEditing ? "X" : "EDIT"}
          </button>

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
                disabled={!isEditing}
                onChange={event => setFirstName(event.target.value)}
              />
            </div>
            <div className="row p-3 pt-1 pb-2">
              <p className="col-sm-6 p-0 m-0 align-self-center">MIDDLE NAME</p>
              <input
                type="text"
                value={middleName}
                className="col-sm-6 rounded py-1 px-3 border border-dark"
                disabled={!isEditing}
                onChange={event => setMiddleName(event.target.value)}
              />
            </div>
            <div className="row p-3 pt-1 pb-2">
              <p className="col-sm-6 p-0 m-0 align-self-center">SURNAME</p>
              <input
                type="text"
                value={surName}
                className="col-sm-6 rounded py-1 px-3 border border-dark"
                disabled={!isEditing}
                onChange={event => setSurName(event.target.value)}
              />
            </div>
            <div className="row p-3 pt-1 pb-2">
              <p className="col-sm-6 p-0 m-0 align-self-center">GSFE ACCOUNT</p>
              <input
                type="text"
                value={gsfeacc}
                className="col-sm-6 rounded py-1 px-3 border border-dark"
                disabled={!isEditing}
                onChange={event => setGsfeacc(event.target.value)}
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
  disabled={!isEditing}
  onChange={event => setSubjectdept(event.target.value)}
>
  <option value="none" disabled hidden>
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
                disabled={!isEditing}
                onChange={event => setPassword(event.target.value)}
              />
            </div>
            {isEditing && (
              <div className="pt-3 text-center col-12">
                <button
                  className="btn btn-light col-md-5 col-lg-2 border border-dark rounded text-center"
                  onClick={handleSave}
                >
                  SAVE
                </button>
              </div>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}
