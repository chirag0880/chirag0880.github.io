const GITHUB_USER = "chirag0880";

// Add curated descriptions here using the exact repository name as the key.
const curatedDescriptions = {
  // "repository-name": "A concise explanation of what you built, the problem it solves, and the tools used."
};

const templates = {
  docker: {
    file: "docker-compose.yml",
    code: `services:\n  web:\n    image: nginx:alpine\n    ports:\n      - "8080:80"\n    restart: unless-stopped\n    healthcheck:\n      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://127.0.0.1"]\n      interval: 30s\n      timeout: 5s\n      retries: 3\n`
  },
  k8s: {
    file: "deployment.yaml",
    code: `apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: sample-web\n  labels:\n    app: sample-web\nspec:\n  replicas: 2\n  selector:\n    matchLabels:\n      app: sample-web\n  template:\n    metadata:\n      labels:\n        app: sample-web\n    spec:\n      containers:\n        - name: web\n          image: nginx:1.27\n          ports:\n            - containerPort: 80\n          resources:\n            requests:\n              cpu: 100m\n              memory: 64Mi\n            limits:\n              cpu: 500m\n              memory: 256Mi\n          readinessProbe:\n            httpGet:\n              path: /\n              port: 80\n`
  },
  terraform: {
    file: "main.tf",
    code: `terraform {\n  required_providers {\n    aws = {\n      source  = "hashicorp/aws"\n      version = "~> 5.0"\n    }\n  }\n}\n\nprovider "aws" {\n  region = var.aws_region\n}\n\nvariable "aws_region" {\n  type    = string\n  default = "ap-south-1"\n}\n\nresource "aws_instance" "web" {\n  ami           = var.ami_id\n  instance_type = "t3.micro"\n\n  tags = {\n    Name        = "portfolio-demo"\n    Environment = "lab"\n  }\n}\n\nvariable "ami_id" {\n  description = "Provide a valid AMI ID for your selected region."\n  type        = string\n}\n`
  },
  ansible: {
    file: "site.yml",
    code: `---\n- name: Configure a basic web server\n  hosts: web\n  become: true\n  tasks:\n    - name: Install nginx\n      ansible.builtin.apt:\n        name: nginx\n        state: present\n        update_cache: true\n\n    - name: Ensure nginx is running\n      ansible.builtin.service:\n        name: nginx\n        state: started\n        enabled: true\n`
  },
  github: {
    file: ".github/workflows/ci.yml",
    code: `name: CI\n\non:\n  push:\n    branches: [main]\n  pull_request:\n    branches: [main]\n\npermissions:\n  contents: read\n\njobs:\n  validate:\n    runs-on: ubuntu-latest\n    steps:\n      - name: Checkout\n        uses: actions/checkout@v4\n      - name: Show repository files\n        run: find . -maxdepth 2 -type f | sort\n      - name: Validation placeholder\n        run: echo "Add lint, test and build commands here"\n`
  },
  prometheus: {
    file: "prometheus.yml",
    code: `global:\n  scrape_interval: 15s\n\nscrape_configs:\n  - job_name: prometheus\n    static_configs:\n      - targets: ["localhost:9090"]\n\n  - job_name: node-exporter\n    static_configs:\n      - targets: ["node-exporter:9100"]\n`
  }
};

function renderTemplate() {
  const selected = templates[document.querySelector("#templateSelect").value];
  document.querySelector("#codeFilename").textContent = selected.file;
  document.querySelector("#generatedCode").textContent = selected.code;
  document.querySelector("#copyCode").textContent = "Copy code";
}
document.querySelector("#generateBtn").addEventListener("click", renderTemplate);
document.querySelector("#templateSelect").addEventListener("change", renderTemplate);
document.querySelector("#copyCode").addEventListener("click", async () => {
  const code = document.querySelector("#generatedCode").textContent;
  try {
    await navigator.clipboard.writeText(code);
    document.querySelector("#copyCode").textContent = "Copied ✓";
  } catch {
    document.querySelector("#copyCode").textContent = "Select code to copy";
  }
});
renderTemplate();

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
}
function languageColor(language) {
  const colors = { JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5", Shell: "#89e051", HCL: "#844FBA", HTML: "#e34c26", CSS: "#563d7c", Go: "#00ADD8", Dockerfile: "#384d54" };
  return colors[language] || "#75a9d4";
}
async function loadRepositories() {
  const grid = document.querySelector("#repoGrid");
  const status = document.querySelector("#repoStatus");
  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100&type=owner`, {
      headers: { "Accept": "application/vnd.github+json" }
    });
    if (!response.ok) throw new Error(response.status === 403 ? "GitHub API rate limit reached. Please refresh later." : "Could not load public repositories.");
    const repos = await response.json();
    const visible = repos.filter(repo => !repo.fork && !repo.archived).sort((a,b) => b.stargazers_count - a.stargazers_count || new Date(b.updated_at) - new Date(a.updated_at)).slice(0, 9);
    if (!visible.length) throw new Error("No public repositories were found yet.");
    status.innerHTML = `<i class="tiny-dot"></i> ${visible.length} repositories · LIVE FROM GITHUB`;
    grid.innerHTML = visible.map(repo => {
      const description = curatedDescriptions[repo.name] || repo.description || "Explore this repository on GitHub for source code, implementation details and documentation.";
      const lang = repo.language ? `<span class="language"><i style="display:inline-block;width:7px;height:7px;border-radius:50%;background:${languageColor(repo.language)}"></i> ${escapeHTML(repo.language)}</span>` : `<span class="language">Repository</span>`;
      return `<article class="panel project-card">
        <h3>${escapeHTML(repo.name)}</h3>
        <p>${escapeHTML(description)}</p>
        <div class="repo-meta"><span>★ ${repo.stargazers_count}</span><span>⑂ ${repo.forks_count} forks</span></div>
        <div class="repo-footer">${lang}<a class="repo-link" href="${escapeHTML(repo.html_url)}" target="_blank" rel="noopener noreferrer">View source ↗</a></div>
      </article>`;
    }).join("");
  } catch (error) {
    status.innerHTML = `<span class="error-state">● ${escapeHTML(error.message)}</span>`;
    grid.innerHTML = `<div class="panel empty-state">GitHub repositories could not be loaded right now. <a class="text-link" href="https://github.com/${GITHUB_USER}?tab=repositories" target="_blank" rel="noreferrer">Browse repositories directly ↗</a></div>`;
  }
}
loadRepositories();

const sidebar = document.querySelector("#sidebar");
document.querySelector("#menuToggle").addEventListener("click", () => sidebar.classList.toggle("open"));
document.querySelectorAll(".nav-link").forEach(link => link.addEventListener("click", () => {
  document.querySelectorAll(".nav-link").forEach(item => item.classList.remove("active"));
  link.classList.add("active");
  sidebar.classList.remove("open");
}));
const sections = [...document.querySelectorAll("main section[id]")];
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    }
  });
}, { rootMargin: "-30% 0px -60% 0px" });
sections.forEach(section => observer.observe(section));
document.querySelector("#year").textContent = new Date().getFullYear();
