import { SSTConfig } from "sst";
import { Auth, Api, Bucket, NextjsSite, Config } from "sst/constructs";

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

      // Add a secret to stacks
      const GOOGLE_CLIENT_ID = new Config.Secret(stack, "GOOGLE_CLIENT_ID");

      // Add auth to the app
      const auth = new Auth(stack, "auth", {
        authenticator: {
          handler: "app/api/auth.handler",
          bind: [GOOGLE_CLIENT_ID],
        },
      });

      auth.attach(stack, {
        api,
        prefix: "/auth",
      });

      const site = new NextjsSite(stack, "site", {
        bind: [bucket, api, auth],
        environment: {
          NEXT_PUBLIC_APP_API_URL: api.url,
        },
      });

      stack.addOutputs({
        ApiUrl: api.url,
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
