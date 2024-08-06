export interface AvailableCar {
  id: number;
  brand: string;
  model: string;
  image: string;
  yearOfProduction: number;
  costPerHour: number;
  description?: string;
  ownerId: number;
}
