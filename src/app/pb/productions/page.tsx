'use client'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useUser } from '@/app/context/UserProvider'
import { getProductsList } from '@/app/action/material.action'
import PriceListPopup from '@/app/components/material/PriceListPopup'
import { updateAllCosts } from '@/app/action/updatePrice.action'
import { convertToPersianDate } from '@/app/utils/helpers'
import { toast } from 'react-toastify'
import Spinner from '@/app/components/Spinner'

export default function RequestsList() {
  const [productions, setProductions] = useState([])
  const [loader, setLoader] = useState<boolean>(false)
  const [popup, setPopup] = useState<boolean>(false)
  const [selectItem, setSelectItem] = useState<any>('')
  const { user } = useUser()
  const [filter, setFilter] = useState('')
  const fetchData = useCallback(async () => {
    if (user?._id !== undefined) {
      let res = await getProductsList({ isDeleted: false, type: 'middle' })
      setProductions(res)
    }
  }, [user])

  useEffect(() => {
    fetchData()
  }, [fetchData])
  let update = async () => {
    setLoader(true)
    let res = await updateAllCosts()
    if (res?.success) { setLoader(false); toast.success('بروزرسانی با موفقیت انجام شد') }
  }
  if (loader) { return <Spinner /> }
  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/pb/dashboard">خانه</Link></li>
          <li className="breadcrumb-item active" aria-current="page">لیست محصولات</li>
        </ol>
      </nav>
      {popup && <PriceListPopup id={selectItem} close={() => setPopup(false)} />}
      <section className="main-body-container rounded">
        <section className="d-flex justify-content-between align-items-center mt-1  mb-3 border-bottom pb-3" >
          <div className="col-md-6">
            <input type="text" onChange={(e: any) => setFilter(e.target.value)} placeholder='فیلتر براساس نام محصول، بارکد و یا سریال محصول ' className="form-control form-control-sm" />
          </div>
          <div className="d-flex gap-1">
            <Link href="/pb/productions/create" className="btn bg-success text-white btn-sm" >
              تعریف محصول میانی جدید
            </Link>
            <button type="button" onClick={async () => { await update() }} className="btn btn-sm bg-custom-1">بروزرسانی قیمت محصولات</button>
          </div>
        </section>
        <section className="table-responsive">
          <table className="table table-bordered table-sm table-striped">
            <thead>
              <tr>
                <th className="text-center">#</th>
                <th>نام محصول</th>
                <th>دسته بندی</th>
                <th>بارکد محصول</th>
                <th>آخرین قیمت</th>
                <th><i className="fa fa-dollar"></i> لیست قیمت</th>
                <th className=" text-center">
                  <i className="fa fa-cogs px-1"></i>تنظیمات
                </th>
              </tr>
            </thead>
            <tbody>
              {productions?.map((item: any, idx: number) => {
                if (item?.name?.includes(filter) || item?.barcode?.includes(filter) || item?.coding?.includes(filter)) {
                  return (<tr key={idx}>
                    <td className="text-center">{idx + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.categoryId?.name}</td>
                    <td>{item?.barcode}</td>
                    <td>{convertToPersianDate(item?.lastCostUpdate, 'YMD')}</td>
                    <td><button type="button" onClick={() => { setPopup(true); setSelectItem(item?._id) }} className='btn btn-sm bg-custom-2'>نمایش</button></td>
                    <td className="text-center">
                      <Link href={`/pb/productions/${item?._id}`} className="btn btn-sm bg-custom-4 ms-1" ><i className="fa fa-edit px-1"></i>ویرایش</Link>
                    </td>
                  </tr>)
                }
              })}
            </tbody>
          </table>
        </section>
      </section>
    </>
  );
}
