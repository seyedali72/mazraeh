'use server'

import Products from '@/models/Products'
import connect from '../lib/db'
import { convertToPersianDate, onlyUnique, sumArray, sumMultipleArrays } from '../utils/helpers'

export const getChartProductsDuration = async (body: any) => {
	await connect()
	body.colors = [{ borderColor: '#2d7c4f', backgroundColor: '#2d7c4f' }, { borderColor: '#078191', backgroundColor: '#078191' },
	{ borderColor: '#cc1220', backgroundColor: '#cc1220' }, { borderColor: '#e05212', backgroundColor: '#e05212' },
	{ borderColor: '#d31184', backgroundColor: '#d31184' }, { borderColor: '#2d7c4f', backgroundColor: '#2d7c4f' },]
	const { branchs,  colors, products ,startDate ,endDate} = body
 
	// ارسال اطلاعات و دریافت اطلاعات مقایسه ای و تفکیکی
	let dataArray: any[] = [];
	for (const branch of branchs) {
		let daysArray: any[] = [];
		for (const valueX of products) {
			body.branch = branch;
			body.valueX = valueX;
			const res = await getChartProduct(body);
			if (res) { res.branch = branch; daysArray.push(res); }
		}
		dataArray.push(daysArray)
	}
	if (dataArray.length === 0) { throw new Error("No data received from branches."); }

	// درست کردن لیبل های مقایسه ای
	let labels = products
	// حلقه زدن برروی اطلاعات دریافتی جهت اماده سازی اطلاعات در نمایش نمودار رادار
	const datasets = dataArray.map((branchData, i) => {
		const data = branchData.map((dayData: any) => dayData.radarChart.data[0]);
		return {
			label: branchs[i],
			data,
			backgroundColor: colors[i].backgroundColor,
			fill: false, tension: 0.1,
			borderColor: colors[i].borderColor,
			pointBackgroundColor: colors[i].backgroundColor,
			pointBorderColor: '#fff',
			pointHoverBackgroundColor: '#fff',
			pointHoverBorderColor: colors[i].borderColor,
		};
	});
		const converted = (days: any) => {
			let result: any = []
			for (const day of days) { result.push(convertToPersianDate(day, 'YMD')) }
			return result
		}
	// اماده سازی اطلاعات نمایش نمودار جهت خروجی اصلی 
	let RadarData = { labels, datasets, title: `نمودار فروش ${products} از تاریخ ${convertToPersianDate(startDate,'YMD')}  تا تاریخ ${convertToPersianDate(endDate,'YMD')}`, header: `جدول فروش ${products} از تاریخ ${convertToPersianDate(startDate,'YMD')} تا تاریخ ${convertToPersianDate(endDate,'YMD')}` }
 
	return { RadarData}
}
export const getChartProduct = async (body: any) => {
	await connect()
	const { branch, valueX, startDate, type ,endDate} = body

	try {
		const find = await Products.find({name:valueX})
		
		const filteredSales = find.flatMap((item: any) =>
			item.totalSell.filter((el: any) => el.branch === branch && el.date >= startDate && el.date <= endDate)
		);
		const salesForCurrentDate: any = filteredSales.map((item: any) => type == 'sell' ? item.sell : item.return);
		const totalSales = sumArray(salesForCurrentDate);

		const radarChart = { data: [totalSales] };
		// const barChart = await getGiveGroupData(body, find)
		return JSON.parse(JSON.stringify({ radarChart }));

	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت کاربر' }
	}
}
