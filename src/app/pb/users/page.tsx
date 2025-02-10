'use client'

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { Confirmation } from "../../components/Confirmation";
import { convertToPersianDate, sortingList, spliteNumber } from "@/app/utils/helpers";
import { nanoid } from "nanoid";
import { deleteDBS, getDBSs } from "@/app/action/report.action";
import DailyReport from "@/app/components/report/Daily";
import UserReport from "@/app/components/report/User";
import { getSellers } from "@/app/action/seller.action";

export default function DaliyListPage() {
    const [mutated, setMutated] = useState<boolean>(false)
    const [uploaded, setUploaded] = useState(false)
    const [selectedSeller, setSelectedSeller] = useState<any>(null);
    const [selectedBranch, setSelectedBranch] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState<any>(null);
    const [sort, setSort] = useState<any>('');
    const [dateTop, setDateTop] = useState(false)
    const [sellTop, setSellTop] = useState(false)
    const [data, setData] = useState<any>(null);
    const fetchData = useCallback(async () => {
        let table = await getSellers({ isDeleted: false })
        setData(table)
    }, [])
    useEffect(() => {
        fetchData()
    }, [mutated, fetchData])
    const handleDelete = async (id: any) => {
        let res = await deleteDBS(id)
        if (!res.error) { setMutated(!mutated) }
    }

    const sortList = sortingList(data, sort)

    return (
        <>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item "><Link href={`/pb/dashboard`}>داشبورد</Link></li>
                    <li className="breadcrumb-item active" aria-current="page"> گزارش فروشندگان</li>
                </ol>
            </nav>
            <section className="main-body-container rounded">
                <section className="d-flex justify-content-between align-items-center mt-1mb-3 border-bottom pb-3" >
                    {uploaded ? <button type="button" onClick={() => { setUploaded(false), setMutated(!mutated) }} className="btn btn-sm bg-custom-2">نمایش لیست گزارشات</button> : <button type="button" onClick={() => { setUploaded(true), setMutated(!mutated) }} className="btn btn-sm bg-custom-2">افزودن گزارش جدید</button>}
                    {!uploaded && <div className="d-flex gap-3 col-12 col-lg-9 ">
                        <input type="text" className="form-control form-control-sm" onChange={(e: any) => setSelectedSeller(e.target.value)} placeholder="نام فروشنده را وارد کنید" />
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
                        <button type="button" onClick={() => { setSelectedBranch(null), setSelectedDate(null), setSelectedSeller('') }} className="btn btn-sm bg-custom-3">ریست</button>

                    </div>}
                </section>
                {uploaded ? <UserReport /> : <section className="table-responsive">
                    <table className="table table-hover table-striped">
                        <thead>
                            <tr>
                                <th className="text-center">#</th>
                                <th>نام فروشنده</th>
                                <th>نام فروشگاه</th>
                                <th className="cursorPointer" onClick={() => { setSort(dateTop ? 'dateUptoBottom' : 'dateBottomToUp'), setDateTop(!dateTop) }}>
                                تاریخ {dateTop ? <i className="fa fa-angle-down" /> : <i className="fa fa-angle-up" />} </th>
                                <th className="cursorPointer" onClick={() => { setSort(sellTop ? 'sellUptoBottom' : 'sellBottomToUp'), setSellTop(!sellTop) }}>
                                        مبلغ فروش {sellTop ? <i className="fa fa-angle-down" /> : <i className="fa fa-angle-up" />} </th>
                                <th className=" text-center"> <i className="fa fa-cogs px-1"></i>تنظیمات </th>
                            </tr>
                        </thead>
                        <tbody>
                         
                            {data?.filter((el: any) => {
                                const isBranchMatch = selectedBranch ? el.branch === selectedBranch : true;
                                const isDateMatch = selectedDate ? el.date === selectedDate : true;
                                const isSellerMatch = selectedSeller ? el.name?.includes(selectedSeller) : true;
                                return isBranchMatch && isDateMatch && isSellerMatch;
                            }).map((el: any, idx: number) => (
                                <tr key={el._id} className='fs80'>
                                    <td className='text-center'>{idx + 1}</td>
                                    <td>{el.name}</td>
                                    <td>{el.branch}</td>
                                        <td>{convertToPersianDate(el?.date,'YMD')}</td>
                                    <td>{spliteNumber(el.totalSell)} ریال</td>
                                    <td className="text-center">
                                        <Link href={`/pb/users/statistics`} className="btn btn-sm bg-custom-4 ms-1">
                                            <i className="fa fa-edit px-1"></i>آمار کلی فروشنده
                                        </Link>
                                 
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </section>}
            </section>

        </>
    )
}