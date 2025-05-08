import { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { navigation } from "../constants";
import Button from "./Button";
import MenuSvg from "../assets/svg/MenuSvg";
import { HamburgerMenu } from "./design/Header";

const Header = () => {
  const location = useLocation();
  const [openNavigation, setOpenNavigation] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
  const [userStreak, setUserStreak] = useState(0);
  const menuRef = useRef(null);

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserStreak(userData.stats?.daysStreak || 0);
          }
        } catch (error) {
          console.error("Error al obtener la racha del usuario:", error);
        }
      } else {
        setUser(null);
        setUserStreak(0);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleNavigation = () => {
    setOpenNavigation((prev) => {
      const newState = !prev;
      newState ? disablePageScroll() : enablePageScroll();
      return newState;
    });
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
            openNavigation ? "flex" : "hidden"
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

            {/* Enlaces de login y signup solo en móvil y si no hay usuario */}
            {!user && (
              <>
                <Link
                  to="/signup"
                  onClick={handleClick}
                  className="block font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 lg:hidden px-6 py-6 md:py-8"
                >
                  New Account
                </Link>
                <Link
                  to="/login"
                  onClick={handleClick}
                  className="block font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 lg:hidden px-6 py-6 md:py-8"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>

          <HamburgerMenu />
        </nav>

        {/* Usuario logueado: nombre y racha */}
        {user ? (
          <div className="relative ml-auto flex items-center">
            <div className="flex flex-col items-end">
              <p
                className="text-white cursor-pointer text-lg font-medium"
                onClick={toggleLogoutMenu}
              >
                {user.displayName || "User"}
              </p>
              <div className="flex items-center text-sm text-orange-400">
                <span>Racha: {userStreak}</span>
                <span className="ml-1">🔥</span>
              </div>
            </div>

            {showLogout && (
              <div
                ref={menuRef}
                className="absolute right-0 top-full mt-2 bg-n-8 border border-gray-300 rounded shadow-lg"
              >
                <button
                  onClick={handleLogout}
                  className="block px-4 py-1 text-red-500 hover:bg-gray-200 whitespace-nowrap"
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
