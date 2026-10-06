"""Static integrity + optional source transcription checks.
Run: python3 docs/verify-site.py [--source]
No dependency installation required. Run from any directory.
"""
from pathlib import Path
from html.parser import HTMLParser
import re, sys, urllib.request, urllib.parse
root=Path(__file__).resolve().parent.parent
class Site(HTMLParser):
 def __init__(self):super().__init__();self.ids=[];self.refs=[];self.links=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.append(a['id'])
  for key in ['src','href']:
   if key in a:self.links.append(a[key])
  for key in ['for','aria-controls','aria-labelledby']:
   if key in a:self.refs.extend(a[key].split())
p=Site();p.feed((root/'index.html').read_text())
assert len(p.ids)==len(set(p.ids)), 'Duplicate element IDs'
for ref in p.refs:assert ref in p.ids, f'Missing referenced ID: {ref}'
for link in p.links:
 if link.startswith('#') and len(link)>1:assert link[1:] in p.ids, f'Broken fragment: {link}'
 if link.startswith('./'):assert (root/urllib.parse.urlsplit(link).path).is_file(), f'Missing asset: {link}'
for css in ['style.css','fonts.css']:
 for url in re.findall(r'url\([\'"]?([^\)\'\"]+)',(root/css).read_text()):
  if url.startswith('./'):assert (root/urllib.parse.urlsplit(url).path).is_file(),f'Missing CSS asset: {url}'
assert 'fonts.googleapis.com' not in (root/'index.html').read_text(),'External fonts returned'
assert 'mailto:' not in (root/'app.js').read_text(),'Unverified email recipient returned'
print(f'PASS: {len(p.ids)} unique IDs, references, anchor links and local assets.')
if '--source' in sys.argv:
 class Cells(HTMLParser):
  def __init__(self):super().__init__();self.rows=[];self.row=[];self.text=[];self.cell=False
  def handle_starttag(self,t,a):
   if t=='tr':self.row=[]
   if t in ['td','th']:self.cell=True;self.text=[]
  def handle_data(self,d):
   if self.cell:self.text.append(d)
  def handle_endtag(self,t):
   if t in ['td','th'] and self.cell:self.row.append(re.sub(r'\s+','',''.join(self.text)));self.cell=False
   if t=='tr' and self.row:self.rows.append(self.row)
 c=Cells();c.feed(urllib.request.urlopen('http://www.sigmacorp.com/cht/spec/spec.aspx',timeout=30).read().decode('utf-8','replace'))
 js=(root/'alloys.js').read_text();count=0
 for row in c.rows:
  if len(row)!=9 or row[0] not in ['ADC3','ADC6','ADC10','ADC12','ADC14']:continue
  key='ADC '+row[0][3:];match=re.search(r"'"+key+r"':\[([^\]]+)\]",js);assert match,key
  actual=[v.replace(' ','') for v in re.findall(r"'([^']+)'",match.group(1))]
  expected=[('≤'+v[:-3] if v.endswith('max') else v.replace('-','–')) for v in row[1:]]
  assert actual==expected,f'Source data mismatch: {key}';count+=1
 assert count==5,f'Expected five source rows, found {count}'
 print('PASS: all 40 chemical composition ranges match official source after normalization.')
