import React, { Component } from "react";
import Ticker from "../components/Ticker";
import { connect } from "react-redux";
import { createPriceData } from "../actions/dataActions";
import FilledPolygon from "./FilledPolygon";
import MultiLine from "./MultiLine";
import MultiRects from "./MultiRects";
import SeriesHandler from "./SeriesHandler";

class CandleView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataLow: 0,
      dataHigh: 1000,
      viewHeight: 1000,
      viewWidth: 1500,
      viewMargin: 0.1, //pct
      candlesPerView: 100,
      startIndex: 0,
      endIndex: 0,
      get bodyWidth() {
        return this.viewWidth / (2 * this.candlesPerView + 1);
      },
      get margin() {
        return this.bodyWidth * 2;
      },
      isCreatingSeries: false,
      seriesName: "",
      seriesColor: "#000000",
      backgroundSeries: [],
      clickedCandleData: {},
    };
    this.t = undefined;
    this.start = 1000;
    this.repeat = this.repeat.bind(this);
    this.tRight = undefined;
    this.startRight = 1000;
    this.repeatRight = this.repeatRight.bind(this);
    this.createNewSeries = this.createNewSeries.bind(this);
    this.finishCreatingSeries = this.finishCreatingSeries.bind(this);
    this.onChange = this.onChange.bind(this);
    this.changeSeriesVisibility = this.changeSeriesVisibility.bind(this);
  }

  componentDidMount() {
    if (this.props.data.priceData) {
      if (this.state.candlesPerView < this.props.data.priceData.length) {
        this.setState(
          {
            startIndex:
              this.props.data.priceData.length - 1 - this.state.candlesPerView,
            endIndex: this.props.data.priceData.length,
          },
          () => {
            this.findLowAndHighest(
              this.props.data.priceData.slice(
                this.state.startIndex,
                this.state.endIndex
              )
            );
          }
        );
      } else {
        this.setState(
          {
            startIndex: 0,
            endIndex: this.props.data.priceData.length,
          },
          () => {
            this.findLowAndHighest(
              this.props.data.priceData.slice(
                this.state.startIndez,
                this.state.endIndex
              )
            );
          }
        );
      }
    }
    //CONVERTING MARKERS INTO SAERIES
    if (this.props.data.otherData) {
      console.log("received new data");
      this.props.data.otherData.forEach((indicator) => {
        if (indicator.type === "Background Markers") {
          this.setState({
            backgroundSeries: [
              ...this.state.backgroundSeries,
              {
                seriesName: indicator.name,
                seriesColor: indicator.color,
                seriesBorderColor: indicator.borderColor,
                seriesData: indicator.data,
                isVisible: true,
              },
            ],
          });
        }
      });
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.data.priceData) {
      if (this.state.candlesPerView < newProps.data.priceData.length) {
        this.setState(
          {
            startIndex:
              newProps.data.priceData.length - 1 - this.state.candlesPerView,
            endIndex: newProps.data.priceData.length,
          },
          () => {
            this.findLowAndHighest(
              newProps.data.priceData.slice(
                this.state.startIndex,
                this.state.endIndex
              )
            );
          }
        );
      } else {
        this.setState(
          {
            startIndex: 0,
            endIndex: newProps.data.priceData.length,
          },
          () => {
            this.findLowAndHighest(
              newProps.data.priceData.slice(
                this.state.startIndez,
                this.state.endIndex
              )
            );
          }
        );
      }
    }
    //CONVERTING MARKERS INTO SAERIES
    if (this.props.data.otherData) {
      console.log("received new data");
      this.props.data.otherData.forEach((indicator) => {
        if (indicator.type === "Background Markers") {
          this.setState({
            backgroundSeries: [
              ...this.state.backgroundSeries,
              {
                seriesName: indicator.name,
                seriesColor: indicator.color,
                seriesData: indicator.data,
                seriesBorderColor: indicator.borderColor,
                isVisible: true,
              },
            ],
          });
        }
      });
    }
  }

  findLowAndHighest(subPriceData) {
    let low = Number.MAX_SAFE_INTEGER;
    let high = Number.MIN_SAFE_INTEGER;
    subPriceData.forEach((day) => {
      if (day.low < low) {
        low = day.low;
      }
      if (day.high > high) {
        high = day.high;
      }
    });

    this.setState({ dataLow: low, dataHigh: high });
  }

  minMaxScale(x) {
    // return (
    //   ((x - this.state.dataLow) / (this.state.dataHigh - this.state.dataLow)) *
    //   this.state.viewHeight
    // );
    return (
      ((x - this.state.dataLow) / (this.state.dataHigh - this.state.dataLow)) *
        this.state.viewHeight *
        (1 - 2 * this.state.viewMargin) +
      this.state.viewHeight * this.state.viewMargin
    );
  }

  prevClicked() {
    //must recalc scale and new high or low etc
    //todo: error check boundaries
    if (this.state.startIndex > 0) {
      this.setState(
        {
          startIndex: this.state.startIndex - 1,
          endIndex: this.state.endIndex - 1,
        },
        () => {
          this.findLowAndHighest(
            this.props.data.priceData.slice(
              this.state.startIndex,
              this.state.endIndex
            )
          );
        }
      );
    }
  }

  nextClicked() {
    //must recalc scale and new high or low etc
    //todo: error check boundaries
    if (this.state.endIndex < this.props.data.priceData.length) {
      this.setState(
        {
          startIndex: this.state.startIndex + 1,
          endIndex: this.state.endIndex + 1,
        },
        () => {
          this.findLowAndHighest(
            this.props.data.priceData.slice(
              this.state.startIndex,
              this.state.endIndex
            )
          );
        }
      );
    }
  }

  repeat() {
    this.prevClicked();
    this.t = setTimeout(this.repeat, this.start);
    this.start = this.start / 1.25;
  }

  prevPressed() {
    this.repeat();
  }

  prevUnpressed() {
    clearTimeout(this.t);
    this.start = 100;
  }

  //Right
  repeatRight() {
    this.nextClicked();
    this.tRight = setTimeout(this.repeatRight, this.startRight);
    this.startRight = this.startRight / 2;
  }

  nextPressed() {
    this.repeatRight();
  }

  nextUnpressed() {
    clearTimeout(this.tRight);
    this.startRight = 100;
  }

  handlePointerDown(e) {
    //TODO: check if there is already a point there, otherwise will mark point again but at 0
    ///TODO : find nearerst index to click , maybe arrayt maybe smart math
    //todo: look up series by name, copy it, change posistion index where clicked
    //if clicked on current exixting, change to 0 else if canvas, change to 1
    //https://stackoverflow.com/questions/29537299/react-how-to-update-state-item1-in-state-using-setstate
    const el = e.target;

    if (this.state.isCreatingSeries) {
      const bbox = e.target.getBoundingClientRect();
      const x = e.clientX - bbox.left;
      let thisIndex = Math.round(x / (2 * this.state.bodyWidth));

      ////
      let _backgroundSeries = [...this.state.backgroundSeries];
      let currSeries = _backgroundSeries.filter(
        (series) => series.seriesName === this.state.seriesName
      )[0];
      if (el.id === "canvas") {
        currSeries.seriesData[this.state.startIndex + thisIndex] = 1;
      }
      if (el.dataset.classifer) {
        currSeries.seriesData[el.dataset.classifer] = 0;
      }
      this.setState({ backgroundSeries: _backgroundSeries });
    }
  }

  zoomOut() {
    this.setState({
      candlesPerView: this.state.candlesPerView + 10,
      startIndex: this.state.startIndex - 10,
    });
  }

  zoomIn() {
    if (
      this.state.startIndex < this.props.data.priceData.length - 10 &&
      this.state.candlesPerView > 10
    ) {
      this.setState({
        candlesPerView: this.state.candlesPerView - 10,
        startIndex: this.state.startIndex + 10,
      });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  createNewSeries() {
    let newSeries = {
      seriesName: this.state.seriesName,
      seriesColor: this.state.seriesColor,
      seriesData: Array(this.props.data.priceData.length).fill(0),
      isVisible: true,
    };
    this.setState({
      isCreatingSeries: true,
      backgroundSeries: [...this.state.backgroundSeries, newSeries],
    });
  }

  finishCreatingSeries() {
    this.setState({ isCreatingSeries: false, seriesName: "" });
  }

  changeSeriesVisibility(name) {
    let _backgroundSeries = [...this.state.backgroundSeries];
    let currSeries = _backgroundSeries.filter(
      (series) => series.seriesName === name
    )[0];
    currSeries.isVisible = !currSeries.isVisible;
    this.setState({ backgroundSeries: _backgroundSeries });
  }

  deleteSeries(name) {
    // let _backgroundSeries = [...this.state.backgroundSeries].filter(
    //   (series) => series.seriesName !== name
    // );
    // this.setState({ backgroundSeries: _backgroundSeries });
  }

  editSeries(name, color) {
    console.log(color);
    this.setState({
      seriesName: name,
      seriesColor: color,
      isCreatingSeries: true,
    });
  }

  handleCandleClicked(i) {
    console.log("cell " + i + " clicked");
    console.log(this.props.data.priceData[i].date);
    this.setState(
      {
        clickedCandleData: {
          cellIndex: i,
          date: this.props.data.priceData[i].date,
        },
      },
      () => {
        Object.entries(this.state.clickedCandleData).forEach(([key, val]) => {
          console.log(key, val);
        });
      }
    );
  }

  render() {
    // console.log(this.state.backgroundSeries);
    let rows = Array(this.props.data.priceData.length).fill("");
    this.state.backgroundSeries.forEach((series, seriesIndex) => {
      series.seriesData.forEach((value, index) => {
        if (seriesIndex === this.state.backgroundSeries.length - 1) {
          rows[index] += value;
        } else {
          rows[index] += value + ",";
        }
      });
    });
    if (this.props.data.priceData) {
      this.props.data.priceData.forEach((dayObj, index) => {
        rows[index] = dayObj.date + "," + rows[index];
      });
    }
    let headers = "Date,";
    this.state.backgroundSeries.forEach((series, seriesIndex) => {
      if (seriesIndex === this.state.backgroundSeries.length - 1) {
        headers += series.seriesName;
      } else {
        headers += series.seriesName + ",";
      }
    });
    rows.unshift(headers);
    let csv = "";
    rows.forEach((row) => {
      csv += row + "\n";
    });
    let csvFile = encodeURI("data:text/csv;charset=utf-8," + csv);
    const bodyWidth =
      this.state.viewWidth / (2 * this.state.candlesPerView + 1);
    const margin = bodyWidth * 2;
    let seriesElements = this.state.backgroundSeries.map((series) => {
      return (
        <SeriesHandler
          name={series.seriesName}
          visibilityHandler={() =>
            this.changeSeriesVisibility(series.seriesName)
          }
          color={series.color}
          isVisible={series.isVisible}
          deleteHandler={() => this.deleteSeries(series.seriesName)}
          editHandler={() =>
            this.editSeries(series.seriesName, series.seriesColor)
          }
        ></SeriesHandler>
      );
    });
    let addedBgSeries = this.state.backgroundSeries.map((series) => {
      if (series.isVisible) {
        return (
          <MultiRects
            data={series.seriesData.slice(
              this.state.startIndex,
              this.state.endIndex
            )}
            bgcolor={series.seriesColor}
            width={bodyWidth}
            height={this.state.viewHeight}
            margin={margin}
            startIndex={this.state.startIndex}
            seriesName={series.seriesName}
            borderColor={series.seriesBorderColor}
          ></MultiRects>
        );
      }
    });

    let overLayIndicatorsElements;
    if (this.props.data.otherData) {
      overLayIndicatorsElements = this.props.data.otherData.map((obj) => {
        if (obj.type === "Line") {
          return (
            <MultiLine
              bodyWidth={bodyWidth}
              margin={margin}
              data={obj.data
                .slice(this.state.startIndex, this.state.endIndex)
                .map((value) => this.minMaxScale(value))}
            ></MultiLine>
          );
        }
        if (obj.type === "Cloud") {
          return (
            <FilledPolygon
              bottomData={obj.data.bottomData
                .slice(this.state.startIndex, this.state.endIndex)
                .map((value) => this.minMaxScale(value))}
              topData={obj.data.topData
                .slice(this.state.startIndex, this.state.endIndex)
                .map((value) => this.minMaxScale(value))}
              maxY={this.state.viewWidth}
              scale={this.minMaxScale(1)}
              bodyWidth={bodyWidth}
              margin={margin}
            ></FilledPolygon>
          );
        }
      });
    }

    let candleElements = [];
    for (let i = this.state.startIndex; i < this.state.endIndex; i++) {
      const day = this.props.data.priceData[i];
      const element = (
        <Ticker
          key={i}
          x={i - this.state.startIndex}
          open={this.minMaxScale(day.open)}
          high={this.minMaxScale(day.high)}
          low={this.minMaxScale(day.low)}
          close={this.minMaxScale(day.close)}
          //   bodyWidth={this.state.viewWidth / (2 * this.state.candlesPerView + 1)}
          bodyWidth={this.state.viewWidth / (2 * this.state.candlesPerView + 1)}
          //   the two comes from how many margin should be compared to body
          onClick={() => this.handleCandleClicked(i)}
        ></Ticker>
      );
      candleElements.push(element);
    }

    // const numVerLines = 20;
    const numVerLines = this.state.candlesPerView;

    let verticalGridElements = [...Array(numVerLines).keys()].map((i) => {
      return (
        <rect
          key={i}
          // 2 is the margin ratio to width , 1 is size of wick
          x={i * margin + (bodyWidth / 2 - 1)}
          // x={i * (this.state.viewWidth / numVerLines)}
          y="0"
          width={2}
          height={this.state.viewHeight}
          style={{ fill: "#758696", opacity: 0.15 }}
        ></rect>
      );
    });
    const numHorLines = 10;
    let horizontalGridElements = [...Array(numHorLines).keys()].map((i) => {
      return (
        <rect
          x="0"
          y={i * (this.state.viewHeight / numHorLines)}
          width={this.state.viewWidth}
          height={2}
          style={{ fill: "#758696", opacity: 0.15 }}
        ></rect>
      );
    });

    let thisDayOverview = Object.entries(this.state.clickedCandleData).map(
      ([key, val]) => {
        return (
          <p>
            {key} : {val}
          </p>
        );
      }
    );
    return (
      <React.Fragment>
        <div
          className=""
          style={{
            width: "100%",
            height: this.state.viewHeight + 50 + "px",
            boxSizing: "border-box",
            // backgroundColor: "#131722",
            // backgroundColor: "#040D14",
            backgroundColor: "#272727",
            backgroundColor: "#121212",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <svg
            width="75px"
            height="75px"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            onClick={() => this.prevClicked()}
            onMouseDown={() => {
              this.prevPressed();
            }}
            onMouseUp={() => {
              this.prevUnpressed();
            }}
            onMouseLeave={() => {
              this.prevUnpressed();
            }}
          >
            <path
              fill="dodgerblue"
              d="M504 256C504 119 393 8 256 8S8 119 8 256s111 248 248 248 248-111 248-248zm-448 0c0-110.5 89.5-200 200-200s200 89.5 200 200-89.5 200-200 200S56 366.5 56 256zm189.1 129.9L123.7 264.5c-4.7-4.7-4.7-12.3 0-17l121.4-121.4c4.7-4.7 12.3-4.7 17 0l19.6 19.6c4.8 4.8 4.7 12.5-.2 17.2L211.2 230H372c6.6 0 12 5.4 12 12v28c0 6.6-5.4 12-12 12H211.2l70.3 67.1c4.9 4.7 5 12.4.2 17.2l-19.6 19.6c-4.7 4.7-12.3 4.7-17 0z"
            ></path>
          </svg>
          <svg
            width={this.state.viewWidth + "px"}
            height={this.state.viewHeight + "px"}
            // viewBox="0 0 1000 1000"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              backgroundColor: "#040D14",
              boxSizing: "border-box",
              // borderRadius: "2%",
              boxShadow:
                "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
            }}
            onPointerDown={(e) => {
              this.handlePointerDown(e);
            }}
            id="canvas"
          >
            {/* tdodo change this 1000 to the const var */}
            <g transform="translate(0,1000) scale(1,-1)">
              <text
                x="50%"
                y="5%"
                dominant-baseline="middle"
                text-anchor="middle"
                fill="white"
                font-size="5em"
                font-family="sans-serif"
                transform="translate(0,1000) scale(1,-1)"
                opacity="0.15"
              >
                ${this.props.data.ticker}
              </text>
              {candleElements}
              {overLayIndicatorsElements}
              {addedBgSeries}

              {/* {horizontalGridElements} */}
              {/* {verticalGridElements} */}

              {/* {this.props.data.otherData[0] && (
                <FilledPolygon
                  bottomData={this.props.data.otherData[0].data[0]
                    .slice(this.state.startIndex, this.state.endIndex)
                    .map((value) => this.minMaxScale(value))}
                  topData={this.props.data.otherData[0].data[1]
                    .slice(this.state.startIndex, this.state.endIndex)
                    .map((value) => this.minMaxScale(value))}
                  maxY={this.state.viewWidth}
                  scale={this.minMaxScale(1)}
                  bodyWidth={bodyWidth}
                  margin={margin}
                ></FilledPolygon>
              )} */}
              {/* 
              <MultiLine
                bodyWidth={bodyWidth}
                margin={margin}
                data={this.props.data.otherData[1].data[0]
                  .slice(this.state.startIndex, this.state.endIndex)
                  .map((value) => this.minMaxScale(value))}
              ></MultiLine> */}
              {/* <circle
                cx={14 * margin + (bodyWidth / 2 - 1)}
                cy={
                  this.minMaxScale(
                    this.props.data.priceData[this.state.startIndex + 14].close
                  ) + 30
                }
                r="7"
                stroke="black"
                stroke-width="2"
                fill="#eb5555"
              /> */}
            </g>
          </svg>
          <svg
            width="75px"
            height="75px"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            onClick={() => this.nextClicked()}
            onMouseDown={() => {
              this.nextPressed();
            }}
            onMouseUp={() => {
              this.nextUnpressed();
            }}
            onMouseLeave={() => {
              this.nextUnpressed();
            }}
          >
            <path
              fill="dodgerblue"
              d="M8 256c0 137 111 248 248 248s248-111 248-248S393 8 256 8 8 119 8 256zm448 0c0 110.5-89.5 200-200 200S56 366.5 56 256 145.5 56 256 56s200 89.5 200 200zM266.9 126.1l121.4 121.4c4.7 4.7 4.7 12.3 0 17L266.9 385.9c-4.7 4.7-12.3 4.7-17 0l-19.6-19.6c-4.8-4.8-4.7-12.5.2-17.2l70.3-67.1H140c-6.6 0-12-5.4-12-12v-28c0-6.6 5.4-12 12-12h160.8l-70.3-67.1c-4.9-4.7-5-12.4-.2-17.2l19.6-19.6c4.7-4.7 12.3-4.7 17 0z"
            ></path>
          </svg>
        </div>
        <div
          className=""
          style={{ width: "100%", textAlign: "center", color: "white" }}
        >
          {thisDayOverview}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            boxSizing: "border-box",
            padding: "25px",
          }}
        >
          <svg
            width="75px"
            height="75px"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            onClick={() => {
              this.zoomOut();
            }}
          >
            <path
              fill="gray"
              d="M304 192v32c0 6.6-5.4 12-12 12H124c-6.6 0-12-5.4-12-12v-32c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12zm201 284.7L476.7 505c-9.4 9.4-24.6 9.4-33.9 0L343 405.3c-4.5-4.5-7-10.6-7-17V372c-35.3 27.6-79.7 44-128 44C93.1 416 0 322.9 0 208S93.1 0 208 0s208 93.1 208 208c0 48.3-16.4 92.7-44 128h16.3c6.4 0 12.5 2.5 17 7l99.7 99.7c9.3 9.4 9.3 24.6 0 34zM344 208c0-75.2-60.8-136-136-136S72 132.8 72 208s60.8 136 136 136 136-60.8 136-136z"
              class=""
            ></path>
          </svg>
          <svg
            width="75px"
            height="75px"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            onClick={() => {
              this.zoomIn();
            }}
          >
            <path
              fill="gray"
              d="M304 192v32c0 6.6-5.4 12-12 12h-56v56c0 6.6-5.4 12-12 12h-32c-6.6 0-12-5.4-12-12v-56h-56c-6.6 0-12-5.4-12-12v-32c0-6.6 5.4-12 12-12h56v-56c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v56h56c6.6 0 12 5.4 12 12zm201 284.7L476.7 505c-9.4 9.4-24.6 9.4-33.9 0L343 405.3c-4.5-4.5-7-10.6-7-17V372c-35.3 27.6-79.7 44-128 44C93.1 416 0 322.9 0 208S93.1 0 208 0s208 93.1 208 208c0 48.3-16.4 92.7-44 128h16.3c6.4 0 12.5 2.5 17 7l99.7 99.7c9.3 9.4 9.3 24.6 0 34zM344 208c0-75.2-60.8-136-136-136S72 132.8 72 208s60.8 136 136 136 136-60.8 136-136z"
            ></path>
          </svg>
        </div>
        <svg
          width="50px"
          viewBox="0 0 448 512"
          onClick={() => {
            if (localStorage["priceData"]) {
              localStorage.removeItem("priceData");
            }
            if (localStorage["otherData"]) {
              localStorage.removeItem("otherData");
            }
            window.location.reload();
          }}
        >
          <path
            fill="red"
            d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z"
            class=""
          ></path>
        </svg>
        <div
          style={{ width: "50%", backgroundColor: "#7b7b7b", margin: "0 auto" }}
        >
          <h2
            style={{
              width: "100%",
              textAlign: "center",
            }}
          >
            {this.state.isCreatingSeries ? (
              <p>
                Editing:
                <span style={{ color: this.state.seriesColor }}>
                  {this.state.seriesName}
                </span>
              </p>
            ) : (
              "Create Series"
            )}
          </h2>
          {!this.state.isCreatingSeries && (
            <input
              style={{
                display: "block",
                width: "25%",
                margin: "0 auto",
              }}
              value={this.state.seriesColor}
              onChange={this.onChange}
              name="seriesColor"
              type="color"
            />
          )}
          {!this.state.isCreatingSeries && (
            <input
              style={{
                display: "block",
                width: "25%",
                margin: "10px auto",
              }}
              value={this.state.seriesName}
              type="text"
              name="seriesName"
              onChange={this.onChange}
              placeholder="Series Name"
            />
          )}

          {!this.state.isCreatingSeries && (
            <button
              style={{
                display: "block",
                width: "25%",
                margin: "10px auto",
              }}
              type="submit"
              onClick={this.createNewSeries}
            >
              Start
            </button>
          )}
          {this.state.isCreatingSeries && (
            <button
              style={{
                display: "block",
                width: "25%",
                margin: "10px auto",
              }}
              type="submit"
              onClick={this.finishCreatingSeries}
            >
              Finish
            </button>
          )}
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {seriesElements}
        </div>
        <div>
          <h2
            style={{ width: "100%", textAlign: "center", color: "dodgerblue" }}
          >
            <a
              href={csvFile}
              download={"series.csv"}
              style={{
                width: "100%",
                textAlign: "center",
                color: "dodgerblue",
              }}
            >
              Download series as csv
            </a>
          </h2>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps, { createPriceData })(CandleView);
