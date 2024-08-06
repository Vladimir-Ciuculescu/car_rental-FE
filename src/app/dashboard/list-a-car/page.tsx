"use client";

import { ControllerRenderProps, useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import Link from "next/link";
import {
  CarPayload,
  listACarApi,
  registerUserApi,
  uploadImageApi,
} from "@/utils/api";
import { Description } from "@radix-ui/react-dialog";
import { register } from "module";

const brands = ["Toyota", "Audi", "Bmw"];

const toyotaModels = [
  "Camry",
  "Corolla",
  "Highlander",
  "Prius",
  "RAV4",
  "Tacoma",
  "Tundra",
  "Yaris",
  "4Runner",
  "Avalon",
];

const bmwModels = [
  "1 Series",
  "2 Series",
  "3 Series",
  "4 Series",
  "5 Series",
  "6 Series",
  "7 Series",
  "8 Series",
  "X1",
  "X2",
  "X3",
  "X4",
  "X5",
  "X6",
  "X7",
  "Z4",
];

const audiModels = [
  "A1",
  "A3",
  "A4",
  "A5",
  "A6",
  "A7",
  "A8",
  "Q2",
  "Q3",
  "Q5",
  "Q7",
  "Q8",
  "TT",
  "R8",
];

const years = [
  1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011,
  2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024,
];

const schema = z.object({
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model name is required"),
  year: z.string().min(1, "Year of production is required"),
  cost: z.string().min(1, "Cost is required"),
  image: z.instanceof(File).optional(),
  description: z.string().min(1, "Please enter a description !").optional(),
});

type zodData = z.infer<typeof schema>;

const Register = () => {
  const form = useForm<zodData>({
    resolver: zodResolver(schema),
    defaultValues: {
      brand: "",
      model: "",
      year: "",
      cost: "",
      description: "",
    },
  });

  const [message, setMessage] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [carModels, setCarModels] = useState<string[]>([]);
  const [modelInputDisabled, setModelInputDisabled] = useState(true);

  const handleImageChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleBrandChange = (
    field: ControllerRenderProps<zodData>,
    brand: string
  ) => {
    field.onChange(brand);
    form.setValue("brand", brand);

    setModelInputDisabled(false);
    form.setValue("model", "");

    switch (brand) {
      case "Toyota":
        setCarModels(toyotaModels);
        break;
      case "Audi":
        setCarModels(audiModels);
        break;
      case "Bmw":
        setCarModels(bmwModels);
        break;
      default:
        setCarModels([]);
        break;
    }
  };

  const onSubmit = async (data: zodData) => {
    const formData = new FormData();
    if (data.image) {
      formData.append(
        "file",
        data.image,
        `${data.brand}-${data.model}-${data.year}`
      );
    }
    try {
      const { url } = await uploadImageApi(formData);

      const payload: CarPayload = {
        brand: data.brand,
        model: data.model,
        image: url,
        year: parseInt(data.year),
        cost: parseInt(data.cost),
        description: data.description,
      };
      await listACarApi(payload);

      // Reset the form values
      form.reset({
        brand: "",
        model: "",
        year: "",
        cost: "",
        description: "",
      });
      setPreview(null); // Clear the image preview
      setCarModels([]); // Clear the car models
      setModelInputDisabled(true); // Disable the model input
      setMessage("Car successfully listed!");
    } catch (error) {
      console.error("Error listing car:", error);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div>
          <div className="grid gap-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-2/3 space-y-6"
              >
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          handleBrandChange(field, value);
                        }}
                        defaultValue=""
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a car brand" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {brands.map((brand, key) => {
                            return (
                              <SelectItem value={brand} key={key}>
                                {brand}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      <Select
                        value={field.value}
                        disabled={modelInputDisabled}
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                        defaultValue=""
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a car model" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {carModels.map((model, key) => {
                            return (
                              <SelectItem value={model} key={key}>
                                {model}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Car Image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files
                              ? e.target.files[0]
                              : null;
                            field.onChange(file);
                            handleImageChange(file);
                          }}
                        />
                      </FormControl>
                      {preview && (
                        <div className="mt-4">
                          <img
                            src={preview}
                            alt="Car Preview"
                            className="h-48 w-auto rounded-md"
                          />
                        </div>
                      )}

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year of production</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue("year", value);
                        }}
                        defaultValue=""
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select the production year" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {years.map((year, key) => {
                            return (
                              <SelectItem key={key} value={year.toString()}>
                                {year}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter cost"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
                {message && (
                  <p className="mt-4 text-center text-sm">{message}</p>
                )}
              </form>
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;