'use client'
import { spliteNumber } from "@/app/utils/helpers"
import { useState } from "react"
export default function GroupList({ singleReport }: any) {
    const [filter, setFilter] = useState('')

    return (
        <section className="main-body-container rounded">
            <section className="d-flex justify-content-between align-items-center mt-1mb-3 border-bottom pb-3" >
                <section className="main-body-title">
                    <h5 className="mb-0">لیست گروه کالا ها</h5>
                </section>
                <div className="col-md-6">
                    <input type="text" onChange={(e: any) => setFilter(e.target.value)} placeholder='فیلتر براساس نام تیم ' className="form-control form-control-sm" />
                </div>
            </section>
            <section className="table-responsive">
                <table className="table table-striped fs85">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>نام گروه</th>
                            <th>میزان فروش (ريال)</th>
                            <th>میزان مرجوعی (ريال)</th>
                            <th>فروش خالص (ريال)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {singleReport?.map((el: any, idx: number) => {
                            if (el?.name?.includes(filter)) {
                                return (<tr key={idx}>
                                    <td>{idx + 1} </td>
                                    <td>{el?.name} </td>
                                    <td>{spliteNumber(el?.totalSell)}</td>
                                    <td>{spliteNumber(el?.totalReturn)} </td>
                                    <td>{spliteNumber(el?.totalSell - el?.totalReturn)} </td>
                                </tr>)
                            }
                        })}
                    </tbody>
                </table>
            </section>
        </section>
    )
}