'use server'

import moment from 'jalali-moment'
import connect from '../lib/db'
import { buildQuery } from '../utils/helpers'
import Seller from '@/models/Seller'

/* ----- Seller ----- */
export const getSellers = async (search?: any) => {
    await connect()

    try {
        const allSellers = await Seller.find(buildQuery(search))
            .skip(search?.skip ? search?.skip : 0)
            .limit(search?.limit ? search?.limit : 0)
            .sort({ createdAt: -1 })
            .lean()

        return JSON.parse(JSON.stringify(allSellers))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در دریافت اطلاعات' }
    }
}

export const getSingleSeller = async (id: string) => {
    await connect()

    try {
        const singleSeller = await Seller.findById(id)
        return JSON.parse(JSON.stringify(singleSeller))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در دریافت کارمند' }
    }
}

export const createSinglesellerReport = async (body: any) => {
    await connect()
    body.map(async (data: any) => {
        let miladiDate = moment.from(data.date, 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD');
        data.date = Date.parse(miladiDate)
        let find = await Seller.findOne({ name: data.seller, date: data.date, isDeleted: false })
        if (find == undefined) {
            let pack = { branch: data.branch, date: data.date, name: data.seller, totalSell: data.totalSell, day: data.day }
            try {
                let res = await Seller.create(pack)
                return JSON.parse(JSON.stringify(res))
            } catch (error) {
                console.log(error)
                return { error: 'خطا در ساخت گزارش' }
            }
        } else {
            return { error: 'این رکورد قبلا ثبت شده است' }

        }
    })
    return { success: 'عملیات انجام شد' }
}

export const editSeller = async (id: string, body: any) => {
    await connect()

    try {
        let updatedSeller = await Seller.findByIdAndUpdate(id, body, { new: true })
        return JSON.parse(JSON.stringify(updatedSeller))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در تغییر کارمند' }
    }
}

export const deleteSeller = async (sellerId: string) => {
    await connect()

    try {
        const found = await Seller.findById(sellerId)

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
