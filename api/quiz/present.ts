import { createEndpoint } from "../../lib/Endpoint";
import { presentGet } from "../../server/PresentGet";
import { presentPost } from "../../server/PresentPost";

export default createEndpoint({ get: presentGet, post: presentPost });
