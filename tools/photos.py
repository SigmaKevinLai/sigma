"""Stock photography helpers. Photos are licensed industry imagery, not SIGMA facilities or products.
Metadata lives in tools/photos.json; files are produced by tools/photo_grade.mjs.
"""
from html import escape
from pathlib import Path
import json

PHOTOS = {k: v for k, v in json.loads((Path(__file__).with_name('photos.json')).read_text()).items() if not k.startswith('_')}
NOTE = '產業示意照片，非新格實拍'


def _srcset(p, key, variant):
    sizes = {'card': (640, 1200), 'wide': (960, 1920)}[variant]
    return ', '.join(f"{p.asset(f'assets/photos/{key}-{variant}-{s}.webp')} {s}w" for s in sizes), sizes[-1]


def img(p, key, variant='card', alt=None, eager=False, sizes='(max-width: 980px) 92vw, 600px', cls=''):
    srcset, big = _srcset(p, key, variant)
    w, h = (1200, 900) if variant == 'card' else (1920, 1080)
    alt_text = f'{PHOTOS[key]["title"]}，{NOTE}' if alt is None else alt
    load = 'loading="eager" fetchpriority="high"' if eager else 'loading="lazy"'
    cls_attr = f' class="{cls}"' if cls else ''
    return (f'<img{cls_attr} src="{p.asset(f"assets/photos/{key}-{variant}-{big}.webp")}" srcset="{srcset}" sizes="{sizes}" '
            f'width="{w}" height="{h}" alt="{escape(alt_text, quote=True)}" {load} decoding="async">')


def figure(p, key, cls='', eager=False, sizes='(max-width: 980px) 92vw, 600px'):
    return (f'<figure class="stock-photo {cls}">{img(p, key, eager=eager, sizes=sizes)}'
            f'<figcaption>{escape(PHOTOS[key]["title"])}｜{NOTE}</figcaption></figure>')


def backdrop(p, key, eager=False):
    """Full-bleed decorative background with a visible disclosure label."""
    return (f'<div class="photo-bg" aria-hidden="true">{img(p, key, "wide", alt="", eager=eager, sizes="100vw")}</div>'
            f'<p class="photo-note">{escape(PHOTOS[key]["title"])}｜{NOTE}</p>')
