import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, plugins, } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { spliteNumber } from '@/app/utils/helpers';
import { nanoid } from 'nanoid';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function CompareLineChartBranch({ compareData }: any) {
  // ,plugins:{ legend: { labels:{font:{size:19,family:'Arial'}}},} 
  // const colors = [{ borderColor: '#0aa04e', backgroundColor: '#0aa04eaa' },
  // { borderColor: '#a93b53', backgroundColor: '#ff6384' },
  // { borderColor: '#0044ee', backgroundColor: '#0044eeaa' },
  // { borderColor: '#aa55c0', backgroundColor: '#aa55c0cc' },
  // { borderColor: '#cc12ec', backgroundColor: '#cc12ecaa' }]

  const options = { responsive: true, plugins: { title: { display: true, text: compareData?.title } } };
  const labels = compareData?.labels

  let dataArray = compareData?.data?.map((wl: any) => wl.dataset?.totalSell)
  
  let dataSet = { label: 'مبلغ به ريال', data: dataArray, borderColor: '#0aa04e', backgroundColor: '#0aa04eaa' }
  
  const data = {
    labels,
    datasets: [dataSet],
  };
  let totalSellTable = compareData?.data?.map((wl: any) => wl.dataset)

  if (dataSet !== undefined) {
    return (<section className="main-body-container rounded">
     <div className="table-responsive">
     <table className="table table-striped border fs90">
        <thead><tr ><th colSpan={totalSellTable?.length + 1} className="text-center">{compareData?.header}</th></tr></thead>
        <tbody>
          <tr><td>تاریخ</td>{totalSellTable?.map((item:any)=><td key={nanoid()}>{item.name}</td>)}</tr>
          <tr><td>مبلغ کل (ريال)</td>{totalSellTable?.map((item:any)=><td key={nanoid()}>{spliteNumber(item.totalSell)}</td>)}</tr>
        </tbody>
      </table>
     </div>
      <Line options={options} data={data} /></section>);
  }
}
