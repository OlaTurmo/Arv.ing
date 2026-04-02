import os
from bs4 import BeautifulSoup

screens = [
    {"file": "sign_in.html"},
    {"file": "output_and_backend_handoff.html"},
    {"file": "forgot_password.html"},
    {"file": "index.html"},
    {"file": "dashboard.html"},
    {"file": "settings_and_connections.html"},
    {"file": "sign_up.html"},
    {"file": "new_job_wizard.html"},
    {"file": "run_detail_and_preview.html"}
]

for screen in screens:
    file_path = os.path.join('DesignUI.site', screen['file'])
    with open(file_path, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')

    modified = False

    for a in soup.find_all('a'):
        href = a.get('href', '')
        if href == '#' or href == '':
            text = a.get_text(strip=True).lower()
            if 'sign in' in text or 'log in' in text or 'login' in text:
                a['href'] = 'sign_in.html'
                modified = True
            elif 'sign up' in text or 'create account' in text:
                a['href'] = 'sign_up.html'
                modified = True
            elif 'home' in text:
                a['href'] = 'index.html'
                modified = True
            elif 'dashboard' in text:
                a['href'] = 'dashboard.html'
                modified = True
            elif 'forgot password' in text:
                a['href'] = 'forgot_password.html'
                modified = True

    if modified:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(str(soup))
