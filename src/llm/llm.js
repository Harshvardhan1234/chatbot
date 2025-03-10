import { MLCEngine } from "@mlc-ai/web-llm";


const initProgressCallback = (initProgress) => {
    console.log("initProgress");
}


const engine = new MLCEngine({
    initProgressCallback: initProgressCallback
});

let selectedModel = "DeepSeek-R1-Distill-Qwen-7B-q4f16_1-MLC"
await engine.reload(selectedModel);


export async function llm(prompt) {

    const messages = [
        { role: "system", content: "You are a helpful AI assistant." },
        { role: "user", content: prompt}
    ]


    const reply = await engine.chat.completions.create({
        messages,
    });

    // console.log(reply.choices[0].message.content)
    return reply.choices[0].message.content;
}