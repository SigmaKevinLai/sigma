// Keyboard audit: run via playwright-cli run-code --filename=docs/focus-check.js.
async (page) => {
 const check=(ok,name)=>{if(!ok)throw Error(name);};
 await page.goto(new URL('./',page.url()).href);
 await page.setViewportSize({width:390,height:844});
 await page.locator('.menu-toggle').click();
 await page.locator('#navigation a[href="#knowledge"]').click();
 check(await page.locator('#knowledge').evaluate(el=>el===document.activeElement),'Navigation content focus');
 for(const product of ['diecast','a356','slab','liquid','zinc']){
  await page.locator(`[data-product="${product}"]`).click();
  check(await page.locator('#dialog-title').evaluate(el=>el===document.activeElement),'Dialog initial heading focus');
  for(let i=0;i<9;i++){await page.keyboard.press('Tab');check(await page.evaluate(()=>!!document.activeElement.closest('#product-dialog')),'Modal tab escape');}
  await page.keyboard.press('Escape');
  check(await page.locator(`[data-product="${product}"]`).evaluate(el=>el===document.activeElement),'Return product focus');
 }
 await page.locator('.finder-open').click();await page.keyboard.press('Escape');
 check(await page.locator('.finder-open').evaluate(el=>el===document.activeElement),'Return finder focus');
 await page.locator('[data-product="zinc"]').click();await page.locator('#dialog-inquiry').click();
 check(await page.locator('#inquiry-name').evaluate(el=>el===document.activeElement),'Immediate inquiry transfer focus');
 await page.keyboard.press('Tab');
 await page.waitForTimeout(450);
 check(await page.locator('#inquiry-email').evaluate(el=>el===document.activeElement),'Inquiry focus not stolen after Tab');
 console.log('PASS: navigation, five modal focus cycles, source links, finder return and inquiry transfer.');
}
