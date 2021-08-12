import React from "react";
//todo: FIX NAN
const MultiLine = ({ bodyWidth, margin, data, color }) => {
  let pointsData = "";
  data.forEach((value, index) => {
    pointsData += `${index * margin + bodyWidth / 2},${value}` + " ";
  });
  return (
    <polyline
      style={{
        fill: "none",
        stroke: color ? color : "yellow",
        strokeWidth: "3",
      }}
      points={pointsData}
    ></polyline>
  );
};

export default MultiLine;
