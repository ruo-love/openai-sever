const express = require("express");
const cors = require("cors");
const app = express();
// 启用 CORS 中间件
app.use(cors());
// 默认使用extended:false即可满足我们的需求
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const { Configuration, OpenAIApi } = require("openai");
const readline = require("readline");
const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

async function chatWithGPT_text(message) {
  const response = await openai.createCompletion({
    model: "text-davinci-003", // 替换为您想要使用的模型
    prompt: message,
    max_tokens: 100,
    stream: true,
  });

  return response;
}

app.post("/chat", async (req, res) => {
  try {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    // 处理流式输出并将其发送给前端
    const sendToClient = (data) => {
      res.write(`data: ${data}\n\n`);
    };
    // 调用OpenAI并获取响应
    const callOpenAI = async (prompt) => {
      const completion = await openai.createChatCompletion(
        {
          model: "gpt-3.5-turbo-1106",
          temperature: 0.2,
          messages: [{ role: "user", content: prompt }],
          stream: true,
          max_tokens: 100,
        },
        { responseType: "stream" }
      );
      const stream = completion.data;
      stream.on("data", (data) => {
        const lines = data
          .toString()
          .split("\n")
          .filter((line) => line.trim() !== "");
        for (const line of lines) {
          let result = line.replace(/^data: /, "");
          if (result === "[DONE]") {
            sendToClient(result);
            return;
          }

          sendToClient(result);
        }
      });

      stream.on("end", () => {});

      stream.on("error", (err) => {
        console.log(err);
        res.send(err);
      });
    };

    console.log(req.body);
    const { content } = req.body;
    // 调用OpenAI并发送结果到前端
    callOpenAI(content);
  } catch (error) {
    console.error("处理聊天请求时出错:", error);
    res.status(500).json({ error: "内部服务器错误" });
  }
});

app.use(express.static("public"));

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
