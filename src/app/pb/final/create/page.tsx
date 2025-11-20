'use client'
import { useForm } from 'react-hook-form'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { Confirmation } from '@/app/components/Confirmation'
import { getMaterialsForCreateFianl } from '@/app/action/material.action'
import SearchMaterialComponent from '@/app/components/SearchMaterialComponent'
import { getCategories } from '@/app/action/category.action'
import SearchCategoryComponent from '@/app/components/SearchCategory'
import { spliteNumber } from '@/app/utils/helpers'
import { createPackage } from '@/app/action/package.action'

interface FormValues1 {
  name: string
  barcode: string
  coding: string
  unit: string
  over: string
  BPercent: number
  NPercent: number
  MNPercent: number
  MHPercent: number
  MCPercent: number
}
export default function CreatePackagePage() {
  const { handleSubmit, register, reset, setValue } = useForm<FormValues1>()
  const [mutated, setMutated] = useState(false)
  const [materials, setMaterils] = useState<any>([])
   const router = useRouter()
  const [items, setItems] = useState<any>([])
  const [categories, setCategories] = useState<any>([])
  const [category, setCategory] = useState<any>({})
  const [selecteds, setSelecteds] = useState<any>()

  const [percent, setPercent] = useState<any>(0)
  const [percents, setPercents] = useState<any>(0)
  const [lastPrice, setLastPrice] = useState<any>(0)
  const [lastPriceOver, setLastPriceOver] = useState<any>(0)
  const [newLevel, setNewLevel] = useState<number>(1)
  const [createBarcode, setCreateBarcode] = useState<string>('0')

  const handleCreatePackage = async (obj: any) => {
    if (items?.length < 2) { toast.warning('برای تعریف محصول حداقل دو قلم محصول باید انتخاب شود'); return }
    // if (typeProduct == undefined) { toast.warning('نوع محصول را مشخص نکرده اید'); return }
    obj.categoryId = category?._id
    let findCat: any = categories?.find((el: any) => el?._id?.toString() == obj.categoryId)
    let cloneSerial = obj.coding
    obj.coding = `${findCat?.serial}${cloneSerial}`
    obj.items = items
    obj.price = lastPrice
    obj.price_over = ((lastPriceOver * ((parseFloat(obj.over) + 100) / 100)))
    obj.type = 'final'
    obj.level = newLevel
    obj.lastCostUpdate = new Date()

    let res = await createPackage(obj)
    if (!res.error) {
      toast.success('انجام شده')
      setMutated(!mutated)
      reset()
      router.replace('/pb/package')
    } else {
      toast.error(res.error)
    }
  }
  const fetchData = useCallback(async () => {
    let res = await getMaterialsForCreateFianl({ isDeleted: false })
    setMaterils(res)
    let cats = await getCategories({ isDeleted: false, level: 3 })
    setCategories(cats)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])
  const handleDelete = async (code: any) => {
    let filter = items.filter((el: any) => el.uniCode !== code)
    let find = items.find((el: any) => el.uniCode == code)
    let minus = parseFloat(percents) - parseFloat(find.percent)
    setPercents(minus)
    setItems(filter)
  }

  const addToItems = () => {
    let dup = items.find((item: any) => item?.material == selecteds?._id)
    if (dup !== undefined) { toast.warning('این محصول را قبلا انتخاب کرده اید'); return }
    let uniCode = Date.now()
    let data = { material: selecteds?._id, percent: parseFloat(percent), uniCode }
    setItems([...items, data])
    selecteds?.level >= 0 ? newLevel >= selecteds?.level + 1 ? setNewLevel(newLevel) : setNewLevel(selecteds?.level + 1) : setNewLevel(selecteds?.level + 1)
    let price = selecteds.price * (parseFloat(percent))
    setLastPrice(price + lastPrice)
    let price_over = selecteds.price_over * (parseFloat(percent))
    setLastPriceOver(price_over + lastPriceOver)
    let plus = parseFloat(percents) + parseFloat(percent)
    setPercents(plus)
    setPercent(0); setSelecteds(null)
  }

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/pb/">خانه</Link></li>
          <li className="breadcrumb-item"> <Link href="/pb/package"> لیست محصولات نهایی</Link> </li>
          <li className="breadcrumb-item active" aria-current="page"> تعریف محصول جدید </li>
        </ol>
      </nav>
      <form action="post" onSubmit={handleSubmit(handleCreatePackage)} method='Post'>
        <section className="main-body-container rounded">
          <section className="row px-2">
            {/* <div className="col-12  col-md-3  mb-2 px-1">
              <label className='my-1' htmlFor="">نوع محصول </label>
              <select className="form-control form-control-sm" value={typeProduct} onChange={(e: any) => { setTypeProduct(e?.target?.value) }}  >
                <option value="" hidden>این محصول بازرگانی است یا بسته بندی</option>
                <option value="final">محصول بازرگانی</option>
                <option value="package">بسته بندی</option>
              </select>
            </div> */}
            <div className="col-12 col-md-4  mb-2 px-1">
              <label className='my-1' htmlFor="">دسته بندی </label>
              {category?._id !== undefined ?
                <div className="d-flex gap-1 align-items-center"><input className="form-control form-control-sm" type="text" disabled value={category?.name} />
                  <span className='btn btn-sm d-flex bg-custom-3 align-items-center' onClick={() => setCategory({})}><i className="fa fa-trash"></i></span></div>
                : <SearchCategoryComponent data={categories} forward={(e: any) => { setCategory(e), setCreateBarcode(`62662865${e.serial}`), setValue('barcode', `62662865${e.serial}`) }} />}
            </div>
            <div className="col-12 col-md-4 px-1 mb-2">
              <label className='my-1' htmlFor="">واحد اندازه گیری </label>
              <input type="text" placeholder='واحد اندازه گیری' className="form-control form-control-sm" {...register('unit', { required: 'واحد محصول را وارد کنید', })} />
            </div>
            <div className="col-12 col-md-4 px-1 mb-2">
              <label className='my-1' htmlFor="">عنوان بسته بندی </label>
              <input type="text" placeholder='عنوان بسته بندی' className="form-control form-control-sm" {...register('name', { required: 'نام محصول را وارد کنید', })} />
            </div>
            <div className="col-12 col-md-4 px-1 mb-2">
              <label className='my-1' htmlFor="">سریال بسته بندی </label>
              <input type="text" placeholder='سریال محصول' className="form-control form-control-sm" {...register('coding')} onBlur={(e: any) => { setValue('barcode', `${createBarcode}${e.target.value}`), setCreateBarcode(`${createBarcode}${e.target.value}`) }} />
            </div>
            <div className="col-12 col-md-4 px-1 mb-2">
              <label className='my-1' htmlFor="">بارکد بسته بندی </label>
              <input type="text" placeholder='بارکد بسته بندی' className="form-control form-control-sm" {...register('barcode', { required: 'بارکد بسته بندی را وارد کنید', })} />
            </div>
            <div className="col-12 col-md-4 px-1 mb-2">
              <label className='my-1' htmlFor="">درصد سربار بسته بندی </label>
              <input type="text" placeholder='درصد سربار بسته بندی' className="form-control form-control-sm" {...register('over', { required: 'درصد سربار بسته بندی را وارد کنید', })} />
            </div>
            <p className=' my-2 py-1 bg-custom-2 rounded'>درصد حاشیه سود فروش</p>
            <div className="col-12 col-md-2 px-1 mb-2 fs85">
              <label className='my-1' htmlFor="">شعب </label>
              <input type="number" placeholder='شعب' className="form-control form-control-sm" {...register('BPercent')} />
            </div>
            <div className="col-12 col-md-2 px-1 mb-2 fs85">
              <label className='my-1' htmlFor="">نمایندگان </label>
              <input type="number" placeholder='نمایندگان' className="form-control form-control-sm" {...register('NPercent')} />
            </div>
            <div className="col-12 col-md-2 px-1 mb-2 fs85">
              <label className='my-1' htmlFor="">مویرگی نقد </label>
              <input type="number" placeholder='مویرگی نقد' className="form-control form-control-sm" {...register('MNPercent')} />
            </div>
            <div className="col-12 col-md-2 px-1 mb-2 fs85">
              <label className='my-1' htmlFor="">مویرگی هفتگی </label>
              <input type="number" placeholder='مویرگی هفتگی' className="form-control form-control-sm" {...register('MHPercent')} />
            </div>
            <div className="col-12 col-md-2 px-1 mb-2 fs85">
              <label className='my-1' htmlFor="">مویرگی چکی </label>
              <input type="number" placeholder='مویرگی چکی' className="form-control form-control-sm" {...register('MCPercent')} />
            </div>
          </section>
          <button type='submit' className="btn btn-primary btn-sm px-5">ثبت</button>
        </section>
      </form>
      <section className="main-body-container rounded">
        <section className="row">
          <p className=' my-2 py-1 bg-custom-2 rounded'>تعریف اقلام تشکیل دهنده</p>
          <div className="col-12 col-md-3 px-1">
            <label className='my-1' htmlFor="">کد کالا  </label>
            <SearchMaterialComponent data={materials} forward={(e: any) => setSelecteds(e)} />
          </div>
          <div className="col-12 col-md-3 px-1">
            <label className='my-1' htmlFor="">کد کالا  </label>
            <input type="text" disabled placeholder="بارکد کالا بعد از انتخاب درج می شود" value={selecteds?.barcode || ''} className="form-control form-control-sm" />
          </div>
          <div className="col-12 col-md-3 px-1">
            <label className='my-1' htmlFor="">نام کالا  </label>
            <input type="text" disabled placeholder="نام کالا بعد از انتخاب درج می شود" value={selecteds?.name || ''} className="form-control form-control-sm" />
          </div>
          <div className="col-12 col-md-3 px-1">
            <label className='my-1' htmlFor=""> وزن مصرفی kg </label>
            {/* float input */}
            <input
              type="text"
              inputMode="decimal"
              value={percent} className="form-control form-control-sm"
              onChange={(e) => {
                let v: any = e.target.value.replace(',', '.');
                if (/^\d*\.?\d*$/.test(v)) {
                  if (v.split('.').length > 2) return;
                  setPercent(v);
                  if (v !== '' && v !== '.' && !isNaN(v) && v !== '0.') {
                    let value = parseFloat(v);
                    setPercent(value.toString());

                  }
                }
              }}
            />
          </div>


          <div className="col-12 my-2 px-1">
            <button type='button' onClick={() => { if (selecteds == null || parseFloat(percent) == 0) { return toast.error('انتخاب محصول و مقدار مصرف الزامیست') } else { addToItems() } }} className="btn bg-custom-1 btn-sm">افزودن به لیست</button>
          </div>
        </section>

        <section className="d-flex justify-content-between align-items-center   my-3 " >
          <section className="main-body-title">
            <h5 className="mb-0">لیست آیتم ها</h5>
          </section>
        </section>
        <section className="table-responsive">
          <table className="table table-sm table-bordered table-striped">
            <thead>
              <tr>
                <th className="text-center">#</th>
                <th>نام کالا</th>
                <th>بارکد</th>
                <th>مقدار مصرف</th>
                <th>قیمت</th>
                <th>قیمت کل</th>
                <th>نوع کالا</th>
                <th className=" text-center">
                  <i className="fa fa-edit px-1"></i>ویرایش
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: any, idx: number) => {
                let find = materials?.find((el: any) => el?._id == item?.material)
                return (<tr key={idx}>
                  <td className="text-center">{idx + 1}</td>
                  <td>{find.name}</td>
                  <td>{find.barcode}</td>
                  <td>{item?.percent}</td>
                  <td>{spliteNumber(find?.price_over?.toFixed())}</td>
                  <td>{spliteNumber(parseInt((parseFloat(find.price_over) * parseFloat(item?.percent)).toFixed()))}</td>
                  <td>{find.type == 'material' ? 'مواد اولیه' : find.type == 'middle' ? 'محصول میانی' : find.type == 'package' ? 'بسته بندی' : 'محصول بازرگانی'}</td>

                  <td className="text-center">
                    <button type="button" className="btn btn-sm bg-custom-3 ms-1" onClick={() => toast(<Confirmation onDelete={() => handleDelete(item?.uniCode)} />, { autoClose: false, })}>
                      <i className="fa fa-trash px-1"></i>حذف از لیست
                    </button>
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
