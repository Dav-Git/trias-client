"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TRIASDeparturesHandler_1 = require("./trias/TRIASDeparturesHandler");
const TRIASJourneysHandler_1 = require("./trias/TRIASJourneysHandler");
const TRIASStopsHandler_1 = require("./trias/TRIASStopsHandler");
const getClient = (options) => {
    return new TRIASClient(options);
};
class TRIASClient {
    constructor(options) {
        if (!options.requestorRef)
            options.requestorRef = "";
        if (!options.headers)
            options.headers = {};
        this.departuresHandler = new TRIASDeparturesHandler_1.TRIASDeparturesHandler(options.url, options.requestorRef, options.headers);
        this.journeysHandler = new TRIASJourneysHandler_1.TRIASJourneysHandler(options.url, options.requestorRef, options.headers);
        this.stopsHandler = new TRIASStopsHandler_1.TRIASStopsHandler(options.url, options.requestorRef, options.headers);
    }
    getDepartures(options) {
        return this.departuresHandler.getDepartures(options);
    }
    getJourneys(options) {
        return this.journeysHandler.getJourneys(options);
    }
    getStops(options) {
        return this.stopsHandler.getStops(options);
    }
}
exports.getClient = getClient;
