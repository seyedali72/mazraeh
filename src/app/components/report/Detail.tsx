'use client'

import { compareAndCompactJson, convertExcelDetailsToJson } from "@/app/action/convert.action";
import { createProduct } from "@/app/action/product.action";
import { addDetailToReport, getDBSs } from "@/app/action/report.action";
import { convertToPersianDate } from "@/app/utils/helpers";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Spinner from "../Spinner";

export default function DetailReport() {
    const [file, setFile] = useState<File | null>(null);
    const [jsonData, setJsonData] = useState<any>(null);
    const [finalData, setFinalData] = useState<any>(null);
    const [data, setData] = useState<any>(null);
    const [selectedBranch, setSelectedBranch] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const uploadDetails = async (data: any) => {
        console.log(convertToPersianDate(Date.now(), 'YYMDHMSS'))
        setLoading(true)
        try {
            let fd = new FormData();
            fd.append('file', data);
            const res = await convertExcelDetailsToJson(fd);
            await handleCompare(res);
            await handleCreateProduct(res);
            setFile(null);
        } catch (error) { console.error('Error uploading details:', error); toast.error('خطا در بارگذاری جزئیات'); }
    }

    const handleCompare = async (data: any) => {
        try {
            const res = await compareAndCompactJson(data); await handleAddDetail(res); setJsonData(null);
        } catch (error) { console.error('Error comparing data:', error); toast.error('خطا در مقایسه داده‌ها'); }
    }

    const handleCreateProduct = async (data: any) => {
        data.week = selectedDate
        try {
            const res = await createProduct(data,selectedDate); setJsonData(null);

            if (res.success) { toast.success(res.success); console.log(convertToPersianDate(Date.now(), 'YYMDHMSS')); setLoading(false); setFinalData(null); } else { toast.error('خطا در افزودن جزئیات'); }
        } catch (error) { console.error('Error creating product:', error); toast.error('خطا در ایجاد محصول'); }
    }

    const handleAddDetail = async (data: any) => {
        try {
            let body = { branch: selectedBranch, date: selectedDate, categories: data.categories, products: data.products, group: data.group };
            const res = await addDetailToReport(body);
            if (res.success) {   setFinalData(null); } else { toast.error('خطا در افزودن جزئیات'); }
        } catch (error) { console.error('Error adding detail:', error); toast.error('خطا در افزودن جزئیات'); }
    }

    const fetchData = useCallback(async () => {
        let table = await getDBSs({ isDeleted: false })
        setData(table)
    }, [])
    useEffect(() => { fetchData() }, [fetchData, selectedBranch])
    if (loading) {return <Spinner /> } else {
        return (
            <div className='p-5 text-center'>
                <h4 className="text-center">برای بارگذاری گزارش کالایی باید شعبه و روز تعریف شده رو انتخاب کنید</h4>
                <div className="d-flex gap-3 col-12 col-md-6 mx-auto justify-content-center">
                   
                    <input type="number" className="form-control form-control-sm" onChange={(e: any) => setSelectedDate(e.target.value)} />
                </div>
                <label htmlFor="attach">
                    <input type="file" name="attach" id="attach" hidden onChange={async (e: any) => { setFile(e.target.files[0]); }} />
                    <span className="btn btn-sm rounded bg-custom-3 text-white mt-2 mx-2">{file?.name !== undefined ? file?.name : 'انتخاب فایل اکسل'}</span>
                </label>
                {file !== null && <button type="button" onClick={() => uploadDetails(file)} className="btn btn-sm rounded bg-custom-2 text-white mt-2 mx-2">تبدیل اطلاعات</button>}
                {jsonData !== null && <button type="button" onClick={() => handleCompare(jsonData)} className="btn btn-sm rounded bg-custom-1 text-white mt-2 mx-2">جداسازی اطلاعات</button>}
                {finalData !== null && <button type="button" onClick={() => handleAddDetail(finalData)} className="btn btn-sm rounded bg-custom-2 text-white mt-2 mx-2">انتقال اطلاعات به دیتابیس </button>}
            </div>
        )
    }
}