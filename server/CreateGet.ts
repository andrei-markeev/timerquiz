import { generateCsrfToken } from "../lib/CsrfToken";
import { NonceType } from "../lib/Db";
import { connectToDatabase } from "../lib/DbUtils";
import { EndpointError, GetEndpointParams } from "../lib/Endpoint";
import { CreateView } from "./views/editor/CreateView";

export async function createGet({ user, userAgent }: GetEndpointParams) {
    if (!user)
        throw new EndpointError(403, "Access denied");

    const db = await connectToDatabase();
    const csrfToken = await generateCsrfToken(db, NonceType.CreateQuizCsrf);

    return CreateView({ userAgent, csrfToken });
}
