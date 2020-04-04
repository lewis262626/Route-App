import React from 'react';
import './App.css';
import { Navbar } from 'react-bootstrap';


function App() {
  return (
    <div className="App">
      <Navbar fluid collapseOnSelect bg="light">
        <Navbar.Brand href="#home">SimRoutes</Navbar.Brand>
      </Navbar>
    </div>
  );
}

export default App;
