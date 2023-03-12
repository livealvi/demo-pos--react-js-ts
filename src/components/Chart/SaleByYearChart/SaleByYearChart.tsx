import {
  Chart as ChartJs,
  BarElement,
  ChartData,
  CategoryScale,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import moment from "moment-timezone";
import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";

ChartJs.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
      display: false,
    },

    title: {
      display: true,
      text: "Sold by Year",
    },
  },
};

const labels = [] as any;

export const data = {
  labels,
  datasets: [
    {
      label: "Dataset",
      data: [] as any,
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
  ],
};

const SaleByYearChart = ({ yearBySale }: any) => {
  console.log({ yearBySale });

  const data = useMemo(
    () => ({
      labels: !!yearBySale?.saleByAllMonth
        ? yearBySale?.saleByAllMonth.map((y: { month: any }) =>
            moment()
              .month(y.month - 1)
              .tz("Asia/Dhaka")
              .format("MMMM")
          )
        : [],

      datasets: [
        {
          label: "Total Sale",
          data: !!yearBySale?.saleByAllMonth
            ? yearBySale?.saleByAllMonth.map((y: { count: any }) => y.count)
            : [],
          // data: [],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    }),
    [yearBySale]
  );

  return <Bar data={data} options={options} />;
};

export default SaleByYearChart;
