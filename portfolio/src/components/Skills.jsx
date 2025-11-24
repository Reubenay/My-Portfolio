// src/components/Skills.jsx
import { 
  FaHtml5, FaCss3Alt, FaJs, FaReact 
} from 'react-icons/fa';
import { SiTailwindcss, SiFastapi, SiMysql } from "react-icons/si";

// Sub-component for the 10 dots
const SkillRating = ({ level, color }) => {
  return (
    <div className="flex space-x-1.5">
      {Array(10).fill(0).map((_, i) => (
        <div 
          key={i}
          className={`w-3 h-3 md:w-3.5 md:h-3.5 rounded-full ${i < level ? color : 'bg-gray-700/50'}`}
        ></div>
      ))}
    </div>
  );
};

// Skill data
const skillsData = [
  { name: 'HTML', icon: <FaHtml5 className="text-orange-500" size={32} />, level: 8, color: 'bg-orange-500' },
  { name: 'CSS', icon: <FaCss3Alt className="text-blue-500" size={32} />, level: 8, color: 'bg-blue-500' },
  { name: 'JavaScript', icon: <FaJs className="text-yellow-400" size={32} />, level: 8, color: 'bg-yellow-400' },
  { name: 'React', icon: <FaReact className="text-cyan-400" size={32} />, level: 8, color: 'bg-cyan-400' },
  { name: 'Tailwind', icon: <SiTailwindcss className="text-indigo-400" size={32} />, level: 8, color: 'bg-indigo-400' },
  { name: 'FastAPI', icon: <SiFastapi className="text-green-500" size={32} />, level: 8, color: 'bg-green-500' },
   { name: 'MySQL', icon: <SiMysql className="text-blue-600" size={32} />, level: 8, color: 'bg-blue-600' },

];

const Skills = () => {
  return (
    <section id="skills" className="py-24">
      <h2 className="text-4xl font-bold text-center mb-16">My Skills</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 max-w-3xl mx-auto">
        {skillsData.map((skill) => (
          <div key={skill.name} className="flex items-center gap-4">
            
            {/* 1. Icon */}
            <div className="w-10 shrink-0 flex justify-center">
              {skill.icon}
            </div>

            {/* 2. Name (Added with fixed width for perfect alignment) */}
            <div className="w-24 md:w-28 font-semibold text-text-light text-lg">
              {skill.name}
            </div>

            {/* 3. Dots */}
            <div className="flex-1">
              <SkillRating level={skill.level} color={skill.color} />
            </div>
            
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;