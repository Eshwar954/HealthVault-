import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer bg-light text-center py-3 mt-auto">
      <div className="container">
        <p className="mb-0">&copy; {new Date().getFullYear()} HealthVault. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
