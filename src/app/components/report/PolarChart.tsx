import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { PolarArea } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

export const data = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgb(200, 200, 200,.5)', 
        ],
        borderWidth: 1,
      },  {
        label: '# of Votes',
        data: [15, 9, 7, 1, 12, 9],
        backgroundColor: [
          'rgba(255, 99, 132)', 
        ],
        borderWidth: 1,
      },
  ],
};

export default function PolarChart() {
  return <PolarArea data={data} />;
}
