import { connect } from "react-redux";
import React, { Component } from "react";
import Papa from "papaparse";
import {
  createPriceData,
  createOtherData,
  deleteOtherData,
  setTickerName,
} from "../actions/dataActions";

//TODO: must clear other data from localstorate if reload and redux other data HERE IN THIS FILE, create action for it
class InputManager extends Component {
  constructor(props) {
    super(props);

    this.state = {
      csvfile: undefined,
      columns: {},
      currentField: undefined,
      currentColor: "#ff0000",
      borderColor: "#000000",
      currentSecondField: undefined,
      currentDisplayType: "Line",
      fieldCombinations: [],
    };
    this.updateData = this.updateData.bind(this);
    this.handleDisplayChange = this.handleDisplayChange.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleSecondFieldChange = this.handleSecondFieldChange.bind(this);
    this.addToChart = this.addToChart.bind(this);
    this.createInput = this.createInput.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  handleChange = (event) => {
    this.setState({
      csvfile: event.target.files[0],
    });
  };

  importCSV = () => {
    const { csvfile } = this.state;
    this.props.setTickerName(csvfile.name.split(".")[0]);
    Papa.parse(csvfile, {
      complete: this.updateData,
      header: true,
    });
    this.props.deleteOtherData();
  };

  updateData(result) {
    console.log("result");
    console.log(result);
    let data = result.data;
    let columns = {};
    if (result.meta) {
      if (result.meta.fields) {
        result.meta.fields.forEach((columnName) => {
          columns[columnName] = [];
        });
        if (result.data) {
          result.data.forEach((row) => {
            Object.entries(columns).forEach(([colName, value]) => {
              if (colName === "Date") {
                columns[colName].push(Date.parse(row[colName]));
              } else {
                columns[colName].push(parseFloat(row[colName]));
              }
            });
          });
        }
        this.setState({ columns });
      }
    }
    ///
    if (data) {
      let priceData = [];
      let otherData = [];
      let bbData = [];
      let lowerband = [];
      let upperband = [];
      let middleband = [];
      data.forEach((row) => {
        if (
          row["Open"] !== "" &&
          row["High"] !== "" &&
          row["Low"] !== "" &&
          row["Close"] !== "" &&
          row["Date"] !== ""
        ) {
          let newObj = {
            open: parseFloat(row["Open"]),
            high: parseFloat(row["High"]),
            low: parseFloat(row["Low"]),
            close: parseFloat(row["Close"]),
            date: row["Date"],
          };
          priceData.push(newObj);

          // let bbObj = {
          //   lowerband: parseFloat(row["lowerband"]),
          //   upperband: parseFloat(row["upperband"]),
          // };
          // bbData.push(bbObj);
          // lowerband.push(parseFloat(row["lowerband"]));
          // upperband.push(parseFloat(row["upperband"]));
          // middleband.push(parseFloat(row["middleband"]));
        }
      });
      // console.log(otherData);
      otherData.push({ data: [lowerband, upperband], type: "cloud" });
      otherData.push({ data: [middleband], type: "line" });
      this.props.createPriceData(priceData);
      // this.props.createOtherData(otherData);
    }
  }

  handleFieldChange(event) {
    this.setState({ currentField: event.target.value });
  }

  handleSecondFieldChange(event) {
    this.setState({ currentSecondField: event.target.value });
  }

  handleDisplayChange(event) {
    this.setState({ currentDisplayType: event.target.value });
  }

  createInput() {
    if (
      this.state.currentField !== "undefined" &&
      this.state.currentDisplayType !== "undefined"
    ) {
      const {
        currentField,
        currentSecondField,
        currentDisplayType,
        currentColor,
        borderColor,
      } = this.state;

      if (this.state.currentDisplayType !== "Cloud") {
        this.setState({
          fieldCombinations: [
            ...this.state.fieldCombinations,
            {
              name: currentField,
              color: currentColor,
              field: currentField,
              displayType: currentDisplayType,
            },
          ],
        });
      } else {
        this.setState({
          fieldCombinations: [
            ...this.state.fieldCombinations,
            {
              topField: currentField,
              bottomField: currentSecondField,
              displayType: currentDisplayType,
              borderColor: borderColor,
            },
          ],
        });
      }
    }
  }

  addToChart() {
    let otherData = [];
    // otherData.push({ data: [lowerband, upperband], type: "Cloud" });
    // otherData.push({ data: {topData:,bottomData:}, type: "Cloud" });
    // otherData.push({ data: , type: "Cloud" });
    Object.entries(this.state.fieldCombinations).forEach(([key, value]) => {
      if (value.displayType === "Cloud") {
        otherData.push({
          data: {
            topData: this.state.columns[value.topField],
            bottomData: this.state.columns[value.bottomField],
          },
          type: value.displayType,
          color: value.color,
        });
      } else {
        otherData.push({
          name: value.name,
          data: this.state.columns[value.field],
          type: value.displayType,
          color: value.color,
          borderColor: this.state.borderColor,
        });
      }
    });
    this.props.createOtherData(otherData);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    let fieldOptions = Object.entries(this.state.columns).map(
      ([colName, value]) => {
        return <option>{colName}</option>;
      }
    );
    let tableRows = this.state.fieldCombinations.map((obj) => {
      if (obj.displayType !== "Cloud") {
        return (
          <tr>
            <td>{obj.field}</td>
            <td>{obj.displayType}</td>
          </tr>
        );
      } else {
        return (
          <tr>
            <td>
              {obj.topField} & {obj.bottomField}
            </td>
            <td>{obj.displayType}</td>
          </tr>
        );
      }
    });
    return (
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          alignContent: "center",
          flexWrap: "wrap",
        }}
      >
        <div
          className="container"
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <div className="file-button-wrapper">
            <span>Choose File</span>
            <input
              type="file"
              className="input-file-upload"
              ref={(input) => {
                this.filesInput = input;
              }}
              name="file"
              placeholder={null}
              onChange={this.handleChange}
            />
            <button
              className="button"
              onClick={this.importCSV}
              style={{ margin: "15px", width: "150px" }}
            >
              {" "}
              Import File
            </button>
          </div>
        </div>
        <div
          style={{
            width: "50%",
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            backgroundColor: "#615c5c",
            margin: "10px",
          }}
        >
          <h1
            style={{
              width: "100%",
              textAlign: "center",
            }}
          >
            Create New Input
          </h1>
          <select
            onChange={this.handleFieldChange}
            style={{
              width: "60%",
              textAlign: "center",
            }}
          >
            {fieldOptions}
          </select>
          {this.state.currentDisplayType === "Cloud" && (
            <select
              onChange={this.handleSecondFieldChange}
              style={{
                width: "60%",
                textAlign: "center",
              }}
            >
              {fieldOptions}
            </select>
          )}
          <select
            style={{
              width: "60%",
              textAlign: "center",
            }}
            onChange={this.handleDisplayChange}
          >
            <option>Line</option>
            <option>Cloud</option>
            <option>Background Markers</option>
          </select>
          <input
            style={{
              width: "80%",
              textAlign: "center",
            }}
            type="color"
            name="currentColor"
            value={this.state.currentColor}
            onChange={this.onChange}
          ></input>
          <input
            style={{
              width: "60%",
              textAlign: "center",
            }}
            type="color"
            name="borderColor"
            value={this.state.borderColor}
            onChange={this.onChange}
          ></input>
          <button
            style={{
              width: "60%",
              height: "50px",
              textAlign: "center",
            }}
            onClick={this.createInput}
          >
            Create
          </button>
        </div>
        <div
          style={{
            width: "50%",
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            backgroundColor: "#615c5c",
            margin: "10px",
          }}
        >
          <table
            style={{
              border: "1px solid black",
              width: "100%",
              textAlign: "center",
            }}
          >
            <thead>
              <tr>
                <th style={{ border: "1px solid black" }}>Field(s)</th>
                <th style={{ border: "1px solid black" }}>Type</th>
              </tr>
            </thead>
            <tbody>{tableRows}</tbody>
          </table>
        </div>
        <div
          style={{
            width: "100%",
            textAlign: "center",
          }}
        >
          <button
            style={{
              width: "50%",
              height: "50px",
              textAlign: "center",
              marginBottom: "20px",
            }}
            onClick={this.addToChart}
          >
            Add to chart
          </button>
        </div>
        <div></div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps, {
  createPriceData,
  createOtherData,
  deleteOtherData,
  setTickerName,
})(InputManager);
