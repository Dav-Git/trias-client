"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRIAS_SER = void 0;
exports.TRIAS_SER = `
<?xml version="1.0" encoding="UTF-8" ?>
<Trias version="1.2" xmlns="http://www.vdv.de/trias" xmlns:siri="http://www.siri.org.uk/siri" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="https://raw.githubusercontent.com/VDVde/TRIAS/v1.2/Trias.xsd">
    <ServiceRequest>
        <siri:RequestorRef>$TOKEN</siri:RequestorRef>
        <RequestPayload>
            <StopEventRequest>
                <Location>
                    <LocationRef>
                        <StopPointRef>$STATIONID</StopPointRef>
                    </LocationRef>
                    <DepArrTime>$TIME</DepArrTime>
                </Location>
                <Params>
                    <IncludeRealtimeData>true</IncludeRealtimeData>
                    <NumberOfResults>$MAXRESULTS</NumberOfResults>
                    <StopEventType>departure</StopEventType>
                </Params>
            </StopEventRequest>
        </RequestPayload>
    </ServiceRequest>
</Trias>
`;
