import { AlignJustify, Search, Slash } from "lucide-react";
import Sidebar from "./Sidebar";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import RegLog from "./RegLog";
import { Button, Center, useDisclosure } from "@chakra-ui/react";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { FiLogOut } from "react-icons/fi";
import { Tooltip } from "@chakra-ui/react";
import { logoutUserRequest } from "../../State/User/userAction";
const Navbar = () => {
  const { data: isLogin } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [drop1, setDrop1] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    localStorage.removeItem("userInfo");
    dispatch(logoutUserRequest());
    // window.location.replace();
  };

  return (
    //
    <>
      <div
        className={` md:mb-[68px]   ${
          drop1 ? "mb-[292px]" : "mb-[70px]"
        } w-full`}
      >
        <nav
          id="navbar"
          className={` border-gray-200 text-white bg-gray-900 select-none  w-full fixed top-0 left-0 z-50`}
        >
          <div className=" flex flex-wrap items-center justify-between mx-auto p-4">
            <div className="flex space-x-1">
              {isLogin && <Sidebar />}
              <img
                src="https://flowbite.com/docs/images/logo.svg"
                className="h-8 cursor-pointer"
                alt="Flowbite Logo"
              />
              <NavLink
                to="/"
                className="flex items-center space-x-3 rtl:space-x-reverse"
              >
                <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                  <span className="text-blue-700">Dev</span>Tube
                </span>
              </NavLink>
            </div>

            <div className={`flex md:order-2 `}>
              {/* Login Signup*/}

              {isLogin ? (
                <div className="flex space-x-2">
                  <div className="relative hidden md:block">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 20"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                        />
                      </svg>
                      <span className="sr-only">Search icon</span>
                    </div>
                    <input
                      type="text"
                      id="search-navbar"
                      className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Search"
                    />
                  </div>
                  <div className="hidden md:block">
                    <Tooltip hasArrow label="Log out" bg="red.600">
                      {/* <Button>Button</Button> */}
                      <Button
                        colorScheme="red"
                        variant="outline"
                        onClick={handleLogout}
                      >
                        <FiLogOut />
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      onOpen();
                    }}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 md:mt-0 mt-3 md:block hidden  "
                  >
                    Register / Login
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  setDrop1(!drop1);
                }}
                type="button"
                className={`inline-flex items-center py-5 ${
                  isLogin ? "px-11" : "px-5"
                } ${
                  drop1 ? "px-5 " : " px-11 "
                } w-11 h-11 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600`}
                // data-collapse-toggle="navbar-search"
                // aria-controls="navbar-search"
                // aria-expanded="false"
                // aria-expanded={drop1 ? "true" : "false"}
              >
                <span className="flex">
                  {drop1 ? (
                    <span className="text-2xl">
                      <IoMdClose />
                    </span>
                  ) : (
                    <>
                      {" "}
                      {isLogin && (
                        <>
                          {" "}
                          <span>
                            <Search />
                          </span>
                          <span className=" mx-1" style={{ fontSize: "32px" }}>
                            |
                          </span>
                        </>
                      )}
                      <span className="sr-only">Open main menu</span>
                      <AlignJustify strokeWidth={1.5} />
                    </>
                  )}
                </span>
              </button>
            </div>

            <div
              className={`items-center justify-between ${
                drop1 ? " " : " hidden"
              } w-full md:flex md:w-auto md:order-1`}
              id="navbar-search"
            >
              {isLogin && (
                <div className="relative mt-3 md:hidden">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="search-navbar"
                    className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Search..."
                  />
                </div>
              )}

              <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg  md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0  ">
                <li>
                  <NavLink
                    onClick={() => {
                      setDrop1(!drop1);
                    }}
                    to="/"
                    className="block py-2 px-3  rounded hover:bg-gray-100 hover:text-blue-700 md:hover:bg-transparent md:hover:text-blue-700 md:p-0  focus:text-blue-700 "
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    onClick={() => {
                      setDrop1(!drop1);
                    }}
                    to="/about"
                    className="block py-2 px-3  rounded hover:bg-gray-100  hover:text-blue-700 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 focus:text-blue-700 "
                  >
                    About
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    onClick={() => {
                      setDrop1(!drop1);
                    }}
                    to="/contact"
                    className="block py-2 px-3  hover:text-blue-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0  focus:text-blue-700"
                  >
                    Contact
                  </NavLink>
                </li>
                <li></li>
              </ul>

              {!isLogin ? (
                <>
                  <div className="mt-2 md:hidden">
                    <Center>
                      <button
                        type="button"
                        onClick={() => {
                          setDrop1(!drop1);
                          onOpen();
                        }}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 md:mt-0 mt-3 md:hidden "
                      >
                        Register / Login
                      </button>
                    </Center>
                  </div>
                </>
              ) : (
                <div className="mt-2 md:hidden">
                  <Center>
                    <Button
                      colorScheme="red"
                      variant="outline"
                      onClick={() => {
                        setDrop1(!drop1);
                        handleLogout();
                      }}
                    >
                      <span className="mr-2">Log out </span>
                      <FiLogOut />
                    </Button>
                  </Center>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
      <RegLog onClose={onClose} isOpen={isOpen} onOpen={onOpen} />
    </>
  );
};

export default Navbar;
