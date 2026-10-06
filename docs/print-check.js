// Print integrity without writing potentially private PDFs.
async(page)=>{
 await page.goto(new URL('./',page.url()).href);
 await page.locator('#inquiry-name').fill('Private print regression');
 await page.locator('#tab-rolling').click();
 const states=await page.locator('main details').evaluateAll(els=>els.map(e=>e.open));
 try{
  await page.emulateMedia({media:'print'});
  await page.evaluate(()=>dispatchEvent(new Event('beforeprint')));
  if(await page.locator('.product-card:visible').count()!==5)throw Error('Print products missing');
  if(await page.locator('#inquiry-form').isVisible())throw Error('Private print fields visible');
  if(await page.locator('main details:not([open])').count())throw Error('Print notes collapsed');
 }finally{
  await page.evaluate(()=>dispatchEvent(new Event('afterprint')));
  await page.emulateMedia({media:'screen'});
 }
 const restored=await page.locator('main details').evaluateAll(els=>els.map(e=>e.open));
 if(JSON.stringify(states)!==JSON.stringify(restored))throw Error('Print state not restored');
 if(await page.locator('.product-card:visible').count()!==1)throw Error('Screen filter not restored');
 await page.locator('#inquiry-name').fill('');
}
