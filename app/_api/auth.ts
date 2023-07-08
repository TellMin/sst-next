import { AuthHandler, GoogleAdapter, Session } from "sst/node/auth";
import { Config } from "sst/node/config";
import { Api } from "sst/node/api";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { Table } from "sst/node/table";

export const handler = AuthHandler({
  providers: {
    google: GoogleAdapter({
      mode: "oidc",
      // @ts-ignore
      clientID: Config.GOOGLE_CLIENT_ID,
      onSuccess: async (tokenset) => {
        const claims = tokenset.claims();

        const ddb = new DynamoDBClient({});
        await ddb.send(
          new PutItemCommand({
            // @ts-ignore
            TableName: Table.users.tableName,
            Item: marshall({
              userId: claims.sub,
              email: claims.email,
              picture: claims.picture,
              name: claims.given_name,
            }),
          })
        );

        return Session.parameter({
          redirect: process.env.IS_LOCAL
            ? "http://localhost:3000"
            : "https://d3cgj8iibxpd5t.cloudfront.net",
          type: "user",
          properties: {
            userID: claims.sub,
          },
        });
      },
    }),
  },
});

declare module "sst/node/auth" {
  export interface SessionTypes {
    user: {
      userID: string;
    };
  }
}
