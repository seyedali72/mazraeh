'use client'
import { useForm } from 'react-hook-form'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { Confirmation } from '@/app/components/Confirmation'
import { getMaterialsForCreateConvert } from '@/app/action/material.action'
import SearchMaterialComponent from '@/app/components/SearchMaterialComponent'
import { getCategories } from '@/app/action/category.action'
import SearchCategoryComponent from '@/app/components/SearchCategory'
import { spliteNumber } from '@/app/utils/helpers'
import { editPackage, getSinglePackage } from '@/app/action/package.action'

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
export default function EditConvert() {
  const [mutated, setMutated] = useState(false)
  const [materials, setMaterils] = useState<any>([])
  const router = useRouter()
  const { id }: any = useParams()
  const [items, setItems] = useState<any>([])
  const [categories, setCategories] = useState<any>([])
  const [category, setCategory] = useState<any>({})
  const [selecteds, setSelecteds] = useState<any>()
  const [single, setSingle] = useState<any>()
  const [percent, setPercent] = useState<any>(0)
  const [percents, setPercents] = useState<any>(100)
  const [lastPrice, setLastPrice] = useState<any>(0)
  const [lastPriceOver, setLastPriceOver] = useState<any>(0)
  const [newLevel, setNewLevel] = useState<number>(1)
  const [createBarcode, setCreateBarcode] = useState<string>('0')
  const [edited, setEdited] = useState(false)

  const fetchData = useCallback(async () => {
    let single = await getSinglePackage(id)
    setSingle(single)
    setItems(single?.items)
    let res = await getMaterialsForCreateConvert({ isDeleted: false, _id: { $ne: id } })
    setMaterils(res)
    let cats = await getCategories({ isDeleted: false })
    setCategories(cats)
    setNewLevel(single?.level)
    setCategory(single?.categoryId)
    let newPrice = 0
    let newPrice_over = 0
    single?.items?.map((item: any) => {
      let price = item.material.price * (parseFloat(item.percent))
      let price_over = item.material.price_over * (parseFloat(item.percent))
      newPrice += price
      newPrice_over += price_over
    })
    setLastPrice(newPrice)
    setLastPriceOver(newPrice_over)
  }, [id])

  const { handleSubmit, register, reset, setValue } = useForm<FormValues1>({
    values: {
      name: single?.name,
      barcode: single?.barcode,
      coding: single?.coding,
      unit: single?.unit,
      over: single?.over,
      BPercent: single?.BPercent,
      NPercent: single?.NPercent,
      MNPercent: single?.MNPercent,
      MHPercent: single?.MHPercent,
      MCPercent: single?.MCPercent,
    }
  })

  const handleEditPackage = async (obj: any) => {
    // if (typeProduct == undefined) { toast.warning('نوع محصول را مشخص نکرده اید'); return }
    if (items?.length < 1) { toast.warning('برای تعریف محصول حداقل یک قلم محصول باید انتخاب شود'); return }
    obj.items = items
    obj.categoryId = category?._id
    obj.price = lastPrice
    obj.price_over = ((lastPriceOver * ((parseFloat(obj.over) + 100) / 100)))
    obj.level = newLevel
    let res = await editPackage(id, obj)
    if (!res.error) {
      toast.success('انجام شده')
      setMutated(!mutated)
      reset()
      router.replace('/pb/converts')
    } else {
      toast.error(res.error)
    }
  }

  useEffect(() => { fetchData() }, [fetchData])
  const handleDelete = async (code: any) => {
    let filter = items.filter((el: any) => el.uniCode !== code)
    let find = items.find((el: any) => el.uniCode == code)

    let price = find?.material.price * (parseFloat(find?.percent))
    setLastPrice(lastPrice - price)
    let price_over = find?.material.price_over * (parseFloat(find?.percent))
    setLastPriceOver(lastPriceOver - price_over)

    setItems(filter)
  }

  const handleEdited = (code: any) => {
    let filter = items.filter((el: any) => el.uniCode !== code)
    let find = items.find((el: any) => el.uniCode == code)
    let id = (find?.material?._id !== undefined ? find?.material?._id : find?.material)
    let findMaterial = materials.find((el: any) => el._id.toString() == id)
    let minus = parseFloat(percents.toFixed(5)) - parseFloat(find.percent)
    setPercents(minus)
    setSelecteds(findMaterial)
    setEdited(true)
    setPercent(parseFloat(find?.percent).toFixed(5))
    setItems(filter)
  }
  const addToItems = () => {
    let dup = items.find((item: any) => item?.material == selecteds?._id)
    if (dup !== undefined) { toast.warning('این آیتم را قبلا انتخاب کرده اید'); return }
    let uniCode = Date.now()
    let data = { material: selecteds?._id, percent: parseFloat(percent), uniCode }
    setItems([...items, data])
    selecteds?.level >= 0 ? newLevel >= selecteds?.level + 1 ? setNewLevel(newLevel) : setNewLevel(selecteds?.level + 1) : setNewLevel(selecteds?.level + 1)
    let price = selecteds.price * (parseFloat(percent))
    setLastPrice(price + lastPrice)
    let price_over = selecteds.price_over * (parseFloat(percent))
    setLastPriceOver(price_over + lastPriceOver)
    setEdited(false)

    let plus = parseFloat(percents) + parseFloat(percent)
    setPercents(plus)
    setPercent(0); setSelecteds(null)
  }

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/pb/">خانه</Link></li>
          <li className="breadcrumb-item"> <Link href="/pb/converts"> لیست محصولات تبدیلی</Link> </li>
          <li className="breadcrumb-item active" aria-current="page"> ویرایش محصول </li>
        </ol>
      </nav>
      {edited &&
        <div className="popupCustom">
          <section className="main-body-container rounded w-50 mx-auto">
            <div className="d-flex justify-content-between border-bottom pb-1">
              <p className="mb-0 fs-6 fw-bold borderright">ویرایش آیتم </p>
              <button onClick={() => { setEdited(false) }} className="btn btn-sm" type="button"><i className="fa fa-times"></i></button>
            </div>
            <section className="d-fle flex-column">

              <div className="col-12 px-1">
                <label className='my-1' htmlFor="">کد کالا  </label>
                <input type="text" disabled placeholder="بارکد کالا بعد از انتخاب درج می شود" value={selecteds?.barcode || ''} className="form-control form-control-sm" />
              </div>
              <div className="col-12 px-1">
                <label className='my-1' htmlFor="">نام کالا  </label>
                <input type="text" disabled placeholder="نام کالا بعد از انتخاب درج می شود" value={selecteds?.name || ''} className="form-control form-control-sm" />
              </div>
              <div className="col-12 px-1">
                <label className='my-1' htmlFor=""> مقدار یا وزن مصرفی </label>
                {/* float input */}
                <input type="text" inputMode="decimal" value={percent} className="form-control form-control-sm"
                  onChange={(e) => {
                    let v: any = e.target.value.replace(',', '.');
                    if (/^\d*\.?\d*$/.test(v)) {
                      if (v.split('.').length > 2) return;
                      setPercent(v);
                      if (v !== '' && v !== '.' && !isNaN(v) && v !== '0.') {
                        let value = parseFloat(v);

                        if (value > 9999100.222) {
                          toast.warning(`میزان وزن باقی مانده جهت استفاده در ترکیب ${9999100.222} کیلو گرم`);

                          setPercent(9999100.222.toString());
                        }
                      }
                    }
                  }}
                  onBlur={() => {
                    if (percent && !isNaN(parseFloat(percent))) {
                      const num = parseFloat(percent);

                      if (num > 9999100.22) {
                        setPercent(9999100.22.toFixed(5));
                        toast.warning(`میزان وزن باقی مانده جهت استفاده در ترکیب ${9999100.22} کیلو گرم`);
                      } else {
                        setPercent(num.toString());
                      }
                    } else if (percent === '' || percent === '.') {
                      setPercent('0');
                    }
                  }}
                />
              </div>


              <div className="col-12 mt-2 px-1">
                <button type='button' onClick={() => { if (selecteds == null || parseFloat(percent) == 0) { return toast.error('انتخاب محصول و درصد مصرف الزامیست') } else { addToItems() } }} className="btn bg-custom-1 btn-sm">افزودن به لیست</button>
              </div>
            </section>
          </section>
        </div>
      }
      <form action="post" onSubmit={handleSubmit(handleEditPackage)} method='Post'>
        <section className="main-body-container rounded">
          <section className="row px-2">
            {/* <div className="col-12  col-md-3  mb-2 px-1">
              <label className='my-1' htmlFor="">نوع محصول </label>
              <select className="form-control form-control-sm" value={typeProduct} onChange={(e: any) => { setTypeProduct(e?.target?.value) }}  >
                <option value="" hidden>این محصول میانی است یا نهایی</option>
                <option value="final">محصول بازرگانی</option>
                <option value="package">بسته بندی</option>
              </select>
            </div> */}
            <div className="col-12 col-md-4 px-1 mb-2">
              <label className='my-1' htmlFor="">عنوان </label>
              <input type="text" placeholder='عنوان' className="form-control form-control-sm" {...register('name', { required: 'عنوان را وارد کنید', })} />
            </div>
            <div className="col-12 col-md-4  mb-2 px-1">
              <label className='my-1' htmlFor="">دسته بندی </label>
              {category?._id !== undefined ?
                <div className="d-flex gap-1 align-items-center"><input className="form-control form-control-sm" type="text" disabled value={category?.name} />
                  <span className='btn btn-sm d-flex bg-custom-3 align-items-center' onClick={() => setCategory({})}><i className="fa fa-trash"></i></span></div>
                : <SearchCategoryComponent data={categories} forward={(e: any) => { setCategory(e), setCreateBarcode(`62662865${e.serial}`), setValue('barcode', `62662865${e.serial}`) }} />}
            </div>
            <div className="col-12 col-md-4 px-1 mb-2">
              <label className='my-1' htmlFor="">واحد اندازه گیری </label>
              <input type="text" placeholder='واحد اندازه گیری' className="form-control form-control-sm" {...register('unit', { required: 'واحد بسته بندی را وارد کنید', })} />
            </div>
            <div className="col-12 col-md-4 px-1 mb-2">
              <label className='my-1' htmlFor="">سریال بسته بندی </label>
              <input type="text" placeholder='سریال بسته بندی' className="form-control form-control-sm" {...register('coding')} onBlur={(e: any) => { setValue('barcode', `${createBarcode}${e.target.value}`), setCreateBarcode(`${createBarcode}${e.target.value}`) }} />
            </div>
            <div className="col-12 col-md-4 px-1 mb-2">
              <label className='my-1' htmlFor="">بارکد </label>
              <input type="text" placeholder='بارکد' className="form-control form-control-sm" {...register('barcode', { required: 'بارکد را وارد کنید', })} />
            </div>
            <div className="col-12 col-md-4 px-1 mb-2">
              <label className='my-1' htmlFor="">درصد سربار </label>
              <input type="text" placeholder='درصد سربار' className="form-control form-control-sm" {...register('over', { required: 'درصد سربار را وارد کنید', })} />
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
          <button type='submit' className="btn btn-primary btn-sm px-5">ثبت تغییرات</button>
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
            <label className='my-1' htmlFor=""> مقدار مصرفی در بسته  </label>
            {/* float input */}
            <input type="text" inputMode="decimal" value={percent} className="form-control form-control-sm"
              onChange={(e) => {
                let v: any = e.target.value.replace(',', '.');
                if (/^\d*\.?\d*$/.test(v)) {
                  if (v.split('.').length > 2) return;
                  setPercent(v);
                  if (v !== '' && v !== '.' && !isNaN(v) && v !== '0.') {
                    let value = parseFloat(v);

                    if (value > 9999100.222) {
                      toast.warning(`میزان وزن باقی مانده جهت استفاده در ترکیب ${9999100.222} کیلو گرم`);

                      setPercent(9999100.222.toString());
                    }
                  }
                }
              }}
              onBlur={() => {
                if (percent && !isNaN(parseFloat(percent))) {
                  const num = parseFloat(percent);

                  if (num > 9999100.22) {
                    setPercent(9999100.22.toFixed(5));
                    toast.warning(`میزان وزن باقی مانده جهت استفاده در ترکیب ${9999100.22} کیلو گرم`);
                  } else {
                    setPercent(num.toString());
                  }
                } else if (percent === '' || percent === '.') {
                  setPercent('0');
                }
              }}
            />
          </div>


          <div className="col-12 my-2 px-1">
            <button type='button' onClick={() => { if (selecteds == null || parseFloat(percent) == 0) { return toast.error('انتخاب بسته بندی و مقدار مصرف الزامیست') } else { addToItems() } }} className="btn bg-custom-1 btn-sm">افزودن به لیست</button>
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
                <th>قیمت به ریال</th>
                <th>قیمت کل</th>
                <th>نوع کالا</th>
                <th className=" text-center">
                  <i className="fa fa-edit px-1"></i>ویرایش
                </th>
              </tr>
            </thead>
            <tbody>
              {items?.map((item: any, idx: number) => {
                let find = item?.material?._id == undefined ? materials?.find((el: any) => el?._id == item?.material) : item?.material

                return (<tr key={idx}>
                  <td className="text-center">{idx + 1}</td>
                  <td>{find?.name}</td>
                  <td>{find?.barcode}</td>
                  <td>{item?.percent.toFixed(5)} </td>
                  <td>{spliteNumber(find?.price_over?.toFixed())}</td>
                  <td>{spliteNumber(parseInt((find?.price_over * (parseFloat(item?.percent))).toFixed(5)))}</td>
                  <td>{find?.type == 'material' ? 'مواد اولیه' : find?.type == 'middle' ? 'محصول میانی' : find?.type == 'convert' ? 'محصول تبدیلی': find?.type == 'convert' ? 'محصول تبدیلی' : find?.type == 'package' ? 'بسته بندی' : 'محصول بازرگانی'}</td>

                  <td className="text-center">
                    <button type="button" className="btn btn-sm bg-custom-4 ms-1" onClick={() => toast(<Confirmation type='ویرایش' onDelete={() => handleEdited(item?.uniCode)} />, { autoClose: false })}>
                      <i className="fa fa-edit px-1"></i> ویرایش
                    </button>
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
