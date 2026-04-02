import os
import json
import urllib.request
import re
from bs4 import BeautifulSoup

os.makedirs('DesignUI.site', exist_ok=True)

screens = [
    {
        "title": "Sign In",
        "file": "sign_in.html",
        "screenshot": "sign_in.png",
        "screenshot_url": "https://lh3.googleusercontent.com/aida/ADBb0ujx_SKNbGcanOFJcsEo9krZayJEwKSr7gYAIeyUuz1lT3e81daTzyD1hIUK6dhd3vWjP1NWO0RfYsJ-lmhLKAsmHK2CNFkCGH2L_7MWvZXVLZf4IdVcaXsWEij0oacAf0t-lQXAHWgXqRxw3YZJYkVosW32Wa8MYACJJRuXoKJOdOO9jzK1FXZktCzo4fEV5OvXpcZkAD3wDAyOWVbz9tCsKIDDKt-15ba-OsmVRxJsxAum_-HHhplXI2sC",
        "html_url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2EyMGI0MmU1ZDlmMzRjZTVhZmQxNzg0OGQ4OGQxMjliEgsSBxCzpZLPnAsYAZIBJAoKcHJvamVjdF9pZBIWQhQxMDU2NjI2MTM3OTc1MzY2ODg5MA&filename=&opi=89354086"
    },
    {
        "title": "Output and Backend Handoff",
        "file": "output_and_backend_handoff.html",
        "screenshot": "output_and_backend_handoff.png",
        "screenshot_url": "https://lh3.googleusercontent.com/aida/ADBb0ugefN-R-b-ItWRLXc4QuWCo1MkQRSXmTe3A6nzlkeFSqFH2Fc9axKdJwLjmgGK4VJqg96D17GKZn9GDfhVIyzd1iVU-EDpusSq1z_0VclyNvBluefRekB08PT8R_zxhxQ4iJAnPB8-9PoQp2C2H2gd0BZRQopR5J40C1J-dqxoqTYulOAgjD8CxdiuOlpLNCXjOTvTTVNQkHEJrBPQ8faPIJKXKV-Hz35O_--AW6Y9EppS3WFbT9KT5XTon",
        "html_url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzFmYzBkYzgwYzY3YjQ5ZDA5YWRlMTg2Y2Y4NjA3OWRiEgsSBxCzpZLPnAsYAZIBJAoKcHJvamVjdF9pZBIWQhQxMDU2NjI2MTM3OTc1MzY2ODg5MA&filename=&opi=89354086"
    },
    {
        "title": "Forgot Password",
        "file": "forgot_password.html",
        "screenshot": "forgot_password.png",
        "screenshot_url": "https://lh3.googleusercontent.com/aida/ADBb0uiHh2pcjS8BrSDW0HCkHxyRV6zyzHEgeTbLH9TEOu93kARpGx-1g9WBp83g_G3sXPXgnDtk5jj1x_xEUDA9zTL-gBE4yQBcRblPKW--s2nqYZVrQuSeUIM9YLMk-2u3HI2ZWKPAqaqZkfXwv9VbVC6IsgUIep9cn4nE_UhdGQxS2VFGSTS0cYYT0bA2HrHVTWQJEihRv3NohSKS72r7pDgIxpWTeAESJEWOsFDb91FpC7phh0udrl7eHUPY",
        "html_url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzQxYTMwOTdjOWIzMjQzYzM5YjAyYWVhOGQwZDc1YzNiEgsSBxCzpZLPnAsYAZIBJAoKcHJvamVjdF9pZBIWQhQxMDU2NjI2MTM3OTc1MzY2ODg5MA&filename=&opi=89354086"
    },
    {
        "title": "DesignUI.site Landing Page",
        "file": "index.html",
        "screenshot": "index.png",
        "screenshot_url": "https://lh3.googleusercontent.com/aida/ADBb0uj73wcAHwLHtmCn6tGOh4o3ABdIcDmYLgCbSxQ541l0PhtP44X75hwgl2bokUqwmRIr9ppnK-i0Z4HjgPTLBkeht5zi3vRdAQfTmhnrqZjWE48x3pvGLS7pG83QA3Agcjdw2yQ-SIScOypkEOZUxp8gP6HYh16-LB1CAfA6apJ-0QfqCgPjBrCsvpX0EN2piTroqlwIIbF5mbgL82AQzIXnIjaUU5duRnQTJGB3nhRhmwX4RNaC5RrwD963",
        "html_url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzc4ZTljNWY1OTE1ZTQ0ZGRiOWE1ZmU3MzkwYmNmNWMxEgsSBxCzpZLPnAsYAZIBJAoKcHJvamVjdF9pZBIWQhQxMDU2NjI2MTM3OTc1MzY2ODg5MA&filename=&opi=89354086"
    },
    {
        "title": "Dashboard",
        "file": "dashboard.html",
        "screenshot": "dashboard.png",
        "screenshot_url": "https://lh3.googleusercontent.com/aida/ADBb0ujUkyErpSa05vE3Qpk-P5HEZy1D0cyxK6EJ__kmyvgMvCDcVHu8ldErFW6O86s6hckrUVWWCUwk_hL7FFy2bsscyXYE0mFNvDJDHfnyknK94FT7QAhZ_rd4RqGxJrHk7gi-5ZFuhyLkjLst8tpvJxjjAG1hlLgyIiGIzTqOo9hVJbqKLwBz4eJveMbCRxlGYiX4u8E6VEa7NWV44vQSoSvqCNs-3wauYmeWTawBLPhwAz305JxttssSKvZH",
        "html_url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2ZmMDIxN2VlM2NiMDQ2NWU5ZjU3YTU2OWI0M2QwMWNjEgsSBxCzpZLPnAsYAZIBJAoKcHJvamVjdF9pZBIWQhQxMDU2NjI2MTM3OTc1MzY2ODg5MA&filename=&opi=89354086"
    },
    {
        "title": "Settings and Connections",
        "file": "settings_and_connections.html",
        "screenshot": "settings_and_connections.png",
        "screenshot_url": "https://lh3.googleusercontent.com/aida/ADBb0uiqOKm90Q8r-rQPURvIqILvop7OaqzKQ_2DGYWxinXKLTOb-9iGH_EsfP4e0mYsCgwPa939w-53uew-GtX5Vb5jn20EUjeFwzHtOaNULxWYQcxTz5puHxdrIn5mKjEqFjg2Pq5ipWuInlAz84m4DmzViiN555EXWpZCRGBhxzF2T4ZyUAYdduHAbdVln0zxtjD0_4Xs-HcRIeyg6cwYTJbwBMyD9Tdn6k4UcX-Ni_xQquo5pfYOnIA1YbE",
        "html_url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2EwM2E0ZDRlYWMzMDQ0YWU5ZGMyZTc1YjVlMjkxMmZiEgsSBxCzpZLPnAsYAZIBJAoKcHJvamVjdF9pZBIWQhQxMDU2NjI2MTM3OTc1MzY2ODg5MA&filename=&opi=89354086"
    },
    {
        "title": "Sign Up",
        "file": "sign_up.html",
        "screenshot": "sign_up.png",
        "screenshot_url": "https://lh3.googleusercontent.com/aida/ADBb0ugsb_6y3dN7WdAzFhBJs62eGzG5g0FwPheJzrQPMkgqN-yWFtr0scigvt0htQBFqhT9AWtizAW4tBtcAuxVhoe2rxL8Ty2FFTZZ_txuLwgxfS_C22y4wPg-7zbC2pt8kOPWy_b5kINAauuLqRicLODdznqjNuLexPw_98tIcexZ1laozmGLUQWPpSRQ1_w9pDtrHxWvnFu9MaFnXHJa_eHNAOAD0f47w-iw_OrySOrfEF-ccA5YPYIzfVha",
        "html_url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzI4NDU3YjA2ODg5NDQzMGZiNTZiMTU2MzM1YzU2MDE4EgsSBxCzpZLPnAsYAZIBJAoKcHJvamVjdF9pZBIWQhQxMDU2NjI2MTM3OTc1MzY2ODg5MA&filename=&opi=89354086"
    },
    {
        "title": "New Job Wizard",
        "file": "new_job_wizard.html",
        "screenshot": "new_job_wizard.png",
        "screenshot_url": "https://lh3.googleusercontent.com/aida/ADBb0uii99E82DF6vuVzt3QyIw7f4QSHo6Sbreye6A4YyVBI0c7Gu2AaFKRJ5LLX4QklvjGjZDxGI6UmXNkujxpwCS4RPWDlS76meCKS_Qk0PlebMYw8kgSgNETFpWizUx-QjT5GFh9zDOk6sHMHS_CNDFoR-YVKYf2tfBEqi5M7X4bVXtYV36Xgj5viYgmSyThIX5KfbBp3BiGsp-pVGd352y7SOY5AhaBa8bcTqEcju05rL7YkjYY0fbV_uK5Z",
        "html_url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2QzNjg2MDkyY2ZjMDQ2NzhhYTZlNGQ0MDg3MmQ5OGU3EgsSBxCzpZLPnAsYAZIBJAoKcHJvamVjdF9pZBIWQhQxMDU2NjI2MTM3OTc1MzY2ODg5MA&filename=&opi=89354086"
    },
    {
        "title": "Run Detail and Preview",
        "file": "run_detail_and_preview.html",
        "screenshot": "run_detail_and_preview.png",
        "screenshot_url": "https://lh3.googleusercontent.com/aida/ADBb0uggZ2dkUvU6uHGR1YgNozyHejCEFucSKsjSDylGJTJf4ZTUMjQBsfSZJ1qJXBs0XeNB1P2Ni4yc0FPMf5SGKUpdzCG2EitcYR7HVa-08lorYLhd9VLsmEHMCCRpNApiN2e3jaR3sMjxwYP7XB4KLgsRueNt9vAOKceJLle8kv52qrCvG8-6OwywiRQZ0_lnbNnnq3zCKm23GAockOPfZheeuUVH5PPk1uX2xiG4MOahAfkXlUqGTJscn5mO",
        "html_url": "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAzMTk0NzA4ZDlmOTRjZDFiNmY0Yzg0NmQ1OTlhNTg5EgsSBxCzpZLPnAsYAZIBJAoKcHJvamVjdF9pZBIWQhQxMDU2NjI2MTM3OTc1MzY2ODg5MA&filename=&opi=89354086"
    }
]

print("Downloading files...")
for screen in screens:
    # download html
    req = urllib.request.Request(screen['html_url'], headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        html = response.read()
        with open(os.path.join('DesignUI.site', screen['file']), 'wb') as f:
            f.write(html)
    # download screenshot
    if screen.get('screenshot_url'):
        try:
            req = urllib.request.Request(screen['screenshot_url'], headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as response:
                img = response.read()
                with open(os.path.join('DesignUI.site', screen['screenshot']), 'wb') as f:
                    f.write(img)
        except Exception as e:
            print(f"Failed to download screenshot for {screen['title']}: {e}")

print("Fixing links...")
# Define link mapping based on common text
link_mapping = {
    'Dashboard': 'dashboard.html',
    'New Job': 'new_job_wizard.html',
    'Runs': 'run_detail_and_preview.html',
    'Output': 'output_and_backend_handoff.html',
    'Settings': 'settings_and_connections.html',
    'Sign In': 'sign_in.html',
    'Sign Up': 'sign_up.html',
    'Forgot Password': 'forgot_password.html',
    'Home': 'index.html',
    'Features': 'index.html#features',
    'Pricing': 'index.html#pricing',
}

# Also try to map button texts
for screen in screens:
    file_path = os.path.join('DesignUI.site', screen['file'])
    with open(file_path, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')

    modified = False
    for a in soup.find_all('a'):
        text = a.get_text(strip=True)
        if text in link_mapping:
            a['href'] = link_mapping[text]
            modified = True

        # specifically for "Start Building Free" or similar that goes to signup
        if "Sign Up" in text or "Start Building" in text or "Create Account" in text:
            a['href'] = 'sign_up.html'
            modified = True

        if "Sign In" in text or "Login" in text:
            a['href'] = 'sign_in.html'
            modified = True

        if "Forgot Password" in text:
            a['href'] = 'forgot_password.html'
            modified = True

    if modified:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(str(soup))

print("Done.")
