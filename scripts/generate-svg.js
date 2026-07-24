
export function generateSVG(languages) {
  const width = 700;
  const height = Math.max(180, languages.length * 38 + 80);

  const colors = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Java: "#b07219",
    Python: "#3572A5",
    Dart: "#00B4AB",
    Kotlin: "#A97BFF",
    Swift: "#F05138",
    C: "#555555",
    "C++": "#f34b7d",
    "C#": "#178600",
    PHP: "#4F5D95",
    Go: "#00ADD8",
    Ruby: "#701516",
    Vue: "#41B883",
    Shell: "#89e051",
    Default: "#8b5cf6"
  };

  const max = languages[0]?.percentage || 100;

  const rows = languages
    .slice(0, 10)
    .map((lang, index) => {
      const barWidth = (lang.percentage / max) * 340;

      return `
        <text x="30" y="${60 + index * 34}"
              font-size="16"
              fill="#ffffff"
              font-family="Arial">
          ${lang.name}
        </text>

        <rect
          x="170"
          y="${48 + index * 34}"
          rx="6"
          width="340"
          height="14"
          fill="#2d333b"/>

        <rect
          x="170"
          y="${48 + index * 34}"
          rx="6"
          width="${barWidth}"
          height="14"
          fill="${colors[lang.name] || colors.Default}"/>

        <text
          x="530"
          y="${60 + index * 34}"
          font-size="14"
          fill="#ffffff"
          text-anchor="end"
          font-family="Arial">
          ${lang.percentage}%
        </text>
      `;
    })
    .join("");

  return `
<svg width="${width}" height="${height}"
xmlns="http://www.w3.org/2000/svg">

<rect
width="100%"
height="100%"
rx="18"
fill="#0d1117"/>

<text
x="30"
y="30"
font-size="22"
font-weight="bold"
fill="#a855f7"
font-family="Arial">

📊 Tecnologias Mais Utilizadas

</text>

${rows}

<text
x="30"
y="${height - 20}"
font-size="12"
fill="#888"
font-family="Arial">

Atualizado automaticamente pelo GitHub Actions

</text>

</svg>
`;
}
