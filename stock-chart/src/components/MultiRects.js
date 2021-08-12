import React from "react";

const MultiRects = ({
  data,
  bgcolor,
  width,
  height,
  margin,
  startIndex,
  seriesName,
  borderColor,
}) => {
  let rectElements = data.map((value, index) => {
    if (value === 1) {
      return (
        <rect
          key={index}
          data-classifer={startIndex + index}
          x={index * margin}
          y={0}
          width={width}
          height={height}
          style={{
            fill: bgcolor,
            stroke: borderColor,
            strokeWidth: "3",
            opacity: "0.2",
          }}
          className="multi-rectangle"
        />
      );
    }
  });
  return <React.Fragment>{rectElements}</React.Fragment>;
};

export default MultiRects;
