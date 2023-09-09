//Charles Bruner 4/10/2023
import "./App.css";
import { useState, useEffect } from "react";
import ScatterPlot from "./ScatterPlot";
import PieChart from "./PieChart";
import Histogram from "./Histogram";
import DataGrid2 from "./DataGrid2";

function App() {
  const [sharedData, setSharedData] = useState([]);
  const [data, setData] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const margin = { top: 20, right: 20, bottom: 50, left: 50 };

  useEffect(() => {
    let count = 0;
    // document.defaultView.addEventListener("resize", handleResize);
    fetch("http://localhost:4000/db")
      .then((response) => response.json())
      .then((data) => {
        // dataTableData = data;
        const fetchedData = data[0].data
        console.log(fetchedData)
        setInitialData(fetchedData.map((d) => ({ ...d })));
        // setInitialData(x);
        fetchedData.forEach((d) => {
          d.Week = new Date(d.Week);
          d.id = count; //adds id field for each entry in array
          count++;
        });

        setData(fetchedData);
        console.log(fetchedData);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      <div className="App">
        <div className="graph-container">
          {data && <ScatterPlot data={data} margin={margin} sharedData={sharedData} setSharedData={setSharedData} />}
          <div className="pie-histo-container">
            <div className="pie-container">
              {data && <PieChart data={data} margin={margin} />}
            </div>
            <div className="histogram-container">
              {data && <Histogram data={data} margin={margin} />}
            </div>
          </div>
        </div>
      </div>
      <div className="data-container">
        {data && <DataGrid2 data={initialData} sharedData={sharedData} setSharedData={setSharedData} />}
      </div>
    </div>
  );
}

export default App;