import { Pin } from "@prisma/client";

export interface MapReturnValue {
  latitude: number;
  longitude: number;
  address: string;
  place_name: string;
}

export interface PinExtended extends Pin {
  is_liked: boolean;
}
