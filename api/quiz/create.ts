import { createEndpoint } from "../../lib/Endpoint";
import { createPost } from "../../server/CreatePost";
import { createGet } from "../../server/CreateGet";

export default createEndpoint({ get: createGet, post: createPost });
