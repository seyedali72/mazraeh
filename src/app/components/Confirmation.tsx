import { toast } from 'react-toastify'

export function Confirmation({ onDelete,type = 'حذف' }: any) {
	return (
		<>
			<p className='toastifyText'>آیا میخواهید آیتم را {type} کنید؟</p>
			<div className='toastifyBtns justify-content-center'>
				<button className='btn btn-success' onClick={onDelete}>
					بله
				</button>
				<button className='btn btn-danger' onClick={() => toast.dismiss()}>
					خیر
				</button>
			</div>
		</>
	)
}
