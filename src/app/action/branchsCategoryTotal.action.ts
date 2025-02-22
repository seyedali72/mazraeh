'use server'

import Products from '@/models/Products'
import connect from '../lib/db'
import { onlyUnique, sumArray, sumMultipleArrays } from '../utils/helpers'

export const getChartBranchCategoriesForTotal = async (body: any) => {
	body.colors = [{ borderColor: '#2d7c4f', backgroundColor: '#2d7c4f' }, { borderColor: '#078191', backgroundColor: '#078191' },
	{ borderColor: '#cc1220', backgroundColor: '#cc1220' }, { borderColor: '#e05212', backgroundColor: '#e05212' },
	{ borderColor: '#d31184', backgroundColor: '#d31184' }, { borderColor: '#2d7c4f', backgroundColor: '#2d7c4f' },]
	const { branchs, typeSearch, category, colors, valueArray } = body
	let allGroup: any = []
	try {
		let object = typeSearch == 'ماه' ? { month: valueArray[0] } : typeSearch == 'سال' ? { year: valueArray[0] } : { week: valueArray[0] }
		const find = await Products.find(object).select('category name')
		const uniqueGroup = find.map((el: any) => (el.category == category) && el.name).filter(Boolean).filter(onlyUnique);
		allGroup.push(uniqueGroup)

	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت کاربر' }
	}
	let allproducts = allGroup.flat()
	body.allproducts = allproducts
	// ارسال اطلاعات و دریافت اطلاعات مقایسه ای و تفکیکی
	let dataArray: any[] = [];
	for (const branch of branchs) {
		let daysArray: any[] = [];
		for (const valueX of valueArray) {
			body.branch = branch;
			body.valueX = valueX;
			const res = await getChartBranchCategory(body);
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
	const datasetBar = dataArray.map((branchData, i: number) => {
		const findData = branchData.map((dayData: any) => dayData.barChart.data);
		let data = sumMultipleArrays(findData)
		return {
			label: branchData[i].barChart.label,
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
	let productChart = { labels: allproducts, datasets: datasetBar }

	return ({ productChart, categoryChart, allproducts })
}
export const getChartBranchCategory = async (body: any) => {

	await connect()
	const { branch, allproducts, category, type,typeSearch ,valueX} = body
	let object = typeSearch == 'ماه' ? { month: valueX } : typeSearch == 'سال' ? { year: valueX } : { week: valueX }
 
	try {
		const find = await Products.find(object)
		const filtered = find.filter((product: any) => product.category == category)

		const filteredSales = filtered.flatMap((item: any) =>
			item.totalSell.filter((el: any) => el.branch === branch )
		);
		 
			const salesForCurrentDate: any = filteredSales.map((item: any) => type == 'sell' ? item.sell : item.return);
			const totalSales = sumArray(salesForCurrentDate);
			
		  
			const radarChart = { data: [totalSales] };
			const barChart = await getGiveCategoryData(body,filtered)
		return JSON.parse(JSON.stringify({ radarChart, barChart, allproducts}));

	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت کاربر' }
	}
}

export const getGiveCategoryData = async (body: any, find: any) => {
	await connect()
	const { branch,  type,allproducts } = body

	try {
	 
		// محصولاتی که توی این گروه کالا قراردارند رو میکشیم بیرون
		const salesByCategory = allproducts.map((name: string) => {
			const salesForCurrentCategory = find.filter((el: any) => el.name === name);

			const totalSalesByGroup = salesForCurrentCategory.reduce((accumulator: any, current: any) => {
				const filteredSales = current.totalSell.filter((sale: any) => sale.branch === branch );
				return accumulator + sumArray(filteredSales.map((item: any) => type == 'sell' ? item.sell : item.return));
			}, 0);

			return totalSalesByGroup
		});

		// اماده سازی ابجکت خروجی
		const result = { label: branch, data: salesByCategory };
		return JSON.parse(JSON.stringify(result));

	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت کاربر' }
	}
}