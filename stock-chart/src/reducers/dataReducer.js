import {
  CREATE_PRICE_DATA,
  CREATE_OTHER_DATA,
  DELETE_OTHER_DATA,
  SET_TICKER_NAME,
} from "../actions/types";

const initialState = {
  priceData: [],
  otherData: [],
  ticker: "NA",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CREATE_PRICE_DATA:
      return {
        ...state,
        priceData: action.payload,
      };
    case CREATE_OTHER_DATA:
      return {
        ...state,
        otherData: action.payload,
      };
    case DELETE_OTHER_DATA:
      return {
        ...state,
        otherData: [],
      };
    case SET_TICKER_NAME:
      return {
        ...state,
        ticker: action.payload,
      };
    default:
      return state;
  }
}
