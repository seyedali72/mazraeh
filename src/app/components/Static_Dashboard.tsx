'use client'

import { useCallback, useEffect, useState } from "react"
import { getAdminDashboard } from "../action/dashboard.action"
import { spliteNumber } from "../utils/helpers"
import Spinner from "./Spinner"
import DashboardChart from "./report/DashboardChart"

export default function StatisticsDashboard() {
  const [data, setData] = useState<any>()

  const fetchData = useCallback(async () => {
    let data = await getAdminDashboard()
    setData(data)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])
  if (data !== undefined) {
    return (
      <section className="row mx-0">
        <section className=" px-0 col-6 col-lg-3">
          <div className="d-block mx-2 mt-2 text-decoration-none text-white ">
            <section className="card">
              <section className="card-body d-flex justify-content-between">
                <section className="info-body-card w-100 ">
                  <h5 className="card-title my-3 text-center">تعداد روزهای اطلاعات</h5>
                  <p className="card-description text-center mb-0">{data ? spliteNumber(data.ReportLength) : 0} روز</p>
                </section>
                <section className="icon-body-card ">
                  <i className="fa fa-chart-bar"></i>
                </section>
              </section>
              <section className="card-footer text-white info-footer-card bg-custom-1">
                هفت روز گذشته: {data ? spliteNumber(data.ReportLastLength) : 0} روز
              </section>
            </section>
          </div>
        </section>

        <section className=" px-0 col-6 col-lg-3">
          <div className="d-block mx-2 mt-2 text-decoration-none text-white ">
            <section className="card ">
              <section className="card-body d-flex justify-content-between">
                <section className="info-body-card w-100">
                  <h5 className="card-title my-3 text-center">تعداد کل فاکتور ها</h5>
                  <p className="card-description text-center mb-0">{data ? spliteNumber(data.totalSumInvoice) : 0} عدد</p>
                </section>
                <section className="icon-body-card">
                  <i className="fa fa-chart-bar"></i>
                </section>
              </section>
              <section className="card-footer text-white info-footer-card bg-custom-2">
                هفت روز گذشته: {data ? spliteNumber(data.totalLastWeekSumInvoice) : 0} عدد
              </section>
            </section>
          </div>
        </section>

        <section className=" px-0 col-6 col-lg-3">
          <div className="d-block mx-2 mt-2 text-decoration-none text-white ">
            <section className="card ">
              <section className="card-body d-flex justify-content-between">
                <section className="info-body-card w-100">
                  <h5 className="card-title my-3 text-center">مقدار کل فروش</h5>
                  <p className="card-description text-center mb-0">{data ? spliteNumber(data.totalSumSell) : 0} ريال</p>
                </section>
                <section className="icon-body-card">
                  <i className="fa fa-chart-bar"></i>
                </section>
              </section>
              <section className="card-footer text-white info-footer-card bg-custom-3">
                هفت روز گذشته: {data ? spliteNumber(data.totalLastWeekSumSell) : 0} ريال
              </section>
            </section>
          </div>
        </section>

        <section className=" px-0 col-6 col-lg-3">
          <div className="d-block mx-2 mt-2 text-decoration-none text-white ">
            <section className="card ">
              <section className="card-body d-flex justify-content-between">
                <section className="info-body-card w-100">
                  <h5 className="card-title my-3 text-center">مقدار کل مرجوعی</h5>
                  <p className="card-description text-center mb-0">{data ? spliteNumber(data.totalSumReturn) : 0} ريال</p>
                </section>
                <section className="icon-body-card">
                  <i className="fa fa-chart-bar"></i>
                </section>
              </section>
              <section className="card-footer text-white info-footer-card bg-custom-4">
                هفت روز گذشته: {data ? spliteNumber(data.totalLastWeekSumReturn) : 0} ريال
              </section>
            </section>
          </div>
        </section>

        <section className=" px-2 col-12 col-lg-6">
       <DashboardChart compareData={data?.totalSellChart} />
        </section>
        <section className=" px-2 col-12 col-lg-6">
       <DashboardChart compareData={data?.avrageTotalSellChart} />
        </section>
        <section className=" px-2 col-12 col-lg-6">
       <DashboardChart compareData={data?.totalReturnChart} />
        </section>
        <section className=" px-2 col-12 col-lg-6">
       <DashboardChart compareData={data?.totalInvoiceChart} />
        </section>
        <section className=" px-2 col-12 col-lg-6">
       <DashboardChart compareData={data?.bascketBranchChart} />
        </section>
      </section>
    )
  } else { <section className="row mx-0"><Spinner /></section> }
} 