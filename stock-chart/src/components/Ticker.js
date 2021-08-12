import React, { Component } from "react";

class Ticker extends Component {
  //total width = marginLeft + bodywidthx
  //total candles that fit in box = view/totalcandlewidth
  render() {
    //total width = margin left + bodywith
    const { open, high, low, close, bodyWidth, onClick } = this.props;
    const wickWidth = bodyWidth * 0.15;
    const marginLeft = bodyWidth * 2; //keep in mind marhin of one width, this should be in tickeer
    let x = this.props.x * marginLeft;
    let topBodyPoint, bottomBodyPoint, candleColor;
    if (open > close) {
      topBodyPoint = open;
      bottomBodyPoint = close;
      candleColor = "#e83e3e";
      //   candleColor = "#EF5350";
    } else {
      topBodyPoint = close;
      bottomBodyPoint = open;
      candleColor = "green"; //   green
      //   candleColor = "#26A69A"; //   green
    }

    return (
      <g style={{ fill: candleColor }}>
        <rect
          x={x + (bodyWidth - wickWidth) / 2}
          y={low}
          width={wickWidth}
          height={high - low}
          style={{ zIndex: "1000" }}
        />
        <rect
          x={x}
          y={bottomBodyPoint}
          width={bodyWidth}
          height={topBodyPoint - bottomBodyPoint}
          style={{ zIndex: "1000" }}
          onClick={onClick}
        />
      </g>
    );
  }
}

export default Ticker;
