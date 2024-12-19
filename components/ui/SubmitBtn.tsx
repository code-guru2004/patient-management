import React, { ReactNode } from 'react'
import { Button } from './button'
import Image from 'next/image'


interface ButtonProps{
    isLoading: boolean
    className?: string 
    children: React.ReactNode
}
function SubmitBtn({isLoading , className , children} : ButtonProps) {
  return (
    <Button type='submit' disabled={isLoading} className={className ?? 'shad-primary-btn w-full'}>
        {
            isLoading ? (
                <div className='flex items-center gap-4'>
                    <Image
                        src={'/assets/icons/Loader.svg'}
                        alt='loading'
                        width={24}
                        height={24}
                        className='animate-spin'/>
                        Loading...
                </div>
            ) :
             children
        }
    </Button>
  )
}

export default SubmitBtn