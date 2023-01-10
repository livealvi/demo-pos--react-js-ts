import React, { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { IoIosArrowDown } from "react-icons/io";
import { NavLink } from "react-router-dom";

const Dropdown = ({ showAnimation, isOpen, route, setIsOpen }: any) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) {
      setIsDropdownOpen(false);
    }
  }, [isOpen]);

  const menuAnimation = {
    hidden: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
    show: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <>
      <div
        onClick={toggleDropdown}
        className="dropdown flex items-center justify-between hover: text-current gap-5 px-5 py-4 hover:bg-sky-200 hover:border-r-sky-500 hover:border-r-[7px] transition duration-150 hover:transition hover:duration-120  "
      >
        <div className="menu-item flex gap-5">
          <div className="icon pr-[10px]">{route.icon}</div>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                variants={showAnimation}
                initial="hidden"
                exit="hidden"
                animate="show"
                className="link_text whitespace-nowrap"
              >
                {route.name}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <motion.div
          animate={isDropdownOpen ? { rotate: -90 } : { rotate: 0 }}
          className=""
        >
          {isOpen && <IoIosArrowDown size={20} />}
        </motion.div>
      </div>
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            variants={menuAnimation}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="dropdown "
          >
            {route.subRoutes.map((subRoute: any, i: any) => (
              <NavLink
                to={subRoute.path}
                key={i}
                className="flex items-center text-current gap-5  py-4 pl-14 hover:bg-sky-200 hover:border-r-sky-500 hover:border-r-[7px] transition duration-150 hover:transition hover:duration-120"
              >
                <div className="icon icon pr-[10px]">{subRoute.icon}</div>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      variants={showAnimation}
                      className="link_text whitespace-nowrap"
                    >
                      {subRoute.name}
                    </motion.div>
                  )}
                </AnimatePresence>
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Dropdown;
