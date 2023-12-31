import React, { useState } from 'react';
import { HiChevronDoubleLeft } from 'react-icons/hi2';
import { MdHome } from "react-icons/md";
import { FaSearchengin } from "react-icons/fa6";
import { motion } from 'framer-motion';
import { Link, Routes, Route } from 'react-router-dom';
import { Logo } from '../assets';
import { Projects, SignUp } from "../container";
import { useDispatch, useSelector } from 'react-redux';
import { UserProfileDetails } from '../components';
import { SET_SEARCH_ACTIONS } from '../context/actions/searchActions';

const Home = () => {
    const [isSideMenu, setIsSideMenu] = useState(false);
    const user = useSelector((state) => state.user?.user);
    const searchTerm = useSelector((state) =>
      state?.searchTerm?.searchTerm ? state.searchTerm?.searchTerm : ""
    );

  const dispatch = useDispatch();


  return (
    <>
      <div
        className={`w-2 ${
          isSideMenu ? "w-2" : "flex-[.60] sm:flex-[.2] "
        }
       min-h-screen max-h-screen relative bg-secondary px-3 py-6 flex flex-col items-center justify-start gap-4 transition-all duration-200 ease-in-out`}
      >
        {/* anchor */}
        <motion.div
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setIsSideMenu((prev) => !prev);
          }}
          className="w-8 h-8 bg-secondary rounded-tr-lg rounded-br-lg 
        absolute -right-6 flex items-center justify-center cursor-pointer"
        >
          <HiChevronDoubleLeft className="text-white text-xl" />
        </motion.div>

        <div className="overflow-hidden w-full flex flex-col gap-4">
          {/* logo */}
          <Link to={"/home"}>
            <img
              src={Logo}
              alt="Logo"
              className="object-contain"
              style={{ width: "200px" }}
            />
          </Link>
          {/* Web Developement enviroment  */}
          <Link to={"/newProject"}>
            <div
              class=" py-2 flex items-center justify-center rounded-xl border
             border-gray-400 cursor-pointer group hover:border-gray-200"
            >
              <p className="sm:text-lg text-sm text-gray-400 group-hover:text-gray-200 capitalize">
                Enviroment
              </p>
            </div>
          </Link>
          {/* Online Compilers  */}
          <Link to={"/compiler"}>
            <div
              class=" py-2 flex items-center justify-center rounded-xl border
             border-gray-400 cursor-pointer group hover:border-gray-200"
            >
              <p className="sm:text-lg text-sm text-gray-400 group-hover:text-gray-200 capitalize">
                Compiler
              </p>
            </div>
          </Link>
          {/* Home nav */}
          {user && (
            <Link
              to={"/home/projects"}
              className="flex items-center justify-center gap-4 "
            >
              <MdHome className="text-primaryText text-xl " />
              <p className="text-lg text-primaryText ">Home</p>
            </Link>
          )}
        </div>
      </div>
      <div
        className="flex-1 min-h-screen max-h-screen overflow-y-scroll h-full flex
      flex-col items-start justify-start px-4 md:px-12 py-4 md:py-12"
      >
        {/* Top section  */}
        <div className="w-full flex items-center justify-between gap-3">
          {/* Search */}
          <div
            className="bg-secondary w-full px-2 sm:px-4 py-2 rounded-md flex items-center justify-start sm:justify-center
            gap-1 sm:gap-3"
          >
            <FaSearchengin className="text-2xl text-primaryText" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => dispatch(SET_SEARCH_ACTIONS(e.target.value))}
              className="flex-1 px-1 sm:px-4 py-1 text-md sm:text-xl bg-transparent outline-none border-none
              text-primaryText placeholder:text-gray-600 hidden sm:block"
              placeholder="Search here..."
            />
          </div>
          {/* Profile section */}
          {!user && (
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="flex items-center justify-center gap-3"
            >
              <Link
                to={"/home/auth"}
                className="bg-emerald-500 px-6 py-2 text-white text-lg cursor-pointer hover:bg-emerald-700 rounded-sm"
              >
                SignUp
              </Link>
            </motion.div>
          )}
          {user && <UserProfileDetails />}
        </div>
        {/* Bottom section */}
        <div className="w-full">
          <Routes>
            <Route path="/*" element={<Projects />} />
            <Route path="/auth" element={<SignUp />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default Home // comment