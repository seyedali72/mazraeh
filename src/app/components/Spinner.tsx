import React from "react";
import { RotatingLines } from "react-loader-spinner";

const Spinner = () => {
  return (
    <div
      style={{
        position: "fixed",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
      }}
    >
      <RotatingLines
        visible={true}
         width="200"
         strokeWidth="5"
        animationDuration="1"
        ariaLabel="rotating-lines-loading"
      />
    </div>
  );
};

export default Spinner;
