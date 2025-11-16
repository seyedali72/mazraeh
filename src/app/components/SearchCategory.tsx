'use client'

import { nanoid } from 'nanoid'
import { useEffect, useState } from 'react'

export default function SearchCategoryComponent({ data, forward }: any) {

	const [search, setSearch] = useState('')

	useEffect(() => {

	}, [search])
	return (
		<div className='component'>
			<div className='SearchBox'>
				<div className='formBox bg-white d-flex gap-1'>
					<div className='dropdownBox position-relative w-100'>
						<input type='text' value={search} onChange={(e) => setSearch(e.target.value)} placeholder='نام یا سریال دسته بندی را وارد کنید' className='inputBoxSearch' />
						{search.length > 0 && <div className={'dropdownresultbox table-responsive'}>
							<table className="table table-sm table-bordered table-striped fs80 mb-0">
								<thead>
									<tr><th>عنوان</th><th>سریال</th><th>عنوان بالادستی</th></tr>
								</thead>
								<tbody>
									{data?.map((el: any) => {
										if (el?.name?.includes(search) || el?.serial?.includes(search)) {
											return (
												<tr className='cursorPointer' onClick={() => { forward(el); setSearch('') }} key={nanoid()}   >
													<td>{el?.name}</td><td>{el?.serial}</td><td>{el?.parent?.name}</td>
												</tr>
											)
										}
									})}
								</tbody>
							</table>
						</div>}
					</div>
				</div>
			</div>
		</div>
	)
}
