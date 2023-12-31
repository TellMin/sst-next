import { SSTConfig } from "sst";
import { Auth, Api, Bucket, NextjsSite, Config, Table } from "sst/constructs";

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

      const table = new Table(stack, "users", {
        fields: {
          userId: "string",
        },
        primaryIndex: { partitionKey: "userId" },
      });

      // Add a secred to connect open ai
      const OPENAI_API_KEY = new Config.Secret(stack, "OPENAI_API_KEY");

      const api = new Api(stack, "api", {
        defaults: {
          function: {
            bind: [table, OPENAI_API_KEY],
          },
        },
        routes: {
          "GET /": "app/_api/time.handler",
          "GET /session": "app/_api/session.handler",
          "POST /chat": "app/_api/chat.handler",
        },
      });

      // Add a secret to stacks
      const GOOGLE_CLIENT_ID = new Config.Secret(stack, "GOOGLE_CLIENT_ID");

      // Add auth to the app
      const auth = new Auth(stack, "auth", {
        authenticator: {
          handler: "app/_api/auth.handler",
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
