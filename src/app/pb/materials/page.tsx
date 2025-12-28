'use client'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useUser } from '../../context/UserProvider'
import { createMaterial, createProduct, editMaterial, getMaterials } from '@/app/action/material.action'
import UplaodMaterial from '@/app/components/material/MaterialPopup'
import { getCategories } from '@/app/action/category.action'
import { toast } from 'react-toastify'
import { spliteNumber } from '@/app/utils/helpers'
import { updateAllCosts } from '@/app/action/updatePrice.action'
import SearchCategoryComponent from '@/app/components/SearchCategory'
import Spinner from '@/app/components/Spinner'

export default function MaterialList() {
  const [materialList, setMaterialList] = useState([])
  const [categories, setCategories] = useState([])
  const [material, setMaterial] = useState<any>()
  const [price_over, setPrice_over] = useState('')
  const [loader, setLoader] = useState<boolean>(false)
  const [name, setName] = useState('')
  const [category, setCategory] = useState<any>()
  const [barcode, setBarcode] = useState('')
  const [coding, setCoding] = useState('')
  const [price, setPrice] = useState('')
  const [over, setOver] = useState('')
  const [unit, setUnit] = useState('')
  const [filter, setFilter] = useState('')
  const [mutated, setMutated] = useState(false)
  const [edited, setEdited] = useState(false)
  const [createPopup, setCreatePopup] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const { user } = useUser()
  const fetchList = useCallback(async () => {
    if (user?._id !== undefined) {
      let res = await getMaterials({ isDeleted: false, type: 'material' })
      setMaterialList(res)
      let cats = await getCategories({ isDeleted: false, level: 3 })
      setCategories(cats)
    }
  }, [user])


  useEffect(() => {
    fetchList()
  }, [fetchList, mutated])

  const handleEditMaterial = async () => {
    let data = { categoryId: category?._id, barcode, coding, price, over, price_over, unit, name }
    let res = await editMaterial(material?._id, data)
    if (!res?.error) { toast.success('تغییرات با موفقیت ثبت شد'); setEdited(false), setMutated((perv) => !perv) }
  }
  const handleCreateMaterial = async () => {
    let data = { categoryId: category?._id, barcode, coding, price, over, price_over, unit, name, type: 'material' }
    let res = await createProduct(data)
    if (!res?.error) { toast.success('ماده اولیه جدید با موفقیت ثبت شد'); setCreatePopup(false), setMutated((perv) => !perv) }
  }
  const selectMaterial = (item: any) => {
    setMaterial(item)
    setCategory(item.categoryId); setBarcode(item.barcode); setCoding(item.coding); setName(item.name);
    setPrice(item.price.toFixed()); setOver(item.over); setUnit(item.unit); setPrice_over(item?.price_over.toFixed(0))
  }
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
          <li className="breadcrumb-item"><Link href="/pb/">خانه</Link></li>
          <li className="breadcrumb-item active" aria-current="page">لیست مواد اولیه</li>
        </ol>
      </nav>
      <section className="main-body-container rounded">
        <section className="d-flex justify-content-between align-items-center mt-1  mb-3 border-bottom pb-3" >
          <div className="col-md-6">
            <input type="text" onChange={(e: any) => setFilter(e.target.value)} placeholder='فیلتر براساس نام کالا، بارکد یا زیرگروه کالا ' className="form-control form-control-sm" />
          </div>
          <div className='d-flex gap-1'>
            <button type="button" onClick={() => { setUploaded(true) }} className="btn btn-sm bg-custom-2">بارگذاری لیست قیمت جدید</button>
            <button type="button" onClick={async () => await update()} className="btn btn-sm bg-custom-1">بروزرسانی قیمت کالا</button>
            <button type="button" onClick={() => { setCreatePopup(true) }} className="btn btn-sm bg-custom-4">تعریف مواد اولیه جدید</button>

          </div>
        </section>
        {uploaded && <UplaodMaterial close={() => { setUploaded(!uploaded); setMutated(!mutated) }} />}
        {createPopup &&
          <div className="popupCustom">
            <section className="main-body-container rounded">
              <div className="d-flex justify-content-between border-bottom pb-1">
                <p className="mb-0 fs-6 fw-bold">تعریف مواد اولیه جدید </p>
                <button onClick={() => { setCreatePopup(false) }} className="btn btn-sm" type="button"><i className="fa fa-times"></i></button>
              </div>
              <div className="row">
                <div className="col-12">
                  <label className='my-1' htmlFor="">نام کالا </label>
                  <input type="text" placeholder="نام کالا را وارد کنید" value={name} className="form-control form-control-sm" onChange={(e: any) => setName(e.target.value)} />
                </div>
                <div className="col-12 col-lg-6">
                  <label className='my-1' htmlFor="">بارکد کالا </label>
                  <input type="text" placeholder="بارکد کالا را وارد کنید" value={barcode} className="form-control form-control-sm" onChange={(e: any) => setBarcode(e.target.value)} />
                </div>
                <div className="col-12 col-lg-6">
                  <label className='my-1' htmlFor="">هزینه تمام شده به ریال </label>
                  <input type="text" placeholder="هزینه تمام شده به ریال را وارد کنید" value={price} className="form-control form-control-sm" onChange={(e: any) => { setPrice(e.target.value); setPrice_over((e.target.value * ((parseFloat(over) + 100) / 100)).toFixed()) }} />
                </div>
                <div className="col-12 col-lg-6">
                  <label className='my-1' htmlFor="">درصد سربار </label>
                  <input type="text" placeholder="درصد سربار را وارد کنید" value={over} className="form-control form-control-sm" onChange={(e: any) => { setOver(e.target.value); setPrice_over((((parseFloat(e.target.value) + 100) / 100) * parseFloat(price)).toFixed()) }} />
                </div>
                <div className="col-12 col-lg-6">
                  <label className='my-1' htmlFor="">قیمت تمام شده به ریال</label>
                  <input type="text" disabled placeholder="قیمت تمام شده را وارد کنید" value={spliteNumber(parseFloat(price_over))} className="form-control form-control-sm" />
                </div>
                <div className="col-12 col-lg-6">
                  <label className='my-1' htmlFor="">واحد اندازه گیری </label>
                  <input type="text" placeholder="واحد اندازه گیری را وارد کنید" value={unit} className="form-control form-control-sm" onChange={(e: any) => setUnit(e.target.value)} />
                </div>
                <div className="col-12 col-lg-6">
                  <label className='my-1' htmlFor="">زیرگروه کالا </label>
                  {category?._id !== undefined ?
                    <div className="d-flex gap-1 align-items-center"><input className="form-control form-control-sm" type="text" disabled value={`${category?.name} - شماره سریال ${category?.serial}`} />
                      <span className='btn btn-sm d-flex bg-custom-3 align-items-center' onClick={() => setCategory({})}><i className="fa fa-trash"></i></span></div>
                    : <SearchCategoryComponent data={categories} forward={(e: any) => { setCategory(e) }} />}

                </div>
                <div className="col-12 col-lg-6">
                  <button className='btn btn-sm bg-custom-2 mt-2' type="button" onClick={() => handleCreateMaterial()}>ثبت</button>
                </div>
              </div>
            </section>
          </div>
        }
        {edited &&
          <div className="popupCustom">
            <section className="main-body-container rounded">
              <div className="d-flex justify-content-between border-bottom pb-1">
                <p className="mb-0 fs-6 fw-bold">ویرایش اطلاعات {material?.name} </p>
                <button onClick={() => { setEdited(false) }} className="btn btn-sm" type="button"><i className="fa fa-times"></i></button>
              </div>
              <div className="row">
                <div className="col-12">
                  <label className='my-1' htmlFor="">نام کالا </label>
                  <input type="text" placeholder="نام کالا را وارد کنید" value={name} className="form-control form-control-sm" onChange={(e: any) => setName(e.target.value)} />
                </div>
                <div className="col-12 col-lg-6">
                  <label className='my-1' htmlFor="">بارکد کالا </label>
                  <input type="text" placeholder="بارکد کالا را وارد کنید" value={barcode} className="form-control form-control-sm" onChange={(e: any) => setBarcode(e.target.value)} />
                </div>
                <div className="col-12 col-lg-6">
                  <label className='my-1' htmlFor="">هزینه تمام شده به ریال </label>
                  <input type="text" placeholder="هزینه تمام شده به ریال را وارد کنید" value={price} className="form-control form-control-sm" onChange={(e: any) => { setPrice(e.target.value); setPrice_over((e.target.value * ((parseFloat(over) + 100) / 100)).toFixed()) }} />
                </div>
                <div className="col-12 col-lg-6">
                  <label className='my-1' htmlFor="">درصد سربار </label>
                  <input type="text" placeholder="درصد سربار را وارد کنید" value={over} className="form-control form-control-sm" onChange={(e: any) => { setOver(e.target.value); setPrice_over((((parseFloat(e.target.value) + 100) / 100) * parseFloat(price)).toFixed()) }} />
                </div>
                <div className="col-12 col-lg-6">
                  <label className='my-1' htmlFor="">قیمت تمام شده به ریال</label>
                  <input type="text" disabled placeholder="قیمت تمام شده را وارد کنید" value={spliteNumber(parseFloat(price_over))} className="form-control form-control-sm" />
                </div>
                <div className="col-12 col-lg-6">
                  <label className='my-1' htmlFor="">واحد اندازه گیری </label>
                  <input type="text" placeholder="واحد اندازه گیری را وارد کنید" value={unit} className="form-control form-control-sm" onChange={(e: any) => setUnit(e.target.value)} />
                </div>
                <div className="col-12 col-lg-6">
                  <label className='my-1' htmlFor="">زیرگروه کالا </label>
                  {category?._id !== undefined ?
                    <div className="d-flex gap-1 align-items-center"><input className="form-control form-control-sm" type="text" disabled value={`${category?.name} - شماره سریال ${category?.serial}`} />
                      <span className='btn btn-sm d-flex bg-custom-3 align-items-center' onClick={() => setCategory({})}><i className="fa fa-trash"></i></span></div>
                    : <SearchCategoryComponent data={categories} forward={(e: any) => { setCategory(e) }} />}

                </div>
                <div className="col-12 col-lg-6">
                  <button className='btn btn-sm bg-custom-2 mt-2' type="button" onClick={() => handleEditMaterial()}>ثبت تغییرات</button>
                </div>
              </div>
            </section>
          </div>
        }
        <section className="table-responsive">
          <table className="table table-bordered table-sm table-striped">
            <thead>
              <tr>
                <th className="text-center">#</th>
                <th>نام کالا</th>
                <th>بارکد</th>
                <th>قیمت به ریال</th>
                <th>زیرگروه کالا</th>
                <th className=" text-center">ویرایش </th>
              </tr>
            </thead>
            <tbody>
              {materialList.map((item: any, idx: number) => {
                if (item.name.includes(filter) || item.barcode.includes(filter)) {
                  return (<tr key={idx}>
                    <td className='text-center'>{idx + 1}</td>
                    <td className='text-end' >{item.name} </td>
                    <td className='text-start'>{item.barcode}</td>
                    <td className='text-start'>{spliteNumber(item.price.toFixed())}</td>
                    <td className='text-end'>{item.categoryId?.name}</td>
                    <td> <button type="button" className="btn btn-sm bg-custom-4 ms-1" onClick={() => { selectMaterial(item); setEdited(true) }}> <i className="fa fa-edit px-1"></i>ویرایش </button></td>
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
