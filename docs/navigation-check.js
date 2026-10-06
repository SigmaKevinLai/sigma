// Verify deterministic reading-location state after fast scroll, including no stale footer state.
async (page)=>{
 await page.goto(new URL('./',page.url()).href);await page.emulateMedia({reducedMotion:'reduce'});
 for(const width of [390,1440]){
  await page.setViewportSize({width,height:900});
  for(const id of ['knowledge','materials','global','circular','about']){
   await page.locator('#'+id).evaluate(e=>e.scrollIntoView({behavior:'instant',block:'start'}));await page.waitForTimeout(60);
   const active=page.locator('#navigation a[aria-current="location"]');
   if(await active.count()!==1||await active.getAttribute('href')!=='#'+id)throw Error('Reading state '+width+' '+id);
  }
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(60);
  if(await page.locator('#navigation [aria-current]').count())throw Error('Hero stale nav');
  await page.evaluate(()=>window.scrollTo({top:document.body.scrollHeight,behavior:'instant'}));await page.waitForTimeout(60);
  if(await page.locator('#navigation [aria-current]').count())throw Error('Footer stale nav');
 }
}
