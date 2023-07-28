"use client";
import Footer from "@/components/DefaultFix/Footer";
import NavBar from "@/components/DefaultFix/NavBar";
import Login from "@/components/LoginPage/Login";

export default function LoginPage() {
  return (
    <main>
      <div>
        <NavBar />
      </div>
      <div>
        <Login />
      </div>
      <div>
        <Footer />
      </div>
    </main>
  );
}
