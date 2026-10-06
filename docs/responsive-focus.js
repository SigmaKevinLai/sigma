async(page)=>{
 await page.goto(new URL('./',page.url()).href);
 await page.setViewportSize({width:390,height:844});
 await page.locator('.menu-toggle').click();
 await page.setViewportSize({width:1440,height:900});
 await page.waitForTimeout(100);
 if(await page.locator('.menu-toggle').getAttribute('aria-expanded')!=='false')throw Error('Stale menu state');
 await page.locator('#navigation a').first().focus();await page.keyboard.press('Escape');
 if(!(await page.locator('#navigation a').first().evaluate(e=>e===document.activeElement)))throw Error('Desktop Escape hidden focus');
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(100);
 if(!(await page.locator('.menu-toggle').evaluate(e=>e===document.activeElement)))throw Error('Compact hidden link focus');
 await page.setViewportSize({width:1440,height:900});await page.waitForTimeout(100);
 if(!(await page.locator('#navigation a').first().evaluate(e=>e===document.activeElement)))throw Error('Desktop hidden toggle focus');
}
