import React, { useEffect, useState, useCallback, FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AdvancedMarker,
  APIProvider,
  ControlPosition,
  Map,
  MapControl,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { Input } from "@/components/ui/input";
import debounce from "debounce";
import { Button } from "@/components/ui/button";

interface MapReturnValue {
  latitude: number;
  longitude: number;
  address: string;
  place_name: string;
}

const MapsDialog = ({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: MapReturnValue) => void;
}) => {
  const position = { lat: -8.453848400000002, lng: 119.8728421 };
  const [center, setCenter] = useState<google.maps.LatLngLiteral>(position);
  const [returnValue, setReturnValue] = useState<MapReturnValue>();

  const onDragEnd = async (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newPosition = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      setCenter(newPosition);
      onCenterChange(event.latLng);
    }
  };

  const onCenterChange = async (c: google.maps.LatLng) => {
    const thisCenter = { lat: c.lat(), lng: c.lng() };
    const geocoder = new google.maps.Geocoder();
    const response = await geocoder.geocode({ location: thisCenter });

    const result = response.results[1] || response.results[0];

    if (result) {
      const { geometry, formatted_address, address_components } = result;

      let placeName = "";
      let cityName = "";
      let provinceName = "";

      for (const component of address_components) {
        if (component.types.includes("administrative_area_level_3")) {
          placeName = component.short_name;
        } else if (component.types.includes("administrative_area_level_2")) {
          cityName = component.short_name;
        } else if (component.types.includes("administrative_area_level_1")) {
          provinceName = component.short_name;
        }
      }

      const expectedResult = {
        latitude: geometry?.location?.lat(),
        longitude: geometry?.location?.lng(),
        address: formatted_address,
        place_name: placeName + ", " + cityName + ", " + provinceName,
      };
      setReturnValue(expectedResult);
    } else {
      alert("No results found!");
    }
  };

  useEffect(() => {
    if (!open) {
      setReturnValue(undefined);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>Select Location on Gmaps</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <APIProvider apiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY as string}>
          <Map
            defaultCenter={center}
            center={center}
            defaultZoom={10}
            mapId="MAP_ID"
            className="w-full h-[70vh]"
            mapTypeControlOptions={{ mapTypeIds: ["ROADMAP"] }}
          >
            <AdvancedMarker position={center} draggable onDragEnd={onDragEnd} />
            <MapControl position={ControlPosition.TOP_CENTER}>
              <AutocompleteCustom
                onPlaceSelect={(place) => {
                  // Handle place selection
                  if (place && place.geometry && place.geometry.location) {
                    setCenter({
                      lat: place.geometry.location.lat(),
                      lng: place.geometry.location.lng(),
                    });
                    onCenterChange(place.geometry.location);
                  }
                }}
              />
            </MapControl>
          </Map>
        </APIProvider>
        <div className="flex justify-between items-center gap-8">
          <p className="text-sm">Address: {returnValue?.address}</p>

          <Button
            variant={"primary"}
            disabled={!returnValue}
            onClick={() => onSubmit(returnValue as MapReturnValue)}
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MapsDialog;

interface Props {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

const AutocompleteCustom = ({ onPlaceSelect }: Props) => {
  const map = useMap();
  const places = useMapsLibrary("places");

  // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompleteSessionToken
  const [sessionToken, setSessionToken] =
    useState<google.maps.places.AutocompleteSessionToken>();

  // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service
  const [autocompleteService, setAutocompleteService] =
    useState<google.maps.places.AutocompleteService | null>(null);

  // https://developers.google.com/maps/documentation/javascript/reference/places-service
  const [placesService, setPlacesService] =
    useState<google.maps.places.PlacesService | null>(null);

  const [predictionResults, setPredictionResults] = useState<
    Array<google.maps.places.AutocompletePrediction>
  >([]);

  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    if (!places || !map) return;

    setAutocompleteService(new places.AutocompleteService());
    setPlacesService(new places.PlacesService(map));
    setSessionToken(new places.AutocompleteSessionToken());

    return () => setAutocompleteService(null);
  }, [map, places]);

  const fetchPredictions = useCallback(
    debounce(async (inputValue: string) => {
      if (!autocompleteService || !inputValue) {
        setPredictionResults([]);
        return;
      }

      const request = {
        input: inputValue,
        sessionToken,
        componentRestrictions: { country: "id" }, // Restrict to the United States
      };
      const response = await autocompleteService.getPlacePredictions(request);
      console.log(response);

      setPredictionResults(response.predictions);
    }, 500),
    [autocompleteService, sessionToken]
  );

  const onInputChange = useCallback(
    (event: FormEvent<HTMLInputElement>) => {
      const value = (event.target as HTMLInputElement)?.value;

      setInputValue(value);
      fetchPredictions(value);
    },
    [fetchPredictions]
  );

  const handleSuggestionClick = useCallback(
    (placeId: string) => {
      if (!places) return;

      const detailRequestOptions = {
        placeId,
        fields: ["geometry", "name", "formatted_address", "place_id"],
        sessionToken,
      };

      const detailsRequestCallback = (
        placeDetails: google.maps.places.PlaceResult | null
      ) => {
        onPlaceSelect(placeDetails);
        setPredictionResults([]);
        setInputValue(placeDetails?.formatted_address ?? "");
        setSessionToken(new places.AutocompleteSessionToken());
      };

      placesService?.getDetails(detailRequestOptions, detailsRequestCallback);
    },
    [onPlaceSelect, places, placesService, sessionToken]
  );

  return (
    <div className="w-96 mt-2">
      <Input
        value={inputValue}
        onInput={(event: FormEvent<HTMLInputElement>) => onInputChange(event)}
        placeholder="Search for a place"
      />

      {predictionResults.length > 0 && (
        <ul className="w-full list-none">
          {predictionResults.map(({ place_id, description }) => {
            return (
              <li
                key={place_id}
                className="p-2 bg-background cursor-pointer hover:bg-accent hover:text-accent-foreground"
                onClick={() => handleSuggestionClick(place_id)}
              >
                {description}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
