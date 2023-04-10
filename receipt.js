const puppeteer = require("puppeteer");
require("dotenv").config();

const receipt = async (res) => {
    const browser = await puppeteer.launch({
        args: [
            "--disable-setuid-sandbox",
            "--no-sandbox",
            "--single-process",
            "--no-zygote"
        ],
        executablePath:
            process.env.NODE_ENV === "production"
                ? process.env.PUPPETEER_EXECUTABLE_PATH
                : puppeteer.executablePath()
    });
    try {
        const page = await browser.newPage();

        await page.goto('https://developer.chrome.com/');

        // Set screen size
        await page.setViewport({width: 1080, height: 1024});

        // Type into search box
        await page.type('.search-box__input', 'automate beyond recorder');

        // Wait and click on first result
        const searchResultSelector = '.search-box__link';
        await page.waitForSelector(searchResultSelector);
        await page.click(searchResultSelector);

        // Locate the full title with a unique string
        const textSelector = await page.waitForSelector(
            'text/Customize and automate'
        );
        const fullTitle = await textSelector.evaluate(el => el.textContent);

        // Print the full title
        console.log('The title of this blog post is "%s".', fullTitle);
        // res.send(fullTitle);

        const buffer = await page.pdf({
            format: 'A4',
        });

        // await browser.close();

        res.set('Content-Type', 'application/pdf')
        res.status(201).send(Buffer.from(buffer, "binary"))
    } catch (e) {
        throw e.message;
    } finally {
        await browser.close();

    }
};

module.exports = { receipt };