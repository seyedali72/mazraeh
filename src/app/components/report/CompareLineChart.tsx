import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, plugins, } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function CompareLineChart({ compareData }: any) {
  // ,plugins:{ legend: { labels:{font:{size:19,family:'Arial'}}},} 
  const colors = [{ borderColor: '#0aa04e', backgroundColor: '#0aa04eaa' },
  { borderColor: '#a93b53', backgroundColor: '#ff6384' },
  { borderColor: '#0044ee', backgroundColor: '#0044eeaa' },
  { borderColor: '#aa55c0', backgroundColor: '#aa55c0cc' },
  { borderColor: '#cc12ec', backgroundColor: '#cc12ecaa' }]

  const options = { responsive: true };
  const labels = compareData?.labels;
  const check = compareData?.data?.map((station: any, idx: number) => {
    let data = station?.dataset?.map((ex: any) => ex?.totalSell)
     return ({ label: station?.branch, data: data, borderColor: colors[idx].borderColor, backgroundColor: colors[idx].backgroundColor })
  });
console.log(check)
  const data = {
    labels,
    datasets: check,
  };
  if (check !== undefined) {
    return (<section className="main-body-container rounded"><Line options={options} data={data} /></section>);
  }
}
