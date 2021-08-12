import {
  CREATE_PRICE_DATA,
  CREATE_OTHER_DATA,
  DELETE_OTHER_DATA,
  SET_TICKER_NAME,
} from "./types";

export const createPriceData = (priceData) => (dispatch) => {
  localStorage.setItem("priceData", JSON.stringify(priceData)); //very important that this is the same as the app.js

  dispatch({ type: CREATE_PRICE_DATA, payload: priceData });
};

export const createOtherData = (otherData) => (dispatch) => {
  localStorage.setItem("otherData", JSON.stringify(otherData)); //very important that this is the same as the app.js
  dispatch({ type: CREATE_OTHER_DATA, payload: otherData });
};

export const deleteOtherData = () => (dispatch) => {
  dispatch({ type: DELETE_OTHER_DATA });
};

export const setTickerName = (tickerName) => (dispatch) => {
  dispatch({ type: SET_TICKER_NAME, payload: tickerName });
};
