import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { spliteNumber } from '@/app/utils/helpers';
import { nanoid } from 'nanoid';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

export default function CompareBarChartBranch({ compareData }: any) {
  // ,plugins:{ legend: { labels:{font:{size:19,family:'Arial'}}},} 
  // const colors = [{ borderColor: '#0aa04e', backgroundColor: '#0aa04eaa' },
  // { borderColor: '#a93b53', backgroundColor: '#ff6384' },
  // { borderColor: '#0044ee', backgroundColor: '#0044eeaa' },
  // { borderColor: '#aa55c0', backgroundColor: '#aa55c0cc' },
  // { borderColor: '#cc12ec', backgroundColor: '#cc12ecaa' }, { borderColor: '#0aa04e', backgroundColor: '#0aa04eaa' },
  // { borderColor: '#a93b53', backgroundColor: '#ff6384' },
  // { borderColor: '#0044ee', backgroundColor: '#0044eeaa' },
  // { borderColor: '#aa55c0', backgroundColor: '#aa55c0cc' },
  // { borderColor: '#cc12ec', backgroundColor: '#cc12ecaa' }, { borderColor: '#0aa04e', backgroundColor: '#0aa04eaa' },
  // { borderColor: '#a93b53', backgroundColor: '#ff6384' },
  // { borderColor: '#0044ee', backgroundColor: '#0044eeaa' },
  // { borderColor: '#aa55c0', backgroundColor: '#aa55c0cc' },
  // { borderColor: '#cc12ec', backgroundColor: '#cc12ecaa' }]

  const options = { responsive: true, plugins: { title: { display: true, text: compareData?.title } } };
  const labels = compareData?.labels

  const data = {
    labels, datasets: [{
      label: 'مبلغ به ريال', data: compareData?.data, backgroundColor: ['rgb(124, 7, 32)',], borderColor: ['rgb(195, 21, 59)',], minBarLength: 5
    }]
  };

  if (labels !== undefined) {
    return (<section className="main-body-container rounded">
      <div className="table-responsive">
        <table className="table table-striped border fs90">
          <thead><tr ><th colSpan={compareData?.labels?.length + 1} className="text-center">{compareData?.header}</th></tr></thead>
          <tbody>
            <tr><td>عنوان</td>{compareData?.labels?.map((item: any) => <td key={nanoid()}>{item}</td>)}</tr>
            <tr><td>مبلغ کل (ريال)</td>{compareData?.data?.map((item: any) => <td key={nanoid()}>{spliteNumber(item)}</td>)}</tr>
          </tbody>
        </table>
      </div>
      <Bar options={options} data={data} /></section>);
  } else { return (<div className='p-3 text-center'>هیچ داده‌ای برای نمایش وجود ندارد.</div>) }
}
