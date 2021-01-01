import { EndpointError, GetEndpointParams } from "../lib/Endpoint";
import { ConfirmPurgeView } from "./views/ConfirmPurgeView";

interface LogoutQuery {
    allDevices: boolean;
    action: string;
}

export async function logoutGet({ query, db, user, userAgent, usedToken, validTokens }: GetEndpointParams<LogoutQuery>) {
    if (!user)
        return { redirectTo: "/" };

    if (query.action === "confirmPurge")
        return ConfirmPurgeView({ userAgent });
    else if (query.action)
        throw new EndpointError(400, "Invalid request");

    const updatedTokens = query.allDevices ? [] : validTokens.filter(t => t !== usedToken);
    await db.Users.updateOne({ _id: user._id }, { $set: { loginTokens: updatedTokens } });
    return { redirectTo: "/" };
}