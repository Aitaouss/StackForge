import execa from "execa";
import fs from "fs-extra";
import path from "path";

const VENDOR_DIR = "stackforge-cli-pack";

/**
 * Install the repo CLI from a packed .tgz under packages/ so host smokes and Docker
 * builds (frozen lockfile) both resolve create-stackforge-app before npm publish.
 */
export async function linkLocalCreateStackforgeApp(appDir, repoRoot) {
  const repoPkg = await fs.readJson(path.join(repoRoot, "package.json"));
  const version = repoPkg.version;
  const tarballName = `create-stackforge-app-${version}.tgz`;
  const vendorDir = path.join(appDir, "packages", VENDOR_DIR);
  await fs.emptyDir(vendorDir);

  await execa("npm", ["pack", "--pack-destination", vendorDir], {
    cwd: repoRoot,
    stdio: "pipe",
  });

  const tarballPath = path.join(vendorDir, tarballName);
  if (!(await fs.pathExists(tarballPath))) {
    throw new Error(
      `Expected packed CLI at packages/${VENDOR_DIR}/${tarballName} after npm pack`,
    );
  }

  await fs.writeJson(
    path.join(vendorDir, "package.json"),
    {
      name: "@internal/stackforge-cli-pack",
      version: "0.0.0",
      private: true,
    },
    { spaces: 2 },
  );

  const pkgPath = path.join(appDir, "package.json");
  const pkg = await fs.readJson(pkgPath);
  pkg.devDependencies ??= {};
  pkg.devDependencies["create-stackforge-app"] =
    `file:packages/${VENDOR_DIR}/${tarballName}`;
  await fs.writeJson(pkgPath, pkg, { spaces: 2 });
}
