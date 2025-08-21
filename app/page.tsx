"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"

export default function Void() {
  const [text, setText] = useState("")
  const [charCount, setCharCount] = useState(0)
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const motivationalQuotes = [
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

  useEffect(() => {
    const savedText = localStorage.getItem("void-notes")
    if (savedText) {
      setText(savedText)
      setCharCount(savedText.length)
    }
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    setText(newText)
    setCharCount(newText.length)
    localStorage.setItem("void-notes", newText)
  }

  const sendToObsidian = () => {
    if (!text.trim()) return

    const today = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    const contentWithDate = `${text}\n\n---\n${today}`

    const obsidianUri = `obsidian://new?content=${encodeURIComponent(contentWithDate)}`

    window.open(obsidianUri, "_blank")

    setText("")
    setCharCount(0)
    localStorage.removeItem("void-notes")

    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  const getWeather = async () => {
    const response = await fetch("https://wttr.in/?format=j1")
    const data = await response.json()
    const tempF = data.current_condition[0].temp_F;
    const conditions = data.current_condition[0].weatherDesc[0].value;
    return `${tempF}°F, ${conditions}`;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        {text.trim() && (
          <button
            onClick={sendToObsidian}
            className="opacity-30 hover:opacity-70 transition-opacity duration-200 text-gray-500 hover:text-gray-700 flex items-center gap-1 text-xs"
            title="Send to Obsidian and clear"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14,2 14,8 20,8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10,9 9,9 8,9" />
            </svg>
            Export
          </button>
        )}
      </div>

      <div className="flex-1 px-8 flex justify-center relative">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          placeholder={motivationalQuotes[placeholderIndex]}
          className="w-1/3 h-full resize-none border-none outline-none text-gray-800 text-base leading-relaxed placeholder-slate-300 font-mono pt-8"
          style={{
            minHeight: "calc(100vh)",
          }}
        />
      </div>

      <div className="p-4 absolute bottom-4 right-4 flex items-center gap-2 flex-col text-xs text-gray-400">
        <div className="flex gap-1">
          <p>
            {charCount.toLocaleString()} character{charCount !== 1 ? "s" : ""}
          </p>
          <p>
            {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </p>
        </div>
        <p>{getWeather()}</p>
      </div>
    </div>
  )
}
