import re
from bs4 import BeautifulSoup

with open('DesignUI.site/screens/Dashboard.html', 'r') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')
for a in soup.find_all('a'):
    print(f"Text: '{a.get_text(strip=True)}', href: '{a.get('href')}'")
