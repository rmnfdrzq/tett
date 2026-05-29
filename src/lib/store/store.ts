import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./app-slice";
import cartReducer from "./cart-slice";
import designToolReducer from "./design-tool-slice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      app: appReducer,
      cart: cartReducer,
      designTool: designToolReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
