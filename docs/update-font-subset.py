"""Regenerate local Noto Sans TC copy subset; network needed during development only.
Run from repository root: python3 docs/update-font-subset.py
SIL OFL license remains in assets/fonts/OFL-NotoSansTC.txt.
"""
from pathlib import Path
import re
import urllib.parse
import urllib.request

root = Path(__file__).resolve().parent.parent
text = ''.join((root / p).read_text() for p in ['index.html', 'app.js', 'alloys.js'])
characters = ''.join(sorted(set(text)))
url = 'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;600;700;800&display=swap&text=' + urllib.parse.quote(characters)
ua = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
request = urllib.request.Request(url, headers={'User-Agent': ua})
css = urllib.request.urlopen(request, timeout=30).read().decode()
font_url = re.search(r'url\(([^)]+)\)', css).group(1)
data = urllib.request.urlopen(font_url, timeout=30).read()
assert data[:4] == b'wOF2', 'Expected WOFF2 font'
path = root / 'assets/fonts/noto-tc-subset.woff2'
path.write_bytes(data)
print(f'Updated {path.name}: {len(data)} bytes, {len(characters)} unique requested characters')
