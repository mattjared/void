class VoidExtension {
  constructor() {
    this.notepad = document.getElementById("notepad")
    this.charCount = document.getElementById("charCount")
    this.exportBtn = document.getElementById("exportBtn")
    this.dateDisplay = document.getElementById("dateDisplay")

    this.motivationalQuotes = [
      "Start typing your tasks...",
      "Turn ideas into action...",
      "Progress begins with the first step...",
      "Small actions, big results...",
      "Make it happen, one note at a time...",
      "Productivity starts here...",
      "Get things done, write them down...",
      "Your next breakthrough is one task away...",
      "Focus on what matters most...",
      "Done is better than perfect...",
    ]

    this.currentQuoteIndex = 0

    this.init()
  }

  init() {
    this.loadNotes()
    this.setupEventListeners()
    this.updateDate()
    this.startQuoteRotation()
    this.notepad.focus()
  }

  loadNotes() {
    window.chrome.storage.local.get(["voidNotes"], (result) => {
      if (result.voidNotes) {
        this.notepad.value = result.voidNotes
        this.updateCharCount()
        this.toggleExportButton()
      }
    })
  }

  saveNotes() {
    const text = this.notepad.value
    window.chrome.storage.local.set({ voidNotes: text })
    this.updateCharCount()
    this.toggleExportButton()
  }

  setupEventListeners() {
    this.notepad.addEventListener("input", () => {
      this.saveNotes()
    })

    this.exportBtn.addEventListener("click", () => {
      this.exportToObsidian()
    })
  }

  updateCharCount() {
    const count = this.notepad.value.length
    this.charCount.textContent = `${count.toLocaleString()} character${count !== 1 ? "s" : ""}`
  }

  toggleExportButton() {
    const hasText = this.notepad.value.trim().length > 0
    this.exportBtn.style.display = hasText ? "flex" : "none"
  }

  updateDate() {
    const today = new Date()
    const dateStr = today.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
    this.dateDisplay.textContent = dateStr
  }

  startQuoteRotation() {
    setInterval(() => {
      this.currentQuoteIndex = (this.currentQuoteIndex + 1) % this.motivationalQuotes.length
      this.notepad.placeholder = this.motivationalQuotes[this.currentQuoteIndex]
    }, 3000)
  }

  exportToObsidian() {
    const text = this.notepad.value.trim()
    if (!text) return

    const today = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    const contentWithDate = `${text}\n\n---\n${today}`
    const obsidianUri = `obsidian://new?content=${encodeURIComponent(contentWithDate)}`

    window.open(obsidianUri, "_blank")

    // Clear the notes
    this.notepad.value = ""
    window.chrome.storage.local.remove(["voidNotes"])
    this.updateCharCount()
    this.toggleExportButton()
    this.notepad.focus()
  }
}

// Initialize the extension when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new VoidExtension()
})
