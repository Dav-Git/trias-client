"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRIASJourneysHandler = void 0;
const moment = require("moment-timezone");
const RequestAndParse_1 = require("../RequestAndParse");
const TRIAS_TR_1 = require("../xml/TRIAS_TR");
class TRIASJourneysHandler {
    constructor(url, requestorRef, headers) {
        this.url = url;
        this.requestorRef = requestorRef;
        this.headers = headers;
    }
    async getJourneys(options) {
        const maxResults = options.maxResults ? options.maxResults : 5;
        let arrTime;
        let depTime;
        if (options.arrivalTime)
            arrTime = this.parseRequestTime(options.arrivalTime);
        else if (options.departureTime)
            depTime = this.parseRequestTime(options.departureTime);
        const via = (options.via || [])
            .map((stationID) => this.parseRequestViaStation(stationID)).join("");
        const payload = TRIAS_TR_1.TRIAS_TR.replace("$ORIGIN", options.origin)
            .replace("$VIA", via)
            .replace("$DESTINATION", options.destination)
            .replace("$DEPTIME", depTime ? depTime : "")
            .replace("$ARRTIME", arrTime ? arrTime : "")
            .replace("$MAXRESULTS", maxResults.toString())
            .replace("$INCLUDE_FARES", options.includeFares ? "true" : "false")
            .replace("$TOKEN", this.requestorRef);
        const doc = await RequestAndParse_1.requestAndParse(this.url, this.requestorRef, this.headers, payload);
        const situations = [];
        const trips = [];
        if (options.includeSituations) {
            for (const situationEl of RequestAndParse_1.selectAll("PtSituation", doc)) {
                const summary = RequestAndParse_1.getText(RequestAndParse_1.selectOne("Summary", situationEl));
                const detail = RequestAndParse_1.getText(RequestAndParse_1.selectOne("Detail", situationEl));
                const startTime = RequestAndParse_1.getText(RequestAndParse_1.selectOne("StartTime", situationEl));
                const endTime = RequestAndParse_1.getText(RequestAndParse_1.selectOne("EndTime", situationEl));
                const priority = RequestAndParse_1.getText(RequestAndParse_1.selectOne("Priority", situationEl));
                const situation = {
                    title: summary || "",
                    description: detail || "",
                    validFrom: startTime || "",
                    validTo: endTime || "",
                    priority: priority || ""
                };
                situations.push(situation);
            }
        }
        for (const tripEl of RequestAndParse_1.selectAll("TripResult", doc)) {
            const trip = {
                type: "journey",
                id: "",
                legs: [],
            };
            const tripID = RequestAndParse_1.getText(RequestAndParse_1.selectOne("TripId", tripEl));
            if (tripID)
                trip.id = tripID;
            for (const legEl of RequestAndParse_1.selectAll("TripLeg", tripEl)) {
                const leg = {
                    mode: "unknown" /* UNKNOWN */,
                    direction: "",
                    origin: "",
                    destination: "",
                    departure: "",
                    arrival: "",
                };
                if (RequestAndParse_1.selectOne("TimedLeg", legEl)) {
                    const origin = {
                        type: "stop",
                        id: "",
                        name: "",
                    };
                    const legBoardEl = RequestAndParse_1.selectOne("LegBoard", legEl);
                    const startStationID = RequestAndParse_1.getText(RequestAndParse_1.selectOne("StopPointRef", legBoardEl));
                    if (startStationID)
                        origin.id = this.parseStationID(startStationID);
                    const startStationName = RequestAndParse_1.getText(RequestAndParse_1.selectOne("StopPointName Text", legBoardEl));
                    if (startStationName)
                        origin.name = startStationName;
                    const startTime = RequestAndParse_1.getText(RequestAndParse_1.selectOne("TimetabledTime", legBoardEl));
                    if (startTime)
                        leg.departure = this.parseResponseTime(startTime);
                    const startRealtime = RequestAndParse_1.getText(RequestAndParse_1.selectOne("EstimatedTime", legBoardEl));
                    if (startRealtime)
                        leg.departureDelay = moment(startRealtime).unix() - moment(leg.departure).unix();
                    const startPlatform = RequestAndParse_1.getText(RequestAndParse_1.selectOne("PlannedBay Text", legBoardEl));
                    if (startPlatform)
                        leg.departurePlatform = startPlatform;
                    const destination = {
                        type: "stop",
                        id: "",
                        name: "",
                    };
                    const legAlightEl = RequestAndParse_1.selectOne("LegAlight", legEl);
                    const endStationID = RequestAndParse_1.getText(RequestAndParse_1.selectOne("StopPointRef", legAlightEl));
                    if (endStationID)
                        destination.id = this.parseStationID(endStationID);
                    const endStationName = RequestAndParse_1.getText(RequestAndParse_1.selectOne("StopPointName Text", legAlightEl));
                    if (endStationName)
                        destination.name = endStationName;
                    const endTime = RequestAndParse_1.getText(RequestAndParse_1.selectOne("TimetabledTime", legAlightEl));
                    if (endTime)
                        leg.arrival = this.parseResponseTime(endTime);
                    const endRealtime = RequestAndParse_1.getText(RequestAndParse_1.selectOne("EstimatedTime", legAlightEl));
                    if (endRealtime)
                        leg.arrivalDelay = moment(endRealtime).unix() - moment(leg.arrival).unix();
                    const endPlatform = RequestAndParse_1.getText(RequestAndParse_1.selectOne("PlannedBay Text", legAlightEl));
                    if (endPlatform)
                        leg.arrivalPlatform = endPlatform;
                    leg.line = {
                        type: "line",
                        id: "",
                        line: "",
                    };
                    const lineName = RequestAndParse_1.getText(RequestAndParse_1.selectOne("PublishedLineName Text", legEl)) || RequestAndParse_1.getText(RequestAndParse_1.selectOne("Name Text", legEl));
                    if (lineName && leg.line) {
                        leg.line.id = lineName;
                        leg.line.line = lineName;
                    }
                    const direction = RequestAndParse_1.getText(RequestAndParse_1.selectOne("DestinationText Text", legEl));
                    if (direction)
                        leg.direction = direction;
                    const mode = RequestAndParse_1.getText(RequestAndParse_1.selectOne("PtMode", legEl));
                    if (mode === "bus") {
                        leg.mode = "bus" /* BUS */;
                    }
                    else if (mode === "tram") {
                        leg.mode = "train" /* TRAIN */;
                        leg.subMode = "tram" /* TRAM */;
                    }
                    else if (mode === "metro") {
                        leg.mode = "train" /* TRAIN */;
                        leg.subMode = "metro" /* METRO */;
                    }
                    else if (mode === "rail") {
                        leg.mode = "train" /* TRAIN */;
                        leg.subMode = "rail" /* RAIL */;
                    }
                    leg.origin = origin;
                    leg.destination = destination;
                }
                else if (RequestAndParse_1.selectOne("ContinuousLeg", legEl) || RequestAndParse_1.selectOne("InterchangeLeg", legEl)) {
                    const origin = {
                        type: "location",
                        name: "",
                    };
                    const legStartEl = RequestAndParse_1.selectOne("LegStart", legEl);
                    const startLocationName = RequestAndParse_1.getText(RequestAndParse_1.selectOne("LocationName Text", legStartEl));
                    if (startLocationName)
                        origin.name = startLocationName;
                    const startGeoPos = RequestAndParse_1.selectOne("GeoPosition", legStartEl);
                    if (startGeoPos) {
                        const latitude = RequestAndParse_1.getText(RequestAndParse_1.selectOne("Latitude", startGeoPos));
                        if (latitude)
                            origin.latitude = parseFloat(latitude);
                        const longitude = RequestAndParse_1.getText(RequestAndParse_1.selectOne("Longitude", startGeoPos));
                        if (longitude)
                            origin.longitude = parseFloat(longitude);
                    }
                    const destination = {
                        type: "location",
                        name: "",
                    };
                    const legEndEl = RequestAndParse_1.selectOne("LegEnd", legEl);
                    const endLocationName = RequestAndParse_1.getText(RequestAndParse_1.selectOne("LocationName Text", legEl));
                    if (endLocationName)
                        destination.name = endLocationName;
                    const endGeoPos = RequestAndParse_1.selectOne("GeoPosition", legEndEl);
                    if (endGeoPos) {
                        const latitude = RequestAndParse_1.getText(RequestAndParse_1.selectOne("Latitude", endGeoPos));
                        if (latitude)
                            destination.latitude = parseFloat(latitude);
                        const longitude = RequestAndParse_1.getText(RequestAndParse_1.selectOne("Longitude", endGeoPos));
                        if (longitude)
                            destination.longitude = parseFloat(longitude);
                    }
                    const startTime = RequestAndParse_1.getText(RequestAndParse_1.selectOne("TimeWindowStart", legEl));
                    if (startTime)
                        leg.departure = this.parseResponseTime(startTime);
                    const endTime = RequestAndParse_1.getText(RequestAndParse_1.selectOne("TimeWindowEnd", legEl));
                    if (endTime)
                        leg.arrival = this.parseResponseTime(endTime);
                    leg.mode = "walking" /* WALKING */;
                    leg.origin = origin;
                    leg.destination = destination;
                }
                trip.legs.push(leg);
            }
            if (options.includeFares) {
                if (!trip.tickets)
                    trip.tickets = [];
                // todo: there might be multiple
                const faresEl = RequestAndParse_1.selectOne("TripFares", tripEl);
                for (const ticketEl of RequestAndParse_1.selectAll("Ticket", faresEl)) {
                    const ticket = this.parseResponseTicket(ticketEl);
                    if (ticket)
                        trip.tickets.push(ticket);
                }
            }
            trips.push(trip);
        }
        const result = {
            success: true,
            journeys: trips,
        };
        if (options.includeSituations)
            result.situations = situations;
        return result;
    }
    parseStationID(id) {
        if (!id.includes(":"))
            return id;
        const t = id.split(":");
        return t[0] + ":" + t[1] + ":" + t[2];
    }
    parseRequestViaStation(stationID) {
        return "<Via><ViaPoint><StopPointRef>" + stationID + "</StopPointRef></ViaPoint></Via>";
    }
    parseRequestTime(time) {
        return "<DepArrTime>" + moment(time).tz("Europe/Berlin").format("YYYY-MM-DDTHH:mm:ss") + "</DepArrTime>";
    }
    parseResponseTime(time) {
        return moment(time).tz("Europe/Berlin").format();
    }
    parseResponseTicket(ticketEl) {
        const id = RequestAndParse_1.getText(RequestAndParse_1.selectOne("TicketId", ticketEl));
        const name = RequestAndParse_1.getText(RequestAndParse_1.selectOne("TicketName", ticketEl));
        const faresAuthorityRef = RequestAndParse_1.getText(RequestAndParse_1.selectOne("FaresAuthorityRef", ticketEl));
        const faresAuthorityName = RequestAndParse_1.getText(RequestAndParse_1.selectOne("FaresAuthorityText", ticketEl));
        if (!id || !name || !faresAuthorityRef || !faresAuthorityName)
            return null;
        const price = RequestAndParse_1.getText(RequestAndParse_1.selectOne("Price", ticketEl));
        return {
            id,
            name,
            faresAuthorityRef,
            faresAuthorityName,
            price: price ? parseFloat(price) : null,
            currency: RequestAndParse_1.getText(RequestAndParse_1.selectOne("Currency", ticketEl)),
            tariffLevel: RequestAndParse_1.getText(RequestAndParse_1.selectOne("TariffLevel", ticketEl)),
            travelClass: RequestAndParse_1.getText(RequestAndParse_1.selectOne("TravelClass", ticketEl)),
            validFor: RequestAndParse_1.getText(RequestAndParse_1.selectOne("ValidFor", ticketEl)),
            validityDuration: RequestAndParse_1.getText(RequestAndParse_1.selectOne("ValidityDuration", ticketEl)),
        };
    }
}
exports.TRIASJourneysHandler = TRIASJourneysHandler;
