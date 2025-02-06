import React from "react";
import { RotatingLines } from "react-loader-spinner";

const Spinner = () => {
  return (
    <div style={{ position: "fixed", backgroundColor: '#0003', backdropFilter: 'blur(10px)', justifyContent: "center", alignItems: "center", height: "100vh", width: "100vw", top: 0, bottom: 0, left: 0, right: 0, display: "flex", zIndex: 111 }}>
      <RotatingLines visible={true} width="200" strokeWidth="5" animationDuration="1" ariaLabel="rotating-lines-loading" />
    </div>
  );
};

export default Spinner;
