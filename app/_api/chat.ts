import { ApiHandler, useJsonBody } from "sst/node/api";
import { useSession } from "sst/node/auth";
import { Config } from "sst/node/config";
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  // @ts-ignore
  apiKey: Config.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const handler = ApiHandler(async () => {
  const session = useSession();

  if (!session) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Not authorized" }),
    };
  }
  console.log("return message");

  const messages = useJsonBody();

  const chatCompletion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messages,
  });

  console.log(chatCompletion.data.choices[0].message);

  return {
    statusCode: 200,
    body: JSON.stringify(session),
  };
});
