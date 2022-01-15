import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginPage, UserListPage } from "./pages";

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="users" element={<UserListPage />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);
