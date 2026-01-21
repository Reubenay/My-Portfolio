// import { FaGithub, FaLinkedin, FaEnvelope, FaHtml5, FaJs, FaReact } from 'react-icons/fa';
// import { HiDownload } from 'react-icons/hi'; // For the download icon

// const SocialLink = ({ href, icon }) => (
//   <a 
//     href={href} 
//     target="_blank" 
//     rel="noopener noreferrer" 
//     className="w-10 h-10 flex items-center justify-center rounded-full bg-bg-dark border border-white/10 text-text-dark hover:text-primary hover:border-primary transition-all duration-300"
//   >
//     {icon}
//   </a>
// );

// const Hero = () => {
//   return (
//     <section id="home" className="min-h-[90vh] flex items-center justify-center pt-20 pb-10 md:pt-32">
//       <div className="max-w-6xl mx-auto px-6 lg:px-8 w-full flex flex-col-reverse md:flex-row items-center justify-between gap-12 md:gap-20">
        
//         {/* --- Left Side: Text Content --- */}
//         <div className="flex-1 text-center md:text-left z-10">
//           <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 tracking-tight">
//             Hi, I'm Reuben Mulero
//           </h1>
          
//           <h2 className="text-3xl md:text-5xl font-bold mb-6">
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
//               AI developer
//             </span>
//           </h2>
          
//           <p className="text-lg text-text-dark mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
//             Crafting modern, responsive, and user-friendly websites, integrating Artificial Intelligence with passion and precision.
//           </p>
          
//           <div className="flex flex-col sm:flex-row items-center gap-6 justify-center md:justify-start">

//             <a 
//               href="/resume.pdf" 
//               className="group flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-1"
//             >
//               Download Resume 
//               <HiDownload className="text-xl group-hover:animate-bounce" />
//             </a>

//             {/* Social Icons */}
//             <div className="flex gap-4">
//               <SocialLink href="https://github.com/Reubenay" icon={<FaGithub size={20} />} />
//               <SocialLink href="https://www.linkedin.com/in/reuben-mulero-204bb6228/" icon={<FaLinkedin size={20} />} />
//               <SocialLink href="https://mail.google.com/mail/u/0/?hl=en#inbox?compose=new" icon={<FaEnvelope size={20} />} />
//             </div>
//           </div>
//         </div>

//         {/* --- Right Side: Image & Floating Icons --- */}
//         <div className="relative w-72 h-72 md:w-96 md:h-96 flex-shrink-0">
//           <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full blur-3xl opacity-20 animate-pulse"></div>
//           <div className="relative w-full h-full rounded-full p-1.5 bg-gradient-to-br from-white/20 to-transparent backdrop-blur-sm">
//             <img 
//               src="/profile-pic.jpg" 
//               alt="Reuben Mulero" 
//               className="w-full h-full rounded-full object-cover border-4 border-bg-dark shadow-2xl"
//             />
//           </div>


//           <div className="absolute top-0 left-0 -translate-x-1/4 translate-y-1/4 w-14 h-14 bg-bg-dark/80 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center shadow-xl animate-[float_3s_ease-in-out_infinite]">
//             <FaJs className="text-[#beaf25] text-2xl" />
//           </div>

//           <div className="absolute top-4 right-4 -translate-y-1/2 translate-x-1/4 w-12 h-12 bg-bg-dark/80 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center shadow-xl animate-[float_4s_ease-in-out_infinite_1s]">
//             <FaHtml5 className="text-[#E34F26] text-2xl" />
//           </div>

//           <div className="absolute bottom-8 right-0 translate-x-1/4 w-16 h-16 bg-bg-dark/80 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center shadow-xl animate-[float_5s_ease-in-out_infinite_0.5s]">
//             <FaReact className="text-[#61DAFB] text-3xl animate-spin-slow" />
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// };

// export default Hero;

import { useState, useEffect } from "react";
import { FaGithub, FaLinkedin, FaEnvelope, FaHtml5, FaJs, FaReact } from 'react-icons/fa';
import { HiDownload } from 'react-icons/hi';

const SocialLink = ({ href, icon }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="w-10 h-10 flex items-center justify-center rounded-full bg-bg-dark border border-white/10 text-text-dark hover:text-primary hover:border-primary transition-all duration-300"
  >
    {icon}
  </a>
);

const Hero = () => {

  // Typing Animation
  const fullName = "Reuben.";
  const [typedName, setTypedName] = useState("");

  useEffect(() => {
    if (typedName.length < fullName.length) {
      const timer = setTimeout(() => {
        setTypedName(fullName.substring(0, typedName.length + 1));
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [typedName, fullName]);

  return (
    <section id="home" className="min-h-[90vh] flex items-center justify-center pt-20 pb-10 md:pt-32">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 w-full flex flex-col-reverse md:flex-row items-center justify-between gap-12 md:gap-20">
        
        {/* --- Left Side: Text Content --- */}
        <div className="flex-1 text-center md:text-left z-10">

          {/* TYPING + BLINKING NAME */}
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 tracking-tight">
            Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary pb-6">
              {typedName}
            </span>
            <span className="blinking-cursor"></span>
          </h1>

          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent pt-12 mt-6">
              AI Developer
            </span>
          </h2>
          
          <p className="text-lg text-text-dark mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
            Crafting modern, responsive, and user-friendly websites, integrating Artificial Intelligence with passion and precision.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 justify-center md:justify-start">

            <a 
              href="/resume.pdf" 
              className="group flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-1"
            >
              Download Resume 
              <HiDownload className="text-xl group-hover:animate-bounce" />
            </a>

            {/* Social Icons */}
            <div className="flex gap-4">
              <SocialLink href="https://github.com/Reubenay" icon={<FaGithub size={20} />} />
              <SocialLink href="https://www.linkedin.com/in/reuben-mulero-204bb6228/" icon={<FaLinkedin size={20} />} />
              <SocialLink href="https://mail.google.com/mail/u/0/?hl=en#inbox?compose=new" icon={<FaEnvelope size={20} />} />
            </div>
          </div>
        </div>

        {/* --- Right Side: Image & Floating Icons --- */}
        <div className="relative w-72 h-72 md:w-96 md:h-96 flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="relative w-full h-full rounded-full p-1.5 bg-gradient-to-br from-white/20 to-transparent backdrop-blur-sm">
            <img 
              src="/profile-pic.jpg" 
              alt="Reuben Mulero" 
              className="w-full h-full rounded-full object-cover border-4 border-bg-dark shadow-2xl"
            />
          </div>

          <div className="absolute top-0 left-0 -translate-x-1/4 translate-y-1/4 w-14 h-14 bg-bg-dark/80 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center shadow-xl animate-[float_3s_ease-in-out_infinite]">
            <FaJs className="text-[#beaf25] text-2xl" />
          </div>

          <div className="absolute top-4 right-4 -translate-y-1/2 translate-x-1/4 w-12 h-12 bg-bg-dark/80 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center shadow-xl animate-[float_4s_ease-in-out_infinite_1s]">
            <FaHtml5 className="text-[#E34F26] text-2xl" />
          </div>

          <div className="absolute bottom-8 right-0 translate-x-1/4 w-16 h-16 bg-bg-dark/80 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center shadow-xl animate-[float_5s_ease-in-out_infinite_0.5s]">
            <FaReact className="text-[#61DAFB] text-3xl animate-spin-slow" />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
