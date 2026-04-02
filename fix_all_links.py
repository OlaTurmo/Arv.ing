import os
import re
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
            # Just attempt to fix based on text
            text = ' '.join(a.stripped_strings).lower()
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
            elif 'new job' in text:
                a['href'] = 'new_job_wizard.html'
                modified = True
            elif 'runs' in text:
                a['href'] = 'run_detail_and_preview.html'
                modified = True
            elif 'output' in text:
                a['href'] = 'output_and_backend_handoff.html'
                modified = True
            elif 'settings' in text:
                a['href'] = 'settings_and_connections.html'
                modified = True
            elif 'features' in text:
                a['href'] = 'index.html#features'
                modified = True
            elif 'pricing' in text:
                a['href'] = 'index.html#pricing'
                modified = True
            # Let's leave remaining empty "#" as they might be for toggles, drop-downs or unlinked items.

    if modified:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(str(soup))
