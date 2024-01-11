"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRIASStopsHandler = void 0;
const RequestAndParse_1 = require("../RequestAndParse");
const TRIAS_LIR_NAME_1 = require("../xml/TRIAS_LIR_NAME");
const TRIAS_LIR_POS_1 = require("../xml/TRIAS_LIR_POS");
class TRIASStopsHandler {
    constructor(url, requestorRef, headers) {
        this.url = url;
        this.requestorRef = requestorRef;
        this.headers = headers;
    }
    async getStops(options) {
        const maxResults = options.maxResults ? options.maxResults : 10;
        let payload;
        if (options.name)
            payload = TRIAS_LIR_NAME_1.TRIAS_LIR_NAME.replace("$QUERY", options.name).replace("$MAXRESULTS", maxResults.toString()).replace("$TOKEN", this.requestorRef);
        else if (options.latitude && options.longitude && options.radius)
            payload = TRIAS_LIR_POS_1.TRIAS_LIR_POS.replace("$LATITUDE", options.latitude.toString())
                .replace("$LONGITUDE", options.longitude.toString())
                .replace("$RADIUS", options.radius.toString())
                .replace("$MAXRESULTS", maxResults.toString())
                .replace("$TOKEN", this.requestorRef);
        else {
            throw new Error("options.name or options.{latitude,longitude} must be passed");
        }
        const doc = await (0, RequestAndParse_1.requestAndParse)(this.url, this.requestorRef, this.headers, payload);
        const stops = [];
        for (const locationEl of (0, RequestAndParse_1.selectAll)("LocationResult", doc)) {
            const stop = {
                type: "stop",
                id: "",
                name: "",
            };
            const id = (0, RequestAndParse_1.getText)((0, RequestAndParse_1.selectOne)("StopPointRef", locationEl));
            if (id)
                stop.id = id;
            const latitude = (0, RequestAndParse_1.getText)((0, RequestAndParse_1.selectOne)("Latitude", locationEl));
            const longitude = (0, RequestAndParse_1.getText)((0, RequestAndParse_1.selectOne)("Longitude", locationEl));
            if (latitude && longitude) {
                stop.location = {
                    type: "location",
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                };
            }
            const stationName = (0, RequestAndParse_1.getText)((0, RequestAndParse_1.selectOne)("StopPointName Text", locationEl));
            const locationName = (0, RequestAndParse_1.getText)((0, RequestAndParse_1.selectOne)("LocationName Text", locationEl));
            if (locationName && stationName && !stationName.includes(locationName))
                stop.name = locationName + " " + stationName;
            else if (stationName)
                stop.name = stationName;
            stops.push(stop);
        }
        return {
            success: true,
            stops,
        };
    }
}
exports.TRIASStopsHandler = TRIASStopsHandler;
