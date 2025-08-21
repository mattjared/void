import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.join(__dirname, "..")

async function buildExtension() {
  console.log("🔨 Building Chrome Extension...")

  const buildDir = path.join(projectRoot, "chrome-extension-build")

  // Clean and create build directory
  try {
    await fs.rm(buildDir, { recursive: true, force: true })
  } catch (error) {
    // Directory doesn't exist, that's fine
  }

  await fs.mkdir(buildDir, { recursive: true })

  // Files to copy for the Chrome extension
  const filesToCopy = ["manifest.json", "index.html", "styles.css", "script.js"]

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

  console.log(`\n🎉 Chrome Extension built successfully!`)
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
