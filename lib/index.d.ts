import { TRIASDeparturesHandler } from "./trias/TRIASDeparturesHandler";
import { TRIASJourneysHandler } from "./trias/TRIASJourneysHandler";
import { TRIASStopsHandler } from "./trias/TRIASStopsHandler";
export declare const getClient: (options: ClientOptions) => TRIASClient;
declare class TRIASClient {
    departuresHandler: TRIASDeparturesHandler;
    journeysHandler: TRIASJourneysHandler;
    stopsHandler: TRIASStopsHandler;
    constructor(options: ClientOptions);
    getDepartures(options: DeparturesRequestOptions): Promise<DeparturesResult>;
    getJourneys(options: JourneyRequestOptions): Promise<JourneysResult>;
    getStops(options: StopsRequestOptions): Promise<StopsResult>;
}
export {};
