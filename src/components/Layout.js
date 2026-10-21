import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./NavBar";

const Layout = ({ loading, error }) => {
  const { pathname } = useLocation();

  return (
    <div>
      <NavBar />
      <main className="content">
        {loading ? (
          <p>Đang tải...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div key={pathname} className="page">
            <Outlet />
          </div>
        )}
      </main>
    </div>
  );
};

export default Layout;