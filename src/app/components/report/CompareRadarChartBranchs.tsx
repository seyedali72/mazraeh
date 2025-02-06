import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, RadialLinearScale, Filler, } from 'chart.js';
import { Bar, Radar } from 'react-chartjs-2';
import { spliteNumber } from '@/app/utils/helpers';
import { nanoid } from 'nanoid';

ChartJS.register(RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend);

export default function CompareRadarChartBranch({ compareData }: any) {
  // ,plugins:{ legend: { labels:{font:{size:19,family:'Arial'}}},} 
  

  const options = { responsive: true, plugins: { title: { display: true, text: compareData?.title } } };
  const labels = compareData?.labels


  if (labels !== undefined) {
    return (<section className="main-body-container rounded">
      <div className="table-responsive">
        <table className="table table-striped border fs90">
          <thead><tr ><th colSpan={compareData?.labels?.length + 1} className="text-center">{compareData?.header}</th></tr></thead>
          <tbody>
            <tr><td>عنوان</td>{compareData?.labels?.map((item: any) => <td key={nanoid()}>{item}</td>)}</tr>
            {compareData?.datasets?.map((item: any) => <tr key={nanoid()}><td>فروش {item?.label} (ريال)</td>{item?.data?.map((el: any) => <td key={nanoid()}>{spliteNumber(el)}</td>)}</tr>)}
          </tbody>
        </table>
      </div>
      <Radar options={options} data={compareData} /></section>);
  } else { return (<div className='p-3 text-center'>هیچ داده‌ای برای نمایش وجود ندارد.</div>) }
}
