async(page)=>{
 await page.goto(new URL('./',page.url()).href);
 try{
  await page.emulateMedia({forcedColors:'active',reducedMotion:'reduce'});
  await page.setViewportSize({width:390,height:844});
  if(await page.locator('.hero-art img').evaluate(e=>getComputedStyle(e).animationName)!=='none')throw Error('Reduced motion ignored');
  await page.locator('.menu-toggle').click();
  if(!(await page.locator('#navigation a').first().evaluate(e=>e===document.activeElement)))throw Error('High contrast menu focus');
  await page.keyboard.press('Escape');await page.locator('[data-product=diecast]').click();
  if(!(await page.locator('#dialog-source').isVisible()))throw Error('High contrast source hidden');
  await page.keyboard.press('Escape');
 }finally{await page.emulateMedia({forcedColors:'none',reducedMotion:'no-preference'});}
}
