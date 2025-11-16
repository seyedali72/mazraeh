'use client'

import { signinAll, signupClient } from '@/app/action/auth.action'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '../../context/UserProvider'
import { toast } from 'react-toastify'

interface FormValues {
  mobile_number: string
  user_name: string
  clientName: string
  password: string
}

export default function LoginForm() {
  const {
    register,
    handleSubmit,
  } = useForm<FormValues>()
  const [state, setState] = useState<any>('')
  const searchParams = useSearchParams()
  let res = searchParams.get('state')
  const [securityCode, setSecurityCode] = useState('')
  const router = useRouter()
  const { updateUser } = useUser()
  const handleSignupUser = async (obj: any) => {
    if (state == 'signup') {
      let res = await signupClient(obj)
      if (res.error) {
        toast.error(res.error)
      } else {
        toast.success('ثبت نام شما با موفقیت انجام شد')
        updateUser(res)
        router.replace('/pb/dashboard')
      }
    } else {
      let result = await signinAll(obj)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('شما با موفقیت وارد شدید')
        updateUser(result)
        result.role === 1
          ? router.replace('/account/dashboard') // after login client admin
          : result.role === 2
            ? router.replace(`/crm/dashboard`) // after login client manager crm
            : result.role === 3
              ? router.replace(`/hrm/dashboard`) // after login client hrm user
              : result.role === 4
                ? router.replace(`/expert/dashboard`) // after login client expert user
                : result.role === 6
                  ? router.replace(`/employee/dashboard`) // after login employee user
                  : result.role === 8
                    ? router.replace(`/employer/dashboard`) // after login client hrm user
                    : router.replace('/account/experts') // after login admin
      }
    }

  }
  useEffect(() => {
    setState(res)
  }, [res])
  return (
    <div className='d-flex flex-column gap-3 py-5 px-5 justify-content-center align-items-center loginBackground' >
      {state !== 'signup' ?
        <div className={` w-50 p-4 rounded-2 bg-white `}>
          <div > <h5 className='mb-4 bg-custom-1 p-2 text-center rounded'>ورود به حساب کاربری</h5> </div>
          <form method="post" className='d-flex flex-column gap-3' onSubmit={handleSubmit(handleSignupUser)}>
            <div><label htmlFor=""> نام کاربری (شماره ملی)</label>
              <input className='form-control my-2' type="text" {...register('user_name')} /></div>
            <div><label htmlFor=""> رمز عبور (شماره موبایل)</label>
              <input className='form-control my-2' type="text" {...register('password')} /></div>
            <div><button className='w-100 py-2 border-0 rounded-2 text-white text-center bg-custom-2' type="submit"> ورود </button></div>
          </form>
          <div><button className='w-100 py-2 border-0 mt-2 rounded-2 text-white text-center bg-custom-4' type="button" onClick={() => { router.replace(`/auth/login?state=signup`) }}>ثبت نام</button></div>
        </div> :
        <div className='w-50 bg-white p-4 rounded-2'>
          <h5 className='mb-4 bg-custom-1 p-2 text-center rounded'>ثبت نام</h5>
          <form method="post" className='d-flex flex-column gap-3' onSubmit={handleSubmit(handleSignupUser)}>
            <div> <label htmlFor="">نام شرکت</label>
              <input className='form-control my-2' type="text" {...register('clientName')} /></div>
            <div> <label htmlFor="">نام کاربری</label>
              <input className='form-control my-2' type="text" {...register('user_name')} /></div>
            <div> <label htmlFor="">شماره موبایل</label>
              <input className='form-control my-2' type="number" {...register('mobile_number')} /></div>
            <div> <label htmlFor="">رمز عبور</label>
              <input className='form-control my-2' type="password" {...register('password')} /></div>
            <div> <label htmlFor="">کد امنیتی</label>
              <input className='form-control my-2' type="password" onChange={(e: any) => setSecurityCode(e.target.value)} /></div>
            <div><button className='w-100 py-2 border-0 mt-2 rounded-2 text-white text-center bg-custom-2' disabled={securityCode !== '123456'} type="submit">ثبت نام</button></div>
          </form>
          <div><button className='w-100 py-2 border-0 mt-2 rounded-2 text-white text-center bg-custom-4' type="button" onClick={() => { router.replace(`/auth/login`) }}>ورود</button></div>
        </div>}

    </div>
  )
}

