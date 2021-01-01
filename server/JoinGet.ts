import { GetEndpointParams } from "../lib/Endpoint";
import { EnterPinView } from "./views/EnterPinView";

export async function joinGet({ userAgent }: GetEndpointParams) {
    return EnterPinView({ userAgent });
}
