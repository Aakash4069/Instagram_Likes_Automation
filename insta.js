// import modules
const pup = require('puppeteer');
require('dotenv').config();

// URL to be opened
const BASE_URL ="https://www.instagram.com/";

// chrome browser puppeteer launch options
const launchOptions = {
    headless: false,
    defaultViewport: false,
    args: ["--start-maximized"]
};

// object with related methods and properties
const instagram = {
    browser: null,
    page: null,

    initialize: async () => {
        instagram.browser = await pup.launch(launchOptions);
        instagram.page = await instagram.browser.newPage();
    },

    login: async (username, password) => {
        await instagram.page.goto(BASE_URL, { waitUntil: 'networkidle2' });
        await instagram.page.waitForTimeout(1000);
        // await instagram.page.waitForNavigation({timeout: 10000});
        await instagram.page.waitForSelector("input[name='username']");
        await instagram.page.type("input[name='username']", username, { delay: 50 });
        await instagram.page.type("input[name='password']", password, { delay: 50 });

        await Promise.all([
            instagram.page.waitForNavigation({ waitUntil: 'networkidle2' }),
            instagram.page.click("button[type='submit']")
        ]);
    },

    likeTagsProcess: async (tags) => {

        for (let tag of tags) {

            await instagram.page.type("input[placeholder='Search']", tag, { delay: 50 });
            await instagram.page.waitForSelector("._01UL2 .fuqBx a", { visible: true });
            await Promise.all([
                instagram.page.waitForNavigation({ waitUntil: 'networkidle2' }),
                instagram.page.click("._01UL2 .fuqBx a")
            ]);
            await instagram.page.waitForTimeout(1000);
            await instagram.page.waitForSelector("article > div:nth-child(1) img[decoding='auto']", { visible: true });
            let posts = await instagram.page.$$("article > div:nth-child(1) img[decoding='auto']");
            for (let i = 0; i < 6; i++) {
                let post = posts[i];
                await Promise.all([
                    instagram.page.waitForNavigation({ waitUntil: 'networkidle2' }),
                    post.click()
                ]);
                
                await instagram.page.waitForSelector('#react-root', { visible: true });
                await instagram.page.waitForTimeout(2000);
                await instagram.page.click('span[class="fr66n"]');
                await instagram.page.waitForTimeout(3000);
                await instagram.page.click('svg[aria-label="Close"]');
                await instagram.page.waitForTimeout(1000);
            }
            await instagram.page.waitForTimeout(4000);
        }
    },

    close: async () => {
        instagram.browser.close();
    }
}

// exporting module
module.exports = instagram;