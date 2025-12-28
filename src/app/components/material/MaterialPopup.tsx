'use client'

import { convertExcelMaterialToJson } from "@/app/action/convert.action";
import { createMaterial } from "@/app/action/material.action";
import { useState } from "react";
import { toast } from "react-toastify";
import Spinner from "../Spinner";
import { updateAllCosts } from "@/app/action/updatePrice.action";

export default function UplaodMaterial({ close }: any) {
    const [dailyFile, setDailyFile] = useState<File | null>(null);
    const [jsonData, setJsonData] = useState<any>(null);
    const [loader, setLoader] = useState<boolean>(false);
    const [loader2, setLoader2] = useState<boolean>(false);
    const uploadToConvert = async (data: any) => {
        setLoader(true)
        let fd = new FormData();
        fd.append('file', data);
        let res = await convertExcelMaterialToJson(fd);
        HandleCreate(res)
    }

    const HandleCreate = async (data: any) => {
        let res = await createMaterial(data)
        setLoader(false)
        toast.success(res.success)
        toast.info('در حال بروزرسانی قیمت کالا و بسته بندی ها')
        setLoader2(true)
        let update = await updateAllCosts()
        if (update?.success) {
            toast.success('قیمت ها بروزرسانی شد')
            setDailyFile(null)
            setJsonData(null)
            setLoader2(false)
            close()
        }
    }
    if (loader) { return <Spinner /> }
    return (
        <div className="popupCustom">
            {!loader2
                ? <section className="main-body-container rounded">
                    <div className="d-flex justify-content-between border-bottom pb-1">
                        <p className="mb-0 fs-6 fw-bold">بارگذاری فایل </p>
                        <button onClick={() => { close() }} className="btn btn-sm" type="button"><i className="fa fa-times"></i></button>
                    </div>
                    <div className='p-5 text-center'>
                        <h4 className="text-center">فایل اکسل مواد اولیه رو انتخاب کنید</h4>
                        <label htmlFor="attach">
                            <input type="file" name="attach" id="attach" hidden onChange={async (e: any) => { setDailyFile(e.target.files[0]); }} />
                            <span className="btn btn-sm rounded bg-custom-3 text-white mt-2 mx-2">{dailyFile?.name !== undefined ? dailyFile?.name : 'انتخاب فایل اکسل'}</span>
                        </label>
                        {dailyFile !== null && <button type="button" onClick={() => uploadToConvert(dailyFile)} className="btn btn-sm rounded bg-custom-2 text-white mt-2 mx-2">تبدیل اطلاعات</button>}
                        {jsonData !== null && <button type="button" onClick={() => HandleCreate(jsonData)} className="btn btn-sm rounded bg-custom-1 text-white mt-2 mx-2">انتقال اطلاعات به دیتابیس</button>}
                    </div>
                </section>
                : <section className="main-body-container rounded">
                    <p>لطفا از صفحه خارج نشوید، نرم افزار در حال بروزرسانی قیمت ها می باشد</p>
                </section>
            }
        </div>
    )
}