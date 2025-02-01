
import RegisterForm from '@/components/forms/RegisterForm'
import { getUser } from '@/lib/actions/patient.actions'
import Image from 'next/image'
import React from 'react'
import * as Sentry from '@sentry/nextjs'
async function Register( { params : { userId } } : SearchParamProps) {

    const user = await getUser(userId)

    Sentry.metrics.set("user_view_register",user?.name);
    
  return ( 
    <div className="flex h-screen max-h-screen pb-4">

    <section className="remove-scrollbar container">
      <div className="sub-container max-w-[860px]">
        <Image
          src="/assets/icons/logo-full.svg"
          width={1000}
          height={1000}
          alt="patent"
          className="mb-12 h-10"
        />

   
        <RegisterForm user={user}/>


        <div className="text-14-regular mt-10 flex justify-center">
          <p className="justify-items-end text-dark-600 xl:text-left">
            © 2024 CarePluse | T&C applied
          </p>
         
        </div>
      </div>
    </section>

    <Image
    src="/assets/images/register-img.png"
    width={1000}
    height={1000}
    alt="patient"
    className="side-img max-w-[390px]"
    />
  </div>
  )
}

export default Register