const HighlightButton = ({ children }) => (
  <div className="py-3 px-5 rounded-lg bg-card-bg border border-border-color text-text-light text-sm md:text-base">
    {children}
  </div>
);

const About = () => {
  const fullName = "Reuben Mulero"; // Direct name — no animation

  return (
    <section id="about" className="py-24 md:py-32">
      <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20">
        
        {/*  Image */}
        <div className="relative w-54 h-54 md:w-60 md:h-60 shrink-0">
          <div className="absolute inset-0 rounded-full bg-linear-to-br from-primary to-secondary opacity-50 blur-xl animate-pulse"></div>
          <img 
            src="/profile-pic.jpg" 
            alt="Reuben Mulero" 
            className="relative w-full h-full rounded-full object-cover border-4 border-text-dark"
          />
        </div>

        {/* info */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-4xl lg:text-5xl font-extrabold mb-4">
            I'm <span className="bg-clip-text text-transparent bg-gradient-to-r from-secondary to-primary">
              {fullName}
            </span>
          </h2>

          <p className="text-lg md:text-xl text-text-dark max-w-2xl">
            I’m an AI Developer specializing in building intelligent systems and integrating machine learning features into full-stack applications.
          </p>

          <p className="text-lg md:text-xl text-text-dark max-w-2xl mt-2">
            I work with Python, React, vite, and modern AI frameworks to create tools that automate tasks, enhance user experience, and unlock new efficiencies for organizations.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row justify-center md:justify-start gap-4">
            <HighlightButton>Web Application Development</HighlightButton>
            <HighlightButton>AI Application Development</HighlightButton>
            <HighlightButton>AI Problem Solving</HighlightButton>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
