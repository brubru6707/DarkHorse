export type EssentialDetails = {
    batteryLevel?: number;
    city?: string;
    connectionType?: string;
    deviceMemory?: number;
    platform?: string;
    userAgent?: string;
};

export function extractEssentialDetails(fullData: any): EssentialDetails | null {
    if (!fullData) {
        return null;
    }

    const essential: EssentialDetails = {
        batteryLevel: fullData.batteryLevel,
        city: fullData.city,
        connectionType: fullData.connectionType,
        deviceMemory: fullData.deviceMemory,
        platform: fullData.platform,
        userAgent: fullData.userAgent,
    };

    return essential;
}