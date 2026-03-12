import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-4 text-center text-sm text-gray-500">
      &copy; {currentYear} Your Company Name. All rights reserved.
    </footer>
  );
};

export default Footer;
