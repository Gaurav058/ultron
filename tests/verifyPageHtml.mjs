import http from "http";

async function fetchPage(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        resolve(data);
      });
    }).on("error", reject);
  });
}

async function verify() {
  console.log("=== VERIFYING ULTRON COMMAND CENTER HTML OUTPUT ===");
  const html = await fetchPage("http://localhost:3000");

  const checks = [
    { label: "Zero artwork: No ultron-core-art.png in rendered HTML", pass: !html.includes("ultron-core-art.png") },
    { label: "Zero artwork: No ultron_reference.png in rendered HTML", pass: !html.includes("ultron_reference.png") },
    { label: "Zero artwork: No <img> tag in rendered HTML", pass: !html.includes("<img") },
    { label: "ULTRON Core Title present", pass: html.includes("ULTRON CORE") },
    { label: "Cognitive Loop Header present", pass: html.includes("COGNITIVE LOOP") },
    { label: "THINK stage present", pass: html.includes("THINK") },
    { label: "KNOW stage present", pass: html.includes("KNOW") },
    { label: "ACT stage present", pass: html.includes("ACT") },
    { label: "VERIFY stage present", pass: html.includes("VERIFY") },
    { label: "REMEMBER stage present", pass: html.includes("REMEMBER") },
    { label: "CURRENT MISSION panel present", pass: html.includes("CURRENT MISSION") },
    { label: "ACTIVE AGENTS panel present", pass: html.includes("ACTIVE AGENTS") },
    { label: "ATTENTION panel present", pass: html.includes("ATTENTION") },
    { label: "WORLD INTELLIGENCE panel present", pass: html.includes("WORLD INTELLIGENCE") },
    { label: "LIVE ACTIVITY panel present", pass: html.includes("LIVE ACTIVITY") },
    { label: "SYSTEM panel present", pass: html.includes("SYSTEM") },
    { label: "Command Bar placeholder present", pass: html.includes("Ask ULTRON to research, build, analyze, automate...") },
    { label: "Operator GAURAV present", pass: html.includes("GAURAV") },
    { label: "Zero black text (no text-black class)", pass: !html.includes("text-black") },
  ];

  let allPassed = true;
  for (const c of checks) {
    if (c.pass) {
      console.log(`✓ [PASS] ${c.label}`);
    } else {
      console.error(`✗ [FAIL] ${c.label}`);
      allPassed = false;
    }
  }

  if (allPassed) {
    console.log("\nALL ACCEPTANCE CRITERIA VERIFIED ON HTTP://LOCALHOST:3000!");
  } else {
    process.exit(1);
  }
}

verify();
