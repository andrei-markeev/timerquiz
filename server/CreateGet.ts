import { EndpointError, GetEndpointParams } from "../lib/Endpoint";
import { CreateView } from "./views/editor/CreateView";

export async function createGet({ user, userAgent, usedToken }: GetEndpointParams) {
    if (!user || !usedToken)
        throw new EndpointError(403, "Access denied");

    return CreateView({ userAgent, csrfToken: usedToken.csrfToken });
}
