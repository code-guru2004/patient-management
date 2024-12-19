'use client'
import { E164Number } from "libphonenumber-js/core";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Control } from "react-hook-form"
import { FormFieldType } from "./forms/PatientForm"
import Image from "next/image"
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "./ui/checkbox";

interface CustomProps {
    control: Control<any>;
    name: string;
    label?: string;
    placeholder?: string;
    iconSrc?: string;
    iconAlt?: string;
    disabled?: boolean;
    dateFormat?: string;
    showTimeSelect?: boolean;
    children?: React.ReactNode;
    renderSkeleton?: (field: any) => React.ReactNode;
    fieldType: FormFieldType;
}

const RenderField = ({field , props}:{field: any; props:CustomProps})=>{
    const {fieldType ,iconSrc,iconAlt,placeholder , showTimeSelect , dateFormat , renderSkeleton} = props;
    switch (fieldType) {
      case FormFieldType.INPUT:
        return (
          <div className="flex rounded-md border border-dark-500 bg-dark-400">
            {iconSrc && (
              <Image
                src={iconSrc}
                alt={iconAlt || "icon"}
                width={24}
                height={24}
                className="ml-2"
              />
            )}

            <FormControl>
              <Input
                placeholder={props.placeholder}
                {...field}
                className="shad-input border-0"
              />
            </FormControl>
          </div>
        );

      case FormFieldType.PHONE_INPUT:
        return (
          <PhoneInput
            defaultCountry="US"
            placeholder={placeholder}
            international
            withCountryCallingCode
            value={field.value as E164Number | undefined}
            onChange={field.onChange}
            className="input-phone"
          />
        );

      case FormFieldType.DATE_PICKER:
        return (
          <div className="flex rounded-md border border-dark-500 bg-dark-400">
            <Image
              src="/assets/icons/calendar.svg"
              width={24}
              height={24}
              alt="calender"
              className="ml-2"
            />
            <FormControl>
              <DatePicker
                selected={field.value}
                onChange={(date) => field.onChange(date)}
                className="shad-input"
                dateFormat={dateFormat ?? "MM/dd/yyyy"}
                showTimeSelect={showTimeSelect ?? false}
                wrapperClassName="date-picker"
              />
            </FormControl>
          </div>
        );
      case FormFieldType.DATE_PICKER:
        return (
          <div className="flex rounded-md border border-dark-500 bg-dark-400">
            <Image
              src="/assets/icons/calendar.svg"
              width={24}
              height={24}
              alt="calender"
              className="ml-2"
            />
            <FormControl>
              <DatePicker
                selected={field.value}
                onChange={(date) => field.onChange(date)}
                className="shad-input"
                dateFormat={dateFormat ?? "MM/dd/yyyy"}
                showTimeSelect={showTimeSelect ?? false}
                wrapperClassName="date-picker"
              />
            </FormControl>
          </div>
        );
      
      case FormFieldType.SKLETON:
        return renderSkeleton ? renderSkeleton(field) : null;
      case FormFieldType.SELECT:
        return (
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl className="shad-select-trigger">
                <SelectTrigger>

                <SelectValue placeholder={placeholder}/>
                </SelectTrigger>
              </FormControl>

              <SelectContent className="shad-select-content ">
                {props.children}
              </SelectContent>
            </Select>
          </FormControl>
        )
        case FormFieldType.TEXTAREA:
          return (
            <FormControl>
              <Textarea
                placeholder={placeholder}
                {...field}
                className="shad-textArea"
                disabled={props.disabled}
              />
            </FormControl>
          );
          case FormFieldType.CHECKBOX:
            return (
              <FormControl>
                <div className="flex items-center gap-4">
                  <Checkbox 
                  id={props.name} 
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  />
                  <label className="checkbox-label" htmlFor={props.name}>{props.label}</label>
                </div>
              </FormControl>
            )
    }
}
function CustomFormField(props: CustomProps) {
    const {control,label,name,fieldType} = props;
    return (
    <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex-1">
                {props.fieldType !== FormFieldType.CHECKBOX && label && (
                  <FormLabel className="shad-input-label">{label}</FormLabel>
                )}
                <RenderField field={field} props={props} />
      
                <FormMessage className="shad-error" />
              </FormItem>
            )}
          />
        )
}

export default CustomFormField