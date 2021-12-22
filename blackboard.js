const puppeteer = require("puppeteer-core");
const cheerio = require('cheerio');

async function blackboard(id, password) {

    const arr = [];

	console.log("step1");

        const browser = await puppeteer.launch({
		executablePath: '/usr/bin/chromium-browser',
		args: [
			'--ignore-certificate-errors',
        		'--no-sandbox',
        		'--disable-setuid-sandbox',
        		'--disable-accelerated-2d-canvas',
        		'--disable-gpu'
		],
		headless: true
	});
        
	console.log(browser);
	console.log("step2");

	const page = await browser.newPage();
	console.log(page);
	console.log("step3");

        await page.setViewport({width: 1200, height: 2000});
        await page.goto("https://kulms.korea.ac.kr", {waitUntil:"networkidle2"});
        
	await page.screenshot({ path: 'screenshot1.png' })

	await page.click("button.close");
        await page.waitFor(3000);
        
	await page.screenshot({ path: 'screenshot2.png' })

	await page.click("div.lang.card-body > h3 > strong > a");
        // await page.click("div.lang.ko.card-body > h3 > strong > a");
        await page.waitForSelector("input#one_id.form-control");
        await page.type("input#one_id.form-control", id);
        await page.type("input#password.form-control", password);
        await page.keyboard.press('Enter');
        await page.waitFor(4000);
        await page.click("ul#base_tools > bb-base-navigation-button:nth-child(4) > div > li > a.base-navigation-button-content.themed-background-primary-alt-fill-only.theme-border-left-active");
        
        await page.waitForTimeout(3000);
        
        const content = await page.content();
        const $ = cheerio.load(content);
        const lists = $("div.course-id > span");
        lists.each((i, course) => {
            const courseName = $(course).text();
            if(courseName.substr(0, 10) === '20212R0136') {
                const courseId = courseName.substr(10, 7) + '-' + courseName.substr(17, 2)
                arr.push(courseId);
                console.log(courseId);
            }
        })
        browser.close();
    return arr;
}

let courseArr = async () => {
    const result = await blackboard('naminyong97', 'dlalsdyd1!');
    console.log(result);
    return result;
}

const result = courseArr();
