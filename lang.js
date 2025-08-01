function toggleLang() {
    const lang = document.documentElement.lang;
    if (lang === "en") {
        document.documentElement.lang = "zh";
        document.getElementById("subtitle").innerText = "你担心 AI 会取代你的工作吗？我们做了一个工具来评估你工作的自动化程度 —— 并告诉你如何保持不可替代。";
        document.getElementById("inputLabel").innerText = "请输入你的职业名称或上传职位描述：";
        document.querySelector("button").innerText = "生成分析";
    } else {
        document.documentElement.lang = "en";
        document.getElementById("subtitle").innerText = "Wonder if AI is going to take your job? We built a tool that tells you how much of your job is automatable — and what you can do to stay irreplaceable.";
        document.getElementById("inputLabel").innerText = "Enter your job title or upload a job description:";
        document.querySelector("button").innerText = "Generate Analysis";
    }
}