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

link_mapping = {
    'Dashboard': 'dashboard.html',
    'New Job': 'new_job_wizard.html',
    'Runs': 'run_detail_and_preview.html',
    'Output': 'output_and_backend_handoff.html',
    'Settings': 'settings_and_connections.html',
    'Sign In': 'sign_in.html',
    'Sign Up': 'sign_up.html',
    'Forgot password?': 'forgot_password.html',
    'Forgot password': 'forgot_password.html',
    'Home': 'index.html',
}

for screen in screens:
    file_path = os.path.join('DesignUI.site', screen['file'])
    with open(file_path, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')

    modified = False

    # Handle icons where text contains both icon text and link text
    # e.g., <a href="#"> <span class="material-symbols-outlined">grid_view</span> Workspace </a>
    for a in soup.find_all('a'):
        text = a.get_text(strip=True)
        # remove material symbols text if present
        span = a.find('span', class_='material-symbols-outlined')
        if span:
            # We want the text without the span's text
            # Actually easier: just check if the icon's text + space + 'Dashboard' matches
            # Let's just look at the string parts
            strings = [s for s in a.stripped_strings if s != span.get_text(strip=True)]
            if strings:
                text = ' '.join(strings)

        if text in link_mapping:
            a['href'] = link_mapping[text]
            modified = True

        elif text == "Start Building Free":
            a['href'] = 'sign_up.html'
            modified = True
        elif text == "Log in":
            a['href'] = 'sign_in.html'
            modified = True
        elif text == "Sign In":
            a['href'] = 'sign_in.html'
            modified = True
        elif text == "Back to Login":
            a['href'] = 'sign_in.html'
            modified = True
        elif "Forgot password" in text:
            a['href'] = 'forgot_password.html'
            modified = True

    if modified:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(str(soup))
