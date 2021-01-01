import { createEndpoint } from "../../lib/Endpoint";
import { logoutGet } from "../../server/LogoutGet";
import { logoutPost } from "../../server/LogoutPost";

export default createEndpoint({ get: logoutGet, post: logoutPost });
