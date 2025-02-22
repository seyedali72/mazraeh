import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, } from 'chart.js';
import { Bar } from 'react-chartjs-2'; 
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

export default function DashboardChart({ compareData }: any) {
  // ,plugins:{ legend: { labels:{font:{size:19,family:'Arial'}}},} 
  const options = { responsive: true, plugins: { title: { display: true, text: compareData?.title } } };
  if (compareData !== undefined) {
    return (
      <section className="main-body-container rounded">

        <Bar options={options} data={compareData} /></section>
    );
  } else { return (<div className='p-3 text-center'>هیچ داده‌ای برای نمایش وجود ندارد.</div>) }
}
