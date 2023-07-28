"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function FacultyArchive() {
  const [classes, setClasses] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [cName, setcName] = useState("");
  const [sName, setsName] = useState("");
  const addClass = () => {
    if (inputValue.trim() !== "") {
      const info = {
        ClassesName:cName,
        ClassCode:inputValue,
        SubjectName:sName
      }
      setClasses([...classes, info]);
      
    }
    setInputValue("");
    setcName("");
    setsName("");
  };
  const deleteClass = (index) => {
    const updatedClass = [...classes];
    updatedClass.splice(index, 1);
    setClasses(updatedClass);
  };
  
  return (
    <main className="custom-m col-11 col-md-10 p-0">
      <section className="container-fluid p-sm-4 py-3 ">
        <h3>FACULTY</h3>
        <button
          type="button"
          className="btn btn-outline-dark pe-3"
          data-bs-toggle="modal"
          data-bs-target="#popup"
        >
          <Image className="pb-1" src="/add.svg" height={25} width={20}></Image>
          <span>NEW</span>
        </button>
        {/* MODAL */}
        <div
          className="modal fade"
          id="popup"
          tabIndex="-1"
          aria-labelledby="ModalLabel"
          aria-hidden="true"
          data-bs-backdrop="static"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="ModalLabel">
                  CLASSROOM
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body px-5">
                <p className="text-center mb-1 ">CLASS NAME</p>
                <input
                  value={cName}
                  type="text"
                  className="py-1 px-3 border border-dark w-100 rounded text-center"
                  onChange={(e) => setcName(e.target.value)}
                />
                <p className="text-center mb-1 mt-3">CLASS CODE</p>
                <input
                  type="text"
                  className="py-1 px-3 border border-dark w-100 rounded text-center"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                  }}
                />
                <p className="text-center mb-1 mt-3">SUBJECT NAME</p>
                <input
                  value={sName}
                  type="text"
                  className="py-1 px-3 border border-dark w-100 rounded text-center"
                  onChange={(e) => setsName(e.target.value)}
                />
              </div>
              <div className="modal-footer align-self-center">
                <button
                  type="button"
                  className="btn btn-outline-dark"
                  onClick={addClass}
                  data-bs-dismiss="modal"
                >
                  Enter
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* End MODAL */}
        {/* Start */}
        <div className="d-flex flex-wrap flex-start pt-2 ">
          {Object.values(classes).map((data, index) => (
            <section   className="col-lg-3 col-md-5 col-12 border border-dark rounded mb-3 me-3 p-5 text-decoration-none link-dark">
              <div className="text-end">
                <Image
                  src="/three-dots.svg"
                  width={20}
                  height={20}
                  role="button"
                  id="dropdownMenuLink"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                />
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuLink"
                >
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={() => deleteClass(index)}
                      
                    >
                      Remove Class
                    </a>
                  </li>
                </ul>
              </div>
              <Link href={{pathname:"/Classroom/F/Test"}} className="link-dark text-decoration-none">
                <p  className="text-center">
                  {data.ClassesName}
                </p>
              </Link>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
