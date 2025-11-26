'use client'

import { useCallback, useEffect, useState } from "react"
import { getAdminDashboard } from "../action/dashboard.action"
import { spliteNumber } from "../utils/helpers"
import Spinner from "./Spinner"
import DashboardChart from "./report/DashboardChart"
import Link from "next/link"

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
        <section className="d-flex flex-column gap-2 col-12 col-md-6 col-lg-3 px-1">
          <span className="bg-white rounded py-3 text-center shadow-sm"> آمارگیری</span>

          <section className=" px-0 col-12">
            <Link href="/pb/compare/branch">
              <div className="d-block text-decoration-none">
                <section className="card  text-white  bg-custom-4">
                  <section className="card-body d-flex justify-content-between">
                    <section className="info-body-card w-100">
                      <h5 className="card-title my-3 text-center textShadow">آمار شعبه</h5>
                    </section>
                  </section>
                </section>
              </div>
            </Link>
          </section>
          <section className=" px-0 col-12">
            <Link href="/pb/compare/product">
              <div className="d-block text-decoration-none">
                <section className="card  text-white  bg-custom-4">
                  <section className="card-body d-flex justify-content-between">
                    <section className="info-body-card w-100">
                      <h5 className="card-title my-3 text-center textShadow">آمار محصول</h5>
                    </section>
                  </section>
                </section>
              </div>
            </Link>
          </section>
          <section className=" px-0 col-12">
            <Link href="/pb/compare/branchs/duration">
              <div className="d-block text-decoration-none">
                <section className="card  text-white  bg-custom-4">
                  <section className="card-body d-flex justify-content-between">
                    <section className="info-body-card w-100">
                      <h5 className="card-title my-3 text-center textShadow">آمار در بازه زمانی </h5>
                    </section>
                  </section>
                </section>
              </div>
            </Link>
          </section>
          <section className=" px-0 col-12">
            <Link href="/pb/compare/branchs/days">
              <div className="d-block text-decoration-none">
                <section className="card  text-white  bg-custom-4">
                  <section className="card-body d-flex justify-content-between">
                    <section className="info-body-card w-100">
                      <h5 className="card-title my-3 text-center textShadow">آمار در چند روز </h5>
                    </section>
                  </section>
                </section>
              </div>
            </Link>
          </section>
          <section className=" px-0 col-12">
            <Link href="/pb/compare/branchs/packs">
              <div className="d-block text-decoration-none">
                <section className="card  text-white  bg-custom-4">
                  <section className="card-body d-flex justify-content-between">
                    <section className="info-body-card w-100">
                      <h5 className="card-title my-3 text-center textShadow">آمار در هفته/ماه/سال </h5>
                    </section>
                  </section>
                </section>
              </div>
            </Link>
          </section>
        </section>

        <section className="d-flex flex-column gap-2 col-12 col-md-6 col-lg-3 px-1">
          <span className="bg-white rounded py-3 text-center shadow-sm"> بارگذاری گزارشات</span>
          <section className=" px-0 col-12">
            <Link href="/pb/daily">
              <div className="d-block text-decoration-none">
                <section className="card  text-white  bg-custom-1">
                  <section className="card-body d-flex justify-content-between">
                    <section className="info-body-card w-100">
                      <h5 className="card-title my-3 text-center textShadow">گزارش تجمیعی روزانه</h5>
                    </section>
                  </section>
                </section>
              </div>
            </Link>
          </section>
          <section className=" px-0 col-12">
            <Link href="/pb/users">
              <div className="d-block text-decoration-none">
                <section className="card  text-white  bg-custom-1">
                  <section className="card-body d-flex justify-content-between">
                    <section className="info-body-card w-100">
                      <h5 className="card-title my-3 text-center textShadow">گزارش تجمیعی کاربران</h5>
                    </section>
                  </section>
                </section>
              </div>
            </Link>
          </section>
          <section className=" px-0 col-12">
            <Link href="/pb/products">
              <div className="d-block text-decoration-none">
                <section className="card  text-white  bg-custom-1">
                  <section className="card-body d-flex justify-content-between">
                    <section className="info-body-card w-100">
                      <h5 className="card-title my-3 text-center textShadow">گزارش تجمیعی کالا </h5>
                    </section>
                  </section>
                </section>
              </div>
            </Link>
          </section>
        </section>

        <section className="d-flex flex-column gap-2 col-12 col-md-6 col-lg-3 px-1">
          <span className="bg-white rounded py-3 text-center shadow-sm"> بارگذاری اطلاعات</span>
          <section className=" px-0 col-12">
            <Link href="/pb/category">
              <div className="d-block text-decoration-none">
                <section className="card  text-white  bg-custom-3">
                  <section className="card-body d-flex justify-content-between">
                    <section className="info-body-card w-100">
                      <h5 className="card-title my-3 text-center textShadow">تعریف دسته بندی </h5>
                    </section>
                  </section>
                </section>
              </div>
            </Link>
          </section>
          <section className=" px-0 col-12">
            <Link href="/pb/materials">
              <div className="d-block text-decoration-none">
                <section className="card  text-white  bg-custom-3">
                  <section className="card-body d-flex justify-content-between">
                    <section className="info-body-card w-100">
                      <h5 className="card-title my-3 text-center textShadow">لیست موارد اولیه </h5>
                    </section>
                  </section>
                </section>
              </div>
            </Link>
          </section>
        </section>

        <section className="d-flex flex-column gap-2 col-12 col-md-6 col-lg-3 px-1">
          <span className="bg-white rounded py-3 text-center shadow-sm"> قیمت نهایی</span>

          <section className=" px-0 col-12">
            <Link href="/pb/productions">
              <div className="d-block text-decoration-none">
                <section className="card  text-white  bg-custom-2">
                  <section className="card-body d-flex justify-content-between">
                    <section className="info-body-card w-100">
                      <h5 className="card-title my-3 text-center textShadow">محصول میانی</h5>
                    </section>
                  </section>
                </section>
              </div>
            </Link>
          </section>
          <section className=" px-0 col-12">
            <Link href="/pb/final">
              <div className="d-block text-decoration-none">
                <section className="card  text-white  bg-custom-2">
                  <section className="card-body d-flex justify-content-between">
                    <section className="info-body-card w-100">
                      <h5 className="card-title my-3 text-center textShadow">محصول بازرگانی</h5>
                    </section>
                  </section>
                </section>
              </div>
            </Link>
          </section>
          <section className=" px-0 col-12">
            <Link href="/pb/converts">
              <div className="d-block text-decoration-none">
                <section className="card  text-white  bg-custom-2">
                  <section className="card-body d-flex justify-content-between">
                    <section className="info-body-card w-100">
                      <h5 className="card-title my-3 text-center textShadow">کالای تبدیلی </h5>
                    </section>
                  </section>
                </section>
              </div>
            </Link>
          </section>
          <section className=" px-0 col-12">
            <Link href="/pb/package">
              <div className="d-block text-decoration-none">
                <section className="card  text-white  bg-custom-2">
                  <section className="card-body d-flex justify-content-between">
                    <section className="info-body-card w-100">
                      <h5 className="card-title my-3 text-center textShadow">بسته بندی </h5>
                    </section>
                  </section>
                </section>
              </div>
            </Link>
          </section>
          <section className=" px-0 col-12">
            <Link href="/pb/finalprice">
              <div className="d-block text-decoration-none">
                <section className="card  text-white  bg-custom-2">
                  <section className="card-body d-flex justify-content-between">
                    <section className="info-body-card w-100">
                      <h5 className="card-title my-3 text-center textShadow">لیست قیمت نهایی </h5>
                    </section>
                  </section>
                </section>
              </div>
            </Link>
          </section>
        </section>

        {/* <section className="d-flex flex-column gap-2 col-12 col-md-6 col-lg-3 px-1">
          <section className=" px-0 col-12">
            <div className="d-block text-decoration-none text-white ">
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

          <section className=" px-0 col-12">
            <div className="d-block text-decoration-none text-white ">
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

          <section className=" px-0 col-12">
            <div className="d-block text-decoration-none text-white ">
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

          <section className=" px-0 col-12">
            <div className="d-block text-decoration-none text-white ">
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
        </section> */}
      </section>
    )
  } else { <section className="row mx-0"><Spinner /></section> }
} 