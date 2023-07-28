import Link from "next/link";


export default function UpdatePassword() {
    return (
      <main className="container-sm vh-100 d-flex justify-content-center align-items-center">
        <section className="col-sm-5 border border-dark rounded p-3 py-5">
          <p className="text-center fs-5 fw-bold">FORGOT PASSWORD</p>
          <form className="row gap-3 justify-content-center">
            <input
              type="password"
              className="w-75 py-1 px-3 border border-dark rounded text-center"
              placeholder="NEW PASSWORD"
            />
            <input
              type="password"
              className="w-75 py-1 px-3 border border-dark rounded text-center"
              placeholder="CONFIRM PASSWORD"
            />
            <div className="text-center mb-3">
              <Link href="/login"><button className="btn btn-outline-dark" href="/login">SUBMIT</button></Link>
            </div>
          </form>
        </section>
      </main>
    );
  }
  