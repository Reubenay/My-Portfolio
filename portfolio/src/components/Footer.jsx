import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';

const SocialLink = ({ href, icon }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-text-dark hover:text-primary transition-colors">
    {icon}
  </a>
);

const Footer = () => {
  return (
    <footer className="py-12">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 flex flex-col items-center gap-6">
        <div className="flex space-x-6">
          <SocialLink href="https://github.com/Reubenay" icon={<FaGithub size={24} />} />
          <SocialLink href="https://www.linkedin.com/in/reuben-mulero-204bb6228/" icon={<FaLinkedin size={24} />} />
          <SocialLink href="https://x.com/Reuben38638691" icon={<FaTwitter size={24} />} />
          <SocialLink href="https://www.instagram.com/reutech_hub/" icon={<FaInstagram size={24} />} />
        </div>
        <p className="text-text-dark text-sm">
          &copy; {new Date().getFullYear()} Reuben Mulero. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;