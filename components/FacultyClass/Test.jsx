"use client";

import { useState } from "react";
export default function FacultyClassTest() {
  const [test, setTest] = useState([]);
  const [testName, setTestName] = useState("");
  const [renametest, setRenameTest] = useState("");

  const addTest = () => {
    if (testName.trim() !== "") {
      setTest([...test, testName]);
      setTestName("");
    }
  };
  const deleteTest = (index) => {
    const deleted = [...test];
    deleted.splice(index, 1);
    setTest(deleted);
  };
  const renameTest = (index) => {
    if (renametest.trim() !== "") {
      const renamedTest = [...test];
      renamedTest.splice(index, 1, renametest);
      setTest(renamedTest);
      setRenameTest("");
    }
  };
  const reset = () => {
    setTest([]);
  };
  return (
    <main className="col-11 col-md-10 p-0">
      <section className="container-fluid p-sm-4 py-3 ">
        <h3 className="d-flex align-items-center gap-2 text-decoration-none link-dark">
          <a href="/Classroom/F" className="align-self-center pb-1">
            <img src="/back-arrow.svg" height={30} width={40} />
          </a>
          <span>CLASS NAME</span>
        </h3>
        <div className="d-flex gap-3 py-3 ">
          <a className="link-dark">
            <h4>TEST</h4>
          </a>
          <a
            href="/Classroom/F/Students"
            className="link-dark text-decoration-none"
          >
            <h4>STUDENTS</h4>
          </a>
        </div>
        <div className="d-flex gap-3">
          <button
            type="button"
            className="btn btn-outline-dark pe-3"
            data-bs-toggle="modal"
            data-bs-target="#popup"
          >
            <img className="pb-1" src="/add.svg" height={25} width={20} />
            <span>ADD</span>
          </button>
          <button
            type="button"
            className="btn btn-outline-dark px-3"
            data-bs-toggle="modal"
            data-bs-target="#Resetpopup2"
          >
            RESET
          </button>
        </div>
        {/* add MODAL */}
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
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body px-5">
                <h4 className="text-center mb-2">ADDING TEST</h4>
                <p className="text-start mb-1 ">CLASS NAME</p>
                <input
                  type="text"
                  className="py-1 px-3 border border-dark w-100 rounded text-start"
                  onChange={(e) => setTestName(e.target.value)}
                  value={testName}
                />
              </div>
              <div className="modal-footer align-self-center">
                <button
                  type="button"
                  className="btn btn-outline-dark"
                  data-bs-dismiss="modal"
                  onClick={addTest}
                >
                  ADD
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* End MODAL */}
        {/* Reset modal */}
        <div
          className="modal fade"
          id="Resetpopup2"
          tabIndex="-1"
          aria-labelledby="ModalLabel"
          aria-hidden="true"
          data-bs-backdrop="static"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header align-self-center pb-0 pt-0">
                <h5 className="modal-title pt-5" id="ModalLabel">
                  RESET TEST LISTS
                </h5>
              </div>
              <div className="modal-body d-flex flex-column align-items-center pb-0 text-center">
                <p className="mb-0 ">Are you sure you want to reset the list?</p>
                <p>
                  This will delete all of the lists including the contents of it
                </p>
              </div>
              <div className="modal-footer align-self-center d-flex gap-4">
                <button
                  type="button"
                  className="btn btn-outline-dark mt-0"
                  onClick={reset}
                  data-bs-dismiss="modal"
                >
                  <h6 className="mx-2 my-1">CONFIRM</h6>
                </button>
                <button
                  type="button"
                  data-bs-dismiss="modal"
                  className="btn btn-outline-dark mt-0"
                >
                  <h6 className="mx-2 my-1">CANCEL</h6>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* End Modal */}
        {/* Start */}
        <div className="container-fluid d-flex flex-wrap pt-2 flex-column gap-2 overflow-auto">
          {test.map((testss, index) => (
            <div className="row py-sm-3 py-5 border border-dark rounded">
              <a href="/Test/TestPaper" className="link-dark text-decoration-none col-11 align-self-center">
              
                <p key={index} className="text-center m-0">
                  {testss}
                </p>
              </a>
              <div className="col-1 text-end align-self-center p-0 pe-2">
                <img
                  src="/three-dots.svg"
                  width={20}
                  height={23}
                  role="button"
                  id="dropdownMenuButton"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  className="pb-1"
                />
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton"
                >
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => deleteTest(index)}
                  >
                    Remove
                  </button>
                  <button
                    type="button"
                    className="dropdown-item"
                    data-bs-toggle="modal"
                    data-bs-target={`#renamePopup${index}`}
                  >
                    Rename
                  </button>
                </ul>
                {/* rename MOdal */}
                <div
                  class="modal fade"
                  id={`renamePopup${index}`}
                  tabindex="-1"
                  aria-labelledby="renamePopupLabel"
                  aria-hidden="true"
                  data-bs-backdrop="static"
                >
                  <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                      <button
                        type="button"
                        class="btn-close align-self-end p-3"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                      <div class="modal-header align-self-center pb-0 pt-0">
                        <h5 class="modal-title" id="ModalLabel">
                          RENAME TEST
                        </h5>
                      </div>
                      <div class="modal-body d-flex flex-column pb-2">
                        <h6 className="align-self-start ps-5 ms-2">
                          TEST NAME
                        </h6>
                        <input
                          type="text"
                          className="py-1 px-3 border border-dark w-75 rounded align-self-center"
                          onChange={(e) => setRenameTest(e.target.value)}
                          value={renametest}
                        />
                      </div>
                      <div class="modal-footer align-self-center">
                        <button
                          type="button"
                          class="btn btn-outline-dark mt-0"
                          data-bs-dismiss="modal"
                          onClick={() => renameTest(index)}
                        >
                          <h6 className="mx-2 my-1">SAVE</h6>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* end renameModal */}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
