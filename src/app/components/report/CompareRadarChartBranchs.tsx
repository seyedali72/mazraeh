import React from 'react';
import { Chart as ChartJS, PointElement, LineElement, Title, Tooltip, Legend, RadialLinearScale, Filler, } from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { spliteNumber } from '@/app/utils/helpers';
import { nanoid } from 'nanoid';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend);

export default function CompareRadarChartBranch({ compareData }: any) {
  // ,plugins:{ legend: { labels:{font:{size:19,family:'Arial'}}},} 

  const options = { responsive: true, plugins: { title: { display: true, text: compareData?.title } }, };
  const labels = compareData?.labels;
  const check = compareData?.datasets?.map((item: any, idx: number) => {
    return ({ label: item?.label, data: item?.data, backgroundColor: item?.backgroundColor, minBarLength: 5 })
  });

  const data = { labels, datasets: check };
  if (check !== undefined) {
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
      <Radar options={options} data={data} /></section>);
  } else { return (<div className='p-3 text-center'>هیچ داده‌ای برای نمایش وجود ندارد.</div>) }
}
