"""Homepage photography helpers. Stock images are not SIGMA facilities/products."""
from html import escape

PHOTOS = {
 'ingots': ('鋁錠堆疊', 'Fumikas Sagisavas', 'CC0 1.0', 'https://creativecommons.org/publicdomain/zero/1.0/', 'https://commons.wikimedia.org/wiki/File:Aluminum_ingots_loaded_on_truck.jpg'),
 'recycling': ('壓縮鋁罐回收料', '[Tycho]', 'CC0 1.0', 'https://creativecommons.org/publicdomain/zero/1.0/', 'https://commons.wikimedia.org/wiki/File:Compressed_aluminium_cans.jpg'),
 'inspection': ('鑄件精密量測', 'U.S. Department of Agriculture', 'CC BY 2.0', 'https://creativecommons.org/licenses/by/2.0/', 'https://commons.wikimedia.org/wiki/File:201107120-RD-LSC-0223_-_Flickr_-_USDAgov.jpg'),
}

def photo(p, key, eager=False):
 title = PHOTOS[key][0]
 return f'''<figure class="stock-photo"><img src="{p.asset('assets/photos/'+key+'-1200.webp')}" srcset="{p.asset('assets/photos/'+key+'-640.webp')} 640w, {p.asset('assets/photos/'+key+'-1200.webp')} 1200w" sizes="(max-width: 980px) 90vw, 600px" width="1200" height="900" alt="{title}，產業示意照片" loading="{'eager' if eager else 'lazy'}" {'fetchpriority="high"' if eager else ''}><figcaption>{title}｜產業示意照片，非新格實拍</figcaption></figure>'''
