import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { Outlet } from "react-router-dom";
import { Button } from "react-bootstrap";

const SIDEBAR_WIDTH = 260;

export default function AdminLayout() {
  const [show, setShow] = useState(false);

  return (
    <>
      {/* SIDEBAR */}
      <AdminSidebar show={show} onHide={() => setShow(false)} />

      {/* MAIN CONTENT */}
      <div
        style={{
          marginLeft: SIDEBAR_WIDTH,
          minHeight: "100vh",
          background: "#f4f6f9"
        }}
      >
        {/* MOBILE TOGGLE */}
        <div className="d-lg-none p-2 bg-dark text-white">
          <Button variant="outline-light" onClick={() => setShow(true)}>
            ☰ Menu
          </Button>
        </div>

        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </>
  );
}
