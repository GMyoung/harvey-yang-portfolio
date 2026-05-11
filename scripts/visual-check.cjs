const { chromium } = require("playwright");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const out = path.resolve(__dirname, "..");
const base = pathToFileURL(path.join(out, "index.html")).href;

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  });
  const cases = [
    { name: "desktop", width: 1440, height: 1100 },
    { name: "mobile", width: 390, height: 1200 },
  ];

  for (const viewport of cases) {
    const page = await browser.newPage({ viewport });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(base, { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(out, `screenshot-${viewport.name}.png`), fullPage: true });

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (overflow) {
      throw new Error(`${viewport.name} viewport has horizontal overflow`);
    }

    if (errors.length) {
      throw new Error(`${viewport.name} page errors: ${errors.join("; ")}`);
    }

    await page.close();
  }

  await browser.close();
})();
