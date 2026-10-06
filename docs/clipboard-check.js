async(page)=>{
 await page.goto(new URL('./',page.url()).href);
 await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:()=>new Promise(resolve=>window.finishCopy=resolve)}}));
 await page.locator('#inquiry-name').fill('Test');await page.locator('#inquiry-email').fill('test@example.com');await page.locator('#inquiry-message').fill('Original');
 await page.locator('#inquiry-form button[type=submit]').click();await page.locator('#copy-draft').click();
 if(!(await page.locator('#copy-draft').isDisabled()))throw Error('Copy pending duplicate allowed');
 await page.locator('#clear-inquiry').click();const status=await page.locator('#form-status').innerText();
 await page.evaluate(()=>window.finishCopy());await page.waitForTimeout(30);
 if(await page.locator('#form-status').innerText()!==status)throw Error('Late copy overwrote clear');
 if(!(await page.locator('#copy-draft').isDisabled()))throw Error('Cleared copy enabled');
}
