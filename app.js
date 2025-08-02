

document.getElementById("analyzeBtn").addEventListener("click", generateScore);
document.getElementById("screenshotBtn").addEventListener("click", takeScreenshot);

// 扩展的智能职业识别数据库
const CAREER_AI_DATABASE = {
  // 高AI抗性职业特征库
  high_resistance: {
    creative_roles: [
      '设计师', '创意', '艺术家', '作家', '编剧', '导演', '策划', '插画', '摄影', '音乐',
      'designer', 'creative', 'artist', 'writer', 'director', 'photographer', 'musician'
    ],
    leadership_roles: [
      '总监', '经理', '主管', '领导', '总裁', 'CEO', '创始人', '合伙人',
      'manager', 'director', 'leader', 'executive', 'founder', 'partner'
    ],
    consulting_roles: [
      '咨询师', '顾问', '专家', '律师', '医生', '心理', '教师', '培训师', '治疗师',
      'consultant', 'advisor', 'expert', 'lawyer', 'doctor', 'therapist', 'teacher'
    ],
    research_roles: [
      '研究员', '科学家', '学者', '教授', '博士', '分析师',
      'researcher', 'scientist', 'scholar', 'professor', 'analyst'
    ],
    scoreRange: [72, 95],
    percentileRange: [68, 90]
  },
  
  // 中等AI抗性职业特征库
  medium_resistance: {
    tech_roles: [
      '程序员', '开发', '工程师', '架构师', '技术', '运维', '测试', '产品',
      'programmer', 'developer', 'engineer', 'architect', 'technical', 'product'
    ],
    business_roles: [
      '销售', '市场', '营销', '商务', '运营', '项目', '客户', '业务',
      'sales', 'marketing', 'business', 'operations', 'project', 'customer'
    ],
    professional_roles: [
      '财务', '会计', '人力', '行政', '法务', '审计', '采购', '质量',
      'finance', 'accounting', 'HR', 'admin', 'legal', 'audit', 'quality'
    ],
    scoreRange: [42, 71],
    percentileRange: [35, 67]
  },
  
  // 低AI抗性职业特征库
  low_resistance: {
    operational_roles: [
      '操作员', '录入', '打字', '文员', '助理', '前台', '客服',
      'operator', 'data entry', 'clerk', 'assistant', 'receptionist'
    ],
    service_roles: [
      '服务员', '收银', '导购', '保安', '清洁', '配送', '快递',
      'waiter', 'cashier', 'security', 'delivery', 'courier'
    ],
    manufacturing_roles: [
      '工人', '装配', '包装', '检验', '生产', '制造', '加工',
      'worker', 'assembly', 'packaging', 'manufacturing', 'production'
    ],
    transport_roles: [
      '司机', '驾驶员', '运输', '物流', '仓管', '搬运',
      'driver', 'transportation', 'logistics', 'warehouse'
    ],
    scoreRange: [15, 41],
    percentileRange: [10, 34]
  }
};

// 行业加成系数
const INDUSTRY_MODIFIERS = {
  high_value: {
    keywords: ['医疗', '教育', '法律', '金融', '咨询', '科研', 'medical', 'education', 'legal', 'finance', 'research'],
    modifier: 8
  },
  emerging: {
    keywords: ['AI', '人工智能', '区块链', '虚拟现实', 'VR', 'AR', '数字化', '智能', 'blockchain', 'digital'],
    modifier: 6
  },
  creative: {
    keywords: ['设计', '艺术', '创意', '媒体', '娱乐', '游戏', 'design', 'art', 'creative', 'media', 'game'],
    modifier: 5
  },
  traditional: {
    keywords: ['制造', '零售', '餐饮', '服务', 'manufacturing', 'retail', 'food', 'service'],
    modifier: -3
  },
  automation_prone: {
    keywords: ['物流', '运输', '生产', '加工', 'logistics', 'transport', 'production', 'processing'],
    modifier: -6
  }
};

// 职位级别加成
const SENIORITY_BONUS = {
  executive: {
    keywords: ['总', '首席', 'CEO', 'CTO', 'CFO', '总裁', '总监', 'president', 'chief', 'vice'],
    bonus: 12
  },
  senior: {
    keywords: ['高级', '资深', '主任', '专家', 'senior', 'principal', 'expert', 'lead'],
    bonus: 8
  },
  specialized: {
    keywords: ['专业', '技术', '顾问', 'specialist', 'technical', 'consultant'],
    bonus: 5
  },
  junior: {
    keywords: ['初级', '助理', '实习', 'junior', 'assistant', 'intern'],
    bonus: -5
  }
};

// 智能职业分析核心引擎
function analyzeCareerIntelligently(jobTitle, language = 'zh') {
  console.log(`🔍 开始分析职业: "${jobTitle}"`);
  
  const title = jobTitle.toLowerCase().trim();
  const words = title.split(/[\s\-_,，、]+/).filter(w => w.length > 0);
  
  // 1. 职业分类匹配
  let bestCategory = 'medium_resistance';
  let maxScore = 0;
  let matchedFeatures = [];
  
  for (let category in CAREER_AI_DATABASE) {
    const categoryData = CAREER_AI_DATABASE[category];
    let categoryScore = 0;
    let categoryMatches = [];
    
    // 检查每个特征组
    for (let roleType in categoryData) {
      if (roleType === 'scoreRange' || roleType === 'percentileRange') continue;
      
      const keywords = categoryData[roleType];
      const matches = keywords.filter(keyword => 
        words.some(word => 
          word.includes(keyword.toLowerCase()) || 
          keyword.toLowerCase().includes(word) ||
          title.includes(keyword.toLowerCase())
        )
      );
      
      if (matches.length > 0) {
        categoryScore += matches.length * 2;
        categoryMatches.push(...matches);
      }
    }
    
    if (categoryScore > maxScore) {
      maxScore = categoryScore;
      bestCategory = category;
      matchedFeatures = categoryMatches;
    }
  }
  
  console.log(`📊 分类结果: ${bestCategory}, 匹配分数: ${maxScore}, 特征: [${matchedFeatures.join(', ')}]`);
  
  // 2. 生成基础分数
  const baseRange = CAREER_AI_DATABASE[bestCategory].scoreRange;
  const basePercentileRange = CAREER_AI_DATABASE[bestCategory].percentileRange;
  
  let baseScore = Math.floor(Math.random() * (baseRange[1] - baseRange[0] + 1)) + baseRange[0];
  let basePercentile = Math.floor(Math.random() * (basePercentileRange[1] - basePercentileRange[0] + 1)) + basePercentileRange[0];
  
  // 3. 应用行业修正
  let industryBonus = 0;
  for (let industry in INDUSTRY_MODIFIERS) {
    const industryData = INDUSTRY_MODIFIERS[industry];
    const hasMatch = industryData.keywords.some(keyword => 
      title.includes(keyword.toLowerCase())
    );
    if (hasMatch) {
      industryBonus = industryData.modifier;
      console.log(`🏭 行业修正: ${industry} (${industryBonus}分)`);
      break;
    }
  }
  
  // 4. 应用职位级别加成
  let seniorityBonus = 0;
  for (let level in SENIORITY_BONUS) {
    const levelData = SENIORITY_BONUS[level];
    const hasMatch = levelData.keywords.some(keyword => 
      title.includes(keyword.toLowerCase())
    );
    if (hasMatch) {
      seniorityBonus = levelData.bonus;
      console.log(`📈 级别加成: ${level} (${seniorityBonus}分)`);
      break;
    }
  }
  
  // 5. 计算最终分数
  let finalScore = baseScore + industryBonus + seniorityBonus;
  let finalPercentile = basePercentile + Math.floor((industryBonus + seniorityBonus) / 2);
  
  // 确保分数在合理范围内
  finalScore = Math.max(10, Math.min(95, finalScore));
  finalPercentile = Math.max(5, Math.min(95, finalPercentile));
  
  console.log(`🎯 最终得分: ${finalScore}/100 (基础:${baseScore} + 行业:${industryBonus} + 级别:${seniorityBonus})`);
  console.log(`📊 超越比例: ${finalPercentile}%`);
  
  // 6. 生成详细分析报告
  return generateDetailedReport(jobTitle, finalScore, finalPercentile, bestCategory, matchedFeatures, language);
}

// 生成详细分析报告
function generateDetailedReport(jobTitle, score, percentile, category, features, lang) {
  const isZh = lang === 'zh';
  
  // 根据分数生成评估等级
  const getAssessmentLevel = (score, isZh) => {
    if (score >= 80) return isZh ? '极高抗性' : 'Very High Resistance';
    if (score >= 65) return isZh ? '高抗性' : 'High Resistance';
    if (score >= 50) return isZh ? '中等抗性' : 'Medium Resistance';
    if (score >= 35) return isZh ? '较低抗性' : 'Low Resistance';
    return isZh ? '高风险' : 'High Risk';
  };
  
  // 生成个性化建议
  const getPersonalizedAdvice = (jobTitle, score, category, isZh) => {
    const baseAdvice = [];
    
    if (score >= 70) {
      baseAdvice.push(
        isZh ? '继续深化您的专业领域expertise，建立不可替代的知识壁垒' : 'Continue deepening your domain expertise to build irreplaceable knowledge barriers',
        isZh ? '学会利用AI工具提升工作效率，成为人机协作的典范' : 'Learn to leverage AI tools for efficiency, becoming a model of human-AI collaboration',
        isZh ? '发展跨领域整合能力，成为复合型专业人才' : 'Develop cross-domain integration abilities to become a versatile professional'
      );
    } else if (score >= 45) {
      baseAdvice.push(
        isZh ? '积极拥抱AI技术，将其作为提升能力的工具而非威胁' : 'Actively embrace AI technology as a capability enhancement tool rather than a threat',
        isZh ? '重点发展AI难以替代的软技能：创造力、批判思维、情商' : 'Focus on developing soft skills that AI cannot replace: creativity, critical thinking, emotional intelligence',
        isZh ? '关注行业数字化趋势，提前布局未来发展方向' : 'Monitor industry digitalization trends and plan ahead for future development'
      );
    } else {
      baseAdvice.push(
        isZh ? '紧急制定技能转型计划，考虑向更高价值的职业方向发展' : 'Urgently develop a skill transformation plan, consider moving towards higher-value career directions',
        isZh ? '学习与AI协作的新技能，寻找人机结合的工作模式' : 'Learn new skills for AI collaboration, find human-AI integrated work models',
        isZh ? '考虑进入管理、创意或服务升级等AI难以完全替代的领域' : 'Consider entering management, creative, or service upgrade areas that AI cannot fully replace'
      );
    }
    
    // 根据具体职业添加针对性建议
    const jobLower = jobTitle.toLowerCase();
    if (jobLower.includes('程序') || jobLower.includes('开发') || jobLower.includes('engineer')) {
      baseAdvice.push(isZh ? '关注低代码平台趋势，向系统架构和技术管理方向发展' : 'Focus on low-code platform trends, develop towards system architecture and technical management');
    }
    if (jobLower.includes('设计') || jobLower.includes('design')) {
      baseAdvice.push(isZh ? '学会使用AI设计工具，专注于创意策略和用户体验层面' : 'Learn AI design tools, focus on creative strategy and user experience aspects');
    }
    if (jobLower.includes('销售') || jobLower.includes('sales')) {
      baseAdvice.push(isZh ? '利用AI进行客户分析和市场预测，专注于关系建立和策略制定' : 'Use AI for customer analysis and market prediction, focus on relationship building and strategic planning');
    }
    
    return baseAdvice;
  };
  
  const assessmentLevel = getAssessmentLevel(score, isZh);
  const personalizedAdvice = getPersonalizedAdvice(jobTitle, score, category, isZh);
  
  if (isZh) {
    return {
      "title": `${jobTitle} - AI时代职业生存力深度评估`,
      "top_charts": {
        "left_chart": {
          "label": "AI世界生存分数",
          "score": score,
          "max_score": 100
        },
        "right_chart": {
          "label": "超越职业比例",
          "percentile": percentile
        }
      },
      "slogan": {
        "title": `${jobTitle}: ${assessmentLevel}职业`,
        "text": `在AI重塑的职场生态中，${jobTitle}展现出${score >= 70 ? '强劲的' : score >= 45 ? '稳定的' : '需要提升的'}竞争优势，智能协作开启职业新篇章`
      },
      "cards": [
        {
          "type": "score_analysis",
          "title": "🎯 AI替代风险综合评估",
          "score": `您的职业获得 ${score}/100 分的AI生存评级`,
          "meaning": score >= 70 ? "优秀！您的职业在AI时代具有强大的生存优势，未来发展前景光明" : 
                    score >= 45 ? "良好！您的职业需要主动适应AI发展，抓住人机协作机遇" : 
                    "警示！您的职业面临较大AI替代风险，需要尽快考虑转型升级",
          "dimensions": [
            { 
              "title": "💡 创造性思维需求", 
              "description": score >= 70 ? "需要高度原创性和创新思维，AI难以完全模拟人类的创意灵感" : 
                           score >= 45 ? "需要一定创造性思维，可与AI协作产生更优秀的成果" : 
                           "创造性需求相对较低，AI可以高效处理大部分工作内容"
            },
            { 
              "title": "🤝 人际互动复杂度", 
              "description": score >= 70 ? "涉及复杂的情感交流、共情理解和人际关系管理" : 
                           score >= 45 ? "需要人际沟通协调能力，但可部分借助数字化工具" : 
                           "人际交往相对标准化，AI可以有效模拟和处理"
            },
            { 
              "title": "🧠 专业判断要求", 
              "description": score >= 70 ? "需要基于丰富经验和直觉的复杂专业判断" : 
                           score >= 45 ? "需要专业知识和技能，AI可以提供决策支持" : 
                           "判断标准相对明确，AI算法可以高效准确处理"
            },
            { 
              "title": "⚡ 工作灵活度", 
              "description": score >= 70 ? "工作内容多样化，需要强大的适应性和应变能力" : 
                           score >= 45 ? "有一定灵活性要求，但存在规律和模式可循" : 
                           "工作流程相对固定，易于标准化和自动化处理"
            }
          ]
        },
        {
          "type": "easy_to_replace",
          "title": "⚠️ AI具有明显优势的任务",
          "tasks": [
            "📊 大量重复性数据处理、统计分析和报表生成工作",
            "📝 标准化文档撰写、格式调整和信息录入任务", 
            "🔍 基础信息检索、资料整理和简单的内容筛选",
            "📋 流程化操作执行和规则化的质量检查工作",
            "🔄 预设条件下的决策判断和异常情况识别处理"
          ]
        },
        {
          "type": "hard_to_replace",
          "title": "💎 人类独有的核心竞争力",
          "tasks": [
            "🧠 复杂战略制定和创新解决方案设计能力",
            "🎨 原创性创意构思和艺术审美判断能力",
            "💬 深度情感沟通和复杂人际关系协调能力", 
            "🔄 跨领域知识整合和直觉性洞察能力",
            "👥 团队文化塑造和人员激励管理能力",
            "🎯 用户需求深度理解和个性化服务设计能力"
          ]
        },
        {
          "type": "recommended_tools",
          "title": "🛠️ AI时代职场必备工具",
          "tools": [
            { "name": "腾讯混元", "function": "国产AI大模型，智能对话和高质量内容创作", "url": "https://hunyuan.tencent.com" },
            { "name": "ChatGPT", "function": "全能AI助手，提升日常工作效率和思维启发", "url": "https://chatgpt.com" },
            { "name": "Claude", "function": "专业文档分析和深度思考伙伴", "url": "https://claude.ai" },
            { "name": "Midjourney", "function": "AI创意图像生成，激发视觉设计灵感", "url": "https://midjourney.com" },
            { "name": "GitHub Copilot", "function": "代码智能生成工具，开发效率倍增器", "url": "https://github.com/features/copilot" },
            { "name": "Notion AI", "function": "智能知识管理和团队协作效率平台", "url": "https://notion.so" }
          ]
        },
        {
          "type": "career_advice",
          "title": "🚀 个性化职业发展战略建议",
          "advice": personalizedAdvice
        }
      ]
    };
  } else {
    // 英文版本
    return {
      "title": `${jobTitle} - AI Era Career Survivability Deep Assessment`,
      "top_charts": {
        "left_chart": {
          "label": "AI Survival Score",
          "score": score,
          "max_score": 100
        },
        "right_chart": {
          "label": "Beats Other Jobs",
          "percentile": percentile
        }
      },
      "slogan": {
        "title": `${jobTitle}: ${assessmentLevel} Profession`,
        "text": `In the AI-reshaped workplace ecosystem, ${jobTitle} demonstrates ${score >= 70 ? 'strong' : score >= 45 ? 'stable' : 'evolving'} competitive advantages, where intelligent collaboration opens new career chapters`
      },
      "cards": [
        {
          "type": "score_analysis",
          "title": "🎯 AI Replacement Risk Comprehensive Assessment",
          "score": `Your profession scores ${score}/100 for AI survival rating`,
          "meaning": score >= 70 ? "Excellent! Your profession has strong survival advantages in the AI era with bright future prospects" : 
                    score >= 45 ? "Good! Your profession needs to actively adapt to AI development and seize human-AI collaboration opportunities" : 
                    "Alert! Your profession faces significant AI replacement risks and should consider transformation and upgrading soon",
          "dimensions": [
            { 
              "title": "💡 Creative Thinking Requirements", 
              "description": score >= 70 ? "Requires high originality and innovative thinking that AI cannot fully simulate human creative inspiration" : 
                           score >= 45 ? "Needs some creative thinking, can collaborate with AI to produce superior results" : 
                           "Relatively low creativity requirements, AI can efficiently handle most work content"
            },
            { 
              "title": "🤝 Interpersonal Interaction Complexity", 
              "description": score >= 70 ? "Involves complex emotional communication, empathetic understanding, and interpersonal relationship management" : 
                           score >= 45 ? "Requires interpersonal communication and coordination skills, but can partially use digital tools" : 
                           "Relatively standardized interpersonal interaction that AI can effectively simulate and handle"
            },
            { 
              "title": "🧠 Professional Judgment Requirements", 
              "description": score >= 70 ? "Requires complex professional judgment based on rich experience and intuition" : 
                           score >= 45 ? "Needs professional knowledge and skills, AI can provide decision support" : 
                           "Relatively clear judgment standards that AI algorithms can handle efficiently and accurately"
            },
            { 
              "title": "⚡ Work Flexibility", 
              "description": score >= 70 ? "Diverse work content requiring strong adaptability and responsiveness" : 
                           score >= 45 ? "Has certain flexibility requirements but follows patterns and rules" : 
                           "Relatively fixed work processes, easy to standardize and automate"
            }
          ]
        },
        {
          "type": "easy_to_replace",
          "title": "⚠️ Tasks Where AI Has Clear Advantages",
          "tasks": [
            "📊 Large-scale repetitive data processing, statistical analysis and report generation",
            "📝 Standardized document writing, formatting and information entry tasks",
            "🔍 Basic information retrieval, material organization and simple content filtering",
            "📋 Process-oriented operation execution and rule-based quality checking",
            "🔄 Decision-making under preset conditions and anomaly identification handling"
          ]
        },
        {
          "type": "hard_to_replace",
          "title": "💎 Uniquely Human Core Competencies",
          "tasks": [
            "🧠 Complex strategic formulation and innovative solution design capabilities",
            "🎨 Original creative conceptualization and artistic aesthetic judgment abilities",
            "💬 Deep emotional communication and complex interpersonal coordination skills",
            "🔄 Cross-domain knowledge integration and intuitive insight capabilities",
            "👥 Team culture shaping and personnel motivation management abilities",
            "🎯 Deep user needs understanding and personalized service design capabilities"
          ]
        },
        {
          "type": "recommended_tools",
          "title": "🛠️ Essential AI Era Workplace Tools",
          "tools": [
            { "name": "Tencent Hunyuan", "function": "Domestic AI large model for intelligent dialogue and high-quality content creation", "url": "https://hunyuan.tencent.com" },
            { "name": "ChatGPT", "function": "Versatile AI assistant for daily productivity enhancement and thinking inspiration", "url": "https://chatgpt.com" },
            { "name": "Claude", "function": "Professional document analysis and deep thinking companion", "url": "https://claude.ai" },
            { "name": "Midjourney", "function": "AI creative image generation for visual design inspiration", "url": "https://midjourney.com" },
            { "name": "GitHub Copilot", "function": "Intelligent code generation tool and development efficiency multiplier", "url": "https://github.com/features/copilot" },
            { "name": "Notion AI", "function": "Smart knowledge management and team collaboration efficiency platform", "url": "https://notion.so" }
          ]
        },
        {
          "type": "career_advice",
          "title": "🚀 Personalized Career Development Strategic Recommendations",
          "advice": personalizedAdvice
        }
      ]
    };
  }
}

// 主要的生成函数 - 完全替换原来的 generateScore
async function generateScore() {
  const input = document.getElementById("inputText").value.trim();
  const lang = document.documentElement.lang;
  const resultCard = document.getElementById("resultCard");
  const resultText = document.getElementById("resultText");

  if (!input) {
    alert(lang === "zh" ? "请输入职业名称" : "Please enter a job title.");
    return;
  }

  // 显示分析中的状态
  resultText.innerHTML = (lang === "zh" ? 
    "🧠 AI智能分析引擎启动中...<br><small>正在进行多维度职业特征识别</small>" : 
    "🧠 AI intelligent analysis engine starting...<br><small>Performing multi-dimensional career feature recognition</small>");
  resultCard.classList.remove("hidden");

  // 模拟真实AI处理时间，增加用户体验
  const processingMessages = lang === "zh" ? [
    "🔍 职业特征识别中...",
    "📊 多维度风险评估中...", 
    "🎯 生成个性化建议中...",
    "✨ 完成智能分析报告..."
  ] : [
    "🔍 Career feature recognition...",
    "📊 Multi-dimensional risk assessment...",
    "🎯 Generating personalized recommendations...", 
    "✨ Completing intelligent analysis report..."
  ];

  // 逐步显示处理进度
  for (let i = 0; i < processingMessages.length; i++) {
    setTimeout(() => {
      if (resultText && !resultCard.classList.contains("hidden")) {
        resultText.innerHTML = processingMessages[i];
      }
    }, i * 800);
  }

  // 执行实际分析
  setTimeout(() => {
    try {
      console.log(`\n🚀 开始分析职业: "${input}"`);
      const result = analyzeCareerIntelligently(input, lang);
      
      if (result && result.top_charts) {
        window.lastResult = result;
        renderStructuredResult(result);
        
        // 成功日志
        console.log(`✅ 分析完成! 职业: ${input}, 得分: ${result.top_charts.left_chart.score}/100, 超越: ${result.top_charts.right_chart.percentile}%`);
        
        // 添加成功提示动画
        setTimeout(() => {
          const titleElement = document.querySelector('#resultCard h2');
          if (titleElement) {
            titleElement.style.animation = 'pulse 1s ease-in-out';
          }
        }, 500);
        
      } else {
        throw new Error("Analysis result is invalid");
      }
      
    } catch (error) {
      console.error('❌ 分析失败:', error);
      resultText.innerHTML = `
        <div style='color:#ff6b6b; text-align:center; padding:30px; background: rgba(255,107,107,0.1); border-radius: 15px; border: 1px solid rgba(255,107,107,0.3);'>
          <h3>⚠️ ${lang === "zh" ? "分析失败" : "Analysis Failed"}</h3>
          <p style='margin: 15px 0; color: rgba(255,255,255,0.8);'>
            ${lang === "zh" ? "系统暂时无法处理您的请求，请稍后重试" : "System temporarily unable to process your request, please try again later"}
          </p>
          <button onclick="generateScore()" 
            style="margin-top: 15px; padding: 12px 24px; background: #6c63ff; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.3s ease;"
            onmouseover="this.style.background='#5851db'" 
            onmouseout="this.style.background='#6c63ff'">
            ${lang === "zh" ? "🔄 重新分析" : "🔄 Retry Analysis"}
          </button>
        </div>
      `;
    }
  }, 3200); // 总计约3.2秒的处理时间
}

// renderStructuredResult 函数保持不变
function renderStructuredResult(data) {
  const resultText = document.getElementById("resultText");
  let html = `<h2>${data.title}</h2>`;

  if (data.top_charts) {
    html += `<div class="chart">
      <div>
        <div style="font-weight:bold">${data.top_charts.left_chart.label}</div>
        <canvas id="circleChart" width="140" height="140"></canvas>
      </div>
      <div>
        <div style="font-weight:bold">${data.top_charts.right_chart.label}</div>
        <div style="margin-top:12px; background:rgba(255,255,255,0.1); border-radius:12px; width:220px; height:24px; position:relative; border: 1px solid rgba(255,255,255,0.2); overflow: hidden;">
          <div style="width:${data.top_charts.right_chart.percentile}%; background:linear-gradient(90deg, #6c63ff, #ff6b9d); height:100%; border-radius:11px; transition: width 0.3s ease;"></div>
          <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); color:#fff; font-weight:bold; font-size:14px; z-index:10; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">${data.top_charts.right_chart.percentile}%</div>
        </div>
      </div>
    </div>`;
  }

  html += `<div class="slogan-block"><h3>${data.slogan.title}</h3><p>${data.slogan.text}</p></div>`;

  data.cards.forEach(card => {
    html += `<div class="result-block"><h3>${card.title}</h3>`;
    if (card.type === "score_analysis") {
      html += `<p>${card.score}</p><p>${card.meaning}</p>`;
      card.dimensions.forEach(dim => {
        html += `<p><strong>${dim.title}</strong>: ${dim.description}</p>`;
      });
    } else if (card.type === "easy_to_replace" || card.type === "hard_to_replace") {
      html += "<ul>";
      card.tasks.forEach(task => html += `<li>${task}</li>`);
      html += "</ul>";
    } else if (card.type === "recommended_tools") {
      html += "<ul>";
      card.tools.forEach(tool => {
        html += `<li><a href="${tool.url}" target="_blank">${tool.name}</a>: ${tool.function}</li>`;
      });
      html += "</ul>";
    } else if (card.type === "career_advice") {
      html += "<ul>";
      card.advice.forEach(tip => html += `<li>${tip}</li>`);
      html += "</ul>";
    }
    html += "</div>";
  });

  resultText.innerHTML = html;

  const canvas = document.getElementById("circleChart");
  if (canvas && data.top_charts.left_chart.score) {
    const ctx = canvas.getContext("2d");
    const score = data.top_charts.left_chart.score;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 10;

    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.beginPath();
    ctx.arc(70, 70, 60, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.strokeStyle = "#6c63ff";
    ctx.beginPath();
    ctx.arc(70, 70, 60, -0.5 * Math.PI, (score / 100) * 2 * Math.PI - 0.5 * Math.PI);
    ctx.stroke();

    ctx.font = "16px Inter";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText(score + "/100", 70, 75);
  }
}

// takeScreenshot 函数保持不变
function takeScreenshot() {
  const result = document.getElementById("resultCard");
  
  if (result.classList.contains("hidden")) {
    alert(document.documentElement.lang === "zh" ? "请先分析一个职业" : "Please analyze a job first");
    return;
  }

  // Loading提示
  const loadingDiv = document.createElement('div');
  loadingDiv.style.cssText = `
    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
    background: rgba(0,0,0,0.8); color: white; padding: 20px; border-radius: 10px;
    z-index: 9999; font-size: 16px;
  `;
  loadingDiv.textContent = document.documentElement.lang === "zh" ? "正在生成截图..." : "Generating screenshot...";
  document.body.appendChild(loadingDiv);

  // 创建截图专用容器
  const screenshotContainer = document.createElement('div');
  screenshotContainer.style.cssText = `
    position: fixed; top: -9999px; left: 0;
    width: 850px; min-height: 600px;
    background: #1a1a2e;
    padding: 40px; border-radius: 20px; color: white;
    font-family: 'Inter', Arial, sans-serif; font-size: 16px; line-height: 1.6;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  `;

  // 获取数据
  const data = window.lastResult;
  if (!data) {
    document.body.removeChild(loadingDiv);
    alert("数据不完整，请重新分析");
    return;
  }

  // 手动构建HTML内容
  let html = `
    <h2 style="font-size: 28px; margin-bottom: 25px; color: #ffffff; 
               font-weight: 700; text-align: center; text-shadow: 0 0 20px rgba(108, 99, 255, 0.5);">${data.title}</h2>
    
    <div style="display: flex; justify-content: space-around; align-items: center; margin-bottom: 30px; 
                padding: 25px; background: rgba(255,255,255,0.1); border-radius: 20px; 
                border: 1px solid rgba(255,255,255,0.2);">
      
      <div style="text-align: center;">
        <div style="font-weight: 700; font-size: 16px; margin-bottom: 15px;">${data.top_charts.left_chart.label}</div>
        <canvas id="screenshotChart" width="140" height="140" style="border-radius: 50%; background: rgba(255,255,255,0.05);"></canvas>
      </div>
      
      <div style="text-align: center;">
        <div style="font-weight: 700; font-size: 16px; margin-bottom: 15px;">${data.top_charts.right_chart.label}</div>
        <div style="margin-top: 12px; background: rgba(255,255,255,0.2); border-radius: 12px; 
                    width: 220px; height: 24px; position: relative; border: 1px solid rgba(255,255,255,0.3);">
          <div style="width: ${data.top_charts.right_chart.percentile}%; 
                      background: linear-gradient(90deg, #6c63ff, #ff6b9d); 
                      height: 100%; border-radius: 11px; position: relative; overflow: hidden;">
          </div>
          <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                      color: #fff; font-weight: bold; font-size: 14px; z-index: 2;">
            ${data.top_charts.right_chart.percentile}%
          </div>
        </div>
      </div>
    </div>

    <div style="background: rgba(255,255,255,0.08); padding: 25px; margin-bottom: 20px; 
                border-radius: 20px; border: 1px solid rgba(255,255,255,0.15); 
                border-left: 4px solid #6c63ff;">
      <h3 style="margin: 0 0 15px 0; font-size: 20px; font-weight: 600;">${data.slogan.title}</h3>
      <p style="margin: 0; color: rgba(255,255,255,0.9);">${data.slogan.text}</p>
    </div>
  `;

  // 添加卡片内容
  data.cards.forEach(card => {
    html += `
      <div style="background: rgba(255,255,255,0.08); padding: 25px; margin-bottom: 20px; 
                  border-radius: 20px; border: 1px solid rgba(255,255,255,0.15); 
                  border-left: 4px solid #ff6b9d; position: relative;">
        <h3 style="margin: 0 0 15px 0; font-size: 20px; font-weight: 600; color: #ffffff;">${card.title}</h3>
    `;

    if (card.type === "score_analysis") {
      html += `<p style="margin-bottom: 12px; color: rgba(255,255,255,0.9);">${card.score}</p>`;
      html += `<p style="margin-bottom: 12px; color: rgba(255,255,255,0.9);">${card.meaning}</p>`;
      card.dimensions.forEach(dim => {
        html += `<p style="margin-bottom: 8px; color: rgba(255,255,255,0.9);">
                   <strong style="color: #4ecdc4;">${dim.title}</strong>: ${dim.description}
                 </p>`;
      });
    } else if (card.type === "easy_to_replace" || card.type === "hard_to_replace") {
      html += "<ul style='padding-left: 20px; margin: 0;'>";
      card.tasks.forEach(task => {
        html += `<li style="margin-bottom: 8px; color: rgba(255,255,255,0.9);">${task}</li>`;
      });
      html += "</ul>";
    } else if (card.type === "recommended_tools") {
      html += "<ul style='padding-left: 20px; margin: 0;'>";
      card.tools.forEach(tool => {
        html += `<li style="margin-bottom: 8px; color: rgba(255,255,255,0.9);">
                   <strong style="color: #6c63ff;">${tool.name}</strong>: ${tool.function}
                 </li>`;
      });
      html += "</ul>";
    } else if (card.type === "career_advice") {
      html += "<ul style='padding-left: 20px; margin: 0;'>";
      card.advice.forEach(tip => {
        html += `<li style="margin-bottom: 8px; color: rgba(255,255,255,0.9);">${tip}</li>`;
      });
      html += "</ul>";
    }
    html += "</div>";
  });

  screenshotContainer.innerHTML = html;
  document.body.appendChild(screenshotContainer);

  // 绘制圆形图表
  setTimeout(() => {
    const canvas = screenshotContainer.querySelector('#screenshotChart');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const score = data.top_charts.left_chart.score;
      
      // 清除画布
      ctx.clearRect(0, 0, 140, 140);
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';

      // 背景圆圈
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.beginPath();
      ctx.arc(70, 70, 60, 0, 2 * Math.PI);
      ctx.stroke();

      // 进度圆圈
      ctx.strokeStyle = "#6c63ff";
      ctx.beginPath();
      ctx.arc(70, 70, 60, -0.5 * Math.PI, (score / 100) * 2 * Math.PI - 0.5 * Math.PI);
      ctx.stroke();

      // 中心文字
      ctx.font = "bold 18px Inter";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${score}/100`, 70, 70);
    }

    // 执行截图
    html2canvas(screenshotContainer, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      width: 900,
      height: screenshotContainer.offsetHeight
    }).then(canvas => {
      // 清理
      document.body.removeChild(screenshotContainer);
      document.body.removeChild(loadingDiv);
      
      // 下载
      const link = document.createElement("a");
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      link.download = `ai-survival-analysis-${timestamp}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
      
      // 成功提示
      const successDiv = document.createElement('div');
      successDiv.style.cssText = `
        position: fixed; top: 20px; right: 20px; background: #4CAF50; color: white;
        padding: 15px 20px; border-radius: 8px; z-index: 9999; font-size: 14px;
      `;
      successDiv.innerHTML = `✅ ${document.documentElement.lang === "zh" ? "截图已保存" : "Screenshot saved"}`;
      document.body.appendChild(successDiv);
      
      setTimeout(() => {
        if (document.body.contains(successDiv)) {
          document.body.removeChild(successDiv);
        }
      }, 3000);
      
    }).catch(error => {
      // 错误处理
      if (document.body.contains(screenshotContainer)) {
        document.body.removeChild(screenshotContainer);
      }
      if (document.body.contains(loadingDiv)) {
        document.body.removeChild(loadingDiv);
      }
      console.error('截图失败:', error);
      alert(document.documentElement.lang === "zh" ? "截图失败，请重试" : "Screenshot failed, please try again");
    });
  }, 100);
}

// 添加一些CSS动画效果
if (!document.getElementById('career-analysis-styles')) {
  const style = document.createElement('style');
  style.id = 'career-analysis-styles';
  style.textContent = `
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .result-block {
      animation: fadeInUp 0.6s ease-out;
    }
    
    .result-block:nth-child(odd) {
      animation-delay: 0.1s;
    }
    
    .result-block:nth-child(even) {
      animation-delay: 0.2s;
    }
  `;
  document.head.appendChild(style);
}