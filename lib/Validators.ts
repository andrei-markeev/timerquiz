export function isObjectIdHexString(s: any): s is string {
    return typeof s === "string" && s.length === 24 && /^[a-f0-9]+$/.test(s);
}

export function isParticipantId(s: any): s is string {
    return typeof s === "string" && s.length > 9 && /^[a-z0-9]+$/.test(s);
}

export function isGamePin(s: any): s is string {
    return typeof s === "string" && s.length === 6 && /^[0-9]+$/.test(s);
}

export function isNonEmptyString(s: any): s is string {
    return typeof s === "string" && s.length > 0;
}

export function isInteger(s: any): s is string {
    return typeof s === "string" && s.length > 0 && !isNaN(+s) && /^[0-9]+$/.test(s);
}
