import React, { useState } from "react";
import IndividualCharts from "./individualCharts";
import ChartConfigure from "./configureCharts";
import { fetchData } from "../service/fredService";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import { useLoader } from "../LoaderCOntext";

// Define the type for the chart data
interface ChartData {
  data: {
    labels: string[];
    config: any;
    points: any[];
    UID: string;
  };
}

const ChartGroup = () => {
  const [charts, setCharts] = useState<ChartData[]>([]);
  const [editingChart, setEditingChart] = useState<ChartData | null>(null); // To track the chart being edited
  const { showLoader, hideLoader } = useLoader(); // implementation of loader context

  const addChart = async (config: any) => {
    try {
      showLoader();
      const dataPoints = await fetchData(
        config.seriesId.id,
        config.start,
        config.end
      );
      hideLoader();
      let points = [];
      const observations = dataPoints?.observations;
      if (config.chartType === "bar") {
        points = observations.map((point: any) => ({
          value: point.value,
          date: point.date.split("-")[0],
        }));
      } else {
        points = dataPoints?.observations.map((point: any) => point.value);
      }
      const tempConfig = config;
      const chartData = {
        labels: dataPoints?.observations.map(
          (point: any) => point.date.split("-")[0]
        ),
        config: Object.assign({}, tempConfig),
        points: points,
        UID: editingChart
          ? editingChart.data.UID
          : `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,   // UID for unique ID while being editing 
      };

      setCharts((prevCharts) => {
        if (editingChart) {
          // Update the existing chart in collection
          return prevCharts.map((chart: any) =>
            chart.data.UID === editingChart.data.UID
              ? { ...chart, data: chartData }
              : chart
          );
        } else {
          // Add new chart in collection
          return [...prevCharts, { data: chartData }];
        }
      });
      setEditingChart(null);
    } catch (error) {
      alert(error);
    }
  };

  const removeChart = (index: number) => {
    setCharts((prevCharts) => prevCharts.filter((_, i) => i !== index));
  };
  const handleEditChart = (chart: ChartData) => {
    setEditingChart(chart); // Set chart to be edited
  };
  const resetEditingChart = () => {
    setEditingChart(null); // reset after updating
  };
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <ChartConfigure
              onUpdate={addChart}
              chartToEdit={editingChart}
              onResetEditing={resetEditingChart}
            />
          </Grid>
          {charts.length > 0 && ( // DIsplay after an entry is added in collection
            <Grid size={12} className="chart-container">
              {charts.map((chart: ChartData, index) => (
                <div key={index} className="charts">
                  <IndividualCharts
                    data={chart.data.points}
                    config={chart.data.config}
                    labels={chart.data?.labels || {}}
                  />
                  <Button
                    className="optionsButton"
                    onClick={() => removeChart(index)}
                    variant="contained"
                  >
                    Delete
                  </Button>
                  <Button
                    className="optionsButton"
                    onClick={() => handleEditChart(chart)}
                    variant="contained"
                  >
                    Update
                  </Button>
                </div>
              ))}
            </Grid>
          )}
        </Grid>
      </Box>
    </div>
  );
};

export default ChartGroup;
