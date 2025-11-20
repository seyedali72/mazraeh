'use client'

import { nanoid } from 'nanoid'
import { useEffect, useState } from 'react'

export default function SearchMaterialComponent({ data, forward }: any) {

	const [search, setSearch] = useState('')

	useEffect(() => {

	}, [search])
	return (
		<div className='component'>
			<div className='SearchBox'>
				<div className='formBox bg-white d-flex gap-1'>
					<div className='dropdownBox position-relative w-100'>
						<input type='text' value={search} onChange={(e) => setSearch(e.target.value)} placeholder='بارکد یا نام کالا را وارد کنید' className='inputBoxSearch' />
						{search.length > 2 && <div className={'dropdownresultbox table-responsive'}>
							<table className="table table-sm table-bordered table-striped fs80 mb-0">
								<thead>
									<tr><th>نام</th><th>بارکد</th><th>قیمت</th><th>نوع محصول</th></tr>
								</thead>
								<tbody>
									{data?.map((el: any) => {
										if (el?.barcode?.includes(search) || el?.name?.includes(search)) {
											return (
												<tr className='cursorPointer' onClick={() => { forward(el); setSearch('') }} key={nanoid()}   >
													<td>{el?.name}</td><td>{el?.barcode}</td><td>{el?.price}</td>
													<td>{el.type == 'material' ? 'مواد اولیه' : el.type == 'middle' ? 'محصول میانی' : el.type == 'package' ? 'بسته بندی' : 'محصول بازرگانی'}</td>

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
