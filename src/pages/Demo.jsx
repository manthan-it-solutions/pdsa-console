import { React, useState } from "react";

const Demo = () => {
  const [initVal, setInitVal] = useState(0);

  const updateVal = () => {
    setInitVal(preCount=>preCount +1);
  };


  return (
    <>
      <div className="container-fluid">
        <span>{initVal}</span>
        <br />

        <div className="btn btn-primary px-3" onClick={updateVal}>
          Add
        </div>
      </div>
    </>
  );
};

export default Demo;
