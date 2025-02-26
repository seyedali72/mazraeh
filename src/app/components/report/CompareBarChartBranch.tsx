import React, { useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { spliteNumber, sumArray } from '@/app/utils/helpers';
import { nanoid } from 'nanoid';
import { useReactToPrint } from 'react-to-print';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

export default function CompareBarChartBranch({ compareData }: any) {
  // ,plugins:{ legend: { labels:{font:{size:19,family:'Arial'}}},} 
  const options = { responsive: true, plugins: { title: { display: true, text: compareData?.title } } };
  const labels = compareData?.labels;
  const check = compareData?.datasets?.map((item: any, idx: number) => {
    return ({ label: item?.label, data: item?.data, backgroundColor: item?.backgroundColor, borderColor: item?.borderColor, minBarLength: 5 })
  });
  const data = { labels, datasets: check };

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  if (check !== undefined) {
    return (<section className="main-body-container rounded">
      <div className="table-responsive">
        <table className="table table-striped border fs90">
          <thead><tr ><th colSpan={compareData?.labels?.length + 2} className="text-end">{compareData?.header}</th></tr></thead>
          <tbody>
            <tr><td>عنوان</td><td>کل فروش</td><td>میانگین فروش</td>{compareData?.labels?.map((item: any) => <td key={nanoid()}>{item}</td>)}</tr>
            {compareData?.datasets?.map((item: any) => {
                        let averageSell = item?.data?.filter((item: any) => item > 0)
                        return (<tr key={nanoid()}>
                          <td>فروش {item?.label} (ريال)</td>
                          <td>{spliteNumber(sumArray(item?.data))}</td>
                          <td>{spliteNumber(sumArray(item?.data) / averageSell?.length)}</td>{item?.data?.map((el: any) => <td key={nanoid()}>{spliteNumber(el)}</td>)}
                        </tr>)
                      })}
          </tbody>
        </table>
      </div>
      <button className="btn btn-sm bg-custom-2 text-nowrap" onClick={() => reactToPrintFn()}>پرینت نمودار</button>
      <div ref={contentRef}>  <Bar options={options} data={data} /></div>
    </section>);
  } else { return (<div className='p-3 text-center'>هیچ داده‌ای برای نمایش وجود ندارد.</div>) }
}
