'use client'
import { nanoid } from 'nanoid'
import { useEffect, useState } from 'react'
import { getDate } from '../action/report.action'
import { convertNumbersToEnglish, convertToPersianDate } from '../utils/helpers'

export default function DDDatePicker({ selectDate, type, date }: any) {
    const [toggle, setToggle] = useState(false)
    const [select, setSelect] = useState('')
    const [search, setSearch] = useState('')
    const [result, setResult] = useState([])

    const searchFetch = async () => {
        let result = await getDate({ isDeleted: false })
        setResult(result)
    }
    useEffect(() => { searchFetch() }, [])

    return (
        <div className='form-control form-control-sm p-0'>
            <div className='SearchBox w-100'>
                <form className='formBox bg-white d-flex rounded-2'>
                    <div className='dropdownBox position-relative w-100'>
                        <input type='text' value={date ? convertToPersianDate(date,'YMD') : select} onChange={(e: any) => setSelect(e.target.value)} placeholder={type} className='inputBoxSearch p-1' />
                        <div className={select.length > 4 ? 'dropdownresultbox' : 'd-none'}>
                            {result?.map((item: any) => {
                                let date = convertToPersianDate(item, 'YMD')
                                if (convertNumbersToEnglish(date).includes(select)) {
                                    return (
                                        <div onClick={() => { selectDate(item), setSelect('') }} key={nanoid()} className='resultItem d-flex justify-content-between text-dark' > {convertToPersianDate(item, 'YMD')} </div>
                                    )
                                }
                            })}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
