import FacultyArchive from "@/components/Class Archive/FacultyArchive";
import FacultyAside from "@/components/DefaultFix/FacultyAside";

export default function FacultyClassPage(){
    return(
        <main className="container-fluid">
            <section className="row">
                <FacultyAside/>
                <FacultyArchive/>
            </section>
        </main>
    )
}