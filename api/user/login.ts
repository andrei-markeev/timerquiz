import { createEndpoint } from "../../lib/Endpoint";
import { loginGet } from "../../server/LoginGet";

export default createEndpoint({ get: loginGet });
