'use server'
import moment from 'jalali-moment'

import connect from '../lib/db'
import { buildQuery } from '../utils/helpers'
import DBS from '@/models/DBS'

/* ----- DBS ----- */
export const getDBSs = async (search?: any) => {
    await connect()

    try {
        const allDBSs = await DBS.find(buildQuery(search))
            .skip(search?.skip ? search?.skip : 0)
            .limit(search?.limit ? search?.limit : 0)
            .sort({ createdAt: -1 })
            .lean()

        return JSON.parse(JSON.stringify(allDBSs))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در دریافت پرسنل' }
    }
}

export const getSingleDBS = async (id: string) => {
    await connect()

    try {
        const singleDBS = await DBS.findById(id)
        return JSON.parse(JSON.stringify(singleDBS))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در دریافت کارمند' }
    }
}

export const addDetailToReport = async (body: any) => {
    await connect()
    try {
        let find = await DBS.findOneAndUpdate({ branch: body.branch, date: body.date }, { $push: { category: body.categories, group: body.group, products: body.products } }, { new: true })
        return { success: 'اطلاعات بارگذاری شد' }
    } catch (error) {
        console.log(error)
        return { error: 'خطا در بارگذاری اطلاعات' }
    }
}

export const createsellerReport = async (body: any) => {
    await connect()
    body.map(async (data: any) => {
        let miladiDate = moment.from(data.date, 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD');
        console.log(data.date,typeof(miladiDate),miladiDate)
        data.date = Date.parse(miladiDate)
        let find = await DBS.findOne({ branch: data.branch, date: data.date, isDeleted: false })
        if (find == undefined) {
            let pack = { branch: data.branch, date: data.date, sellers: [{ seller: data.seller, totalSell: data.totalSell }] }
            try {
                let res = await DBS.create(pack)
                return JSON.parse(JSON.stringify(res))
            } catch (error) {
                console.log(error)
                return { error: 'خطا در ساخت شرکت' }
            }
        } else {
            find.sellers.push({ seller: data.seller, totalSell: data.totalSell })
            await find.save()
        }
    })
    return { success: 'عملیات انجام شد' }
}

export const createDailyReport = async (body: any) => {
    await connect()
    body.map(async (data: any) => {
        let miladiDate = moment.from(data.date, 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD');
        console.log(data.date,typeof(miladiDate),miladiDate)
        data.date = Date.parse(miladiDate)
        let find = await DBS.findOne({ branch: data.branch, date: data.date, isDeleted: false })
        if (find == undefined) {
            try {
                let res = await DBS.create(data)
                return JSON.parse(JSON.stringify(res))
            } catch (error) {
                console.log(error)
                return { error: 'خطا در ساخت شرکت' }
            }
        }
    })
    return { success: 'عملیات انجام شد' }
}

export const editDBS = async (id: string, body: any) => {
    await connect()

    try {
        let updatedDBS = await DBS.findByIdAndUpdate(id, body, { new: true })
        return JSON.parse(JSON.stringify(updatedDBS))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در تغییر کارمند' }
    }
}

export const deleteDBS = async (DBSId: string) => {
    await connect()

    try {
        const found = await DBS.findById(DBSId)

        if (!found) {
            return { error: 'مقاله وجود ندارد' }
        }

        await found.softDelete()
        return { success: true }
    } catch (error) {
        console.log(error)
        return { error: 'خطا در پاک کردن کارمند' }
    }
}
