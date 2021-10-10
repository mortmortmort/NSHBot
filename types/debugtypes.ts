export enum DebugLevel {
    OFF   = "OFF",
    ERROR = "ERROR",
    DEBUG =  "DEBUG",
    TRACE =  "TRACE"
};

export function debugLevelFromString(level: string): DebugLevel {
    switch (level.toUpperCase()) {
        case DebugLevel.OFF:
            return DebugLevel.OFF;

        case DebugLevel.ERROR:
            return DebugLevel.ERROR;
        
        case DebugLevel.DEBUG:
            return DebugLevel.DEBUG;
                
        case DebugLevel.TRACE:
            return DebugLevel.TRACE;                    

        default:
            return DebugLevel.OFF;
    }
}