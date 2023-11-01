import { useEffect, useState } from 'react';

const LoadingScreen = () => {
    return (

    <div className="loading-container">
        <div className="spinner"></div>
        <p className="text-fs-brown">Loading...</p>
      </div>


    );
};

export default LoadingScreen;
