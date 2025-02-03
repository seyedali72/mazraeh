import { dirname, join } from 'path'
import url from 'url'
import persian_fa from 'react-date-object/locales/persian_fa'
import persian from 'react-date-object/calendars/persian'
import gregorian from 'react-date-object/calendars/gregorian'
import gregorian_en from 'react-date-object/locales/gregorian_en'
import DateObject from 'react-date-object'
import XLSX from 'xlsx-js-style';

export const BASE_URL: any = 'http://localhost:3000'
// export const BASE_URL: any = 'https://bazarchehapp.ir'

export const queriesForSoftDelete = [
	'findOneAndUpdate',
	'findOneAndRemove',
	'count',
	'distinct',
	// method for softdelete & restore
	// "find",
	// "findOne",
]


export const sideItems = (leadType: string) => [
	{
		navId: 1,
		navHead: 'سفارشات',
		subNavItems: [
			{
				title: 'سفارشات پرداخت شده',
				path: `/pishkhan/orders/list`,
				ban: [''],
			},
			{
				title: 'سفارشات پرداخت نشده  ',
				path: `/pishkhan/orders/pending`,
				ban: [''],
			},
		],
		iconClass: 'fa fa-comment',
		ban: ['customer', 'master', 'storage'],
	},
	{
		navId: 1,
		navHead: 'محصولات',
		subNavItems: [
			{
				title: 'لیست محصولات',
				path: `/pishkhan/product/list`,
				ban: [''],
			},
			{
				title: 'افزودن محصول',
				path: `/pishkhan/product/add`,
				ban: [''],
			},
		],
		iconClass: 'fa fa-comment',
		ban: ['customer', 'master', 'storage'],
	},
	{
		navId: 1,
		navHead: 'مقالات',
		subNavItems: [
			{
				title: 'لیست مقالات',
				path: `/pishkhan/article/list`,
				ban: [''],
			},
			{
				title: 'افزودن مقاله',
				path: `/pishkhan/article/add`,
				ban: [''],
			},
		],
		iconClass: 'fa fa-comment',
		ban: ['customer', 'master', 'storage'],
	},
	{
		navId: 1,
		navHead: 'تیکت ها',
		subNavItems: [
			{
				title: 'لیست تیکت ها',
				path: `/pishkhan/ticket/list`,
				ban: [''],
			},
			{
				title: 'تیکت های باز',
				path: `/pishkhan/ticket/open`,
				ban: [''],
			},
			{
				title: 'تیکت های بسته شده',
				path: `/pishkhan/ticket/closed`,
				ban: [''],
			},
		],
		iconClass: 'fa fa-comment',
		ban: ['customer', 'master', 'storage'],
	},
	{
		navId: 1,
		navHead: 'دیدگاه ها',
		subNavItems: [
			{
				title: 'لیست دیدگاه های پست',
				path: `/pishkhan/comment/post`,
				ban: [''],
			},
			{
				title: 'لیست دیدگاه های محصول',
				path: `/pishkhan/comment/product`,
				ban: [''],
			},
		],
		iconClass: 'fa fa-comment',
		ban: ['customer', 'master', 'storage'],
	},
	{
		navId: 2,
		navHead: 'صفحات عمومی  ',
		subNavItems: [
			{ title: 'لیست صفحات عمومی  ', path: `/pishkhan/pages`, ban: [''] },
			{ title: 'ساخت صفحه عمومی  ', path: `/pishkhan/pages/create`, ban: [''] },
		],
		iconClass: 'fa fa-rss',
		ban: [''],
	},
	{
		navId: 4,
		navHead: 'دسته بندی ها',
		subNavItems: [
			{
				title: 'افزودن دسته بندی',
				path: `/pishkhan/category/add`,
				ban: [''],
			},
			{
				title: 'لیست دسته بندی محصولات',
				path: `/pishkhan/category/products`,
				ban: [''],
			},
			{
				title: 'لیست دسته بندی مقالات',
				path: `/pishkhan/category/articles`,
				ban: [''],
			},
		],
		iconClass: 'fa fa-object-ungroup',
		ban: [''],
	},
	{
		navId: 5,
		navHead: 'برچسب ها',
		subNavItems: [
			{
				title: 'افزودن برچسب',
				path: `/pishkhan/tag/add`,
				ban: [''],
			},
			{
				title: 'لیست برچسب ها',
				path: `/pishkhan/tag/list`,
				ban: [''],
			},
		],
		iconClass: 'fa fa-tags',
		ban: ['customer', 'master', 'storage'],
	},
	{
		navId: 6,
		navHead: 'پرسنل',
		subNavItems: [
			{
				title: 'پرسنل پنل',
				path: `/pishkhan/leads/list`,
				ban: ['customer'],
			},
			{
				title: 'خریداران',
				path: `/pishkhan/leads/clients`,
				ban: [''],
			},
			{
				title: 'فروشندگان',
				path: `/pishkhan/leads/vendors`,
				ban: [''],
			},
		],
		iconClass: 'fa fa-bars',
		ban: ['customer', 'master', 'storage', 'writer'],
	},
	{
		navId: 6,
		navHead: 'فهرست ها',
		subNavItems: [
			{
				title: 'لیست فهرست ها',
				path: `/pishkhan/menu/list`,
				ban: ['customer'],
			},
			{
				title: 'افزودن فهرست',
				path: `/pishkhan/menu/add`,
				ban: [''],
			},
		],
		iconClass: 'fa fa-bars',
		ban: ['customer', 'master', 'storage', 'writer'],
	},
	{
		navId: 7,
		navHead: 'تنظیمات',
		subNavItems: [
			{ title: 'تنظیمات کلی', path: `/pishkhan/setting/general`, ban: [''] },
			{ title: 'نقشه سایت', path: `/pishkhan/setting/sitemap`, ban: [''] },
		],
		iconClass: 'fa fa-cogs',
		ban: ['customer', 'master', 'writer', 'storage'],
	},
	{
		navId: 3,
		navHead: 'سوالات متداول',
		path: `/pishkhan/faq`,
		iconClass: 'fa fa-thumbs-up',
		ban: [''],
	},
	{
		navId: 3,
		navHead: 'درگاه پرداخت',
		path: `/pishkhan/terminalcode`,
		iconClass: 'fa fa-thumbs-up',
		ban: [''],
	},
]

export const buildQuery = (searchObj: any, flag: boolean = false) => {
	let query: any = {}

	if (!Object.keys(searchObj).length && !flag) {
		query['isDeleted'] = false
	}

	for (let param in searchObj) {
		if (param === 'name' || param === 'title') {
			query[param] = { $regex: searchObj[param], $options: 'i' }
		} else if (param === 'category') {
			query[param] = { $regex: `^${searchObj[param]}` }
		} else {
			if (param !== 'skip' && param !== 'limit' && param !== 'sortBy' && param !== 'asc') {
				query[param] = searchObj[param]
			}
		}

		// query['isDeleted'] = false
		// query['status'] = {status: {$ne: 'پیش نویس'}};
	}

	return query
}

export const findDir = (fileUrl: string) => {
	const __filename = url.fileURLToPath(fileUrl)
	return join(dirname(__filename))
}

export const validate = (schema: any, data: unknown) => {
	const result = schema.safeParse(data)

	if (result.success) {
		return { data: result.data }
	}

	if (result.error) {
		return { error: result.error.flatten() }
	}
}

export const formDataToJSON = (data: FormData) => {
	let ConvertedJSON: any = {}
	let aa: any = Array.from(data.entries())

	for (let k of aa) {
		ConvertedJSON[k[0]] = k[1]
	}

	return ConvertedJSON
}

export const slugify = (input: string) => {
	return input.split(' ').join('-')
}

export const inputStyles = {
	control: (base: any, state: any) => ({
		...base,
		height: '50px',
		minHeight: '50px',
		// lineHeight: '10px',
		fontSize: '14px',
		padding: 0,
		margin: 0,
		zIndex: 0,
	}),
	valueContainer: (base: any, state: any) => ({
		...base,
		height: '50px',
	}),
	input: (base: any) => ({
		padding: 0,
		margin: 0,
		fontSize: '.7rem',
	}),
	multiValue: (base: any) => ({
		...base,
		marginTop: 0,
		padding: '2px',
		lineHeight: '10px',
		background: '#ace3c7',
	}),
	indicatorsContainer: (base: any) => ({
		...base,
		height: '32px',
	}),
}

export const labelizeSet = (set: any) => {
	let a = set?.map((item: any) => ({
		_id: item._id,
		cat_code: item.cat_code || '',
		value: item?.name || item?.galleryName,
		label: item?.name || item?.galleryName,
	}))

	return a
}

export function next_num(input: any) {
	let output: any = parseInt(input, 10) + 1
	output = output.toString()
	while (output.length < 2) output = '0' + output
	return output
}

export function excerpt(str: string, num: number) {
	return str?.replace(/<[^>]*>?/gm, '')?.slice(0, num) + '...'
}

export function spliteNumber(price: number) {
	return new Intl.NumberFormat().format(price)
}


export const convertToPersianDate = (date: any, type: string) => {
	if (type === 'YYMDHMSS') { return new DateObject(date).convert(persian, persian_fa).format('HH:mm:ss - YYYY/MM/DD') }
	if (type === 'YYMDHM') { return new DateObject(date).convert(persian, persian_fa).format('HH:mm - YYYY/MM/DD') }
	if (type === 'YMDHM') { return new DateObject(date).convert(persian, persian_fa).format('HH:mm - YY/MM/DD') }
	if (type === 'MDHM') { return new DateObject(date).convert(persian, persian_fa).format('HH:mm - MM/DD') }
	if (type === 'YYMD') { return new DateObject(date).convert(persian, persian_fa).format('YY/MM/DD') }
	if (type === 'Y') { return new DateObject(date).convert(persian, persian_fa).format('YYYY') }
	if (type === 'M') { return new DateObject(date).convert(persian, persian_fa).format('MM') }
	if (type === 'YMD') { return new DateObject(date).convert(persian, persian_fa).format('YYYY/MM/DD') }
	if (type === 'MD') { return new DateObject(date).convert(persian, persian_fa).format('MM/DD') }
	if (type === 'HM') { return new DateObject(date).convert(persian, persian_fa).format('HH:mm') }
}

export const convertToTimeStamp = (date: any) => {
	let time = Date.parse(date?.convert(gregorian, gregorian_en).format())
	return time
}

export const convertToGregorianianDate = (date: any) => {
	date?.convert(gregorian, gregorian_en).format()
}

export const createOption = (label: string) => ({
	label,
	value: label,
})
export const roleType = (role: any) => {
	let res = ''
	switch (role) {
		case 1: res = 'client'; break;
		case 2: res = 'crm'; break;
		case 3: res = 'hrm'; break;
		case 4: res = 'expert'; break;
		case 5: res = 'account'; break;
		case 6: res = 'employee'; break;
		case 7: res = 'supplies'; break;
		case 8: res = 'employer'; break;
		case 9: res = 'account'; break;
		case 0: res = 'account'; break;
		default:
			break;
	}
	return (res)
}

export const fileType = (type: any) => {
	let res = type?.includes('image') ? 'عکس'
		: type?.includes('word') ? 'فایل ورد'
			: type?.includes('pdf') ? 'pdf'
				: type?.includes('sheet') ? 'اکسل'
					: type?.includes('mp4') ? 'ویدئو'
						: type?.includes('video') ? 'ویدئو'
							: type?.includes('audio') ? 'صدا'
								: type?.includes('presentetaion') ? 'پاورپوینت'
									: type?.includes('visio') ? 'visio'
										: 'file'

	return (res)
}


export function checkCols(refstr: any) {
	return Array.from({ length: XLSX.utils.decode_range(refstr).e.c + 1 }, (x, i) => XLSX.utils.encode_col(i));
}

export const mineDataFromExcel = async (file: any) => {
	const mmd: File | null = file.get('file') as unknown as File;
	if (!mmd) {
		return { error: 'فایلی وجود ندارد!' };
	}
	// find data inside the file
	let wb = XLSX.readFile(mmd.name);
	console.log(wb)
	let ws = wb.Sheets[wb.SheetNames[0]];
	let aoa: any = XLSX.utils.sheet_to_json(ws, { raw: true, header: 1 });

	let apl: any = [];
	let al: any = [];
	// let headTitles = checkCols(ws["!ref"]);

	for (let i = 1; i < aoa.length; i++) {
		apl[i - 1] = {};
		apl[i - 1]['uniqueCode'] = null;
		for (let j = 0; j < aoa[0].length; j++) {
			if (aoa[i][j] === undefined) {
				apl[i - 1][`${aoa[0][j]}`] = null;
				// assembly list
				let existIndex = al.findIndex((val: any) => val['a'] === aoa[i][0]);
				if (existIndex < 0) {
					al.push({ a: aoa[i][0], quantity: aoa[i][2], weight: aoa[i][6], rev: 'none', opcMap: 'OPC1' });
				}
			} else {
				apl[i - 1][`${aoa[0][j]}`] = aoa[i][j];
			}
		}
		apl[i - 1]['pdfLink'] = null;
		apl[i - 1]['opcMap'] = 'OPC1';
		apl[i - 1]['rev'] = 'none';
		apl[i - 1]['uniqueCode'] = `${apl[i - 1]['Assembly']}${apl[i - 1]['Pose'] ? apl[i - 1]['Pose'] : apl[i - 1]['Assembly']}`;
	}

	return { apl, al };
};

export const turnDataToExcel = async (data: any, changed: any) => {
	const ws = XLSX.utils.json_to_sheet(data);
	const wb = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');

	let cols: any = [];
	let rows: any = [];

	for (let m = 0; m < Object.keys(data[0]).length; m++) {
		cols.push((m + 10).toString(36).toUpperCase());
	}

	// رنگ سطر
	for (let r = 0; r < rows.length; r++) {
		for (let c = 0; c < cols.length; c++) {
			wb.Sheets[wb.SheetNames[0]][cols[c] + rows[r]].s = {
				fill: {
					patternType: 'solid',
					fgColor: { rgb: '00ff00' },
				},
			};
		}
	}

	for (let k = 0; k < changed.length; k++) {
		ws[changed[k]].s = {
			fill: {
				fgColor: { rgb: 'ff0000' },
			},
		};

		!rows.includes(changed[k].slice(1)) && rows.push(changed[k].slice(1));
	}

	XLSX.writeFile(wb, 'sample.xlsx');
};

export const onlyUnique = (value: any, index: any, array: any) => {
	return array.indexOf(value) === index
}

export const sumArray = (numbers: []) => {
	return numbers.reduce((accumulator: number, currentValue: number) => {
		return accumulator + currentValue;
	}, 0);
}
 
export const sortingList = (data: any, sort: any) => {
	data?.sort((a: any, b: any) => sort === 'dateUptoBottom' ? Date.parse(b.date) - Date.parse(a.date) :
		sort === 'sellUptoBottom' ? b.totalSell - a.totalSell :
			sort === 'returnUptoBottom' ? b.totalReturn - a.totalReturn :
				sort === 'basketUptoBottom' ? (b.totalSell / b.totalInvoice) - (a.totalSell / a.totalInvoice) :
					sort === 'invoiceUptoBottom' ? b.totalInvoice - a.totalInvoice :
						sort === 'dateBottomToUp' ? Date.parse(a.date) - Date.parse(b.date) :
							sort === 'sellBottomToUp' ? a.totalSell - b.totalSell :
								sort === 'returnBottomToUp' ? a.totalReturn - b.totalReturn :
									sort === 'basketBottomToUp' ? (a.totalSell / a.totalInvoice) - (b.totalSell / b.totalInvoice) :
										sort === 'invoiceBottomToUp' && a.totalInvoice - b.totalInvoice)
	return data
}