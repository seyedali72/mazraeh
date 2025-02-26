'use server'

import Products from '@/models/Products'
import connect from '../lib/db'
import { onlyUnique, sumArray, sumMultipleArrays } from '../utils/helpers'

export const getChartProductsForTotal = async (body: any) => {
	await connect()
	body.colors = [{ borderColor: '#2d7c4f', backgroundColor: '#2d7c4f' }, { borderColor: '#078191', backgroundColor: '#078191' },
	{ borderColor: '#cc1220', backgroundColor: '#cc1220' }, { borderColor: '#e05212', backgroundColor: '#e05212' },
	{ borderColor: '#d31184', backgroundColor: '#d31184' }, { borderColor: '#2d7c4f', backgroundColor: '#2d7c4f' },]
	const { branchs, typeSearch, colors, valueArray } = body
	let allGroup: any = []
	try {
		let object = typeSearch == 'ماه' ? { month: valueArray[0] } : typeSearch == 'سال' ? { year: valueArray[0] } : { week: valueArray[0] }
		const find = await Products.find(object).select('group')
		const uniqueGroup = find.map((el: any) => el.group).filter(onlyUnique);
		allGroup.push(uniqueGroup)

	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت کاربر' }
	}
	let allGroups = allGroup.flat()
	body.allGroups = allGroups
	// ارسال اطلاعات و دریافت اطلاعات مقایسه ای و تفکیکی
	let dataArray: any[] = [];
	for (const branch of branchs) {
		let daysArray: any[] = [];
		for (const valueX of valueArray) {
			body.branch = branch;
			body.valueX = valueX;
			const res = await getChartProduct(body);
			if (res) { res.branch = branch; daysArray.push(res); }
		}
		dataArray.push(daysArray)
	}
	if (dataArray.length === 0) { throw new Error("No data received from branches."); }

	// درست کردن لیبل های مقایسه ای
	let labels = valueArray
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
	// اماده سازی اطلاعات نمایش نمودار جهت خروجی اصلی 
	let RadarData = { labels, datasets }
	// حلقه زدن برروی اطلاعات دریافتی جهت اماده سازی اطلاعات در نمایش نمودار رادار
	const datasetBar = dataArray.map((branchData, i: number) => {
		const findData = branchData.map((dayData: any) => dayData.barChart.data);
		let data = sumMultipleArrays(findData)
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
	// اماده سازی اطلاعات نمایش نمودار جهت خروجی اصلی 
	let BarData = { labels: allGroups, datasets: datasetBar }

	return { RadarData, allGroups, BarData }
}
export const getChartProduct = async (body: any) => {
	await connect()
	const { branch, valueX, typeSearch, type, allGroups } = body

	let object = typeSearch == 'ماه' ? { month: valueX } : typeSearch == 'سال' ? { year: valueX } : { week: valueX }
	try {
		const find = await Products.find(object)
		const filteredSales = find.flatMap((item: any) =>
			item.totalSell.filter((el: any) => el.branch === branch)
		);
		const salesForCurrentDate: any = filteredSales.map((item: any) => type == 'sell' ? item.sell : item.return);
		const totalSales = sumArray(salesForCurrentDate);


		const radarChart = { data: [totalSales] };
		const barChart = await getGiveGroupData(body, find)
		return JSON.parse(JSON.stringify({ radarChart, barChart, allGroups }));

	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت کاربر' }
	}
}

export const getGiveGroupData = async (body: any, data: any) => {
	await connect()
	const { branch, type, allGroups } = body
	try {
		// محصولاتی که توی این گروه کالا قراردارند رو میکشیم بیرون
		const salesByGroup = allGroups.map((group: string) => {
			const salesForCurrentGroup = data.filter((el: any) => el.group === group);

			const totalSalesByGroup = salesForCurrentGroup.reduce((accumulator: any, current: any) => {
				const filteredSales = current.totalSell.filter((sale: any) => sale.branch === branch);
				return accumulator + sumArray(filteredSales.map((item: any) => type == 'sell' ? item.sell : item.return));
			}, 0);

			return totalSalesByGroup
		});

		// اماده سازی ابجکت خروجی
		const result = { label: branch, data: salesByGroup };
		return JSON.parse(JSON.stringify(result));

	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت کاربر' }
	}
}