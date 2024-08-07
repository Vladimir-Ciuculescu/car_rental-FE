"use client";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

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
import {
  acceptRequestApi,
  AcceptRequestPayload,
  declineRequestApi,
  getRequestsForYourCarsApi,
} from "@/utils/api";

import { CarRequest } from "@/types/requests.types";
import * as moment from "moment";
import { Button } from "@/components/ui/button";

const Requests = () => {
  const user: any = localStorage.getItem("user");
  const parsedUser = JSON.parse(user!);

  const [requests, setRequests] = useState<CarRequest[]>([]);

  useEffect(() => {
    getRequests();
  }, []);

  const getRequests = async () => {
    const requests = await getRequestsForYourCarsApi(parsedUser.id);
    setRequests(requests);
  };

  const formatDate = (dateString: Date) => {
    return moment(dateString).format("Do MMMM, YYYY");
  };

  const declineRequest = async (id: number) => {
    try {
      await declineRequestApi(id);

      const newRequestsList = requests.map((request) => {
        return request.id === id ? { ...request, status: "DECLINED" } : request;
      });

      setRequests(newRequestsList);
    } catch (error: any) {
      console.log(error);
      const message = error.response?.data?.message;
      throw new Error(message);
    }
  };

  const acceptRequest = async (carId: number, requestId: number) => {
    try {
      const payload: AcceptRequestPayload = {
        carId,
        requestId,
      };

      await acceptRequestApi(payload);

      const newRequestsList = requests
        .map((request) => {
          return request.id === requestId
            ? { ...request, status: "ACCEPTED" }
            : request;
        })
        .filter(
          (request) => request.car.id !== carId || request.id === requestId
        );

      setRequests(newRequestsList);
    } catch (error: any) {
      console.log(error);
      const message = error.response?.data?.message;
      throw new Error(message);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4"></div>

            <Card x-chunk="dashboard-05-chunk-3">
              <CardHeader className="px-7">
                <CardTitle>Requests for you car</CardTitle>
                <CardDescription>
                  Here you can see all requests for the cars you listed
                </CardDescription>
              </CardHeader>
              <CardContent>
                {requests.length ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Car ID</TableHead>
                        <TableHead>From user</TableHead>

                        <TableHead>Image</TableHead>

                        <TableHead>Brand</TableHead>
                        <TableHead>Model</TableHead>
                        <TableHead>Start Date</TableHead>

                        <TableHead>End Date</TableHead>
                        <TableHead>Total price</TableHead>

                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requests.map((request, key) => {
                        return (
                          <TableRow
                            key={key}
                            className={
                              request.status !== "DECLINED"
                                ? "cursor-pointer"
                                : ""
                            }
                          >
                            <TableCell className="font-medium">
                              {request.car.id}
                            </TableCell>
                            <TableCell className="font-medium">
                              {request.user.firstName +
                                " " +
                                request.user.lastName}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <Image
                                alt="Product image"
                                className="aspect-square rounded-md object-cover"
                                height="64"
                                loader={() => request.car.image}
                                src={request.car.image}
                                width="64"
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              {request.car.brand}
                            </TableCell>
                            <TableCell className="font-medium">
                              {request.car.model}
                            </TableCell>
                            <TableCell className="font-medium">
                              {formatDate(request.startDate)}
                            </TableCell>
                            <TableCell className="font-medium">
                              {formatDate(request.endDate)}
                            </TableCell>
                            <TableCell align="center" className="font-medium">
                              <Badge variant="outline">
                                {request.totalPrice} $
                              </Badge>
                            </TableCell>
                            <TableCell align="center" className="font-medium">
                              <Badge variant="outline">{request.status}</Badge>
                            </TableCell>
                            <TableCell className="font-medium ">
                              <div className=" flex gap-5">
                                <Button
                                  onClick={() =>
                                    acceptRequest(request.car.id, request.id)
                                  }
                                  disabled={
                                    request.status === "DECLINED" ||
                                    request.status === "ACCEPTED"
                                  }
                                >
                                  {request.status === "PENDING" ||
                                  request.status === "DECLINED"
                                    ? "Approve"
                                    : "Aprroved"}
                                </Button>
                                <Button
                                  disabled={
                                    request.status === "DECLINED" ||
                                    request.status === "ACCEPTED"
                                  }
                                  onClick={() => declineRequest(request.id)}
                                  variant="destructive"
                                >
                                  {request.status === "PENDING" ||
                                  request.status === "DECLINED"
                                    ? "Decline"
                                    : "Declined"}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center gap-1 text-center">
                    <h3 className="text-2xl font-bold tracking-tight">
                      Currently you have no rent requests for your cars
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      When someone will make a request, you will see it here
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

export default Requests;
