import { createEndpoint } from "../../lib/Endpoint";
import { editGet } from "../../server/EditGet";
import { editPost } from "../../server/EditPost";

export default createEndpoint({ get: editGet, post: editPost });
