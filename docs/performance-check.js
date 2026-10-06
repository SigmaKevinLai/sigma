// Run through playwright-cli run-code --filename; localhost lab, not field Core Web Vitals.
async (page) => {
 const browser=page.context().browser();const results=[];
 for(const width of [390,1440]){
  const context=await browser.newContext({viewport:{width,height:900}});
  await context.addInitScript(()=>{window.lab={lcp:0,cls:0};new PerformanceObserver(list=>{for(const e of list.getEntries())window.lab.lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.lab.cls+=e.value;}).observe({type:'layout-shift',buffered:true});});
  const p=await context.newPage();await p.goto('http://127.0.0.1:4286/',{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(1600);
  results.push(await p.evaluate(()=>({width:innerWidth,lcpMs:Math.round(window.lab.lcp),cls:Number(window.lab.cls.toFixed(4)),externalRequests:performance.getEntriesByType('resource').filter(r=>!r.name.startsWith(location.origin)).length,resourceTransferBytes:performance.getEntriesByType('resource').reduce((n,r)=>n+r.transferSize,0)})));
  await context.close();
 }
 await page.evaluate(data=>window.sigmaLab=data,results);
 console.log(JSON.stringify(results));
}
