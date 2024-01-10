/**
 * Using the Friendly Public Transport Format (FPTF) v1.2.1 for all responses
 * However, some optional attributes were removed as they are not supported by TRIAS
 * See https://github.com/public-transport/friendly-public-transport-format/tree/1.2.1
 *
 * For reference, this data model mostly aligns with the one of Abfahrt Core, which has been used in TRIAS use cases for a long time
 * See https://gitlab.com/andary/abfahrt-core/-/blob/2.0/swagger.yaml
 */
interface FPTFStop {
    type: string;
    id: string;
    name: string;
    location?: FPTFLocation;
}
interface FPTFLocation {
    type: string;
    name?: string;
    address?: string;
    longitude?: number;
    latitude?: number;
    altitude?: number;
}
interface FPTFLine {
    type: string;
    id: string;
    line: string;
}
interface FPTFStopover {
    type: string;
    stop: string;
    line?: FPTFLine;
    mode: FPTFMode;
    subMode?: FPTFSubmode;
    direction?: string;
    arrival?: string;
    arrivalDelay?: number;
    arrivalPlatform?: string;
    departure?: string;
    departureDelay?: number;
    departurePlatform?: string;
    cancelled?: boolean;
}
interface FPTFJourney {
    type: string;
    id: string;
    legs: FPTFLeg[];
    tickets?: Ticket[];
}
interface FPTFLeg {
    line?: FPTFLine;
    mode: FPTFMode;
    subMode?: FPTFSubmode;
    direction: string;
    origin: string | FPTFStop | FPTFLocation;
    destination: string | FPTFStop | FPTFLocation;
    departure: string;
    departureDelay?: number;
    departurePlatform?: string;
    arrival: string;
    arrivalDelay?: number;
    arrivalPlatform?: string;
    stopovers?: FPTFStopover[];
}
declare const enum FPTFMode {
    AIRCRAFT = "aircraft",
    BICYCLE = "bicycle",
    BUS = "bus",
    CAR = "car",
    GONDOLA = "gondola",
    TAXI = "taxi",
    TRAIN = "train",
    UNKNOWN = "unknown",
    WALKING = "walking",
    WATERCRAFT = "watercraft"
}
declare const enum FPTFSubmode {
    METRO = "metro",
    RAIL = "rail",
    TRAM = "tram"
}
interface Ticket {
    id: string;
    name: string;
    faresAuthorityRef: string;
    faresAuthorityName: string;
    price: number | null;
    currency: string | null;
    tariffLevel: string | null;
    travelClass: string | null;
    validFor: string | null;
    validityDuration: string | null;
}
interface Situation {
    title: string;
    description: string;
    validFrom: string;
    validTo: string;
    priority: string;
}
