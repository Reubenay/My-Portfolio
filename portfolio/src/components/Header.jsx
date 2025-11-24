// import { useState } from "react";
// import { Link } from "react-scroll";
// import { FaBars, FaTimes } from "react-icons/fa";

// // Updated NavLink to accept an onClick prop (so the menu closes when clicked)
// const NavLink = ({ to, children, onClick }) => (
//   <Link
//     to={to}
//     spy={true}
//     smooth={true}
//     offset={-70}
//     duration={500}
//     onClick={onClick} // Add this line
//     className="cursor-pointer text-text-dark hover:text-primary transition-colors duration-300 block py-2 md:py-0"
//   >
//     {children}
//   </Link>
// );

// const Header = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   // Function to toggle the menu
//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   // Function to close menu (passed to links)
//   const closeMenu = () => {
//     setIsOpen(false);
//   };

//   return (
//     <header className="sticky top-0 z-50 bg-bg-dark/95 backdrop-blur-sm border-b border-white/5">
//       <nav className="max-w-6xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
        
//         {/* Logo */}
//         <h1 className="text-2xl font-bold text-text-light">
//           Reuben<span className="text-primary">.</span>
//         </h1>

//         {/* Desktop Menu (Hidden on Mobile) */}
//         <div className="hidden md:flex space-x-8">
//           <NavLink to="about">About</NavLink>
//           <NavLink to="skills">Skills</NavLink>
//           <NavLink to="projects">Projects</NavLink>
//           <NavLink to="contact">Contact</NavLink>
//         </div>

//         {/* Mobile Burger Button (Hidden on Desktop) */}
//         <div className="md:hidden">
//           <button
//             onClick={toggleMenu}
//             className="text-text-light hover:text-primary focus:outline-none transition-colors"
//             aria-label="Toggle menu"
//           >
//             {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
//           </button>
//         </div>
//       </nav>

//       {/* Mobile Menu Dropdown */}
//       {isOpen && (
//         <div className="md:hidden absolute top-20 left-0 w-full bg-bg-dark border-b border-white/5 shadow-lg animate-fade-in-down">
//           <div className="flex flex-col px-6 py-4 space-y-2">
//             <NavLink to="about" onClick={closeMenu}>About</NavLink>
//             <NavLink to="skills" onClick={closeMenu}>Skills</NavLink>
//             <NavLink to="projects" onClick={closeMenu}>Projects</NavLink>
//             <NavLink to="contact" onClick={closeMenu}>Contact</NavLink>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Header;


import { useState } from "react";
import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink, useNavigate } from "react-router-dom"; // Import RouterLink
import { FaBars, FaTimes, FaUserShield } from "react-icons/fa";

const NavLink = ({ to, children, onClick }) => (
  <ScrollLink
    to={to}
    spy={true}
    smooth={true}
    offset={-70}
    duration={500}
    onClick={onClick}
    className="cursor-pointer text-text-dark hover:text-primary transition-colors duration-300 block py-3 text-lg md:text-base md:py-0"
  >
    {children}
  </ScrollLink>
);

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full bg-bg-dark/95 backdrop-blur-sm border-b border-white/10">
      <nav className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between relative">
        
        {/* Logo */}
        <h1 className="text-2xl font-bold text-text-light z-50 cursor-pointer" onClick={() => navigate('/')}>
          Reuben<span className="text-primary">.</span>
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 items-center">
          <NavLink to="about">About</NavLink>
          <NavLink to="skills">Skills</NavLink>
          <NavLink to="projects">Projects</NavLink>
          <NavLink to="contact">Contact</NavLink>
          
          {/* Admin Button (Desktop) */}
          <RouterLink 
            to="/login" 
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 text-primary hover:bg-primary hover:text-white transition-all duration-300 text-sm font-semibold"
          >
            <FaUserShield /> Admin
          </RouterLink>
        </div>

        {/* Mobile Toggle Button */}
        <div className="md:hidden z-50 flex items-center gap-4">
           {/* Admin Button (Mobile Icon Only) */}
           <RouterLink to="/login" className="text-primary">
              <FaUserShield size={20} />
           </RouterLink>
           
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-text-light hover:text-primary focus:outline-none p-2"
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 w-full bg-bg-dark border-b border-white/10 shadow-2xl md:hidden flex flex-col py-4 px-6 animate-fade-in">
            <NavLink to="about" onClick={() => setIsOpen(false)}>About</NavLink>
            <NavLink to="skills" onClick={() => setIsOpen(false)}>Skills</NavLink>
            <NavLink to="projects" onClick={() => setIsOpen(false)}>Projects</NavLink>
            <NavLink to="contact" onClick={() => setIsOpen(false)}>Contact</NavLink>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;