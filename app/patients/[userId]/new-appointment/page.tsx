

import PatientForm from "@/components/forms/PatientForm";
import { Button } from "@/components/ui/button";
import { getPatient } from "@/lib/actions/patient.actions";
import Image from "next/image";
import Link from "next/link";
import * as Sentry from '@sentry/nextjs'
import AppointmentForm from "@/components/forms/AppointmentForm";

export default async function NewAppointment({ params: { userId } }: SearchParamProps) {
  const patient = await getPatient(userId);
      Sentry.metrics.set("user_view_register",patient?.name);
  return (
    <div className="flex h-screen max-h-screen"> 
      {/* {otp verification } */}
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image
            src="/assets/icons/logo-full.svg"
            width={1000}
            height={1000}
            alt="patent"
            className="mb-12 h-10"
          />

          <AppointmentForm
            type="create"
            userId={userId}
            patientId={patient?.$id}
            />

            <p className="justify-items-end text-dark-600 xl:text-left">
              © 2024 CarePluse
            </p>

        </div>
      </section>

      <Image
      src="/assets/images/appointment-img.png"
      width={1000}
      height={1000}
      alt="appointment"
      className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
}
