import { Board, Pin } from "./database";

export interface PinExtended extends Pin {
  is_liked: boolean;
}

export interface BoardExtended extends Board {
  // pins: { pin_id: number }[];
  is_liked: boolean;
  has_itinerary?: boolean;
}

export interface MapReturnValue {
  latitude: number;
  longitude: number;
  address: string;
  place_name: string;
}

export type CostBreakdown = {
  id: number | undefined;
  image_url: string | null;
  name: string | null;
  content: string | null;
  order_id: number | null;
  itinerary_id: number;
};
