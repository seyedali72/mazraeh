'use client'

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { Confirmation } from "../../components/Confirmation";
import { convertToPersianDate, sortingList, spliteNumber } from "@/app/utils/helpers";
import { nanoid } from "nanoid";
import { deleteDBS, getDBSs } from "@/app/action/report.action";
import DailyReport from "@/app/components/report/Daily";
import DetailReport from "@/app/components/report/Detail";
import { getProducts } from "@/app/action/product.action";

export default function ProductListPage() {
    const [mutated, setMutated] = useState(false)
    const [uploaded, setUploaded] = useState(false)
    const [selectedBranch, setSelectedBranch] = useState<any>('');
    const [selectedDate, setSelectedDate] = useState<any>(null);
    const [data, setData] = useState<any>(null);
    const [sort, setSort] = useState<any>('');

    
    const fetchData = useCallback(async () => {
        let table = await getProducts({ isDeleted: false })
        setData(table)
    }, [])
    useEffect(() => {
        fetchData()
    }, [mutated, fetchData])
    const sortList = sortingList(data, sort)
    // const handleDelete = async (id: any) => {
    //     let res = await deleteDBS(id)
    //     if (!res.error) { setMutated(!mutated) }
    // }

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
                        <input className="form-control form-control-sm" placeholder="جستجو نام محصول" onChange={(e: any) => { setSelectedBranch(e.target.value)  }}/>
                       
                        <select className="form-control form-control-sm" onChange={(e: any) => setSelectedDate(e.target.value)}>
                            {selectedDate ? <option hidden value=''>{convertToPersianDate(selectedDate, 'YMD')}</option> : <option hidden value=''>تاریخ مورد نظر را انتخاب کنید</option>}
                            {data?.map((el: any) => {
                                if (el?.branch == selectedBranch) {
                                    return (
                                        <option key={nanoid()} value={el?.date}>{convertToPersianDate(el?.date, 'YMD')}</option>
                                    )
                                }
                            })}

                        </select>
                        <button type="button" onClick={() => { setSelectedBranch(''), setSelectedDate(null) }} className="btn btn-sm bg-custom-3">ریست</button>
                    </div>}
                </section>
                {uploaded ? <DetailReport /> : <section className="table-responsive">
                    <table className="table table-hover table-striped">
                        <thead>
                            <tr>
                                <th className="text-center">#</th>
                                <th>عنوان محصول</th>
                                <th>سال</th>
                                <th>ماه</th>
                                <th>هفته</th>
                                {/* <th>دسته بندی</th>
                                <th>زیر گروه</th>
                                <th>گروه کالایی</th> */}
                                <th>تعداد فاکتور</th>
                                {/* <th className=" text-center"> <i className="fa fa-cogs px-1"></i>تنظیمات </th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {sortList?.map((el: any, idx: number) => {
                                if (el?.name?.includes(selectedBranch)) {
                                    return (<tr key={idx} className='fs80'>
                                        <td className='text-center'>{idx + 1}</td>
                                        <td>{el?.name} </td>
                                        <td>{el?.year} </td>
                                        <td>{el?.month} </td>
                                        <td>{el?.week} </td>
                                        {/* <td>{el?.category} </td>
                                        <td>{el?.subGroup} </td>
                                        <td>{el?.group} </td> */}
                                        <td>{spliteNumber(el?.totalSell.length)}</td>
                                        {/* <td className="  text-center">
                                            <Link href={`/pb/report/${el?._id}`} className="btn btn-sm bg-custom-4 ms-1" >
                                                <i className="fa fa-edit px-1"></i>جزئیات</Link>
                                            <button type="button" className="btn btn-sm bg-custom-3 ms-1" onClick={() => toast(<Confirmation onDelete={() => handleDelete(el?._id)} />, { autoClose: false, })}>
                                                <i className="fa fa-trash px-1"></i>حذف
                                            </button>
                                        </td> */}
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