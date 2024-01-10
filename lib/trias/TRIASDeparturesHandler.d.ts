export declare class TRIASDeparturesHandler {
    url: string;
    requestorRef: string;
    headers: {
        [key: string]: string;
    };
    constructor(url: string, requestorRef: string, headers: {
        [key: string]: string;
    });
    getDepartures(options: DeparturesRequestOptions): Promise<DeparturesResult>;
    parseResponseTime(time: string): string;
}
