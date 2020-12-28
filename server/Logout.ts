import { EndpointParams } from "../lib/Endpoint";

interface LogoutParams {
    allDevices?: boolean
}

export async function logout({ params, db, user, usedToken, validTokens }: EndpointParams<LogoutParams>) {
    if (user) {
        const updatedTokens = params.allDevices ? [] : validTokens.filter(t => t !== usedToken);
        await db.Users.updateOne({ _id: user._id }, { $set: { loginTokens: updatedTokens } })
    }
    return { redirectTo: "/" }
}