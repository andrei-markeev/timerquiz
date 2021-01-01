import { createEndpoint } from "../../lib/Endpoint";
import { managePost } from "../../server/ManagePost";

export default createEndpoint({ post: managePost });
