/* eslint-disable @typescript-eslint/no-unused-vars */
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
const IndividualCharts = ({ data, config, labels }) => {

  const chartSetting = {
    yAxis: [
      {
        label: config.axisName,
      },
    ],
    width: 550,
    height: 300,
  };
  let chart: any;
  if (config.chartType === "bar") {
    chart = (
      <BarChart
        dataset={data}
        series={[
          {
            dataKey: "value",
            label: config.seriesId.label,
            color: config.color ? `#${config.color}` : "",
          },
        ]}
        xAxis={[{ scaleType: "band", dataKey: "date" }]}
        {...chartSetting}
      ></BarChart>
    );
  } else {
    chart = (
      <LineChart
        xAxis={[{ data: data }]}
        series={[
          {
            data: labels,
            color: config.color ? `#${config.color}` : "",
          },
        ]}
        width={650}
        height={300}
      />
    );
  }

  return (
    <>
      <h2 className=""> {config.title} </h2>
      {chart}
    </>
  );
};

export default IndividualCharts;
