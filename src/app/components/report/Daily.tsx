'use client'

import { convertExcelDailyToJson } from "@/app/action/convert.action";
import { createDailyReport } from "@/app/action/report.action";
import { useState } from "react";
import { toast } from "react-toastify";

export default function DailyReport() {
    const [dailyFile, setDailyFile] = useState<File | null>(null);
    const [jsonData, setJsonData] = useState<any>(null);
    const uploadDaily = async (data: any) => {
        let fd = new FormData();
        fd.append('file', data);
        let res = await convertExcelDailyToJson(fd);
        HandleDaily(res)
    }

    const HandleDaily = async (data: any) => {
        let res = await createDailyReport(data)
        toast.success(res.success)
        setDailyFile(null)
        setJsonData(null)
    }
    return (
        <div className='p-5 text-center'>
            <h4 className="text-center">فایل اکسل گزارشات روزانه رو انتخاب کنید</h4>
            <label htmlFor="attach">
                <input type="file" name="attach" id="attach" hidden onChange={async (e: any) => { setDailyFile(e.target.files[0]); }} />
                <span className="btn btn-sm rounded bg-custom-3 text-white mt-2 mx-2">{dailyFile?.name !== undefined ? dailyFile?.name : 'انتخاب فایل اکسل'}</span>
            </label>
            {dailyFile !== null && <button type="button" onClick={() => uploadDaily(dailyFile)} className="btn btn-sm rounded bg-custom-2 text-white mt-2 mx-2">تبدیل اطلاعات</button>}
            {jsonData !== null && <button type="button" onClick={() => HandleDaily(jsonData)} className="btn btn-sm rounded bg-custom-1 text-white mt-2 mx-2">انتقال اطلاعات به دیتابیس</button>}
        </div>
    )
}