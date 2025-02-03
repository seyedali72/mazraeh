// app/actions.ts
'use server';

import * as XLSX from 'xlsx';
import { convertToPersianDate, onlyUnique } from '../utils/helpers';
import DBS from '@/models/DBS';

export async function convertExcelsellerToJson(formData: FormData) {
    const file = formData.get('file') as File;

    if (!file) {
        throw new Error('No file uploaded');
    }

    // خواندن فایل اکسل
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0]; // نام اولین شیت
    const worksheet = workbook.Sheets[sheetName];

    // تبدیل شیت به JSON
    const jsonData: any = XLSX.utils.sheet_to_json(worksheet);
    return JSON.parse(JSON.stringify(jsonData))


}

export async function convertExcelDetailsToJson(formData: FormData) {
    const file = formData.get('file') as File;

    if (!file) {
        throw new Error('No file uploaded');
    }

    // خواندن فایل اکسل
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0]; // نام اولین شیت
    const worksheet = workbook.Sheets[sheetName];

    // تبدیل شیت به JSON
    const jsonData: any = XLSX.utils.sheet_to_json(worksheet);
    return JSON.parse(JSON.stringify(jsonData))

}

export async function convertExcelDailyToJson(formData: FormData) {
    const file = formData.get('file') as File;
    if (!file) { throw new Error('No file uploaded'); }
    // خواندن فایل اکسل
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0]; // نام اولین شیت
    const worksheet = workbook.Sheets[sheetName];
    // تبدیل شیت به JSON
    const jsonData: any = XLSX.utils.sheet_to_json(worksheet);
    return JSON.parse(JSON.stringify(jsonData))

}

export async function compareAndCompactJson(jsonData: any) {
    let categories: any = [];
    let products: any = [];
    let group: any = [];
    // level 1 : recive product / category / group list
    for (let i = 0; i < jsonData.length; i++) {
        categories.push(jsonData[i].category)
        products.push(jsonData[i].product)
        group.push(jsonData[i].group)
    }
    // level 2 : unique lists
    const uniCat = categories.filter(onlyUnique);
    const uniProduct = products.filter(onlyUnique);
    const uniGroup = group.filter(onlyUnique);

    // level 3 : jambandi mabaleghe har group / product / category be sorate object
    let categoriesObject: any = [];
    let productsObject: any = [];
    let groupObject: any = [];

    // jambandi product
    for (let i = 0; i < uniProduct.length; i++) {
        let singleObject: any = [];
        for (let j = 0; j < jsonData.length; j++) {
            if (uniProduct[i] == jsonData[j].product) {
                singleObject.push({ sell: jsonData[j].sell, return: jsonData[j].return })
            }
        }
        let totalSell = singleObject.reduce((acc: any, curr: any) => acc + curr.sell, 0)
        let totalReturn = singleObject.reduce((acc: any, curr: any) => acc + curr.return, 0)

        productsObject.push({ 'name': uniProduct[i], 'totalSell': totalSell, 'totalReturn': totalReturn })
    }
    // jam bandi category
    for (let i = 0; i < uniCat.length; i++) {
        let singleObject: any = [];
        for (let j = 0; j < jsonData.length; j++) {
            if (uniCat[i] == jsonData[j].category) {
                singleObject.push({ sell: jsonData[j].sell, return: jsonData[j].return })
            }
        }
        let totalSell = singleObject.reduce((acc: any, curr: any) => acc + curr.sell, 0)
        let totalReturn = singleObject.reduce((acc: any, curr: any) => acc + curr.return, 0)

        categoriesObject.push({ 'name': uniCat[i], 'totalSell': totalSell, 'totalReturn': totalReturn })
    }
    // jambandi group
    for (let i = 0; i < uniGroup.length; i++) {
        let singleObject: any = [];
        for (let j = 0; j < jsonData.length; j++) {
            if (uniGroup[i] == jsonData[j].group) {
                singleObject.push({ sell: jsonData[j].sell, return: jsonData[j].return })
            }
        }
        let totalSell = singleObject.reduce((acc: any, curr: any) => acc + curr.sell, 0)
        let totalReturn = singleObject.reduce((acc: any, curr: any) => acc + curr.return, 0)

        groupObject.push({ 'name': uniGroup[i], 'totalSell': totalSell, 'totalReturn': totalReturn })
    }
    // الان یه ارایه داریم باید یه کلید نام دسته بندی و یه کلید دیگه به عنوان جمع فروش این دسته بندی در قالب یک ابجکت خروجی بده
    let final = { 'categories': categoriesObject, 'group': groupObject, 'products': productsObject }
    return JSON.parse(JSON.stringify(final))
}

export async function getCompare(jsonData: any) {
    let keysArr: any = []
    for (let i = 0; i < jsonData.length; i++) {
        for (let j = 0; j < jsonData[i][1].length; j++) {
            let ali = jsonData[i][1][j].name
            keysArr.push(ali)
        }
    }
    const uniqueKeysArr: any = keysArr.filter(onlyUnique)
    const resultArray = jsonData.map((item: any) => {
        let araays = uniqueKeysArr.map((key: any) => {
            const foundItem = item[1].find((data: any) => data?.name == key);
            if (foundItem) {
                return { name: foundItem.name, totalSell: foundItem.totalSell };
            }
            return { name: key, totalSell: 0 }; // اینجا لیبل رو حفظ می کنیم ولی مقدار فروش رو صفر میزاریم
        }).filter(Boolean);
        return { 'branch': item[0], 'dataset': araays }  
    });
    let aman = { 'labels': uniqueKeysArr, 'data': resultArray }
    return JSON.parse(JSON.stringify(aman))
}

export async function getCompareSingleBranch(jsonData: any) {
    try {
        const allDBSs = await DBS.find({ isDeleted: false, branch: jsonData.branch })
        let inDate = allDBSs.filter((el: any) => Date.parse(el?.date) >= Date.parse(jsonData.startDate) && Date.parse(el?.date) <= Date.parse(jsonData.endDate))
        let final = inDate.filter((el: any) => el?.group?.length > 0 && el?.products?.length > 0 && el?.category?.length > 0)
        return JSON.parse(JSON.stringify(final))
    } catch (error) {
        console.error('Error fetching or filtering data:', error);
        throw new Error('خطا در دریافت یا فیلتر کردن داده‌ها');
    }
}

export async function getChartSingleBranch(jsonData: any) {
    try {
        let filtered: any = jsonData?.map((el: any) => [`${convertToPersianDate(el.date, 'YMD')}`, el.group.flat()])
        let ch = await getCompare(filtered)
        console.log(ch)
        return JSON.parse(JSON.stringify(ch))
    } catch (error) {
        console.error('Error fetching or filtering data:', error);
        throw new Error('خطا در دریافت یا فیلتر کردن داده‌ها');
    }
}