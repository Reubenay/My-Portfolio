import { useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';

// Project Data
const webProjects = [
  {
    title: 'E-commerce Page',
    description: 'A clean, focused homepage UI for an e-commerce platform. Designed to reduce show and display products for clients.',
    imgUrl: '/project1.png.png',
    repoUrl: 'https://github.com/Reubenay/React/tree/master/TAILWINDD/complete-e-commere',
    demoUrl: '#',
  },
  {
    title: 'Expense Tracker',
    description: 'It allows users to add transactions, categorize spending, view summaries, and track their financial habits through a clean, responsive interface. Perfect for improving budgeting and money management.',
    imgUrl: '/expense-tracker.png',
    repoUrl: 'https://github.com/Reubenay/React/tree/master/expense-tracker',
    demoUrl: '#',
  },
  {
    title: 'Student Performance Tracker',
    description: 'A lightweight app that helps track students’ academic progress by recording scores, monitoring subject-by-subject performance, and visualizing overall improvement. It provides teachers and students with clear insights, easy updates, and a simple dashboard for evaluating growth over time.',
    imgUrl: '/performance.jpg',
    repoUrl: '#',
    demoUrl: '#',
  },
];

// Sub-component for Project Cards
const ProjectCard = ({ title, description, imgUrl, repoUrl, demoUrl }) => (
  <div className="bg-card-bg border border-border-color rounded-lg overflow-hidden shadow-lg 
                  transform transition-transform duration-300 hover:scale-[1.03] hover:shadow-primary/30">
    <img src={imgUrl} alt={title} className="w-full h-48 object-cover border-b border-border-color" />
    <div className="p-6">
      <h3 className="text-xl font-bold text-text-light mb-2">{title}</h3>
      <p className="text-text-dark mb-6 text-sm">{description}</p>
      <div className="flex justify-between items-center">
        <a 
          href={repoUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-700/50 text-text-dark hover:text-text-light hover:bg-gray-600/50 transition-colors"
        >
          <FaGithub /> Repository
        </a>
        <a 
          href={demoUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-2 px-4 py-2 rounded-md text-white bg-linear-to-r from-accent to-primary hover:from-primary hover:to-accent transition-all"
        >
          Demo <FiExternalLink />
        </a>
      </div>
    </div>
  </div>
);

const Projects = () => {
  const [activeTab, setActiveTab] = useState('web');

  return (
    <section id="projects" className="py-24">
      <h2 className="text-4xl font-bold text-center mb-8">My Projects</h2>
      
      {/* Tabs */}
      <div className="flex justify-center space-x-4 mb-12">
        <button
          onClick={() => setActiveTab('web')}
          className={`px-6 py-2 rounded-md text-lg font-medium transition-all ${
            activeTab === 'web' 
            ? 'bg-linear-to-r from-primary to-secondary text-white' 
            : 'bg-card-bg border border-border-color text-text-dark hover:bg-border-color'
          }`}
        >
          Web Application
        </button>
        <button
          onClick={() => setActiveTab('mobile')}
          className={`px-6 py-2 rounded-md text-lg font-medium transition-all ${
            activeTab === 'mobile' 
            ? 'bg-linear-to-r from-primary to-secondary text-white' 
            : 'bg-card-bg border border-border-color text-text-dark hover:bg-border-color'
          }`}
        >
          AI Application
        </button>
      </div>

      {/* Project Grid */}
      <div>
        {activeTab === 'web' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {webProjects.map((project) => (
              <ProjectCard key={project.title} {...project} />
            ))}
          </div>
        )}
        {activeTab === 'mobile' && (
          <div className="text-center text-text-dark">
            <p>AI projects coming soon!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;