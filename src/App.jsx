import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminHome from "./pages/admin/AdminHome";
import Reports from "./pages/admin/Reports";
import Profile from "./pages/profile/Profile";
import NotAuthorized from "./pages/NotAuthorized";
import RequireRole from "./components/RequireRole";

const ADMIN_ROLE = "Admin";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route
          path="/admin"
          element={
            <RequireRole allowedRoles={[ADMIN_ROLE]}>
              <AdminHome />
            </RequireRole>
          }
        />

        <Route
          path="/admin/reports"
          element={
            <RequireRole allowedRoles={[ADMIN_ROLE]}>
              <Reports />
            </RequireRole>
          }
        />

        <Route path="/profile" element={<Profile />} />
        <Route path="/not-authorized" element={<NotAuthorized />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;