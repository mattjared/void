const fs = require("fs/promises")
const path = require("path")

const projectRoot = path.join(__dirname, "..")

async function bumpVersion() {
  console.log("📈 Bumping version number...")
  
  const manifestPath = path.join(projectRoot, "manifest.json")
  const manifestContent = await fs.readFile(manifestPath, "utf8")
  const manifest = JSON.parse(manifestContent)
  
  // Parse current version (e.g., "1.0" -> [1, 0])
  const versionParts = manifest.version.split(".").map(Number)
  const [major, minor, patch = 0] = versionParts
  
  // Bump minor version
  const newMinor = minor + 1
  const newVersion = `${major}.${newMinor}`
  
  // Update manifest
  manifest.version = newVersion
  
  // Write back to manifest.json
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2))
  
  console.log(`✅ Version bumped from ${versionParts.join(".")} to ${newVersion}`)
  return newVersion
}

async function buildExtension() {
  console.log("🔨 Building Chrome Extension...")

  // Bump version first
  const newVersion = await bumpVersion()

  const buildDir = path.join(projectRoot, "chrome-extension-build")

  // Clean and create build directory
  try {
    await fs.rm(buildDir, { recursive: true, force: true })
  } catch (error) {
    // Directory doesn't exist, that's fine
  }

  await fs.mkdir(buildDir, { recursive: true })

  // Files to copy for the Chrome extension
  const filesToCopy = [
    "manifest.json", 
    "index.html", 
    "styles.css", 
    "script.js"
  ]

  // Copy each file
  for (const file of filesToCopy) {
    const sourcePath = path.join(projectRoot, file)
    const destPath = path.join(buildDir, file)

    try {
      await fs.copyFile(sourcePath, destPath)
      console.log(`✅ Copied ${file}`)
    } catch (error) {
      console.error(`❌ Failed to copy ${file}:`, error.message)
    }
  }

  // Copy icon files from public directory
  const iconFiles = ["placeholder-logo.png", "placeholder-logo.svg"]
  for (const iconFile of iconFiles) {
    const sourcePath = path.join(projectRoot, "public", iconFile)
    const destPath = path.join(buildDir, iconFile)

    try {
      await fs.copyFile(sourcePath, destPath)
      console.log(`✅ Copied icon: ${iconFile}`)
    } catch (error) {
      console.error(`❌ Failed to copy icon ${iconFile}:`, error.message)
    }
  }

  // Fix icon paths in the copied manifest.json
  const buildManifestPath = path.join(buildDir, "manifest.json")
  const buildManifestContent = await fs.readFile(buildManifestPath, "utf8")
  const buildManifest = JSON.parse(buildManifestContent)
  
  // Update icon paths to remove "public/" prefix
  if (buildManifest.icons) {
    for (const size in buildManifest.icons) {
      buildManifest.icons[size] = buildManifest.icons[size].replace(/^public\//, "")
    }
  }
  
  // Write the corrected manifest back
  await fs.writeFile(buildManifestPath, JSON.stringify(buildManifest, null, 2))
  console.log(`✅ Fixed icon paths in manifest.json`)

  console.log(`\n🎉 Chrome Extension built successfully!`)
  console.log(`📦 Version: ${newVersion}`)
  console.log(`📁 Extension files are in: ${buildDir}`)
  console.log(`\n📋 To install:`)
  console.log(`1. Open Chrome and go to chrome://extensions/`)
  console.log(`2. Enable "Developer mode" (top right toggle)`)
  console.log(`3. Click "Load unpacked"`)
  console.log(`4. Select the folder: ${buildDir}`)
  console.log(`5. Open a new tab to see your Void extension!`)

  return buildDir
}

// Run the build
buildExtension().catch(console.error)
