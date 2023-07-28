import FacultyAside from "@/components/DefaultFix/FacultyAside";
import Records from "@/components/TestPaper/Records";

export default function RecordsPage(){
    return(
        <main className="container-fluid">
        <div className="row ">
          <FacultyAside/>
          <div className="custom-m col-12 col-sm-11 col-md-10 p-0 vh-100">
            <Records/>
          </div>
        </div>
      </main>
    )
}