import Link from "next/link";

export default function PresetTest() {
  return (
    <main className="custom-m col-11 col-md-10 p-0">
      <section className="container-fluid p-sm-4 py-3 ">
        <div className="d-flex align-items-center">
          <Link href="http://localhost:3000/Classroom/S">
            <img src="/back-arrow.svg" height={30} width={40} />
          </Link>
          <h2 className="m-0">&#123;CLASS NAME&#125;</h2>
        </div>
        <h3 className="pt-3 m-0 ">PRETETS</h3>
        {/* CHANGE Year*/}
        <div className="d-flex flex-column gap-1 mb-2 mt-2">
          <div className="custom-dropdown-container border border-dark rounded text-center overflow-hidden">
            <input id="cdd" type="checkbox" className="custom-dropdown" />
            <label htmlFor="cdd">
              <div role="button" className="p-2">
                <span>
                  YEAR <span className="dropdown-toggle text-end"></span>
                </span>
              </div>
            </label>

            <div className="custom-dropdown-item container-fluid border-top border-dark p-5">
              <div className="row gap-2 justify-content-center">
                {/* Content under year */}
                <div className="col-sm-3 col-md-4 col-lg-3 col-12 d-flex flex-column">
                  <img
                    className="custom-round1 custom-round2 col-12 border border-dark m-0 px-4"
                    src="/sample-image.png"
                    alt="image"
                    height={100}
                    width={80}
                  />
                  <div className="border-bottom border-end border-start custom-round3 custom-round4 border-dark text-end pe-2">
                    <span className="me-2">ADD</span>
                    <span>EYE</span>
                  </div>
                </div>
                {/* Content under year */}
              </div>
            </div>
          </div>
        </div>
        {/* CHANGE */}
      </section>
    </main>
  );
}