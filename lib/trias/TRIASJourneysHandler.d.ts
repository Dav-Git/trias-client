import { DOMElement } from "../RequestAndParse";
export declare class TRIASJourneysHandler {
    url: string;
    requestorRef: string;
    headers: {
        [key: string]: string;
    };
    constructor(url: string, requestorRef: string, headers: {
        [key: string]: string;
    });
    getJourneys(options: JourneyRequestOptions): Promise<JourneysResult>;
    parseStationID(id: string): string;
    parseRequestViaStation(stationID: string): string;
    parseRequestTime(time: string): string;
    parseResponseTime(time: string): string;
    parseResponseTicket(ticketEl: DOMElement): Ticket | null;
}
