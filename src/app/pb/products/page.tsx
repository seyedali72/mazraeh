'use client'

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { Confirmation } from "../../components/Confirmation";
import { convertToPersianDate, spliteNumber } from "@/app/utils/helpers";
import { nanoid } from "nanoid";
import { deleteDBS, getDBSs } from "@/app/action/report.action";
import DailyReport from "@/app/components/report/Daily";
import DetailReport from "@/app/components/report/Detail";

export default function ProductListPage() {
    const [mutated, setMutated] = useState(false)
    const [uploaded, setUploaded] = useState(false)
    const [selectedBranch, setSelectedBranch] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState<any>(null);
    const [data, setData] = useState<any>(null);
    const fetchData = useCallback(async () => {
        let table = await getDBSs({ isDeleted: false })
        setData(table)
    }, [])
    useEffect(() => {
        fetchData()
    }, [mutated, fetchData])
    const handleDelete = async (id: any) => {
        let res = await deleteDBS(id)
        if (!res.error) { setMutated(!mutated) }
    }

    return (
        <>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item "><Link href={`/pb/dashboard`}>داشبورد</Link></li>
                    <li className="breadcrumb-item active" aria-current="page"> گزارشات کالایی روزانه</li>
                </ol>
            </nav>
            <section className="main-body-container rounded">
                <section className="d-flex justify-content-between align-items-center mt-1mb-3 border-bottom pb-3" >
                    {uploaded ? <button type="button" onClick={() => { setUploaded(false) }} className="btn btn-sm bg-custom-2">نمایش لیست گزارشات</button> : <button type="button" onClick={() => { setUploaded(true) }} className="btn btn-sm bg-custom-2">افزودن گزارش جدید</button>}
                    {!uploaded && <div className="d-flex gap-3 col-12 col-lg-6 col-md-9">
                        <select className="form-control form-control-sm" onChange={(e: any) => { setSelectedBranch(e.target.value), setSelectedDate(null) }}>
                            {selectedBranch ? <option hidden value=''>{selectedBranch}</option> : <option hidden value=''>فروشگاه را انتخاب کنید</option>}

                            <option value="فروشگاه کهنز">فروشگاه کهنز</option>
                            <option value="فروشگاه رباط کریم">فروشگاه رباط کریم</option>
                            <option value="فروشگاه کلهر">فروشگاه کلهر</option>
                            <option value="فروشگاه معلم">فروشگاه معلم</option>
                        </select>
                        <select className="form-control form-control-sm" onChange={(e: any) => setSelectedDate(e.target.value)}>
                            {selectedDate ? <option hidden value=''>{convertToPersianDate(selectedDate,'YMD')}</option> : <option hidden value=''>تاریخ مورد نظر را انتخاب کنید</option>}
                            {data?.map((el: any) => {
                                if (el?.branch == selectedBranch) {
                                    return (
                                        <option key={nanoid()} value={el?.date}>{convertToPersianDate(el?.date,'YMD')}</option>
                                    )
                                }
                            })}

                        </select>
                        <button type="button" onClick={() => { setSelectedBranch(null), setSelectedDate(null) }} className="btn btn-sm bg-custom-3">ریست</button>
                    </div>}
                </section>
                {uploaded ? <DetailReport /> : <section className="table-responsive">
                    <table className="table table-hover table-striped">
                        <thead>
                            <tr>
                                <th className="text-center">#</th>
                                <th>نام فروشگاه</th>
                                <th>تاریخ</th>
                                <th>مبلغ فروش</th>
                                <th>مبلغ مرجوعی</th>
                                <th>تعداد فاکتور</th>
                                <th className=" text-center"> <i className="fa fa-cogs px-1"></i>تنظیمات </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((el: any, idx: number) => {
                                if (selectedBranch !== null ? selectedDate !== null ? el?.branch == selectedBranch && el?.date == selectedDate : el?.branch == selectedBranch : true) {
                                    return (<tr key={idx} className='fs80'>
                                        <td className='text-center'>{idx + 1}</td>
                                        <td>{el?.branch} </td>
                                        <td>{convertToPersianDate(el?.date,'YMD')}</td>
                                        <td>{spliteNumber(el?.totalSell)} ريال</td>
                                        <td>{spliteNumber(el?.totalReturn)} ريال</td>
                                        <td>{spliteNumber(el?.totalInvoice)}</td>
                                        <td className="  text-center">
                                            <Link href={`/pb/report/${el?._id}`} className="btn btn-sm bg-custom-4 ms-1" >
                                                <i className="fa fa-edit px-1"></i>جزئیات</Link>
                                            <button type="button" className="btn btn-sm bg-custom-3 ms-1" onClick={() => toast(<Confirmation onDelete={() => handleDelete(el?._id)} />, { autoClose: false, })}>
                                                <i className="fa fa-trash px-1"></i>حذف
                                            </button>
                                        </td>
                                    </tr>)
                                }
                            })}
                        </tbody>
                    </table>
                </section>}
            </section>

        </>
    )
}