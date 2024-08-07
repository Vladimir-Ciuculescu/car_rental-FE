"use client";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useEffect, useState } from "react";
import { getAvailableCarsApi } from "@/utils/api";
import { AvailableCar } from "@/types/car.types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { audiModels, bmwModels, brands, toyotaModels } from "@/consts";
import { useRouter } from "next/navigation";

const AvailableCars = () => {
  const user: any = localStorage.getItem("user");
  const parsedUser = JSON.parse(user!);

  const [cars, setCars] = useState<AvailableCar[]>([]);

  const router = useRouter();

  const [models, setModels] = useState<string[]>();
  const [modelInputDisabled, setModelInputDisabled] = useState(true);
  const [model, setModel] = useState("");

  const [brand, setBrand] = useState("");

  useEffect(() => {
    getAvailableCars();
  }, [brand, model]);

  const getAvailableCars = async () => {
    let payload: any = { ownerId: parsedUser.id };

    if (brand) {
      payload.brand = brand;
    }

    if (model) {
      payload.model = model;
    }

    const availableCars = await getAvailableCarsApi(payload);
    setCars(availableCars);
  };

  const handleBrandChange = (brand: string) => {
    setBrand(brand);
    setModelInputDisabled(false);

    switch (brand) {
      case "Toyota":
        setModels(toyotaModels);
        break;
      case "Audi":
        setModels(audiModels);
        break;
      case "Bmw":
        setModels(bmwModels);
        break;
      default:
        setModels([]);
        break;
    }
  };

  const goToCarDetails = (car: AvailableCar) => {
    router.push(`/dashboard/car-details/${car.id}`);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4"></div>
            <div className="flex flex-row gap-4">
              <Select value={brand} onValueChange={(e) => handleBrandChange(e)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {brands.map((brand, key) => {
                      return (
                        <SelectItem key={key} value={brand}>
                          {brand}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                  <Button
                    className="w-full px-2"
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      setBrand("");
                    }}
                  >
                    Clear
                  </Button>
                </SelectContent>
              </Select>
              <Select
                value={model}
                onValueChange={(e) => setModel(e)}
                disabled={modelInputDisabled}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {models?.length &&
                      models.map((brand, key) => {
                        return (
                          <SelectItem key={key} value={brand}>
                            {brand}
                          </SelectItem>
                        );
                      })}
                  </SelectGroup>
                  <Button
                    className="w-full px-2"
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      setModel("");
                    }}
                  >
                    Clear
                  </Button>
                </SelectContent>
              </Select>
            </div>
            <Card x-chunk="dashboard-05-chunk-3">
              <CardHeader className="px-7">
                <CardTitle>Available cars</CardTitle>
                <CardDescription>
                  Here you can see a list of available cars
                </CardDescription>
              </CardHeader>
              <CardContent>
                {cars.length ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>

                        <TableHead>Brand</TableHead>
                        <TableHead>Model</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Year of production
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Price per hour
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          description
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cars.map((car, key) => {
                        return (
                          <TableRow
                            key={key}
                            className="cursor-pointer"
                            onClick={() => goToCarDetails(car)}
                          >
                            <TableCell className="hidden sm:table-cell">
                              <Image
                                alt="Product image"
                                className="aspect-square rounded-md object-cover"
                                height="64"
                                loader={() => car.image}
                                src={car.image}
                                width="64"
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              {car.brand}
                            </TableCell>
                            <TableCell className="font-medium">
                              {car.model}
                            </TableCell>
                            <TableCell>{car.yearOfProduction}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Badge variant="outline">
                                {car.costPerHour} $
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {car.description}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center gap-1 text-center">
                    <h3 className="text-2xl font-bold tracking-tight">
                      There are not available cars at the moment
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Please come back later
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AvailableCars;
