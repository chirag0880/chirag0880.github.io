# Chirag Patel — 



## Features
- Minimal light theme with blue/violet gradients, glass-style floating elements and subtle motion
- Responsive navigation and mobile menu
- About, skills, live GitHub projects, journey, learning and contact sections
- Live public repository feed for `chirag0880`
- Interactive snippet generator for Docker Compose, Kubernetes, Terraform, Ansible, GitHub Actions and Prometheus
- Copy-to-clipboard support; no framework or build step

## Run locally
Open `index.html` in a browser or use VS Code Live Server.

## Deploy to GitHub Pages
1. Create a **public** repository named `chirag0880.github.io`.
2. Upload `index.html`, `style.css`, `script.js` and `README.md` to the repository root.
3. Open **Settings → Pages**.
4. Select **Deploy from a branch**, branch `main`, folder `/(root)`, then save.
5. Wait for deployment. Site URL: https://chirag0880.github.io/

## Personalize before publishing
- Replace the LinkedIn placeholder URL in `index.html` with your real profile.
- Add a public contact email if desired.
- Add verified employer names, titles and dates in the Journey section.
- Add only earned credentials; learning items are labelled as study tracks.
- Add accurate project summaries in `curatedDescriptions` in `script.js`.

## GitHub API
Public repositories are loaded from `https://api.github.com/users/chirag0880/repos`. Private repositories are not exposed. Unauthenticated GitHub API rate limits apply.

## Safety
Generated snippets are starter examples, not production-ready configurations. Review permissions, networking, resource sizing, versions and secret handling. Never place credentials in frontend JavaScript.
