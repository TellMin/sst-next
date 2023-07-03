import { SSTConfig } from "sst";
import { Api, Bucket, NextjsSite } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "sst-next",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      // Add an S3 bucket to the app
      const bucket = new Bucket(stack, "public");

      const api = new Api(stack, "api", {
        routes: {
          "GET /": "app/api/time.handler",
        },
      });

      const site = new NextjsSite(stack, "site", {
        bind: [bucket, api],
      });

      stack.addOutputs({
        ApiUrl: api.url,
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
