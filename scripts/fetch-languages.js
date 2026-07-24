import { Octokit } from "@octokit/rest";
import fs from "fs";
import { generateSVG } from "./generate-svg.js";

const username = process.env.GITHUB_USERNAME;
const token = process.env.GITHUB_TOKEN;

const octokit = new Octokit({
  auth: token,
});

// Linguagens que não queremos mostrar
const ignoredLanguages = [
  "Hack",
  "Shell",
  "Batchfile",
  "Makefile",
  "Dockerfile",
  "PowerShell"
];

// Repositórios que não devem entrar na estatística
const ignoredRepos = [
  username, // repositório do perfil
  ".github"
];

async function fetchLanguages() {
  let page = 1;
  let repos = [];

  while (true) {
    const { data } = await octokit.repos.listForUser({
      username,
      per_page: 100,
      page,
    });

    if (data.length === 0) break;

    repos.push(
      ...data.filter(
        (repo) =>
          !repo.fork &&
          !repo.archived &&
          !ignoredRepos.includes(repo.name)
      )
    );

    page++;
  }

  const totals = {};

  for (const repo of repos) {
    try {
      const { data } = await octokit.repos.listLanguages({
        owner: username,
        repo: repo.name,
      });

      for (const [language, bytes] of Object.entries(data)) {

        if (ignoredLanguages.includes(language))
          continue;

        totals[language] = (totals[language] || 0) + bytes;
      }

    } catch (err) {
      console.log(`Erro em ${repo.name}`);
    }
  }

  const totalBytes = Object.values(totals).reduce(
    (a, b) => a + b,
    0
  );


console.log("Totais encontrados:");
console.table(totals);
  
  const languages = Object.entries(totals)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage: Number(
        ((bytes / totalBytes) * 100).toFixed(2)
      ),
    }))
    .sort((a, b) => b.bytes - a.bytes);

  if (!fs.existsSync("assets")) {
    fs.mkdirSync("assets");
  }

  fs.writeFileSync(
    "assets/languages.svg",
    generateSVG(languages)
  );

  console.log("SVG criado com sucesso!");
}

fetchLanguages();
