import requests,xml.etree.ElementTree as E,concurrent.futures,subprocess,time
from bs4 import BeautifulSoup
B='http://localhost:3098'
p=subprocess.Popen(['node','node_modules/next/dist/bin/next','start','--hostname','localhost','--port','3098'],stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
try:
 for i in range(30):
  try: requests.get(B,timeout=1);break
  except requests.RequestException:time.sleep(.2)
 for path,target in [('/accueil','/'),('/r%C3%A9alisations','/realisations'),('/resurfa%C3%A7age','/resurfacage'),('/historique-1','/a-propos'),('/contact','/#contact'),('/en/contact','/en#contact'),('/sitemap.website.xml','/sitemap.xml')]:
  r=requests.get(B+path,headers={'Accept-Language':'fr'},allow_redirects=False);print('CHECK',path,r.status_code,r.headers.get('Location'));assert r.status_code==308,(path,r.status_code);assert r.headers['Location']==target,(path,r.headers);print(path,r.status_code,r.headers['Location'])
 root=E.fromstring(requests.get(B+'/sitemap.xml').text);paths=[x.text.replace('https://www.lafabric.ca','') or '/' for x in root.findall('{*}url/{*}loc')]
 def check(path):
  r=requests.get(B+path);assert r.status_code==200,(path,r.status_code);s=BeautifulSoup(r.text,'html.parser');assert len(s.select('h1'))==1,path;assert 'noindex' not in str(s.find('meta',attrs={'name':'robots'})),path;assert r.headers.get('X-Robots-Tag')=='noindex, follow',path
  if path in ['/cuisine','/salle-de-bain','/mobilier-integre','/en/kitchen','/en/bathroom','/en/built-in-furniture']:
   text=s.get_text(' ',strip=True);assert 'à venir' not in text and 'coming soon' not in text and 'à compléter' not in text,path
  return path
 with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:print('Pages validated',len(list(ex.map(check,paths))))
 for path in ['/non-existent-audit','/en/non-existent-audit']:
  r=requests.get(B+path);assert r.status_code==404,(path,r.status_code);print('404',path,'custom',('Page introuvable' in r.text or 'Page not found' in r.text))
 for host in ['www.lafabric.ca','lafabric.ca','preview.vercel.app']:
  r=requests.get(B+'/historique-1',headers={'Host':host},allow_redirects=False);print('HOST',host,r.status_code,r.headers.get('Location'),r.headers.get('X-Robots-Tag'))
  if host=='www.lafabric.ca':assert r.headers.get('X-Robots-Tag') is None
  rr=requests.get(B+'/robots.txt',headers={'Host':host},allow_redirects=False)
  if host=='preview.vercel.app':assert rr.headers.get('X-Robots-Tag')=='noindex, follow'
  if host=='www.lafabric.ca':assert rr.headers.get('X-Robots-Tag') is None
  if host=='lafabric.ca':assert r.headers['Location']=='https://www.lafabric.ca/a-propos'
 for lang in ['en','fr']:
  r=requests.get(B,headers={'Accept-Language':lang});assert '<html lang="fr-CA"' in r.text
 print('French priority passed')
finally:p.terminate()
