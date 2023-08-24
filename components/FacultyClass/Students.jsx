"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function FacultyClassStudent() {
  const [studlist, setStudlist] = useState([]);
  const searchparams = useSearchParams();
  const classname = searchparams.get("classname");
  const classcode = searchparams.get("classcode");
  const subjectname = searchparams.get("subjectname");

  useEffect(() => {
    if (classcode) {
      fetchStudents(classcode);
    }
  }, [classcode]);

  const fetchStudents = async (classcode) => {
    try {
      console.log("classcode: ", classcode);
      const response = await axios.get(
        `http://localhost:3001/getstudents/${classcode}`
      );
      setStudlist(response.data.students);
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudlist([]);
    }
  };
  console.log(studlist)
  return (
    <main className="col-11 col-md-10 p-0">
      <section className="container-fluid p-sm-4 py-3 ">
        <h3 className="d-flex align-items-center gap-2 text-decoration-none link-dark">
          <a href="/Classroom/F" className="align-self-center pb-1">
            <img src="/back-arrow.svg" height={30} width={40} />
          </a>
          <span>
            {classname} CLASSCODE: {classcode} SUBJECT: {subjectname}
          </span>
        </h3>
        <div className="d-flex gap-3 py-3 ">
          <Link
            href={{
              pathname: "/Classroom/F/Test",
              query: {
                classname: classname,
                classcode: classcode,
                subjectname: subjectname,
              },
            }}
            className="link-dark text-decoration-none"
          >
            <h4>TEST</h4>
          </Link>
          <a href="/Classroom/F/Students" className="link-dark ">
            <h4>STUDENTS</h4>
          </a>
        </div>

        {/* Student List Table */}
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID NO.</th>
                <th>FIRST NAME</th>
                <th>MIDDLE NAME</th>
                <th>SURNAME</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {studlist[0]?.map((student, index) => (
                <tr key={index}>
                  <td>{student.TUPCID}</td>
                  <td>{student.FIRSTNAME}</td>
                  <td>{student.MIDDLENAME}</td>
                  <td>{student.SURNAME}</td>
                  <td>{student.STATUS}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* End Student List Table */}
      </section>
    </main>
  );
}
