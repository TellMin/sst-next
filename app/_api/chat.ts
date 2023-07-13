import { ApiHandler } from "sst/node/api";
import { useSession } from "sst/node/auth";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";
import { Config } from "sst/node/config";

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  // @ts-ignore
  apiKey: Config.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export const handler = ApiHandler(async (evt) => {
  const session = useSession();

  if (session.type === "user") {
    // Extract the `messages` from the body of the request
    const messages = JSON.parse(evt.body).messages;

    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      stream: true,
      messages,
    });

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);
    // Respond with the stream
    return new StreamingTextResponse(stream);
  }

  console.log("session", session);

  return {
    statusCode: 202,
    body: JSON.stringify(session),
  };
});
