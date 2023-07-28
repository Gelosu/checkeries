"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function StudentArchive() {
  const [classCode, setClassCode] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const addClass = () => {
    if (inputValue.trim() !== "") {
      setClassCode([...classCode, inputValue]);
      setInputValue("");
    }
  };
  const deleteClass = (index) => {
    const updatedClass = [...classCode];
    updatedClass.splice(index, 1);
    setClassCode(updatedClass);
    console.log(classCode)
  };
  return (
    <main className="custom-m col-11 col-md-10 p-0">
      <section className="container-fluid p-sm-4 py-3 ">
        <h3>STUDENT</h3>
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
                  INSERT SUBJECT CODE
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  value={inputValue}
                  className="py-1 px-3 border border-dark w-100 rounded"
                  placeholder="Ask class code to your professor"
                  onChange={(e) => {
                    setInputValue(e.target.value);
                  }}
                />
              </div>
              <div className="modal-footer align-self-center">
                <button
                  type="button"
                  className="btn btn-outline-dark"
                  data-bs-dismiss="modal"
                  onClick={addClass}
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
          {classCode.map((classC, index) => (
              <section className="col-lg-3 col-md-5 col-12 border border-dark rounded mb-3 me-3 p-5 text-decoration-none link-dark">
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
                        key={index}
                      >
                        Remove Class
                      </a>
                    </li>
                  </ul>
                </div>
                <a href="/Classroom/S/Result" className="text-decoration-none link-dark">
                  <p key={index} className="text-center">
                    {classC}
                  </p>
                </a>
              </section>
          ))}
        </div>
      </section>
    </main>
  );
}
