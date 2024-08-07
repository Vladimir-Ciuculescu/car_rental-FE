"use client";

import { Copy } from "lucide-react";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  addCarRequestApi,
  getCarDetailsApi,
  RequestPayload,
} from "@/utils/api";
import { AvailableCar } from "@/types/car.types";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const CarDetails = () => {
  const { id: carId }: { id: string } = useParams();
  const [details, setDetails] = useState<AvailableCar>();
  const [totalCost, setTotalCost] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getCarDetails = async () => {
      const data = await getCarDetailsApi(parseInt(carId));
      setDetails(data);
    };

    getCarDetails();
  }, []);

  const imageLoader = () => {
    return details?.image;
  };

  const FormData = z.object({
    startDate: z.date({
      required_error: "Start date required!",
    }),
    endDate: z.date({
      required_error: "End date required!",
    }),
  });

  type zodData = z.infer<typeof FormData>;

  const form = useForm<zodData>({
    resolver: zodResolver(FormData),
  });

  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const differenceInMilliseconds = end.getTime() - start.getTime();
      const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);
      setTotalCost(differenceInHours * details!.costPerHour);
    } else {
      setTotalCost(null);
    }
  }, [startDate, endDate]);

  const onSubmit = async (data: zodData) => {
    const user: any = localStorage.getItem("user");
    const parsedUser = JSON.parse(user!);

    const payload: RequestPayload = {
      startDate: data.startDate,
      endDate: data.endDate,
      totalPrice: totalCost!,
      carId: parseInt(carId),
      userId: parsedUser.id,
    };

    try {
      await addCarRequestApi(payload);
      router.push("/dashboard/available-cars");
    } catch (error) {
      console.error("Error listing car:", error);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="grid gap-0.5">
                  <CardTitle className="group flex items-center gap-2 text-lg">
                    Summary
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Copy className="h-3 w-3" />
                      <span className="sr-only">Copy Order ID</span>
                    </Button>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 text-sm">
                <div className="grid gap-3">
                  <div className="font-semibold">Car Details</div>
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Brand</span>
                      <span>{details?.brand}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Model</span>
                      <span>{details?.model}</span>
                    </li>
                  </ul>
                  <Separator className="my-2" />
                  <ul className="grid gap-3">
                    <Image
                      loader={imageLoader}
                      src="me.png"
                      alt="Picture of the author"
                      width={500}
                      height={500}
                    />
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Year of production
                      </span>
                      <span>{details?.yearOfProduction}</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="grid gap-0.5">
                  <CardTitle className="group flex items-center gap-2 text-lg">
                    Calculate cost
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Copy className="h-3 w-3" />
                      <span className="sr-only">Copy Order ID</span>
                    </Button>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 text-sm">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    <div className="flex flex-row gap-3">
                      <span className="text-muted-foreground">
                        Cost per hour
                      </span>
                      <Badge variant="outline">{details?.costPerHour} $</Badge>
                    </div>

                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-[240px] pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>End Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-[240px] pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date <= form.getValues("startDate")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {totalCost && (
                      <div className="flex flex-row gap-3">
                        <span className="text-muted-foreground">
                          Total Cost
                        </span>
                        <Badge variant="outline">{totalCost} $</Badge>
                      </div>
                    )}
                    <Button type="submit" disabled={!startDate || !endDate}>
                      Rent
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CarDetails;
