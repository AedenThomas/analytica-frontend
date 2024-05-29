"use client";
import axios from 'axios';
import { useEffect, useState } from 'react';
import LineChart from './components/LineChart';
import Plot from 'react-plotly.js';


function aggregateData(rawData) {
  const counts = {}; // Object to hold the count of visits per date
  rawData.forEach(item => {
    const date = new Date(item.timestamp).toISOString().substring(0, 10);
    if (counts[date]) {
      counts[date] += 1; // Increment if already exists
    } else {
      counts[date] = 1; // Initialize if doesn't exist
    }
  });

  // Transform this object into an array suitable for plotting
  return Object.keys(counts).map(date => ({
    x: date,
    y: counts[date]
  }));
}


export default function Home() {
  const [data, setData] = useState([]);

  
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/pageviews/')
      .then(response => {
        const aggregatedData = aggregateData(response.data);
        console.log("Aggregated Data for Plotting:", aggregatedData); // Debugging line
        setData([{
          x: aggregatedData.map(d => d.x),
          y: aggregatedData.map(d => d.y),
          type: 'scatter',
          mode: 'lines+markers',
          marker: { color: 'blue' },
        }]);
      })
      .catch(error => console.log(error));
  }, []);
  
  console.log(data);

  return (
    <div>
      <h1>Page Views Analytics</h1>
      
      {data.length > 0 && (
       <Plot
       data={data}
       layout={{
         title: 'Page View Data Over Time',
         xaxis: {
           title: 'Date',
           type: 'date',
           tickformat: '%Y-%m-%d',
           nticks: 20 // Adjust the number of ticks for better visualization
         },
         yaxis: {
           title: 'Number of Views'
         },
         showlegend: true, // Turn on legend if not visible
         width: 800,
         height: 500,
         margin: { l: 50, r: 50, b: 100, t: 50, pad: 4 }
       }}
       useResizeHandler={true} // Ensure responsive resizing
       style={{ width: "100%", height: "100%" }} // Ensure the plot fills the container
     />
     
      
      
      )}
    </div>
  );
}

function transformDataForPlot(rawData) {
  return rawData.map(item => ({
    x: new Date(item.timestamp).toISOString().substring(0, 10), // Extracts date in YYYY-MM-DD
    y: 1 // Since no count is specified, we'll plot each timestamp occurrence as '1'
  }));
}

