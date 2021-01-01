import { createEndpoint } from "../../lib/Endpoint";
import { playPost } from "../../server/PlayPost";

export default createEndpoint({ post: playPost });
