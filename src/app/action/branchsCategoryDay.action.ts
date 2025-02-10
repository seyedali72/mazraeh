'use server'

import Products from '@/models/Products'
import connect from '../lib/db'
import { convertNumbersToEnglish, convertToPersianDate, onlyUnique, sumArray, sumMultipleArrays } from '../utils/helpers'

export const getChartBranchCategoriesForDay = async (body: any) => {
	body.colors = [{ borderColor: '#2d7c4f', backgroundColor: '#2d7c4f55' }, { borderColor: '#078191', backgroundColor: '#07819155' },
	{ borderColor: '#cc1220', backgroundColor: '#cc122055' }, { borderColor: '#e05212', backgroundColor: '#e0521255' },
	{ borderColor: '#d31184', backgroundColor: '#d3118455' }, { borderColor: '#2d7c4f', backgroundColor: '#2d7c4f55' },]
	const { branchs, type, days,colors } = body
	// ارسال اطلاعات و دریافت اطلاعات مقایسه ای و تفکیکی
	let dataArray: any[] = [];
	for (const branch of branchs) {
		let daysArray: any[] = [];
		for (const day of days) {
			body.branch = branch;
			body.day = day;
			const res = await getChartBranchCategory(body);
			if (res) { res.branch = branch; daysArray.push(res); }
		}
		dataArray.push(daysArray)
	}
	if (dataArray.length === 0) { throw new Error("No data received from branches."); }
	// ترکیب ارایه های گروه های کالایی و یونیک سازی یک ارایه واحد
	let uniqueProduct: any = []
	for (const data of dataArray.flat()) { for (let i = 0; i < data.allproducts.length; i++) { uniqueProduct.push(data.allproducts[i]) } }
	let allproducts: any = (uniqueProduct).filter(onlyUnique)
	// درست کردن لیبل های مقایسه ای
	let labels = dataArray.map((name: any, idx: number) => name[idx]?.newName[0]).filter(onlyUnique).filter((unique: any) => unique !== undefined)
	// حلقه زدن برروی اطلاعات دریافتی جهت اماده سازی اطلاعات در نمایش نمودار رادار
	const datasets = dataArray.map((branchData, i) => {
		const data = branchData.map((dayData: any) => dayData.radarChart.data[0]);
		return {
			label: branchData[0]?.branch,
			data,
			backgroundColor: colors[i].backgroundColor,
			fill:false,   tension: 0.1,
			borderColor: colors[i].borderColor,
			pointBackgroundColor: colors[i].backgroundColor,
			pointBorderColor: '#fff',
			pointHoverBackgroundColor: '#fff',
			pointHoverBorderColor: colors[i].borderColor,
		};
	});
	// اماده سازی اطلاعات نمایش نمودار جهت خروجی اصلی 
	let categoryChart = { labels, datasets }
	// حلقه زدن برروی اطلاعات دریافتی جهت اماده سازی اطلاعات در نمایش نمودار رادار
	const datasetBar = dataArray.map((branchData, i) => {
		const findData = branchData.map((dayData: any) => dayData.barChart.data);
		let data = sumMultipleArrays(findData)
		return {
			label: branchData[0]?.branch,
			data,
			backgroundColor: colors[i].backgroundColor,
			fill:false,   tension: 0.1,
			borderColor: colors[i].borderColor,
			pointBackgroundColor: colors[i].backgroundColor,
			pointBorderColor: '#fff',
			pointHoverBackgroundColor: '#fff',
			pointHoverBorderColor: colors[i].borderColor,
		};
	});
	// اماده سازی اطلاعات نمایش نمودار جهت خروجی اصلی 
	let productChart = { labels: allproducts, datasets: datasetBar }

	return ({ productChart, categoryChart, allproducts })
}
export const getChartBranchCategory = async (body: any) => {

	await connect()
	const { branch, day, category, type } = body

	let startYear = convertToPersianDate(day, 'Y')
	let startMonth = convertToPersianDate(day, 'M')
	try {
		const find = await Products.find({ year: convertNumbersToEnglish(startYear), month: convertNumbersToEnglish(startMonth) })
		const allProOnCategory = find.filter((el: any) => el.category === category);
		const allproducts = allProOnCategory.map((el: any) => el.name).filter(onlyUnique);
		// محصولاتی که توی این گروه کالایی قراردارند رو میکشیم بیرون
		const filteredSales = allProOnCategory.flatMap((item: any) =>
			item.totalSell.filter((el: any) => el.branch === branch && el.date == day)
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
		const radarChart = { data: salesByDate };
		const barChart = await getGiveCategoryData(body, find, day)
		return JSON.parse(JSON.stringify({ radarChart, barChart, allproducts, newName: dayByDate.flat() }));

	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت کاربر' }
	}
}

export const getGiveCategoryData = async (body: any, find: any, day: any) => {
	await connect()
	const { branch, category, type } = body

	try {
		const allCategory = find.filter((el: any) => el.category == category);
		let uniProduct = allCategory.map((el: any) => el.name).filter(onlyUnique)
		// محصولاتی که توی این گروه کالایی قراردارند رو میکشیم بیرون
		const salesByCategory = uniProduct.map((name: string) => {
			const salesForCurrentCategory = find.filter((el: any) => el.name === name);

			const totalSalesByGroup = salesForCurrentCategory.reduce((accumulator: any, current: any) => {
				const filteredSales = current.totalSell.filter((sale: any) => sale.branch === branch && sale.date == day);
				return accumulator + sumArray(filteredSales.map((item: any) => type == 'sell' ? item.sell : item.return));
			}, 0);

			return totalSalesByGroup
		});

		// اماده سازی ابجکت خروجی
		const result = { data: salesByCategory };

		return JSON.parse(JSON.stringify(result));

	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت کاربر' }
	}
}