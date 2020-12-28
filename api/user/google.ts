import { createEndpoint } from "../../lib/Endpoint";
import { loginWithGoogle } from "../../server/LoginWithGoogle";

export default createEndpoint(loginWithGoogle);
