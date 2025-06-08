import { readdirSync } from "fs";
import { join } from "path";

export async function GET() {
  try {
    const testsDir = join(process.cwd(), "app");
    const files = readdirSync(testsDir, { withFileTypes: true });
    const testFolders = files
      .filter((dirent) => dirent.isDirectory() && /^test\d+$/.test(dirent.name))
      .map((dirent) => dirent.name);

    return new Response(JSON.stringify(testFolders), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify([]), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
