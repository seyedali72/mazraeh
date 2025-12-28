'use client'

import { deleteDBS, getSingleDBS } from "@/app/action/report.action"
import { Confirmation } from "@/app/components/Confirmation"
import CategoryList from "@/app/components/report/Category"
import GroupList from "@/app/components/report/Groups"
import LineChart from "@/app/components/report/LineChart"
import ProductList from "@/app/components/report/Products"
import Spinner from "@/app/components/Spinner"
import { spliteNumber } from "@/app/utils/helpers"
import { nanoid } from "nanoid"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { toast } from "react-toastify"

export default function ReportDetail() {
    const { id }: any = useParams()
    const router = useRouter()
    const [singleReport, setSingleReport] = useState<any>([])
    const [groupBox, setGroupBox] = useState(false)
    const [categoryBox, setCategoryBox] = useState(false)
    const [productBox, setProductBox] = useState(false)
    const fetchSingle = useCallback(async () => {
        let single = await getSingleDBS(id)
        setSingleReport(single)
    }, [id])
    useEffect(() => { fetchSingle() }, [fetchSingle])
    const handleDelete = async () => {
        let res = await deleteDBS(singleReport?._id)
        if (!res.error) { router.replace('/pb/daily') }
    }

    if (singleReport?.length !== 0) {
        return (
            <>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item "><Link href="/pb/dashboard">داشبورد</Link></li>
                        <li className="breadcrumb-item "><Link href="/pb/daily"> لیست گزارشات </Link></li>
                        <li className="breadcrumb-item active" aria-current="page"> {singleReport?.branch}</li>
                    </ol>
                </nav>
                <section className="main-body-container rounded">
                    <section className="row">
                        <div className="col-12 col-md-4">
                            <label className='my-1' htmlFor="">نام فروشگاه </label>
                            <div className="form-control form-control-sm">{singleReport?.branch} </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <label className='my-1' htmlFor="">تاریخ </label>
                            <div className="form-control form-control-sm">{singleReport?.date} </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <label className='my-1' htmlFor=""> مبلغ فروش </label>
                            <div className="form-control form-control-sm">{spliteNumber(singleReport?.totalSell)} ريال</div>
                        </div>
                        <div className="col-12 col-md-4">
                            <label className='my-1' htmlFor="">مبلغ مرجوعی </label>
                            <div className="form-control form-control-sm">{spliteNumber(singleReport?.totalReturn)} ريال</div>
                        </div>
                        <div className="col-12 col-md-4">
                            <label className='my-1' htmlFor="">تعداد فاکتور </label>
                            <div className="form-control form-control-sm">{spliteNumber(singleReport?.totalInvoice)} </div>
                        </div>
                        <div className="col-12  ">
                            <label className='my-1' htmlFor="">فروشندگان </label>
                            {singleReport?.sellers?.length &&
                                <div className="form-control form-control-sm">{singleReport?.sellers?.map((el: any) => { return (<span key={nanoid()}>{el?.seller} : {spliteNumber(el?.totalSell)} ريال{' - '}</span>) })} </div>}
                        </div>
                    </section>
                </section>
                <div className="d-flex flex-wrap gap-3 mt-3">
                    {singleReport?.group?.length > 0 ? <button type="button" onClick={() => setGroupBox(!groupBox)} className="btn btn-sm bg-custom-2">  <i className="fa fa-cubes px-1"></i> گروه کالا ها</button> : ''}
                    {singleReport?.category?.length > 0 ? <button type="button" onClick={() => setCategoryBox(!categoryBox)} className="btn btn-sm bg-custom-4">  <i className="fa fa-folder-open px-1"></i> دسته بندی ها</button> : ''}
                    {singleReport?.products?.length > 0 ? <button type="button" onClick={() => setProductBox(!productBox)} className="btn btn-sm bg-custom-5">  <i className="fa fa-cube px-1"></i> لیست کالاها</button> : ''}
                    <button type="button" className="btn btn-sm bg-custom-3 ms-1" onClick={() => toast(<Confirmation onDelete={() => handleDelete()} />, { autoClose: false, })}>
                        <i className="fa fa-trash px-1"></i>حذف این گزارش
                    </button>
                </div>

                {groupBox ? <><LineChart singleReport={singleReport?.group[0]} /><GroupList singleReport={singleReport?.group[0]} /> </> : ''}
                {categoryBox ? <><LineChart singleReport={singleReport?.category[0]} /><CategoryList singleReport={singleReport?.category[0]} /></> : ''}
                {productBox ? <><LineChart singleReport={singleReport?.products[0]} /><ProductList singleReport={singleReport?.products[0]} /></> : ''}

            </>
        )
    } else { return (<Spinner />) }
}