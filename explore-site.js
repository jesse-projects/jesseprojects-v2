const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('https://jesseprojects.com');
  await page.waitForTimeout(2000);

  // Screenshot home
  await page.screenshot({ path: 'section-1-home.png', fullPage: false });
  console.log('Captured: Home');

  // Click Photography link
  await page.click('text=Photography');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'section-2-photography.png', fullPage: false });
  console.log('Captured: Photography');

  // Click Workshop link
  await page.click('text=Workshop');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'section-3-workshop.png', fullPage: false });
  console.log('Captured: Workshop');

  // Click About link
  await page.click('text=About');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'section-4-about.png', fullPage: false });
  console.log('Captured: About');

  // Try clicking next arrow multiple times to see all slides
  const nextButton = page.locator('button:has-text(">"), [aria-label*="next"], .carousel-next, .slick-next').first();
  if (await nextButton.count() > 0) {
    for (let i = 0; i < 5; i++) {
      try {
        await nextButton.click();
        await page.waitForTimeout(1000);
        await page.screenshot({ path: `section-scroll-${i}.png`, fullPage: false });
        console.log(`Captured: Scroll position ${i}`);
      } catch (e) {
        console.log('No more slides or button not found');
        break;
      }
    }
  }

  await browser.close();
  console.log('Done!');
})();
