
import React from 'react';

const Footer: React.FC<{ t: any }> = ({ t }) => {
  return (
    <footer className="py-8 border-t border-slate-200 dark:border-slate-800 text-center text-sm opacity-50">
      <div className="container mx-auto px-4">
        <p>Built by Fluxo – Generate static websites from AI prompts.</p>
        <p className="mt-1">&copy; {new Date().getFullYear()} Fluxo AI Generator</p>
      </div>
    </footer>
  );
};

export default Footer;
