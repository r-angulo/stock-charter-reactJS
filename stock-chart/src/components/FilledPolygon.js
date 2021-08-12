import React from "react";
import MultiLine from "./MultiLine";

const FilledPolygon = ({
  topData,
  bottomData,
  maxY,
  scale,
  spaceInBetween,
  bodyWidth,
  margin,
}) => {
  // console.log("scale");
  // console.log(scale);

  let bottomPoints = "";
  bottomData.forEach((value, index) => {
    // let retValue;
    // if (index === 0) {
    //   retValue = `0,${bottomData[0]}`;
    // } else if (index === bottomData.length - 1) {
    //   retValue = `${maxY},${bottomData[bottomData.length - 1]}`;
    // } else {
    //   retValue = `${index * margin + bodyWidth / 2},${value}`;
    // }

    // bottomPoints += retValue + " ";
    ////
    bottomPoints += `${index * margin + bodyWidth / 2},${value}` + " ";
  });

  let topPoints = "";
  topData
    .slice()
    .reverse()
    .forEach((value, index) => {
      index = topData.length - index - 1;
      topPoints += `${index * margin + bodyWidth / 2},${value}` + " ";
    });

  return (
    <React.Fragment>
      <MultiLine
        bodyWidth={bodyWidth}
        margin={margin}
        data={topData}
        color="dodgerblue"
      ></MultiLine>
      <polygon
        // // 1 3 9 7
        // points={`0,100            90,45     700,250                           ${maxY},100
        //       ${maxY},500         1000,530     90,180                           0,500`}
        // points={`${bottomPoints}
        //       ${maxY},1000                                    0,1000`}
        points={`${bottomPoints}
            ${topPoints}`}
        //ONLY PASS IN DATA THATS REQUIRED, PARENT CONTROLS THE [:]
        //  second line must be done in reverse
        // numbers must be scaled
        // 1500 is a const, 0 is not
        //note space inbetween should be calcualted before proceedin
        //the lenght doesnt match number of candles
        //x is off
        //make it so that you dont need margin and body with
        style={{
          fill: "#198787",
          stroke: "black",
          strokeWidth: "1",
          opacity: "0.3",
        }}
      />
      <MultiLine
        bodyWidth={bodyWidth}
        margin={margin}
        data={bottomData}
        color="dodgerblue"
      ></MultiLine>
    </React.Fragment>
  );
};

export default FilledPolygon;
