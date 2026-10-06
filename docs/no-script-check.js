async(page)=>{
 const context=await page.context().browser().newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
 try{
  const p=await context.newPage();await p.goto(new URL('./',page.url()).href);
  if(!(await p.locator('.no-script-note').isVisible()))throw Error('No-script explanation missing');
  if(await p.locator('.menu-toggle').isVisible())throw Error('Dead menu visible');
  if(await p.locator('.material-finder').isVisible())throw Error('Dead finder visible');
  if(await p.locator('.product-card:visible').count()!==5)throw Error('No-script products missing');
  if(!(await p.locator('#inquiry-form button[type=submit]').isDisabled()))throw Error('Unsafe no-script submit');
 }finally{await context.close();}
}
