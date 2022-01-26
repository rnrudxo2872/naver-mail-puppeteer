import "dotenv/config";
import path from "path";
import { Page } from "./node_modules/@types/puppeteer/index";

function getPuppeteer(): typeof import("./node_modules/@types/puppeteer/index") {
  if (process.pkg) {
    return require(path.resolve(process.cwd(), "node_modules/puppeteer"));
  } else {
    return require("puppeteer");
  }
}

(async () => {
  const puppeteer = getPuppeteer();
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],
  });
  const page = await browser.newPage();

  await goToNaver(page);
  await login(page);
  await goToMailPage(page);
})();

async function goToNaver(page: Page) {
  await page.goto("https://naver.com");
}

async function login(page: Page) {
  const mainLoginBtn = await page.waitForSelector(".link_login");

  if (!mainLoginBtn) throw new Error(".link_login class does not exist.");
  await mainLoginBtn.click();

  const idBox = await page.waitForSelector("#id");

  if (!idBox) throw new Error("#id does not exist.");

  const pwBox = await page.$("#pw");
  if (!pwBox) throw new Error("#pw does not exist.");

  idBox
    .type(process.env.naverID)
    .then(() => pwBox.type(process.env.password))
    .then(async () => {
      const loginBtn = await page.$(".btn_login_wrap>.btn_login");
      if (!loginBtn) throw new Error("#log.login does not exist.");

      await loginBtn.click();
    });
}

async function goToMailPage(page: Page) {
  const myIframe = await page.waitForSelector("#minime");
  if (!myIframe) throw new Error("my menu does not exist.");

  const mailBtn = await page.waitForSelector("[data-clk='svc.mail']");
  if (!mailBtn) throw new Error("mail button does not exist.");

  await mailBtn.click();
}
