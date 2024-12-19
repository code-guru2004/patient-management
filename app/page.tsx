
import PatientForm from "@/components/forms/PatientForm";
import PassKeyModel from "@/components/PassKeyModel";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home({searchParams} : SearchParamProps) {
  const isAdmin = searchParams?.admin==='true'; 
  return (
    <div className="flex h-screen max-h-screen">
      {/* {otp verification } */}
      {
        isAdmin && <PassKeyModel/>
      }
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <Image
            src="/assets/icons/logo-full.svg"
            width={1000}
            height={1000}
            alt="patent"
            className="mb-12 h-10"
          />

          <PatientForm/>

          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © 2024 CarePluse
            </p>
            <Link href="/?admin=true" className="text-green-500">
              Admin
            </Link>
          </div>
        </div>
      </section>

      <Image
      src="/assets/images/onboarding-img.png"
      width={1000}
      height={1000}
      alt="patient"
      className="side-img max-w-[50%]"
      />
    </div>
  );
}