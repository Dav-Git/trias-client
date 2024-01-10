export declare class TRIASStopsHandler {
    url: string;
    requestorRef: string;
    headers: {
        [key: string]: string;
    };
    constructor(url: string, requestorRef: string, headers: {
        [key: string]: string;
    });
    getStops(options: StopsRequestOptions): Promise<StopsResult>;
}
