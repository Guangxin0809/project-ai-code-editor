import Firecrawl from "@mendable/firecrawl-js";

export const firecrawl = new Firecrawl({
  apiKey: process.env.FIRECRAEL_API_KEY!,
});