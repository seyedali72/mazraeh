import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, plugins, } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function LineChart({ singleReport }: any) {
  // ,plugins:{ legend: { labels:{font:{size:19,family:'Arial'}}},} 
  const options = { responsive: true };
  const labels = singleReport?.map((el: any) => el?.name);
  const sellData = singleReport?.map((el: any) => el?.totalSell);
  const returnData = singleReport?.map((el: any) => el?.totalReturn);
  const data = {
    labels,
    datasets: [
      {
        label: 'مبالغ فروش',
        data: sellData,
        borderColor: 'rgb(15, 160, 85)',
        backgroundColor: 'rgba(10, 123, 78, 0.5)',
      }, {
        label: 'مبالغ مرجوعی',
        data: returnData,
        borderColor: 'rgb(169, 59, 83)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ],
  };

  return (<section className="main-body-container rounded"><Line options={options} data={data} /></section>);
}
