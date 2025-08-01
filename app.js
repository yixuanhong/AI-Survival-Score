async function generateScore() {
    const jobTitle = document.getElementById('jobTitle').value;
    const resultBox = document.getElementById('result');
    const scoreBox = document.getElementById('score');
    const modulesBox = document.getElementById('modules');
    const toolsBox = document.getElementById('tools');
    const skillsBox = document.getElementById('skills');

    const userLang = document.documentElement.lang;

    const prompt = `Act as a career AI assistant. For the job title "${jobTitle}", please provide:

1. AI substitution score (0-100) with explanation.

2. Tasks most likely and least likely to be automated.

3. Suggested AI tools and links for efficiency.

4. Career advice on how to stay irreplaceable.

Respond in ${userLang === 'zh' ? 'Chinese' : 'English'}.`;

    scoreBox.innerHTML = "Loading...";
    resultBox.classList.remove("hidden");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": "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",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }]
        })
    });

    const data = await response.json();
    const text = data.choices[0].message.content;

    scoreBox.innerHTML = `<pre class="whitespace-pre-wrap">${text}</pre>`;
}