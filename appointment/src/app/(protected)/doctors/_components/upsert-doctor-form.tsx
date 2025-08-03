"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import z from "zod";

import { capitalize } from "@/_helpers/capitalize";
import { upsertDoctor } from "@/actions/upsert-doctor";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { doctorsTable } from "@/db/schema";

import { generateTimeSlots } from "../../../../_helpers/generateTimeSlots";
import { WeekDays, weekDaysLabels } from "../../../../_helpers/week-days-enum";
import { medicalSpecialties } from "../_constants";
import { doctorInitials } from "../_helpers/doctorInitials";
import UploadImageDoctorForm from "./upload-image-doctor-form";
const formSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, { message: "Nome é obrigatório" })
      .transform((val) => capitalize(val)),
    specialty: z
      .string()
      .trim()
      .min(3, { message: "Especialidade é obrigatório" }),
    appointmentPrice: z
      .number()
      .min(1, { message: "Preço da consulta é obrigatório" }),
    availableFromWeekDays: z
      .string()
      .min(1, { message: "Dia da semana é obrigatório" }),
    availableToWeekDays: z
      .string()
      .min(1, { message: "Dia da semana é obrigatório" }),
    availableFromTime: z
      .string()
      .min(1, { message: "Horário de início é obrigatório" }),
    availableToTime: z
      .string()
      .min(1, { message: "Horário de término é obrigatório" }),
    avatarImageUrl: z.string(),
  })
  .refine(
    (data) => {
      return data.availableFromTime < data.availableToTime;
    },
    {
      message: "Horário de início não pode ser maior que o horário de término",
      path: ["availableToTime"],
    },
  );

interface UpsertDoctorFormProps {
  doctor?: typeof doctorsTable.$inferSelect;
  onSuccess?: () => void;
  isOpen: boolean;
}

const morningTimeSlots = generateTimeSlots("06:00", "12:30");
const afternoonTimeSlots = generateTimeSlots("13:00", "18:30");
const nightTimeSlots = generateTimeSlots("19:00", "23:59");

const UpsertDoctorForm = ({ doctor, onSuccess }: UpsertDoctorFormProps) => {
  const initialsName = doctorInitials(doctor?.name);

  const form = useForm<z.infer<typeof formSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: doctor?.name ?? "",
      specialty: doctor?.specialty ?? "",
      appointmentPrice: doctor?.appointmentPriceInCents
        ? doctor.appointmentPriceInCents / 100
        : 0,
      availableFromWeekDays: `${doctor?.availableFromWeekDays ?? WeekDays.MONDAY}`,
      availableToWeekDays: `${doctor?.availableToWeekDays ?? WeekDays.FRIDAY}`,
      availableFromTime: doctor?.availableFromTime ?? "",
      availableToTime: doctor?.availableToTime ?? "",
      avatarImageUrl: doctor?.avatarImageUrl ?? "",
    },
  });

  const upsertDoctorAction = useAction(upsertDoctor, {
    onSuccess: () => {
      toast.success("Médico cadastrado com sucesso");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Erro ao cadastrar médico");
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    upsertDoctorAction.execute({
      ...values,
      id: doctor?.id,
      availableFromWeekDays: parseInt(values.availableFromWeekDays),
      availableToWeekDays: parseInt(values.availableToWeekDays),
      appointmentPriceInCents: values.appointmentPrice * 100,
      avatarImageUrl: values.avatarImageUrl,
    });
  };

  const handleAvatarUploadSuccess = (url: string) => {
    form.setValue("avatarImageUrl", url, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{doctor ? doctor.name : "Adicionar médico"}</DialogTitle>
        <DialogDescription>
          {doctor
            ? "Edite as informações do médico"
            : "Adicione um novo médico"}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="avatarImageUrl"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <UploadImageDoctorForm
                    initialUrl={field.value}
                    onUploadSuccess={handleAvatarUploadSuccess}
                    fallbackText={initialsName}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campos do formulário */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nome do médico" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="specialty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Especialidade *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma especialidade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {medicalSpecialties.map((specialty) => (
                      <SelectItem key={specialty.value} value={specialty.value}>
                        {specialty.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="appointmentPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço da Consulta (R$) *</FormLabel>
                <NumericFormat
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value.floatValue);
                  }}
                  decimalScale={2}
                  fixedDecimalScale
                  decimalSeparator=","
                  allowNegative={false}
                  allowLeadingZeros={false}
                  thousandSeparator="."
                  customInput={Input}
                  prefix="R$"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between gap-4">
            <FormField
              control={form.control}
              name="availableFromWeekDays"
              render={({ field }) => (
                <FormItem className="w-[220px]">
                  <FormLabel>Disponível de *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione data inicial" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(weekDaysLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="availableToWeekDays"
              render={({ field }) => (
                <FormItem className="w-[220px]">
                  <FormLabel>Até *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione data final" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(weekDaysLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between gap-2">
              <FormField
                control={form.control}
                name="availableFromTime"
                render={({ field }) => (
                  <FormItem className="w-[220px]">
                    <FormLabel>Horário Inicial *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione horário inicial" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Manhã</SelectLabel>
                          {morningTimeSlots.map((time) => (
                            <SelectItem key={time.value} value={time.value}>
                              {time.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>Tarde</SelectLabel>
                          {afternoonTimeSlots.map((time) => (
                            <SelectItem key={time.value} value={time.value}>
                              {time.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>Noite</SelectLabel>
                          {nightTimeSlots.map((time) => (
                            <SelectItem key={time.value} value={time.value}>
                              {time.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="availableToTime"
                render={({ field }) => (
                  <FormItem className="w-[220px]">
                    <FormLabel>Horário Final *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione horário final" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Manhã</SelectLabel>
                          {morningTimeSlots.map((time) => (
                            <SelectItem key={time.value} value={time.value}>
                              {time.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>Tarde</SelectLabel>
                          {afternoonTimeSlots.map((time) => (
                            <SelectItem key={time.value} value={time.value}>
                              {time.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>Noite</SelectLabel>
                          {nightTimeSlots.map((time) => (
                            <SelectItem key={time.value} value={time.value}>
                              {time.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <p className="text-destructive text-sm font-medium">
              {form.formState.errors.availableFromTime?.message ||
                form.formState.errors.availableToTime?.message}
            </p>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={upsertDoctorAction.isPending}>
              {upsertDoctorAction.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default UpsertDoctorForm;
