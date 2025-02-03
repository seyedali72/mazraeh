'use client'

import { convertExcelsellerToJson } from "@/app/action/convert.action";
import { createsellerReport } from "@/app/action/report.action";
import { createSinglesellerReport } from "@/app/action/seller.action";
import { useState } from "react";
import { toast } from "react-toastify";

export default function UserReport() {
    const [sellerFile, setsellerFile] = useState<File | null>(null);
    const [jsonData, setJsonData] = useState<any>(null);
    const uploadseller = async (data: any) => {
        let fd = new FormData();
        fd.append('file', data);
        let res = await convertExcelsellerToJson(fd);
        Handleseller(res)
        setsellerFile(null)
    }
    const Handleseller = async (data: any) => {
        let res = await createsellerReport(data) 
        HandleSingleseller(data)
     }
    const HandleSingleseller = async (data: any) => {
        let res = await createSinglesellerReport(data)
        toast.success(res.success)
        setJsonData(null)
    }
    return (
        <div className='text-center p-5'>
            <h4 className="text-center">فایل اکسل تجمیعی کاربرات رو انتخاب کنید</h4>
            <label htmlFor="attach">
                <input type="file" name="attach" id="attach" hidden onChange={async (e: any) => { setsellerFile(e.target.files[0]); }} />
                <span className="btn btn-sm rounded bg-custom-3 text-white mt-2 mx-2">{sellerFile?.name !== undefined ? sellerFile?.name : 'انتخاب فایل اکسل'}</span>
            </label>
            {sellerFile !== null && <button type="button" onClick={() => uploadseller(sellerFile)} className="btn btn-sm rounded bg-custom-2 text-white mt-2 mx-2">تبدیل اطلاعات</button>}
            {jsonData !== null && <button type="button" onClick={() => Handleseller(jsonData)} className="btn btn-sm rounded bg-custom-1 text-white mt-2 mx-2">انتقال اطلاعات به دیتابیس</button>}
        </div>
    )
}