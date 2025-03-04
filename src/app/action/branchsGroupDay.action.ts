'use server'

import Products from '@/models/Products'
import connect from '../lib/db'
import { convertNumbersToEnglish, convertToPersianDate, onlyUnique, sumArray, sumMultipleArrays } from '../utils/helpers'

export const getChartBranchsGroupForDay = async (body: any) => {
	body.colors = [{ borderColor: '#2d7c4f', backgroundColor: '#2d7c4f' }, { borderColor: '#078191', backgroundColor: '#078191' },
	{ borderColor: '#cc1220', backgroundColor: '#cc1220' }, { borderColor: '#e05212', backgroundColor: '#e05212' },
	{ borderColor: '#d31184', backgroundColor: '#d31184' }, { borderColor: '#2d7c4f', backgroundColor: '#2d7c4f' },]
	const { branchs, type, days ,colors} = body
	// ارسال اطلاعات و دریافت اطلاعات مقایسه ای و تفکیکی
	let dataArray: any[] = [];
	for (const branch of branchs) {
		let daysArray: any[] = [];
		for (const day of days) {
			body.branch = branch;
			body.day = day;
			const res = await getChartBranchGroup(body);
			if (res) { res.branch = branch; daysArray.push(res); }
		}
		dataArray.push(daysArray)
	}
	if (dataArray.length === 0) { throw new Error("No data received from branches."); }
	// ترکیب ارایه های گروه های کالایی و یونیک سازی یک ارایه واحد
	let uniqueSubGroup: any = []
	for (const data of dataArray.flat()) { for (let i = 0; i < data.allSubGroups.length; i++) { uniqueSubGroup.push(data.allSubGroups[i]) } }
	let allSubGroups: any = (uniqueSubGroup).filter(onlyUnique)
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
	let groupChart = { labels, datasets }
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
	let subGroupChart = { labels: allSubGroups, datasets: datasetBar }

	return ({ groupChart, allSubGroups, subGroupChart })
}
export const getChartBranchGroup = async (body: any) => {

	await connect()
	const { branch, day, group, type } = body
	let startYear = convertToPersianDate(day, 'Y')
	let startMonth = convertToPersianDate(day, 'M')
	try {
		const find = await Products.find({ year: convertNumbersToEnglish(startYear), month: convertNumbersToEnglish(startMonth) })

		const findGroup = find.filter((el: any) => el.group == group)
		const allSubGroups = findGroup.map((el: any) => el.subGroup).filter(onlyUnique);

		// محصولاتی که توی این گروه کالا قراردارند رو میکشیم بیرون
		const allProGroup = find.filter((el: any) => el.group === group);
		const filteredSales = allProGroup.flatMap((item: any) =>
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
		const barChart = await getGiveSubGroupData(body, find, day)
		return JSON.parse(JSON.stringify({ radarChart, barChart, allSubGroups, newName: dayByDate.flat() }));

	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت کاربر' }
	}
}

export const getGiveSubGroupData = async (body: any, find: any, day: any) => {
	await connect()
	const { branch,  group, type } = body

	try {
		const allGroups = find.filter((el: any) => el.group == group);
		let filtered = allGroups.map((el: any) => el.subGroup).filter(onlyUnique)
		// محصولاتی که توی این گروه کالا قراردارند رو میکشیم بیرون
		const salesByGroup = filtered.map((subGroup: string) => {
			const salesForCurrentGroup = find.filter((el: any) => el.subGroup === subGroup);

			const totalSalesByGroup = salesForCurrentGroup.reduce((accumulator: any, current: any) => {
				const filteredSales = current.totalSell.filter((sale: any) => sale.branch === branch && sale.date == day);
				return accumulator + sumArray(filteredSales.map((item: any) => type == 'sell' ? item.sell : item.return));
			}, 0);

			return totalSalesByGroup
		});

		// اماده سازی ابجکت خروجی
		const result = { data: salesByGroup };
		return JSON.parse(JSON.stringify(result));

	} catch (error) {
		console.log(error)
		return { error: 'خطا در دریافت کاربر' }
	}
}