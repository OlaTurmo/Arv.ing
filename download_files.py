import os
import json
import urllib.request
import re

screens = [
    {"id": "612e4ac1145f4985bcb94d74897f44c6", "title": "Sign In", "file": "sign_in.html"},
    {"id": "938fb7b2bcc94be6a42d9f6607282391", "title": "Output and Backend Handoff", "file": "output_and_backend_handoff.html"},
    {"id": "a1093c612d464eafb3d993ef3e62c7c8", "title": "Forgot Password", "file": "forgot_password.html"},
    {"id": "e00f8961a1e8419bad9d2b27b2ed8f90", "title": "DesignUI.site Landing Page", "file": "index.html"},
    {"id": "551510975dc64d388610b1e1cbc63224", "title": "Dashboard", "file": "dashboard.html"},
    {"id": "717b8e99ee1b44da8d31d21dd801eacb", "title": "Settings and Connections", "file": "settings_and_connections.html"},
    {"id": "c73c0d160eae48a7ad3f4a37764f7de9", "title": "Sign Up", "file": "sign_up.html"},
    {"id": "66a37cd09fbd44e2a5c4cf3f659e0eee", "title": "New Job Wizard", "file": "new_job_wizard.html"},
    {"id": "e2c0f02d7b9f4cadbe308dbe9e6875ce", "title": "Run Detail and Preview", "file": "run_detail_and_preview.html"}
]

# I need to fetch the downloadUrl for each screen.
# Wait, I can just use the provided stitch tool outputs since they are in my history,
# or I can query using a quick bash script or just copy paste the URLs.
