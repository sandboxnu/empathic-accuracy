import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import ExperimentOnline from './ExperimentOnline';
import AdminPanel from './AdminPanel';

function AppRouter() {
  return (
    <Router>
      <div className="App">
        <Route path="/admin" exact component={AdminPanel} />
        <Route path="/" exact component={ExperimentOnline} />
      </div>
    </Router>
  );
}

export default AppRouter;
