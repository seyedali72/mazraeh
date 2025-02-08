'use server'

import Products from '@/models/Products'
import connect from '../lib/db'
import { convertNumbersToEnglish, convertToPersianDate, onlyUnique, sumArray } from '../utils/helpers'

export const getChartBranchsSubGroup = async (body: any) => {
	const colors = [{ borderColor: '#0aa04e', backgroundColor: '#0aa04e32' }, { borderColor: '#a93b53', backgroundColor: '#ff638432' },
	{ borderColor: '#0044ee', backgroundColor: '#0044ee32' }, { borderColor: '#aa55c0', backgroundColor: '#aa55c032' },
	{ borderColor: '#cc12ec', backgroundColor: '#cc12ec32' }, { borderColor: '#0aa04e', backgroundColor: '#0aa04e32' },]
	const { branchs, startDate, endDate } = body
	// ارسال اطلاعات و دریافت اطلاعات مقایسه ای و تفکیکی
	let dataArray: any[] = [];
	for (const branch of branchs) { body.branch = branch; const res = await getChartBranchSubGroup(body); dataArray.push(res); }
	if (dataArray.length === 0) { throw new Error("No data received from branches."); }
	// ترکیب ارایه های گروه های کالایی و یونیک سازی یک ارایه واحد
	let uniqueSubGroup: any = []
	for (const data of dataArray) { for (let i = 0; i < data.allcategories.length; i++) { uniqueSubGroup.push(data.allcategories[i]) } }
	let allcategories: any = (uniqueSubGroup).filter(onlyUnique)
	// حلقه زدن برروی اطلاعات دریافتی جهت اماده سازی اطلاعات در نمایش نمودار رادار
	const datasets = dataArray.map((data: any, index: number) => ({
		label: data.radarChart.branch,
		data: data.radarChart.data,
		fill: true,
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
	let subGroupChart = { labels, datasets, title: dataArray[0].radarChart.title, header: dataArray[0].radarChart.header }
	// حلقه زدن برروی اطلاعات دریافتی جهت اماده سازی اطلاعات در نمایش نمودار رادار
	const barDatasets = dataArray.map((data: any, index: number) => ({
		label: data.barChart.branch,
		data: data.barChart.data,
		fill: true,
		backgroundColor: colors[index].backgroundColor,
		borderColor: colors[index].borderColor,
		pointBackgroundColor: colors[index].backgroundColor,
		pointBorderColor: '#fff',
		pointHoverBackgroundColor: '#fff',
		pointHoverBorderColor: colors[index].borderColor,
	}));
	// اماده سازی اطلاعات نمایش نمودار جهت خروجی اصلی 
	let categoryChart = { labels: dataArray[0].barChart.labels, datasets: barDatasets, title: dataArray[0].barChart.title, header: dataArray[0].barChart.header }
	return ({ subGroupChart, allcategories, categoryChart })
}
export const getChartBranchSubGroup = async (body: any) => {

	await connect()
	const { branch, startDate, endDate, startYear, startMonth, endYear, endMonth, subGroup, type } = body

	
	try {
		const productsInStartMonth = await Products.find({ year: convertNumbersToEnglish(startYear), month: convertNumbersToEnglish(startMonth) })
		const productsInEndMonth = (startYear !== endYear || startMonth !== endMonth) ? await Products.find({ year: convertNumbersToEnglish(endYear), month: convertNumbersToEnglish(endMonth) }) : []
		let combinedProducts = productsInStartMonth.concat(productsInEndMonth)

		// محصولاتی که توی این گروه کالایی قراردارند رو میکشیم بیرون
		const allProSubGroup = combinedProducts.filter((el: any) => el.subGroup === subGroup);
		const allcategories = allProSubGroup.map((el: any) => el.category).filter(onlyUnique);
		const filteredSales = allProSubGroup.flatMap((item: any) =>
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
		const radarChart = { labels: sortDate.map(date => convertToPersianDate(date, 'YMD')), data: salesByDate, title: `نمودار ${type == 'sell' ? 'فروش' : 'مرجوعی'} زیر گروه ${subGroup} در ${branch} از تاریخ ${convertToPersianDate(startDate, 'YMD')} الی ${convertToPersianDate(endDate, 'YMD')} `, header: `جدول ${type == 'sell' ? 'فروش' : 'مرجوعی'} زیر گروه ${subGroup} در ${branch} از تاریخ ${convertToPersianDate(startDate, 'YMD')} الی ${convertToPersianDate(endDate, 'YMD')} `, branch: branch, newName: dayByDate };
		const barChart = await getGiveCategoryData(body, combinedProducts)
		return JSON.parse(JSON.stringify({ radarChart, barChart, allcategories }));

	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت کاربر' }
	}
}

export const getGiveCategoryData = async (body: any, combinedProducts: any) => {
	await connect()
	const { branch, startDate, endDate, subGroup, type } = body
	
	try {
		const allSubGroups = combinedProducts.filter((el: any) => el.subGroup == subGroup);
		let uniCategory = allSubGroups.map((el: any) => el.category).filter(onlyUnique)
		// محصولاتی که توی این گروه کالایی قراردارند رو میکشیم بیرون
		const salesByGroup = uniCategory.map((category: string) => {
			const salesForCurrentGroup = combinedProducts.filter((el: any) => el.category === category);

			const totalSalesByGroup = salesForCurrentGroup.reduce((accumulator: any, current: any) => {
				const filteredSales = current.totalSell.filter((sale: any) => sale.branch === branch && sale.date >= startDate && sale.date <= endDate);
				return accumulator + sumArray(filteredSales.map((item: any) => type == 'sell' ? item.sell : item.return));
			}, 0);

			return totalSalesByGroup  
		});

		// اماده سازی ابجکت خروجی
		const result = { labels: uniCategory, data: salesByGroup, title: `نمودار مبلغ کل ${type == 'sell' ? 'فروش' : 'مرجوعی'} دسته بندی های زیر گروه ${subGroup} در ${branch} از تاریخ ${convertToPersianDate(startDate, 'YMD')} الی ${convertToPersianDate(endDate, 'YMD')} `, header: `جدول مبلغ کل ${type == 'sell' ? 'فروش' : 'مرجوعی'} دسته بندی های زیر گروه ${subGroup} در ${branch} از تاریخ ${convertToPersianDate(startDate, 'YMD')} الی ${convertToPersianDate(endDate, 'YMD')} `, branch: branch };

		return JSON.parse(JSON.stringify(result));

	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت کاربر' }
	}
}