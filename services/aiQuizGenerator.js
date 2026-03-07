const OpenAI = require("openai")

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

module.exports = async function(text){

    const prompt = `
    Generate 5 MCQ questions from this text:
    ${text}
    `

    const response = await openai.chat.completions.create({
        model:"gpt-4o-mini",
        messages:[
            {role:"user",content:prompt}
        ]
    })

    return response.choices[0].message.content
}