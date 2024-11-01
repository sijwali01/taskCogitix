import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = () => {
  return (
    <div className="sticky-top bg-light">
      <div className="container mb-2">
        <div className="d-flex justify-content-center">
          <h1 className="text-center">Rick and Morty Characters</h1>
        </div>
      </div>
    </div>
  );
};

export default Header;
