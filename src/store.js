import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/states/authSlice";
import userReducer from "./features/users/states/userSlice";
import lostFoundReducer from "./features/lost-founds/states/lostFoundSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    lostFounds: lostFoundReducer,
  },
});

export default store;
