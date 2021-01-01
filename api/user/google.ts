import { createEndpoint } from "../../lib/Endpoint";
import { loginWithGoogleGet } from "../../server/LoginWithGoogleGet";

export default createEndpoint({ get: loginWithGoogleGet });
