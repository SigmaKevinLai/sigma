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
 await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:()=>Promise.reject(new Error('Denied for regression'))}}));
 await page.locator('#inquiry-name').fill('Fallback');await page.locator('#inquiry-email').fill('test@example.com');await page.locator('#inquiry-message').fill('Manual copy test');
 await page.locator('#inquiry-form button[type=submit]').click();await page.locator('#copy-draft').click();
 if(!(await page.locator('#draft-preview').evaluate(e=>e===document.activeElement&&e.selectionStart===0&&e.selectionEnd===e.value.length)))throw Error('Fallback draft not selected');
 if(!(await page.locator('#form-status').innerText()).includes('無法自動複製'))throw Error('Fallback instruction missing');
 if(await page.locator('#copy-draft').isDisabled())throw Error('Fallback retry disabled');
}
