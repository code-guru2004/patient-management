"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl } from "@/components/ui/form";

import CustomFormField from "../CustomFormField";
import SubmitBtn from "../ui/SubmitBtn";
import { useState } from "react";
import { formSchema, PatientFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser, registerPatient } from "@/lib/actions/patient.actions";
import { FormFieldType } from "./PatientForm";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants";
import { Label } from "../ui/label";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import { FileUploader } from "../FileUploader";


const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
        ...PatientFormDefaultValues,
      name: "",
      email: "",
      phone: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    setIsLoading(true);
    //console.log({name , email ,phone});
    let formData;
    if( values.identificationDocument &&
        values.identificationDocument?.length > 0 ){
            const blobFile = new Blob([values.identificationDocument[0]] , {
                type: values.identificationDocument[0].type,
            })

            formData = new FormData();
            formData.append('blobed' , blobFile);
            formData.append('fileName',values.identificationDocument[0].name)
        }
    try {
        const patientData = {
            ...values,
            userId: user.$id,
            birthDate: new Date(values.birthDate),
            identificationDocument: formData
        }

        //@ts-ignore
        const patient = await registerPatient(patientData);

        if(patient){
            router.push(`/patients/${user.$id}/new-appointment`);
        }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-12 flex-1"
        >
          <section className="space-y-4">
            <h1 className="header">Welcome 👋</h1>
            <p className="text-dark-700">Let us know more about yourself.</p>
          </section>

          <section className="space-y-4">
            <div className="mb-9 space-y-1">
              <h2 className="sub-header">Personal Information</h2>
            </div>
          </section>

          {/* name */}
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            label="Name"
            placeholder="Enter  your  name"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
          />
          {/* email && mobile no */}
          <div className="flex flex-col gap-6 xl:flex-row">
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
          </div>
          {/* DOB and gender */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="birthDate"
              label="Date of Birth"
              placeholder="Enter your birth date"
            />
            <CustomFormField
              fieldType={FormFieldType.SKLETON}
              control={form.control}
              name="gender"
              label="Gender"
              renderSkeleton={(field) => (
                <FormControl>
                  <RadioGroup
                    className="flex h-11 gap-6 xl:justify-between"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    {GenderOptions.map((option, i) => (
                      <div key={option + 1} className="radio-group">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option} className="cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="address"
              label="Address"
              placeholder="Enter  your  address"
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="occupation"
              label="Occupation"
              placeholder="Enter your occupation"
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="emergencyContactName"
              label="Emergency Contact Name"
              placeholder="Guardian's name"
            />
            <CustomFormField
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name="emergencyContactNumber"
              label="Emergency Contact Numberr"
              placeholder="Guardian's phone no"
            />
          </div>

          <section className="space-y-4">
            <div className="mb-9 space-y-1">
              <h2 className="sub-header">Medical Information</h2>
            </div>
          </section>

          {/* select doctors */}
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="primaryPhysician"
            label="Primary Physician"
            placeholder="Choose Your Primary Physician"
          >
            {Doctors.map((doctor) => (
              <SelectItem key={doctor.name} value={doctor.name}>
                <div className="flex flex-col gap-6 xl:flex-row hover:text-slate-500 cursor-pointer">
                  <Image
                    src={doctor.image}
                    alt="doctor"
                    width={32}
                    height={32}
                    className="rounded-full border border-dark-500"
                  />
                  <p>{doctor.name}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>

            {/* insurance */}
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="insuranceProvider"
              label="Insurance Provider"
              placeholder="Enter  your  Insurance Provider"
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="insurancePolicyNumber"
              label="Insurance Policy Number"
              placeholder="ABC123456"
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="allergies"
              label="Allergies (if any)"
              placeholder="Do you have any allergies"
            />
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="currentMedication"
              label="Current Medication (if any)"
              placeholder="Medecines..."
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="familyMedicalHistory"
              label="Family Medical History"
              placeholder="Ex.- Mother has blood preasure, Father has diabetes etc."
            />
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="pastMedicalHistory"
              label="Past Medical History"
              placeholder="Appendactomy"
            />
          </div>

          <section className="space-y-4">
            <div className="mb-9 space-y-1">
              <h2 className="sub-header">Identification and Verification</h2>
            </div>
          </section>
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="identificationType"
            label="Identification Type"
            placeholder="Select type of document"
          >
            {IdentificationTypes.map((docs) => (
              <SelectItem key={docs} value={docs}>
                <div className="flex flex-col gap-6 xl:flex-row hover:text-slate-500 cursor-pointer">
                  <p>{docs}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="identificationNumber"
            label="Identification Number"
            placeholder="Ex. Aadhar no"
          />

          <CustomFormField
            fieldType={FormFieldType.SKLETON}
            control={form.control}
            name="identificationDocument"
            label="Scan Copy Of Identification Documents"
            renderSkeleton={(field) => (
              <FormControl>
                <FileUploader files={field.value} onChange={field.onChange} />
              </FormControl>
            )}
          />

          <section className="space-y-4">
            <div className="mb-9 space-y-1">
              <h2 className="sub-header">Terms and Conditions</h2>
            </div>
          </section>

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="treatmentConsent"
            label="I consent to treatment"
          />

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="disclosureConsent"
            label="I consent to disclosure of information"
          />
          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="privacyConsent"
            label="I consent to privacy policy"
          />

          <SubmitBtn isLoading={isLoading}>Get Registered</SubmitBtn>
        </form>
      </Form>
    </div>
  );
};
export default RegisterForm;
