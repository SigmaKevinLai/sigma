"""Homepage photography helpers. Stock images are not SIGMA facilities/products."""
from html import escape

PHOTOS = {
 'ingots': ('鋁錠堆疊', 'Fumikas Sagisavas', 'CC0 1.0', 'https://creativecommons.org/publicdomain/zero/1.0/', 'https://commons.wikimedia.org/wiki/File:Aluminum_ingots_loaded_on_truck.jpg'),
 'recycling': ('壓縮鋁罐回收料', '[Tycho]', 'CC0 1.0', 'https://creativecommons.org/publicdomain/zero/1.0/', 'https://commons.wikimedia.org/wiki/File:Compressed_aluminium_cans.jpg'),
 'inspection': ('鑄件精密量測', 'U.S. Department of Agriculture', 'CC BY 2.0', 'https://creativecommons.org/licenses/by/2.0/', 'https://commons.wikimedia.org/wiki/File:201107120-RD-LSC-0223_-_Flickr_-_USDAgov.jpg'),
}

def photo(p, key, eager=False):
 title = PHOTOS[key][0]
 return f'''<figure class="stock-photo"><img src="{p.asset('assets/photos/'+key+'-1200.webp')}" srcset="{p.asset('assets/photos/'+key+'-640.webp')} 640w, {p.asset('assets/photos/'+key+'-1200.webp')} 1200w" sizes="(max-width: 980px) 90vw, 600px" width="1200" height="900" alt="{title}，產業示意照片" loading="{'eager' if eager else 'lazy'}" {'fetchpriority="high"' if eager else ''}><figcaption>{title} · 產業示意，非新格實拍</figcaption></figure>'''

def credits():
 rows=''.join(f'<li><h2>{escape(t)}</h2><p>{escape(a)} · <a href="{l}">{lic}</a></p><p><a href="{u}">檢視原始圖片與授權紀錄</a></p><p>處理：縮放、WebP 壓縮；版面顯示時裁切。</p></li>' for t,a,lic,l,u in PHOTOS.values())
 return f'''<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>圖片來源｜SIGMA 新格集團</title><style>body{{font:18px/1.8 system-ui,sans-serif;background:#f6f7f5;color:#263e4b;max-width:850px;margin:60px auto;padding:24px}}a{{color:#87401d}}li{{margin:40px 0}}h2{{font-size:24px}}</style></head><body><main><a href="../">返回首頁</a><h1>圖片來源</h1><p>本站選用的圖庫照片僅作產業與材料示意，不代表新格的產品、員工、設備或廠區，也不表示照片作者或原企業對本站的背書。</p><ul>{rows}</ul></main></body></html>'''
