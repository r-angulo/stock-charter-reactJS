import React from "react";

const Multipoints = ({ data }) => {
  return (
    <React.Fragment>
      <circle
        cx="50"
        cy="50"
        r="40"
        stroke="black"
        stroke-width="3"
        fill="red"
      />
      <circle
        cx="50"
        cy="50"
        r="40"
        stroke="black"
        stroke-width="3"
        fill="red"
      />
    </React.Fragment>
  );
};

export default Multipoints;
