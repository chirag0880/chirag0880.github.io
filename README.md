# Chirag Patel — DevOps & Cloud Portfolio

A responsive, terminal-inspired personal portfolio built with plain HTML, CSS and JavaScript. The design uses a dark interface with modern blue accents and a live public GitHub repository section.

## Features
- Responsive sidebar navigation and mobile menu
- DevOps / Cloud profile, skills, project, experience and learning sections
- Live public repositories loaded from the GitHub REST API (`chirag0880`)
- Interactive DevOps snippet generator: Docker Compose, Kubernetes, Terraform, Ansible, GitHub Actions and Prometheus
- Copy-to-clipboard support
- No build tools or backend required

## Run locally
Open `index.html` in a browser, or use VS Code Live Server.

## Deploy with GitHub Pages
1. Create a public repository named `chirag0880.github.io`.
2. Upload `index.html`, `style.css`, `script.js`, and `README.md` to the repository root.
3. Open **Settings → Pages**.
4. Choose **Deploy from a branch**, select `main` and `/(root)`, then save.
5. Your site will be published at `https://chirag0880.github.io/` after GitHub Pages finishes deploying.

## Personalize before publishing
- Replace the LinkedIn placeholder URL in `index.html` with your actual profile URL.
- Replace `hello@yourdomain.com` with an email address you want to publish, or remove the email link.
- Add verified employer names, role titles and dates in the Experience section.
- Add only credentials you have earned; the current certification section is deliberately labelled as learning tracks.
- Add curated project descriptions in `curatedDescriptions` inside `script.js`.
- Consider adding a profile photo and a resume PDF under an `assets/` directory if desired.

## GitHub API
The repository grid calls `https://api.github.com/users/chirag0880/repos`. This works for public repositories without a token, subject to GitHub's unauthenticated API rate limits. Private repositories are not exposed.

## Security
The script generator provides starter snippets, not production-ready infrastructure. Review resource sizing, provider versions, image tags, network access, IAM permissions and secret handling before use. Never put credentials or tokens in client-side JavaScript or public repositories.
