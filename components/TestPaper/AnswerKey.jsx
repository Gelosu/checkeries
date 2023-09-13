export default function AnswerKey() {
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
            <li className="m-0 fs-5 text-decoration-none">ANSWER SHEET</li>
          </a>
          <a
            href="/Test/AnswerKey"
            className="text-decoration-underline link-dark"
          >
            <li className="m-0 fs-5">ANSWER KEY</li>
          </a>
          <a href="/Test/Records" className="text-decoration-none link-dark">
            <li className="m-0 fs-5">RECORDS</li>
          </a>
        </ul>
        {/* CONTENT */}
        <section className="container-sm mt-5 col-xl-6 py-3 px-4 border border-dark rounded">
          <form className="row">
            <h5 className="col-6 m-0 text-center align-self-center">TYPE OF TEST</h5>
            <select className="py-1 px-3 border border-dark rounded col-6" name="" id="">
              <option value="" selected disabled hidden>
                Choose...
              </option>
              <option value="IDENTIFICATION">IDENTIFICATION</option>
              <option value="MULTIPLE CHOICE">MULTIPLE CHOICE</option>
              <option value="NUMERICAL">NUMERICAL</option>
              <option value="TRUE OR FALSE">TRUE OR FALSE</option>
            </select>
            <div className="col-12">
                <p>1</p>
                <p>1</p>
                <p>1</p>
              </div>
          </form>
        </section>
        {/* END CONTENT */}
      </section>
    </main>
  );
}
