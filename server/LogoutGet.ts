import { generateCsrfToken } from "../lib/CsrfToken";
import { NonceType } from "../lib/Db";
import { connectToDatabase } from "../lib/DbUtils";
import { EndpointError, GetEndpointParams } from "../lib/Endpoint";
import { ConfirmPurgeView } from "./views/ConfirmPurgeView";

interface LogoutQuery {
    allDevices: boolean;
    action: string;
}

export async function logoutGet({ query, user, userAgent, usedToken, validTokens }: GetEndpointParams<LogoutQuery>) {
    if (!user)
        return { redirectTo: "/" };

    const db = await connectToDatabase();
    if (query.action === "confirmPurge") {
        const csrfToken = await generateCsrfToken(db, NonceType.DeleteAccountCsrf);
        return ConfirmPurgeView({ userAgent, csrfToken });
    } else if (query.action)
        throw new EndpointError(400, "Invalid request");

    const updatedTokens = query.allDevices ? [] : validTokens.filter(t => t !== usedToken);
    await db.Users.updateOne({ _id: user._id }, { $set: { loginTokens: updatedTokens } });
    return { redirectTo: "/" };
}