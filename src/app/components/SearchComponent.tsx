'use client'
import Link from 'next/link'

import { nanoid } from 'nanoid'
import { useEffect, useState } from 'react'

export default function SearchComponent({ data, forward }: any) {
	const [toggle, setToggle] = useState(false)
	const [select, setSelect] = useState('کالا')
	const [search, setSearch] = useState('')
	const [selecteds, setSelecteds] = useState<any>([])

	useEffect(() => {

	}, [search])

	return (
		<div className='component'>
			<div className='SearchBox'>
				<div className='formBox bg-white d-flex gap-1'>
					<div className='dropdownBox position-relative w-100'>
						<input type='text' value={search} onChange={(e) => setSearch(e.target.value)} placeholder='دنبال چی میگردی' className='inputBoxSearch' />
						<div className={search.length > 1 ? 'dropdownresultbox' : 'd-none'}>
							{data?.map((el: any) => {
								if (el?.includes(search)) {
									return (
										<span onClick={() => { selecteds?.includes(el) ? setSelecteds(selecteds.filter((item: any) => item !== el)) : setSelecteds([...selecteds, el]) }} key={nanoid()} className='resultItem d-flex justify-content-start text-dark' >
											{selecteds?.includes(el) ? <input type="checkbox" checked /> : <input type="checkbox" />}	{el}
											{/* <span className='sub'> دسته بندی:{' '} <b className='text-danger'> {select === 'کالا' ? el?.categories?.name : el?.categories[0]?.name} </b> </span> */}
										</span>
									)
								}
							})}
						</div>
					</div>
					<button type="button" onClick={() => { setSearch(''), forward(selecteds) }} className="btn btn-sm bg-custom-2 fs75">انتخاب</button>
				</div>
			</div>
		</div>
	)
}
