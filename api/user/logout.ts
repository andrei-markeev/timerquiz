import { createEndpoint } from "../../lib/Endpoint";
import { logoutGet } from "../../server/logoutGet";
import { logoutPost } from "../../server/LogoutPost";

export default createEndpoint({ get: logoutGet, post: logoutPost });
