import { firecrawl } from "@/lib/firecrawl";

import { inngest } from "./client";

const URL_REGEX = /https?:\/\/[\/s]+/g;

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {

    const { prompt } = event.data as { prompt: string };

    const urls = await step.run("extract-urls", async () => {
      return prompt.match(URL_REGEX) ?? [];
    }) as string[];

    const scrapedContent =await step.run("scrape-urls", async () => {
      const results = await Promise.all(
        urls.map(async (url: string) => {
          const result = await firecrawl.scrape(
            url,
            { formats: ["markdown"] },
          );

          return result.markdown ?? null;
        }),
      );

      return results.filter(Boolean).join("\n\n");
    });

    const finalPrompt = scrapedContent
      ? `Content:\n${scrapedContent}\n\nQuestions: ${prompt}`
      : prompt;

    console.log("final prompt: ", finalPrompt);

    throw new Error("inngest error: backcgroumd job failed");
  },
);