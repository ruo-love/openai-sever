
const express = require('express');
const bodyparser = require('body-parser');
const app = express();

// 默认使用extended:false即可满足我们的需求
app.use(bodyparser.urlencoded({ extended: false }))
const { Configuration, OpenAIApi } = require("openai");
const readline = require('readline');
const configuration = new Configuration({
    apiKey: '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',
});
const openai = new OpenAIApi(configuration);


async function chatWithGPT_gpt35(message) {
    const res = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }]
    })
    const reply = res.data.choices[0].message.content;
    return reply;
}

async function chatWithGPT_text(message) {
    const response = await openai.createCompletion({
        model: 'text-davinci-003',  // 替换为您想要使用的模型
        prompt: message,
        max_tokens: 2048,
        temperature: 0.2
    });

    const reply = response.data.choices;
    return reply;
}
async function chatWithGPTtoImage(message) {
    const response = await openai.createImage({
        model: "text-davinci-003",  // 替换为您想要使用的模型
        prompt: message,
        size: "256x256",
        n: 1
    });

    const reply = response.data;
    return reply;
}
// 与ChatGPT进行交互
async function interactWithGPT() {

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question(`若若GPT:   请问你想咨询什么问题呢?\n `, async (userInput) => {
        const reply = await chatWithGPT_gpt35(userInput);
        console.log('若若GPT回复❤↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓');
        console.log('\n', reply);
        console.log('\n结束*************************************');
        // close the stream
        rl.close();
    });
}
interactWithGPT()
app.post('/chat', async (req, res) => {
    // 处理登录逻辑
    const { prompt } = req.body
    console.log(req.body)
    const result = await chatWithGPT_text(prompt)
    res.send({
        data: result
    })
});
app.use(express.static('public'));

app.listen(3000, () => {
    console.log('Server started on port 3000');
});

