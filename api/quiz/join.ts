import { createEndpoint } from "../../lib/Endpoint";
import { joinGet } from "../../server/JoinGet";
import { joinPost } from "../../server/JoinPost";

export default createEndpoint({ get: joinGet, post: joinPost });
