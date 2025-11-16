'use client'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useUser } from '@/app/context/UserProvider'
import { getFinalList } from '@/app/action/material.action'
import { getCategories } from '@/app/action/category.action'
import ProductionList from '@/app/components/FilterItem'
export default function FinalPrice() {
  const [productions, setProductions] = useState([])
  const [selectCat, setSelectCat] = useState<any>('')
  const [selectGroup, setSelectGroup] = useState<any>('')
  const [selectSubGroup, setSelectSubGroup] = useState<any>('')
  const [selectType, setSelectType] = useState<any>('')
  const { user } = useUser()
  const [categories, setCategories] = useState([])

  const [filter, setFilter] = useState('')
  const fetchData = useCallback(async () => {
    if (user?._id !== undefined) {
      let res = await getFinalList({ isDeleted: false })
      setProductions(res)
      let cats = await getCategories({ isDeleted: false })
      setCategories(cats)
    }
  }, [user])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/pb/dashboard">خانه</Link></li>
          <li className="breadcrumb-item active" aria-current="page">لیست قیمت محصولات</li>
        </ol>
      </nav>
      <section className="main-body-container rounded">
        <section className="d-flex flex-column justify-content-between align-items-center mt-1 gap-2 mb-3 border-bottom pb-3" >
          <div className="col-12 d-flex ">
            <div className="col-12 col-md-4 px-1">
              <input type="text" onChange={(e: any) => setFilter(e.target.value)} placeholder='فیلتر براساس نام محصول یا بارکد محصول ' className="form-control form-control-sm" />
            </div>
            <div className="col-12 col-md-4 px-1">
              <select className="form-control form-control-sm" value={selectType} onChange={(e: any) => { setSelectType(e.target.value) }}>
                <option value='' > فیلتر براساس نوع کالا</option>
                <option value='middle' > محصول میانی</option>
                <option value='final' > محصول نهایی</option>
                <option value='package' > بسته بندی</option>
              </select>
            </div>
          </div>
          <div className="col-12 d-flex ">
            <div className="col-12 col-md-4 px-1">
              <select className="form-control form-control-sm" value={selectCat} onChange={(e: any) => { setSelectCat(e.target.value), setSelectGroup(''), setSelectSubGroup('') }}>
                <option value='' > فیلتر براساس دسته کالا</option>
                {categories?.map((cat: any, idx: number) => { if (cat?.level == 1) { return (<option key={idx} value={cat?._id}>{cat?.name}</option>) } })}
              </select>
            </div>
            <div className="col-12 col-md-4 px-1">
              <select className="form-control form-control-sm" value={selectGroup} onChange={(e: any) => { setSelectGroup(e.target.value), setSelectSubGroup('') }}>
                <option value='' >فیلتر براساس گروه کالا</option>
                {categories?.map((cat: any, idx: number) => { if (cat?.level == 2) { if (cat?.parent?._id == selectCat) { return (<option key={idx} value={cat?._id}>{cat?.name}</option>) } } })}
              </select>
            </div>
            <div className="col-12 col-md-4 px-1">
              <select className="form-control form-control-sm" value={selectSubGroup} onChange={(e: any) => { setSelectSubGroup(e.target.value) }}>
                <option value='' >فیلتر براساس زیر گروه کالا</option>
                {categories?.map((cat: any, idx: number) => { if (cat?.level == 3) { if (cat?.parent?._id == selectGroup) { return (<option key={idx} value={cat?._id}>{cat?.name}</option>) } } })}
              </select>
            </div>
          </div>
        </section>
        <section className="table-responsive">

          <ProductionList productions={productions} categories={categories} filtered={{filter, selectCat, selectGroup, selectSubGroup}} type={selectType} />

        </section>
      </section>
    </>
  );
}
