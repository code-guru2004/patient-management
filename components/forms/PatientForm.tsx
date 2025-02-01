"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {Form} from "@/components/ui/form";

import CustomFormField from "../CustomFormField";
import SubmitBtn from "../ui/SubmitBtn";
import { useState } from "react";

import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patient.actions";
import { formSchema } from "@/lib/validation";

export enum FormFieldType {
    INPUT = 'input',
    TEXTAREA='textarea',
    PHONE_INPUT='phoneInput',
    CHECKBOX='checkbox',
    DATE_PICKER='datePicker',
    SELECT='select',
    SKLETON='skleton',
}

const PatientForm = () => {
    const router = useRouter();
    const [isLoading , setIsLoading] = useState(false)
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email:"",
      phone:""
    },
  });

  // 2. Define a submit handler.
 async function onSubmit({name , email ,phone}: z.infer<typeof formSchema>) {
   
    setIsLoading(true)
     //console.log({name , email ,phone});
    try {
        const userData = {name , email ,phone};
        const user = await  createUser(userData);
        
        if(user){
            //console.log(user);
            
            router.push(`/patients/${user.$id}/register`)
        }
    } catch (error) {
        console.log(error);
        
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
            <section className="mb-12 space-y-4">
                <h1 className="header">Hi there 👋</h1>
                <p className="text-dark-700">Schedule your first appoitment</p>
            </section>
          
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            label="Full Name"
            placeholder="Enter  your  name"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
           />

            <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            label="Email"
            placeholder="Enter  your  email"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
           />
           <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="phone"
            label="Phone Number"
            placeholder="Enter your phone number"
           />

          <SubmitBtn isLoading={isLoading}>Get Started</SubmitBtn>
        </form>
      </Form>
    </div>
  );
};
export default PatientForm;
