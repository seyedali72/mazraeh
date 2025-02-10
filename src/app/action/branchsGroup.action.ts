'use server'

import Products from '@/models/Products'
import connect from '../lib/db'
import { convertNumbersToEnglish, convertToPersianDate, onlyUnique, sumArray } from '../utils/helpers'

export const getChartBranchsGroup = async (body: any) => {
	body.colors = [{ borderColor: '#2d7c4f', backgroundColor: '#2d7c4f55' }, { borderColor: '#078191', backgroundColor: '#07819155' },
	{ borderColor: '#cc1220', backgroundColor: '#cc122055' }, { borderColor: '#e05212', backgroundColor: '#e0521255' },
	{ borderColor: '#d31184', backgroundColor: '#d3118455' }, { borderColor: '#2d7c4f', backgroundColor: '#2d7c4f55' },]
	const { branchs,colors } = body
	// ارسال اطلاعات و دریافت اطلاعات مقایسه ای و تفکیکی
	let dataArray: any[] = [];
	for (const branch of branchs) { body.branch = branch; const res = await getChartBranchGroup(body); dataArray.push(res); }
	if (dataArray.length === 0) { throw new Error("No data received from branches."); }
	// ترکیب ارایه های گروه های کالایی و یونیک سازی یک ارایه واحد
	let uniqueSubGroup: any = []
	for (const data of dataArray) { for (let i = 0; i < data.allSubGroups.length; i++) { uniqueSubGroup.push(data.allSubGroups[i]) } }
	let allSubGroups: any = (uniqueSubGroup).filter(onlyUnique)
	// حلقه زدن برروی اطلاعات دریافتی جهت اماده سازی اطلاعات در نمایش نمودار رادار
	const datasets = dataArray.map((data: any, index: number) => ({
		label: data.radarChart.branch,
		data: data.radarChart.data,
		fill:false,   tension: 0.1,
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
	let groupChart = { labels, datasets, title: dataArray[0].radarChart.title, header: dataArray[0].radarChart.header }
	// حلقه زدن برروی اطلاعات دریافتی جهت اماده سازی اطلاعات در نمایش نمودار رادار
	const barDatasets = dataArray.map((data: any, index: number) => ({
		label: data.barChart.branch,
		data: data.barChart.data,
		fill:false,   tension: 0.1,
		 backgroundColor: colors[index].backgroundColor,
		borderColor: colors[index].borderColor,
		pointBackgroundColor: colors[index].backgroundColor,
		pointBorderColor: '#fff',
		pointHoverBackgroundColor: '#fff',
		pointHoverBorderColor: colors[index].borderColor,
	}));
	// اماده سازی اطلاعات نمایش نمودار جهت خروجی اصلی 
	let subGroupChart = { labels: dataArray[0].barChart.labels, datasets: barDatasets, title: dataArray[0].barChart.title, header: dataArray[0].barChart.header }

	return ({ groupChart, allSubGroups, subGroupChart })
}
export const getChartBranchGroup = async (body: any) => {

	await connect()
	const { branch, startDate, endDate, startYear, startMonth, endYear, endMonth, group, type } = body

	
	try {
		const productsInStartMonth = await Products.find({ year: convertNumbersToEnglish(startYear), month: convertNumbersToEnglish(startMonth) })
		const productsInEndMonth = (startYear !== endYear || startMonth !== endMonth) ? await Products.find({ year: convertNumbersToEnglish(endYear), month: convertNumbersToEnglish(endMonth) }) : []
		let combinedProducts = productsInStartMonth.concat(productsInEndMonth)
		const findGroup = combinedProducts.filter((el: any) => el.group == group)
		const allSubGroups = findGroup.map((el: any) => el.subGroup).filter(onlyUnique);

		// محصولاتی که توی این گروه کالایی قراردارند رو میکشیم بیرون
		const allProGroup = combinedProducts.filter((el: any) => el.group === group);
		const filteredSales = allProGroup.flatMap((item: any) =>
			item.totalSell.filter((el: any) => el.branch === branch && el.date >= startDate && el.date <= endDate)
		);
		const allDates = filteredSales.map((el: any) => el.date).filter(onlyUnique);
		const sortDate = allDates.sort((a: any, b: any) => a - b)
		const salesByDate = sortDate.map((date) => {
			const salesForCurrentDate: any = filteredSales.filter((el: any) => el.date === date).map((item: any) => type == 'sell' ? item.sell : item.return);
			const totalSales = sumArray(salesForCurrentDate);
			return totalSales  
		});
		const dayByDate = sortDate.map((date) => {
			const dayCurrentDate: any = filteredSales.filter((el: any) => el.date === date).map((el: any) => `${convertToPersianDate(date, 'YMD')}-${el.day}`).filter(onlyUnique);
			return dayCurrentDate
		});

		const radarChart = { labels: sortDate.map(date => convertToPersianDate(date, 'YMD')), data: salesByDate, title: `نمودار ${type == 'sell' ? 'فروش' : 'مرجوعی'} گروه ${group} در شعب زیر از تاریخ ${convertToPersianDate(startDate, 'YMD')} الی ${convertToPersianDate(endDate, 'YMD')} `, header: `جدول ${type == 'sell' ? 'فروش' : 'مرجوعی'} گروه ${group} در شعب زیر از تاریخ ${convertToPersianDate(startDate, 'YMD')} الی ${convertToPersianDate(endDate, 'YMD')} `, branch: branch, newName: dayByDate };
		const barChart = await getGiveSubGroupData(body, combinedProducts)
		return JSON.parse(JSON.stringify({ radarChart, barChart, allSubGroups }));

	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت کاربر' }
	}
}

export const getGiveSubGroupData = async (body: any, combinedProducts: any) => {
	await connect()
	const { branch, startDate, endDate, group, type } = body
	// تبدیل تاریخ ها
	
	try {
		const allGroups = combinedProducts.filter((el: any) => el.group == group);
		let filtered = allGroups.map((el: any) => el.subGroup).filter(onlyUnique)
		// محصولاتی که توی این گروه کالایی قراردارند رو میکشیم بیرون
		const salesByGroup = filtered.map((subGroup: string) => {
			const salesForCurrentGroup = combinedProducts.filter((el: any) => el.subGroup === subGroup);

			const totalSalesByGroup = salesForCurrentGroup.reduce((accumulator: any, current: any) => {
				const filteredSales = current.totalSell.filter((sale: any) => sale.branch === branch && sale.date >= startDate && sale.date <= endDate);
				return accumulator + sumArray(filteredSales.map((item: any) => type == 'sell' ? item.sell : item.return));
			}, 0);

			return totalSalesByGroup  
		});

		// اماده سازی ابجکت خروجی
		const result = { labels: filtered, data: salesByGroup, title: `نمودار مبلغ کل ${type == 'sell' ? 'فروش' : 'مرجوعی'} زیر گروه های ${group} شعب زیر از تاریخ ${convertToPersianDate(startDate, 'YMD')} الی ${convertToPersianDate(endDate, 'YMD')} `, header: `جدول مبلغ کل ${type == 'sell' ? 'فروش' : 'مرجوعی'} زیر گروه های ${group} شعب زیر از تاریخ ${convertToPersianDate(startDate, 'YMD')} الی ${convertToPersianDate(endDate, 'YMD')} `, branch: branch };

		return JSON.parse(JSON.stringify(result));

	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت کاربر' }
	}
}