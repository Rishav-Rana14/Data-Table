import React from 'react';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import DataTable from './components/DataTable';
import './App.css';

function App() {
  return (
    <>
    <div className="App">
      <h1>Data Table</h1>
      <DataTable />
    </div>
     <ToastContainer autoClose={2000} />
    </>
  );
}

export default App;