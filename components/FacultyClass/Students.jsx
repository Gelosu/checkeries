"use client";
import { useState } from "react";
import Link from "next/link";
export default function FacultyClassStudent() {
  const [studlist, setStudlist] = useState([]);
  const [studname, setStudname] = useState("");
  const [tupcId, setTupcId] = useState("");
  const [status, setStatus] = useState("");
  const addSTUD = () => {
    if (tupcId.trim() !== "") {
      const infor = {
        TupcId: tupcId,
        StudentName: studname,
        StudStatus: status,
      };
      setStudlist([...studlist, infor]);
    }
    setStudname("");
    setTupcId("");
    setStatus("");
  };
  const deleteTest = (index) => {
    const deleted = [...studlist];
    deleted.splice(index, 1);
    setStudlist(deleted);
  };
  const reset = () => {
    setStudlist([]);
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
          <a className="link-dark text-decoration-none">
            <h4>TEST</h4>
          </a>
          <a href="/Classroom/F/Students" className="link-dark ">
            <h4>STUDENTS</h4>
          </a>
        </div>
        {/* BUTTONS */}
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
        {/* end BUTTONS */}

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
                <p className="text-start mb-1 ">TUPCID</p>
                <input
                  type="text"
                  className="py-1 px-3 border border-dark w-100 rounded text-start"
                  onChange={(e) => setTupcId(e.target.value)}
                  value={tupcId}
                />
                <p className="text-start mb-1 ">STUDENT NAME</p>
                <input
                  type="text"
                  className="py-1 px-3 border border-dark w-100 rounded text-start"
                  onChange={(e) => setStudname(e.target.value)}
                  value={studname}
                />
                <p className="text-start mb-1 ">TUPCID</p>
                <select
                  type="text"
                  className="py-1 px-3 border border-dark w-100 rounded text-start"
                  onChange={(e) => setStatus(e.target.value)}
                  value={status}
                >
                  <option selected>Choose....</option>
                  <option value="Regular">REGULAR</option>
                  <option value="Irregular">IRREGULAR</option>
                </select>
              </div>
              <div className="modal-footer align-self-center">
                <button
                  type="button"
                  className="btn btn-outline-dark"
                  data-bs-dismiss="modal"
                  onClick={addSTUD}
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
              <div className="modal-body d-flex flex-column align-items-center pb-0">
                <p className="mb-0">Are you sure you want to reset the list?</p>
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
        <div className="container-fluid d-flex pt-3 flex-column gap-2 px-0">
          <div className="d-flex text-center justify-content-between mb-2">
            <h4 className="col-2 border border-dark py-1 px-3 m-0 rounded">
              ID NO.
            </h4>
            <h4 className="col-7 border border-dark py-1 px-3 m-0 rounded">
              STUDENT NAME
            </h4>
            <h4 className="col-2 border border-dark py-1 px-3 m-0 rounded">
              STATUS
            </h4>
          </div>
          {Object.values(studlist).map((lists, index) => (
            <div>
              <div className="d-flex text-center justify-content-between">
                <h5 className="col-2 border border-dark py-2 px-3 m-0 rounded">
                  {lists.TupcId}
                </h5>
                <h5 className="col-7 border border-dark py-2 px-3 m-0 rounded">
                  {lists.StudentName}
                </h5>
                <h5 className="col-2 border border-dark py-2 px-3 m-0 rounded">
                  {lists.StudStatus}
                </h5>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
