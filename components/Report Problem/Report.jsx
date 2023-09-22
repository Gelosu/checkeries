"use client"
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ReportProblem() {
  const SearchParams = useSearchParams();
  const gsfeAcc = SearchParams.get("gmail")
  return (
    <main className="custom-m col-11 col-md-10 p-0">
      <div className="d-flex justify-content-start align-items-center">
        <Link href="/">
          <button className="btn btn-outline-none" type="button">
            <img src="/back-arrow.svg" alt="backArrow" height={30} width={40} />
          </button>
        </Link>
        <h4 className="text-dark fw-bold fs-3 my-1">REPORT PROBLEM</h4>
      </div>
      <div className="studrepprobpt mx-auto col-lg-6 row">
        <div className="studsettingbg mx-auto col-lg-9 border border-dark rounded-4 pt-3">
          <form>
            <div className="form-outline mx-4">
              <input
                type="text"
                value={gsfeAcc}
                className="form-control border border-dark rounded-3 mt-1 mb-2"
                disabled
              />
              <textarea
                type="text"
                placeholder="Message"
                className="form-control border border-dark rounded-3 mt-1 mb-2 pb-5"
              />
            </div>
          </form>
          <div>
            <button
              type="button"
              className="btn btn-outline-dark rounded-3 mt-2 mb-3 studrepmx"
            >
              <h5 className="mb-0">SAVE</h5>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
