'use server'

import Material from '@/models/Material'
import connect from '../lib/db'
import { buildQuery } from '../utils/helpers'
import Category from '@/models/Category'

/* ----- category ----- */
export const getCategories = async (search?: any) => {
    await connect()

    try {
        const allCategories = await Category.find(buildQuery(search)).populate([{ path: 'parent', select: 'name parent', populate: ({ path: 'parent', select: 'name', model: Category }) }])
            .skip(search?.skip ? search?.skip : 0)
            .limit(search?.limit ? search?.limit : 0)
            .sort({ createdAt: -1 })
            .lean()

        return JSON.parse(JSON.stringify(allCategories))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در دریافت دسته بندی' }
    }
}

export const getSingleCategory = async (id: string) => {
    await connect()

    try {
        const singleCategory = await Category.findById(id).populate([{ path: 'products', model: Material }, { path: 'parent', model: Category }])
        return JSON.parse(JSON.stringify(singleCategory))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در دریافت دسته بندی' }
    }
}

export const createCategory = async (body: any) => {
    await connect()
    try {
        let res = await Category.create(body)
        return JSON.parse(JSON.stringify(res))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در ثبت دسته بندی' }
    }
}

export const editCategory = async (id: string, body: any) => {
    await connect()
    try {
        let updatedCategory = await Category.findByIdAndUpdate(id, body, { new: true })
        return JSON.parse(JSON.stringify(updatedCategory))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در تغییر دسته بندی' }
    }
}

export const deleteCategory = async (Id: string) => {
    await connect()

    try {
        const found = await Category.findById(Id)

        if (!found) {
            return { error: 'دسته بندی وجود ندارد' }
        }

        await found.softDelete()
        return { success: true }
    } catch (error) {
        console.log(error)
        return { error: 'خطا در پاک کردن دسته بندی' }
    }
}

export const addProductToCategory = async (id: string, body: any, type: string) => {
    await connect()

    try {
        let result = await Category.findByIdAndUpdate(id, { $push: { products: body } }, { new: true })
        await Material.findByIdAndUpdate(body, { categoryId: result?._id })

        return JSON.parse(JSON.stringify(result))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در تغییر دسته بندی' }
    }
}

export const editProductFromCategory = async (id: string, body: any, type: string, last: any) => {
    await connect()

    try {
        let remove = await Category.findByIdAndUpdate(last, { $pull: { products: body } }, { new: true })
        if (remove !== undefined) {
            let result = await Category.findByIdAndUpdate(id, { $push: { products: body } }, { new: true })
            await Material.findByIdAndUpdate(body, { categoryId: result?._id })


            return JSON.parse(JSON.stringify(result))
        }
    } catch (error) {
        console.log(error)
        return { error: 'خطا در تغییر دسته بندی' }
    }
}
export const removeProductFromCategory = async (id: string, body: any) => {
    await connect()

    try {
        let result = await Category.findByIdAndUpdate(id, { $pull: { products: body } }, { new: true })
        let find = await Material.findById(body)
        if (find == undefined) {
            await Material.findByIdAndUpdate(body, { categoryId: result?._id })
        }

        return JSON.parse(JSON.stringify(result))
    } catch (error) {
        console.log(error)
        return { error: 'خطا در تغییر دسته بندی' }
    }
}