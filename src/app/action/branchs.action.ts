'use server'

import Products from '@/models/Products'
import connect from '../lib/db'
import { convertNumbersToEnglish, convertToPersianDate, onlyUnique, sumArray } from '../utils/helpers'

export const getChartProducts = async (body: any) => {
	body.colors = [{ borderColor: '#2d7c4f', backgroundColor: '#2d7c4f' }, { borderColor: '#078191', backgroundColor: '#078191' },
	{ borderColor: '#cc1220', backgroundColor: '#cc1220' }, { borderColor: '#e05212', backgroundColor: '#e05212' },
	{ borderColor: '#d31184', backgroundColor: '#d31184' }, { borderColor: '#2d7c4f', backgroundColor: '#2d7c4f' },]
	const { branchs, startDate, endDate, type, colors } = body
	// ارسال اطلاعات و دریافت اطلاعات مقایسه ای و تفکیکی
	let dataArray: any[] = [];
	for (const branch of branchs) { body.branch = branch; const res = await getChartProduct(body); dataArray.push(res); }
	if (dataArray.length === 0) { throw new Error("No data received from branches."); }
	// ترکیب ارایه های گروه های کالایی و یونیک سازی یک ارایه واحد
	let uniqueGroup: any = []
	for (const data of dataArray) { for (let i = 0; i < data.allGroups.length; i++) { uniqueGroup.push(data.allGroups[i]) } }
	let allGroups: any = (uniqueGroup).filter(onlyUnique)
	// حلقه زدن برروی اطلاعات دریافتی جهت اماده سازی اطلاعات در نمایش نمودار رادار
	const datasets = dataArray.map((data: any, index: number) => ({
		label: data.radarChart.branch,
		data: data.radarChart.data,
		fill: false, tension: 0.1,
		backgroundColor: colors[index].backgroundColor,
		borderColor: colors[index].borderColor,
		pointBackgroundColor: colors[index].backgroundColor,
		pointBorderColor: '#fff',
		pointHoverBackgroundColor: '#fff',
		pointHoverBorderColor: colors[index].borderColor,
	}));
	// درست کردن لیبل های مقایسه ای
	let labels = dataArray[0].radarChart.newName.map((name: any) => name[0]);
	// اماده سازی اطلاعات نمایش نمودار جهت خروجی اصلی 
	let RadarData = { labels, datasets, allGroups, title: `نمودار مقایسه ${type == 'sell' ? 'فروش' : 'مرجوعی'} شعب از تاریخ ${convertToPersianDate(startDate, 'YMD')} الی ${convertToPersianDate(endDate, 'YMD')} `, header: `جدول مقایسه ${type == 'sell' ? 'فروش' : 'مرجوعی'} شعب از تاریخ ${convertToPersianDate(startDate, 'YMD')} الی ${convertToPersianDate(endDate, 'YMD')} `, }
	// حلقه زدن برروی اطلاعات دریافتی جهت اماده سازی اطلاعات در نمایش نمودار رادار
	const barDatasets = dataArray.map((data: any, index: number) => ({
		label: data.barChart.branch,
		data: data.barChart.data,
		backgroundColor: colors[index].backgroundColor,
		fill: false, tension: 0.1,
		borderColor: colors[index].borderColor,
		pointBackgroundColor: colors[index].backgroundColor,
		pointBorderColor: '#fff',
		pointHoverBackgroundColor: '#fff',
		pointHoverBorderColor: colors[index].borderColor,
	}));

	// اماده سازی اطلاعات نمایش نمودار جهت خروجی اصلی 
	let BarData = { labels: allGroups, datasets: barDatasets, allGroups, title: `نمودار مقایسه ${type == 'sell' ? 'فروش' : 'مرجوعی'} شعب براساس گروه کالا از تاریخ ${convertToPersianDate(startDate, 'YMD')} الی ${convertToPersianDate(endDate, 'YMD')} `, header: `جدول مقایسه ${type == 'sell' ? 'فروش' : 'مرجوعی'} شعب از تاریخ ${convertToPersianDate(startDate, 'YMD')} الی ${convertToPersianDate(endDate, 'YMD')} `, }

	return { RadarData, BarData }
}
export const getChartProduct = async (body: any) => {
	await connect()
	const { branch, startDate, endDate, startYear, startMonth, endYear, endMonth, type } = body
	let loop = (endDate - startDate) / 86400000
	let spliteDateArray: any = []
	for (let i = 0; i <= loop; i++) {
		let value = startDate + (86400000 * i)
		spliteDateArray.push(value)
	}
	try {
		const productsInStartMonth = await Products.find({ year: convertNumbersToEnglish(startYear), month: convertNumbersToEnglish(startMonth) })
		const productsInEndMonth = (startYear !== endYear || startMonth !== endMonth) ? await Products.find({ year: convertNumbersToEnglish(endYear), month: convertNumbersToEnglish(endMonth) }) : []
		let combinedProducts = productsInStartMonth.concat(productsInEndMonth)
		const filteredSales = combinedProducts.flatMap((item: any) =>
			item.totalSell.filter((el: any) => el.branch === branch && el.date >= startDate && el.date <= endDate)
		);

		const allGroups = combinedProducts.map((el: any) => el.group).filter(onlyUnique);

		const salesByDate = spliteDateArray.map((date: any) => {
			const salesForCurrentDate: any = filteredSales.filter((el: any) => el.date === date).map((item: any) => type == 'sell' ? item.sell : item.return);
			const totalSales = sumArray(salesForCurrentDate);
			return totalSales
		});
		const dayByDate = spliteDateArray.map((date: any) => {
			const dayCurrentDate: any = filteredSales.filter((el: any) => el.date === date).map((el: any) => `${convertToPersianDate(date, 'YMD')}-${el.day}`).filter(onlyUnique);
			return dayCurrentDate.length > 0 ? dayCurrentDate : convertToPersianDate(date, 'YMD')
		});

		const radarChart = { labels: spliteDateArray.map((date: any) => convertToPersianDate(date, 'YMD')), data: salesByDate, branch: branch, newName: dayByDate };
		const barChart = await getGiveGroupData(body, combinedProducts)
		return JSON.parse(JSON.stringify({ radarChart, barChart, allGroups }));

	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت کاربر' }
	}
}

export const getGiveGroupData = async (body: any, combinedProducts: any) => {
	await connect()
	const { branch, startDate, endDate, type } = body

	try {
		const allGroups = combinedProducts.map((el: any) => el.group).filter(onlyUnique);

		// محصولاتی که توی این گروه کالا قراردارند رو میکشیم بیرون
		const salesByGroup = allGroups.map((group: string) => {
			const salesForCurrentGroup = combinedProducts.filter((el: any) => el.group === group);

			const totalSalesByGroup = salesForCurrentGroup.reduce((accumulator: any, current: any) => {
				const filteredSales = current.totalSell.filter((sale: any) => sale.branch === branch && sale.date >= startDate && sale.date <= endDate);
				return accumulator + sumArray(filteredSales.map((item: any) => type == 'sell' ? item.sell : item.return));
			}, 0);

			return totalSalesByGroup
		});

		// اماده سازی ابجکت خروجی
		const result = { labels: allGroups, data: salesByGroup, branch: branch };
		return JSON.parse(JSON.stringify(result));

	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت کاربر' }
	}
}