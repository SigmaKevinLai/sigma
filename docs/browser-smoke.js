// Run: PLAYWRIGHT_MCP_BROWSER=chromium playwright-cli -s=<session> run-code --filename=docs/browser-smoke.js
async (page) => {
  const check = (ok, message) => { if (!ok) throw new Error(message); };
  await page.goto(new URL('./', page.url()).href);
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Horizontal overflow: ${width}`);
  }
  for (const [application, title] of [['automotive','再生鋁合金'],['precision','A356.2 合金'],['packaging','高端扁錠與罐材合金'],['zinc','鋅合金錠'],['supply','鋁液直供']]) {
    await page.locator('#application-select').selectOption(application);
    await page.locator('.finder-open').click();
    check(await page.locator('#dialog-title').innerText() === title, `Finder mismatch: ${application}`);
    await page.keyboard.press('Escape');
    check(!(await page.locator('dialog').isVisible()), 'Dialog failed to close');
  }
  await page.locator('#alloy-comparison summary').click();
  check(await page.locator('#composition-body tr').count() === 8, 'Composition element count');
  await page.locator('#alloy-left').selectOption('ADC 14');
  await page.locator('#alloy-right').selectOption('ADC 12');
  check((await page.locator('#comparison-status').innerText()).includes('6 項'), 'Composition difference count');
  await page.locator('#alloy-right').selectOption('ADC 14');
  check(await page.locator('.composition-table .different').count() === 0, 'Identical alloy comparison');
  await page.locator('#tab-casting').click();
  check(await page.locator('.product-card:visible').count() === 3, 'Casting filter count');
  await page.locator('#tab-casting').press('ArrowRight');
  check(await page.locator('#tab-rolling').getAttribute('aria-selected') === 'true', 'Keyboard tab navigation');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('.menu-toggle').click();
  await page.locator('#navigation a').first().focus();
  await page.keyboard.press('Escape');
  check(await page.locator('.menu-toggle').evaluate(el => el === document.activeElement), 'Mobile menu focus');
  await page.locator('#inquiry-name').fill('Regression Test');
  await page.locator('#inquiry-email').fill('test@example.com');
  await page.locator('#inquiry-message').fill('Local draft test — do not transmit.');
  await page.locator('#inquiry-form button').click();
  check((await page.locator('#draft-preview').inputValue()).includes('Local draft test'), 'Draft content');
  check(!page.url().includes('email='), 'Private data in URL');
  console.log('PASS: widths, five material paths, filter, keyboard tabs, modal, mobile focus and local draft.');
}
