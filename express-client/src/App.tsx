import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@material-ui/core";

function App() {
  return (
    <Card style={{ justifyItems: "center" }}>
      <CardContent>
        <h1>Auth App</h1>
        <nav
          style={{
            borderBottom: "solid 1px",
            paddingBottom: "1rem",
            justifyItems: "center",
          }}
        >
          <Link to="/login">Giriş</Link> | <Link to="/users">Kullanıcılar</Link>
        </nav>{" "}
      </CardContent>
    </Card>
  );
}

export default App;
