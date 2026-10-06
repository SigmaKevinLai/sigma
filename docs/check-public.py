"""Bounded public artifact integrity check, independent of browser interaction tests.
python3 docs/check-public.py
An unavailable network is a failure, not an assumed deployment success.
"""
from pathlib import Path
import urllib.request, sys
root=Path(__file__).resolve().parent.parent
base='https://ed100084.github.io/sigma/'
for name in ['index.html','app.js','style.css','fonts.css']:
 try:
  req=urllib.request.Request(base+name,headers={'Cache-Control':'no-cache','User-Agent':'Sigma-release-check'})
  with urllib.request.urlopen(req,timeout=20) as response:
   content=response.read()
  if content!=(root/name).read_bytes():raise ValueError('public bytes differ from checkout')
  print('PASS:',name,flush=True)
 except Exception as error:
  print('FAIL:',name,str(error),file=sys.stderr,flush=True)
  sys.exit(1)
print('PASS: four public artifacts match checkout; interaction testing is separate.')
