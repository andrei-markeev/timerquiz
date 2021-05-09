import { connectToDatabase } from "../lib/DbUtils";
import { EndpointError, GetEndpointParams } from "../lib/Endpoint";
import { ConfirmPurgeView } from "./views/ConfirmPurgeView";

interface LogoutQuery {
    allDevices: boolean;
    action: string;
}

export async function logoutGet({ query, user, userAgent, usedToken, validTokens }: GetEndpointParams<LogoutQuery>) {
    if (!user || !usedToken)
        return { redirectTo: "/" };

    const db = await connectToDatabase();
    if (query.action === "confirmPurge")
        return ConfirmPurgeView({ userAgent, csrfToken: usedToken.csrfToken });
    else if (query.action)
        throw new EndpointError(400, "Invalid request");

    const updatedTokens = query.allDevices ? [] : validTokens.filter(t => t !== usedToken);
    await db.Users.updateOne({ _id: user._id }, { $set: { loginTokens: updatedTokens } });
    return { redirectTo: "/" };
}