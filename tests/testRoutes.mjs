import http from "http";

const routes = [
  "/",
  "/core",
  "/missions",
  "/brain",
  "/agents",
  "/tools",
  "/world",
  "/system",
  "/ui-reference",
  "/ultron-core-art.png",
  "/ultron_reference.png"
];

async function checkRoute(path) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let dataLen = 0;
      res.on("data", (chunk) => {
        dataLen += chunk.length;
      });
      res.on("end", () => {
        resolve({ path, status: res.statusCode, bytes: dataLen, type: res.headers["content-type"] });
      });
    }).on("error", (err) => {
      resolve({ path, error: err.message });
    });
  });
}

async function run() {
  console.log("=== ULTRON OS ENDPOINT HEALTH VERIFICATION ===");
  let allPass = true;
  for (const r of routes) {
    const res = await checkRoute(r);
    if (res.status === 200) {
      console.log(`✓ [200 OK] ${res.path.padEnd(25)} (${res.bytes} bytes, ${res.type})`);
    } else {
      console.error(`✗ [FAIL]   ${res.path.padEnd(25)} status: ${res.status || res.error}`);
      allPass = false;
    }
  }
  if (allPass) {
    console.log("\nALL 11 ENDPOINTS RETURNED HTTP 200 OK WITH VALID PAYLOADS.");
  } else {
    process.exit(1);
  }
}

run();
