import { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { navigation } from "../constants";
import Button from "./Button";
import MenuSvg from "../assets/svg/MenuSvg";
import { HamburgerMenu } from "./design/Header";

const Header = () => {
  const pathname = useLocation();
  const [openNavigation, setOpenNavigation] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
  const menuRef = useRef(null); // Referencia para el menú desplegable

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  const handleClick = () => {
    if (!openNavigation) return;
    enablePageScroll();
    setOpenNavigation(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(getAuth());
      setUser(null);
      setShowLogout(false);
    } catch (error) {
      console.error("Error cerrando sesión:", error);
    }
  };

  const toggleLogoutMenu = () => {
    setShowLogout((prev) => !prev);
  };

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowLogout(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 border-b border-n-6 lg:bg-n-8/90 lg:backdrop-blur-sm ${
        openNavigation ? "bg-n-8" : "bg-n-8/90 backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
        <Link className="block w-[12rem] xl:mr-8" to="/">
          <h1 className="text-2xl text-n-1">HANDS AI</h1>
        </Link>

        <nav
          className={`${
            openNavigation ? "flex " : "hidden"
          } fixed top-[5rem] left-0 right-0 bottom-0 bg-n-8 lg:static lg:flex lg:mx-auto lg:bg-transparent`}
        >
          <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
            {navigation.map((item) => (
              <Link
                key={item.id}
                to={item.url}
                onClick={handleClick}
                className={`block relative font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 
            ${item.onlyMobile ? "lg:hidden" : ""}
            px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold ${
              item.url === location.pathname
                ? "z-2 lg:text-n-1"
                : "lg:text-n-1/50"
            } lg:leading-5 lg:hover:text-n-1 xl:px-12`}
              >
                {item.title}
              </Link>
            ))}
          </div>

          <HamburgerMenu />
        </nav>

        {/* Mostrar nombre de usuario y menú de cerrar sesión si está logueado */}
        {user ? (
          <div className="relative ml-auto flex items-center">
            <p className="text-white cursor-pointer" onClick={toggleLogoutMenu}>
              {user.displayName || "User"}
            </p>

            {showLogout && (
              <div
                ref={menuRef}
                className="absolute right-0 mt-2 bg-n-8 border border-gray-300 rounded shadow-lg"
              >
                <Link
                  to="/profile"
                  className="block px-4 py-1 text-white hover:bg-gray-200 hover:text-gray-800 whitespace-nowrap"
                >
                  Mi Perfil
                </Link>
                <Link
                  to="/badges"
                  className="block px-4 py-1 text-white hover:bg-gray-200 hover:text-gray-800 whitespace-nowrap"
                >
                  Mis Insignias
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-1 text-red-500 hover:bg-gray-200 whitespace-nowrap"
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              to="/signup"
              className="button hidden mr-8 text-n-1/50 transition-colors hover:text-n-1 lg:block"
            >
              New Account
            </Link>
            <Link to="/login" className="button hidden lg:flex">
              Sign in
            </Link>
          </>
        )}

        <Button
          className="ml-auto lg:hidden"
          px="px-3"
          onClick={toggleNavigation}
        >
          <MenuSvg openNavigation={openNavigation} />
        </Button>
      </div>
    </div>
  );
};

export default Header;
