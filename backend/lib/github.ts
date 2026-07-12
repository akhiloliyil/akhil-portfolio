import "server-only";

/**
 * Minimal GitHub Contents API helper used to persist admin edits by committing
 * to the repo (which triggers a Vercel redeploy). Enabled only when the env
 * vars are present — otherwise the app falls back to local-disk writes.
 *
 * Env:
 *   GITHUB_TOKEN   fine-grained PAT with "Contents: read & write" on the repo
 *   GITHUB_REPO    "owner/name", e.g. akhiloliyil/akhil-portfolio
 *   GITHUB_BRANCH  branch to commit to (default "main")
 */
const API = "https://api.github.com";

function repoInfo() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  if (!token || !repo || !repo.includes("/")) return null;
  const [owner, name] = repo.split("/");
  const branch = process.env.GITHUB_BRANCH || "main";
  return { token, owner, name, branch };
}

export function githubEnabled(): boolean {
  return repoInfo() !== null;
}

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "ak-portfolio-admin",
    "Content-Type": "application/json",
  };
}

/** Create or update a file in the repo. Returns the commit's html_url. */
export async function commitFile(
  path: string,
  content: Buffer,
  message: string
): Promise<string> {
  const info = repoInfo();
  if (!info) throw new Error("GitHub storage is not configured.");
  const { token, owner, name, branch } = info;
  const base = `${API}/repos/${owner}/${name}/contents/${path}`;

  // Look up the existing file's blob SHA (required to update it).
  let sha: string | undefined;
  const getRes = await fetch(`${base}?ref=${branch}`, {
    headers: headers(token),
    cache: "no-store",
  });
  if (getRes.ok) {
    const json = (await getRes.json()) as { sha?: string };
    sha = json.sha;
  } else if (getRes.status !== 404) {
    throw new Error(`GitHub read failed (${getRes.status}).`);
  }

  const putRes = await fetch(base, {
    method: "PUT",
    headers: headers(token),
    body: JSON.stringify({
      message,
      content: content.toString("base64"),
      branch,
      ...(sha ? { sha } : {}),
    }),
  });
  if (!putRes.ok) {
    const detail = await putRes.text().catch(() => "");
    throw new Error(`GitHub commit failed (${putRes.status}). ${detail.slice(0, 200)}`);
  }
  const out = (await putRes.json()) as { commit?: { html_url?: string } };
  return out.commit?.html_url ?? "";
}
