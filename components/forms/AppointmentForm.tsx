"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {Form} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CustomFormField from "../CustomFormField";
import SubmitBtn from "../ui/SubmitBtn";
import { useState } from "react";

import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patient.actions";
import { CreateAppointmentSchema, formSchema, getAppointmentSchema } from "@/lib/validation";
import { FormFieldType } from "./PatientForm";
import Image from "next/image";
import { SelectItem } from "../ui/select";
import { Doctors } from "@/constants";
import { createAppointment, updateAppointment } from "@/lib/actions/appointment.actions";
import { Appointment } from "@/types/appwrite.types";


const AppointmentForm = ({userId,patientId,type= "create",appointment,setOpen}: { userId: string; patientId:string; type:"create"|"cancel"|"schedule";
  appointment?:Appointment;
  setOpen: (open: boolean)=>void;
}) => {
    const router = useRouter();
    const [isLoading , setIsLoading] = useState(false)
    const AppointmentFormValidation = getAppointmentSchema(type)
  // 1. Define your form.
  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment ? appointment.primaryPhysician :"",
      schedule: appointment ? new Date(appointment.schedule) : new Date(Date.now()),
      note:appointment? appointment.note : "",
      reason: appointment ? appointment.reason : "" ,
      cancellationReason: appointment?.cancellationReason || "",
    },
  });


  let buttonLabel;
  switch (type) {
    case "cancel":
      buttonLabel="Cancel Appointment"
    
      case "create":
      buttonLabel="Get Appointment"
      
      case "schedule":
        buttonLabel="Schedule Appointment"
  }
  // 2. Define a submit handler.
  const onSubmit = async (
    values: z.infer<typeof AppointmentFormValidation>
  ) => {
    setIsLoading(true);
    let status;

    switch (type) {
      case "schedule":
        status='scheduled'
        break;
      case "cancel":
        status='cancelled'
        break;
      default:
        status='pending'
        break;
    }
    try {
        if(type==="create" && patientId){
          
          
          const appointmentData = {
            userId,
            patient: patientId,
            primaryPhysician: values.primaryPhysician,
            schedule: new Date(values.schedule),
            reason: values.reason!,
            note: values.note,
            status: status as Status,
          }
          const appointment = await createAppointment(appointmentData);
          if(appointment){
            form.reset();
            router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`)
          }
        }else{
          const appointmentToUpdate = {
            userId,
            appointmentId: appointment?.$id!,
            appointment:{
              primaryPhysician: values?.primaryPhysician,
              schedule: new Date(values?.schedule),
              status:status as Status,
              cancellationReason: values?.cancellationReason,
            },
            type
          }

          const updatedAppointment = await updateAppointment(appointmentToUpdate);

          if(updatedAppointment){
            setOpen && setOpen(false);
            form.reset()
          }
        }

    } catch (error) {
        console.log(error);
        
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
          { type==='create' &&
            <section className="mb-12 space-y-4">
                <h1 className="header">New Appointment 👨🏻‍⚕</h1>
                <p className="text-dark-700">Request  a  new  appointment  in  less  than  1 minute</p>
            </section>
          }
          {type !=="cancel" && (
            <>
              {/* select doctors */}
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="primaryPhysician"
            label="Doctor"
            placeholder="Select Doctor"
          >
            {Doctors.map((doctor) => (
              <SelectItem key={doctor.name} value={doctor.name}>
                <div className="flex  gap-6 xl:flex-row hover:text-slate-500 cursor-pointer justify-center items-center">
                  <Image
                    src={doctor.image}
                    alt="doctor"
                    width={32}
                    height={32}
                    className="rounded-full border border-dark-500 md:w-8"
                  />
                  <p>{doctor.name}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>

          <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Date For Appointment  (Note: MM/DD/YYYY )"
              placeholder="Select a date (MM/DD/YYYY)"
              showTimeSelect
              dateFormat="MM/dd/yyyy - h:mm aa"
            />

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="reason"
              label="Reason For Appointment"
              placeholder="Enter  your  Appointment Reason"
            />
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="note"
              label="Notes (If any)"
              placeholder="Any Note..."
            />
          </div>
            </>
          )}
          
          {type==="cancel" && (
             <CustomFormField
             fieldType={FormFieldType.TEXTAREA}
             control={form.control}
             name="cancellationReason"
             label="Reason For Cancellation"
             placeholder="Enter reason for cancellation"
           />
          )}

          <SubmitBtn isLoading={isLoading} className={`${type === 'cancel' ? "shad-danger-btn": 'shad-primary-btn'} w-full`} >{buttonLabel}</SubmitBtn>
        </form>
      </Form>
    </div>
  );
};
export default AppointmentForm;
