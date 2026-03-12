export const parseGithubUrl = (url: string) => {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);

  if (!match) {
    throw new Error("Invalid Github URL");
  }

  return {
    owner: match[1],
    repo: match[2].replace(/\.git$/, ""),
  }
}