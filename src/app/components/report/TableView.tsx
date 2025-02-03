'use client'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
 import { toast } from 'react-toastify'
import { Confirmation } from '@/app/components/Confirmation'
import { convertToPersianDate, roleType, spliteNumber } from '@/app/utils/helpers'
import { useUser } from '@/app/context/UserProvider'
import { getDBSs } from '@/app/action/report.action'

export default function FristView() {
    const [list, setList] = useState([])
    const [mutated, setMutated] = useState(false)
    const { user } = useUser()
    const fetchData = useCallback(async () => {
        let res = await getDBSs({ isDeleted: false })
        setList(res)
    }, [])
  
    useEffect(() => {
        fetchData()
    }, [fetchData, mutated])

    return (
        <>
            <section className="main-body-container rounded">
                <section className="table-responsive">
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
                            {list.map((el: any, idx: number) => {
                                return (<tr key={idx} className='fs80'>
                                    <td className='text-center'>{idx + 1}</td>
                                    <td>{el?.branch} </td>
                                    <td>{convertToPersianDate(el?.date,'YMD')}</td>
                                    <td>{spliteNumber(el?.totalSell)} ريال</td>
                                    <td>{spliteNumber(el?.totalReturn)} ريال</td>
                                    <td>{spliteNumber(el?.totalInvoice)}</td>
                                    <td className="  text-center">
                                        <Link href={`/pb/els/${el?._id}`} className="btn btn-sm bg-custom-4 ms-1" >
                                            <i className="fa fa-edit px-1"></i>جزئیات</Link>
                                
                                    </td>
                                </tr>)
                            })}
                        </tbody>
                    </table>
                </section>
            </section>

        </>
    );
}
