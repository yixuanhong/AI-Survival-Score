function toggleLang() {
  const lang = document.documentElement.lang;
  if (lang === "en") {
    document.documentElement.lang = "zh";
    document.querySelector("h1").innerText = "🧠 AI岗位生存分析";
    document.querySelector(".subtitle").innerText = "输入你的职业名称，让我们分析它是否会被 AI 替代";
    document.querySelector("label").innerText = "职业名称：";
    document.getElementById("inputText").placeholder = "如：金融分析师";
    document.getElementById("analyzeBtn").innerText = "立即分析 🔍";
    document.getElementById("screenshotBtn").innerText = "📸 保存截图";
    
    const resultText = document.getElementById("resultText");
    if (resultText.innerText === "Your result will appear here...") {
      resultText.innerText = "分析结果将显示在这里...";
    }
    
    if (!document.getElementById("resultCard").classList.contains("hidden")) {
      resultText.innerHTML = "<div style='text-align:center; color:#666; padding:20px;'>🌐 语言已切换到中文<br>请重新点击立即分析获取中文结果</div>";
    }
  } else {
    document.documentElement.lang = "en";
    document.querySelector("h1").innerText = "🧠 AI Survival Score";
    document.querySelector(".subtitle").innerText = "Enter your job title and let us analyze AI risk";
    document.querySelector("label").innerText = "Job Title:";
    document.getElementById("inputText").placeholder = "e.g. Financial Analyst";
    document.getElementById("analyzeBtn").innerText = "Analyze Now 🔍";
    document.getElementById("screenshotBtn").innerText = "📸 Save Screenshot";
    
    const resultText = document.getElementById("resultText");
    if (resultText.innerText === "分析结果将显示在这里...") {
      resultText.innerText = "Your result will appear here...";
    }
    
    if (!document.getElementById("resultCard").classList.contains("hidden")) {
      resultText.innerHTML = "<div style='text-align:center; color:#666; padding:20px;'>🌐 Language switched to English<br>Please click Analyze Now again to get English results</div>";
    }
  }
}