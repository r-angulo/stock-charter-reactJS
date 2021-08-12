import React, { Component } from "react";
import { connect } from "react-redux";

import CandleView from "./components/CandleView";
import InputManager from "./components/InputManager";
import store from "./store";
import { Provider } from "react-redux"; //a wrapper that provides our application with the global store
import { createPriceData, createOtherData } from "./actions/dataActions";

if (localStorage.priceData) {
  store.dispatch(createPriceData(JSON.parse(localStorage.priceData)));
}
if (localStorage.otherData) {
  store.dispatch(createOtherData(JSON.parse(localStorage.otherData)));
}
export class App extends Component {
  render() {
    return (
      <div>
        <Provider store={store}>
          <CandleView></CandleView>
          <InputManager></InputManager>
        </Provider>
      </div>
    );
  }
}

export default App;
