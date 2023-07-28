export default function TestPaper() {
  return (
    <main className="container-fluid p-sm-4 py-3 h-100">
      <section>
        <div className="d-flex ">
          <a className="align-self-center" href="/Classroom/F/Test">
            <img src="/back-arrow.png" />
          </a>
          &nbsp;
          <h3 className="m-0">&#123;TEST NO&#125;&#58;&#123;TEST NAME&#125;</h3>
        </div>
        <ul className="d-flex flex-wrap justify-content-around mt-3 list-unstyled">
          <li className="m-0 fs-5 text-decoration-underline">TEST PAPER</li>
          <a
            href="/Test/AnswerSheet"
            className="text-decoration-none link-dark"
          >
            <li className="m-0 fs-5">ANSWER SHEET</li>
          </a>
          <a href="/Test/AnswerKey" className="text-decoration-none link-dark">
            <li className="m-0 fs-5">ANSWER KEY</li>
          </a>
          <a href="/Test/Records" className="text-decoration-none link-dark">
            <li className="m-0 fs-5">RECORDS</li>
          </a>
        </ul>
        {/* CONTENT */}
        <section className="container-sm mt-5 col-xl-6 py-3 px-4 border border-dark rounded">
          <form className="row p-sm-2 px-3">
            <p className="col-sm-4 my-1 text-sm-start text-center">
              TYPE OF TEST
            </p>
            <select
              type="text"
              className="col-sm-8 rounded border border-dark text-sm-start text-center"
            >
              <option selected>Choose...</option>
              <option value="">IDENTIFICATION</option>
              <option value="">MULTIPLE CHOICE</option>
              <option value="">NUMERICAL</option>
              <option value="">TRUE OR FALSE</option>
            </select>
          </form>
          <form className="row p-sm-2 px-3">
            <p className="col-sm-4 col-md-5 my-1 text-sm-start text-center">
              NUMBER OF QUESTION
            </p>
            <input
              type="number"
              className="col-sm-2 rounded border border-dark text-sm-start text-center"
            />
            <p className="col-sm-4 col-md-3 my-1 text-center">PAGE SIZE</p>
            <input
              type="number"
              className="col-sm-2 col-12 rounded border border-dark text-sm-start text-center"
            />
          </form>
          <form className="row p-sm-2 px-3">
            <p className="col-sm-4 my-1 text-sm-start text-center">
              PAGE ORIENTATION
            </p>
            <select
              type="text"
              className="col-sm-6 rounded border border-dark text-sm-start text-center"
            >
              <option selected>Choose...</option>
              <option value="">LANDSCAPE</option>
              <option value="">POTRAIT</option>
            </select>
          </form>
          <div className="text-center">
            <button className="btn btn-outline-dark px-sm-5 mt-2 mt-sm-0">
              GENERATE
            </button>
          </div>
        </section>
        {/* END CONTENT */}
      </section>
    </main>
  );
}
