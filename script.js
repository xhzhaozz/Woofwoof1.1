const TAGS = {
  relation: ["父子", "师生", "骨科", "乐队吉他手&男高", "dom&sub", "明星&网黄", "三角关系"],
  background: ["现实背景", "古风", "民国", "乡土", "出租屋"],
  plot: ["Phone sex", "Public sex", "回家过年", "调教", "一夜情", "私奔", "0713喝酒唱歌"],
  pov: ["陈楚生第一人称", "王栎鑫第一人称", "双方第三人称", "第三者第一视角"],
  format: ["纯对话", "日记体", "论坛体", "多段式超短篇"],
  style: [
    "安德烈·艾席蒙《Call Me By Your Name》",
    "王小波《爱你就像爱生命》",
    "马尔克斯《百年孤独》",
    "特德·姜《你一生的故事》",
    "双雪涛《平原上的摩西》"
  ]
};

const selected = {};

function init() {
  Object.keys(TAGS).forEach(key => {
    selected[key] = [];
    const container = document.getElementById(key);
    TAGS[key].forEach(tag => {
      const btn = document.createElement("button");
      btn.innerText = tag;
      btn.onclick = () => {
        btn.classList.toggle("active");
        if (selected[key].includes(tag)) {
          selected[key] = selected[key].filter(t => t !== tag);
        } else {
          selected[key].push(tag);
        }
      };
      container.appendChild(btn);
    });
  });
}

async function generate() {
  const styleText = document.getElementById("styleText").value;

  const prompt = `
CP：陈楚生 × 王栎鑫（人设固定，避免OOC）

人物关系：${selected.relation.join("、")}
背景设定：${selected.background.join("、")}
关键情节：${selected.plot.join("、")}
人物视角：${selected.pov.join("、")}
表现形式：${selected.format.join("、")}

参考作品风格：
${selected.style.join("、")}
${styleText ? "\n参考段落：\n" + styleText : ""}

请写一段中文同人小说，情感克制但张力强，避免AI腔。
字数约800字。
`;

  document.getElementById("result").value = "生成中…";

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer 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"
    },
    body: JSON.stringify({
      model: "gpt-4.1",
      messages: [
        { role: "system", content: "你是一名成熟、克制的中文同人作者。" },
        { role: "user", content: prompt }
      ],
      temperature: 0.85
    })
  });

  const data = await res.json();
  document.getElementById("result").value =
    data.choices?.[0]?.message?.content || "生成失败";
}

init();
