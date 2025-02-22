import React, { useRef } from 'react';
import { Chart as ChartJS, PointElement, LineElement, Title, Tooltip, Legend, RadialLinearScale, Filler, } from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { adjustOpacity, spliteNumber, sumArray } from '@/app/utils/helpers';
import { nanoid } from 'nanoid';
import { useReactToPrint } from 'react-to-print';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend);

export default function CompareRadarChartBranch({ compareData }: any) {
  // ,plugins:{ legend: { labels:{font:{size:19,family:'Arial'}}},} 

  const options = { responsive: true, plugins: { title: { display: true, text: compareData?.title } }, };
  const labels = compareData?.labels;
  const check = compareData?.datasets?.map((item: any, idx: number) => {
    let newColor = adjustOpacity(item?.backgroundColor, 0.2);
    return ({ label: item?.label, data: item?.data, backgroundColor: newColor, borderColor: item?.borderColor, minBarLength: 5 })
  });
  const data = { labels, datasets: check };

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  if (check !== undefined) {
    return (<section className="main-body-container rounded">
      <div className="table-responsive">
        <table className="table table-striped border fs90">
          <thead><tr ><th colSpan={compareData?.labels?.length + 2} className="text-center">{compareData?.header}</th></tr></thead>
          <tbody>
            <tr><td>عنوان</td><td>کل فروش</td><td>میانگین فروش</td>{compareData?.labels?.map((item: any) => <td key={nanoid()}>{item}</td>)}</tr>
            {compareData?.datasets?.map((item: any) => <tr key={nanoid()}><td>فروش {item?.label} (ريال)</td><td>{spliteNumber(sumArray(item?.data))}</td><td>{spliteNumber(sumArray(item?.data) / item?.data?.length)}</td>{item?.data?.map((el: any) => <td key={nanoid()}>{spliteNumber(el)}</td>)}</tr>)}
          </tbody>
        </table>
      </div>
      <button className="btn btn-sm bg-custom-2 text-nowrap" onClick={() => reactToPrintFn()}>پرینت نمودار</button>
      <div ref={contentRef}> <Radar options={options} data={data} /></div>
    </section>);
  } else { return (<div className='p-3 text-center'>هیچ داده‌ای برای نمایش وجود ندارد.</div>) }
}
