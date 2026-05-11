const { chromium } = require("playwright");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const out = path.resolve(__dirname, "..");
const url = pathToFileURL(path.join(out, "index.html")).href;

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  });
  const page = await browser.newPage({ viewport: { width: 831, height: 909 } });
  await page.goto(url, { waitUntil: "networkidle" });

  await page.getByRole("tab", { name: "Analyze" }).click();
  const rowText = await page.locator("[data-row-value='primary']").innerText();
  if (rowText !== "Operational analytics dashboard") {
    throw new Error(`Analyze tab did not update content. Saw: ${rowText}`);
  }

  await page.getByRole("link", { name: "Start a conversation" }).click();
  const hash = await page.evaluate(() => window.location.hash);
  if (hash !== "#contact") {
    throw new Error(`Start a conversation did not navigate to contact. Saw: ${hash}`);
  }

  await browser.close();
})();
