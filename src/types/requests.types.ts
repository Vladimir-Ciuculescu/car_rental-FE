import { AvailableCar } from "./car.types";

export interface CarRequest {
  id: number;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: string;
  car: AvailableCar;
  user: any;
}
