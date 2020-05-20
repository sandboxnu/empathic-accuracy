import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "../App.css";
import ExperimentOnline from "./ExperimentOnline";
import ExperimentOffline from "./ExperimentOffline";
import AdminPanel from "./AdminPanel";

const PRODUCTION = process.env.NODE_ENV === "production";
const Experiment = PRODUCTION ? ExperimentOnline : ExperimentOffline;

function AppRouter() {
  return (
    <Router>
      <div className="App">
        <Route path="/admin" exact component={AdminPanel} />
        <Route path="/" exact component={Experiment} />
      </div>
    </Router>
  );
}

export default AppRouter;
