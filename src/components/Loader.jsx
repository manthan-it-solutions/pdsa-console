import React from "react";
import "../css/Loader.css";
import loaderSvg from "../Assets/Spin@1x-1.3s-198px-198px.svg"; 

function Loader() {
  return (
    <div className="loader-container">
      <img src={loaderSvg} alt="Loading..." className="loader-svg" />
    </div>
  );
}

export default Loader;
