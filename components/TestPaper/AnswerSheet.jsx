export default function AnswerSheet() {
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
          <a href="/Test/TestPaper" className="text-decoration-none link-dark">
            <li className="m-0 fs-5">TEST PAPER</li>
          </a>
          <a>
            <li className="m-0 fs-5 text-decoration-underline">ANSWER SHEET</li>
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
              className="py-1 px-3 col-sm-8 rounded border border-dark text-sm-start text-center"
            >
              <option value="" selected disabled hidden>
                Choose...
              </option>
              <option value="IDENTIFICATION">IDENTIFICATION</option>
              <option value="MULTIPLE CHOICE">MULTIPLE CHOICE</option>
              <option value="NUMERICAL">NUMERICAL</option>
              <option value="TRUE OR FALSE">TRUE OR FALSE</option>
            </select>
          </form>
          <form className="row p-sm-2 px-3">
            <p className="col-4 my-1 text-sm-start text-center pe-0">
              NUMBER OF QUESTION
            </p>
            <input
              min="0"
              type="number"
              className="py-1 px-3 col-2 rounded border border-dark text-sm-start text-center"
            />
            <p className="col-4 my-1 text-sm-start text-center">
              NUMBER OF CHOICES
            </p>
            <input
              min="0"
              type="number"
              className="py-1 px-3 col-2 rounded border border-dark text-sm-start text-center"
            />
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
