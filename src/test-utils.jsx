import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import authReducer from "./features/auth/states/authSlice";
import userReducer from "./features/users/states/userSlice";
import lostFoundReducer from "./features/lost-founds/states/lostFoundSlice";

export function setupTestStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      auth: authReducer,
      users: userReducer,
      lostFounds: lostFoundReducer,
    },
    preloadedState,
  });
}

/**
 * Render a component wrapped in Redux Provider and MemoryRouter for testing
 * @param {React.ReactElement} ui
 * @param {Object} [options]
 * @returns {Object}
 */
export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = setupTestStore(preloadedState),
    initialRoute = "/",
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[initialRoute]}>{children}</MemoryRouter>
      </Provider>
    );
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

export * from "@testing-library/react";
