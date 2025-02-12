"use client"

import { AccountingQuiz } from "@/components/AccountingQuiz"
import { questionBank } from "@/data/questionBank"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"

const motivationalMessages = [
  "זוכרים - פחת זה לא כזה נורא! 📉",
  "אם שנהב יכולה, גם אתם יכולים! 💪",
  "חובה = זכות, בדיוק כמו ההצלחה שלכם! ⚖️",
  "תזרים מזומנים חיובי של ידע! 💰",
  "המאזן שלכם תמיד מאוזן! 📊",
  "רווח נקי של ידע בדרך! 📈",
  "הפרשה לחופשה? לא צריך, אתם שולטים בזה! 🏖️",
  "הון עצמי גבוה של בטחון! 🎯",
  "נכס בלתי מוחשי: הידע שלכם! 🧠",
  "מדיניות חשבונאית: להצליח בגדול! 🌟"
]

export default function Home() {
  const [showQuiz, setShowQuiz] = useState(false)
  const [isInfiniteMode, setIsInfiniteMode] = useState(false)
  const [currentMessage, setCurrentMessage] = useState("")
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    if (showQuiz) {
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * motivationalMessages.length)
        setCurrentMessage(motivationalMessages[randomIndex])
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [showQuiz])

  return (
    <main className="min-h-screen flex flex-col items-center justify-between p-4 sm:p-8 md:p-24 bg-clean">
      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="fixed top-4 left-4 p-2 rounded-full bg-white hover:bg-gray-100 transition-all duration-300"
      >
        {theme === "dark" ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </button>

      <div className="relative z-10 w-full max-w-5xl flex-1">
        <AnimatePresence mode="wait">
          {!showQuiz ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <motion.h1 
                className="text-4xl sm:text-6xl md:text-7xl font-bold mb-12 gradient-text-bgu"
              >
                שימדים בבן גוריון
              </motion.h1>
              
              <motion.div 
                className="clean-card max-w-3xl mx-auto"
              >
                <h2 className="text-2xl sm:text-3xl font-bold mb-8 subtle-border">
                  בואו נלמד חשבונאות יחד! <span className="emoji">🎯</span>
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                  <button
                    className="bgu-button"
                    onClick={() => {
                      setIsInfiniteMode(false)
                      setShowQuiz(true)
                    }}
                  >
                    <span className="emoji">📚</span>
                    <div>
                      <div className="font-bold">חידון רגיל</div>
                      <div className="text-sm opacity-80">10 שאלות אקראיות</div>
                    </div>
                  </button>

                  <button
                    className="bgu-button"
                    onClick={() => {
                      setIsInfiniteMode(true)
                      setShowQuiz(true)
                    }}
                  >
                    <span className="emoji">🔄</span>
                    <div>
                      <div className="font-bold">מוד אינסופי</div>
                      <div className="text-sm opacity-80">מותר עד 5 טעויות</div>
                    </div>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="clean-card">
                    <span className="emoji animate-gentle">✨</span>
                    <p className="mt-2">שאלות מגוונות</p>
                  </div>
                  <div className="clean-card">
                    <span className="emoji animate-gentle">📝</span>
                    <p className="mt-2">הסברים מפורטים</p>
                  </div>
                  <div className="clean-card">
                    <span className="emoji animate-gentle">🎮</span>
                    <p className="mt-2">ממשק נוח</p>
                  </div>
                  <div className="clean-card">
                    <span className="emoji animate-gentle">🎯</span>
                    <p className="mt-2">תרגול רציף</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <div className="fixed top-0 left-0 right-0 z-50 bg-clean p-4">
                <div className="max-w-5xl mx-auto flex justify-between items-center">
                  <button
                    onClick={() => {
                      setShowQuiz(false)
                      setIsInfiniteMode(false)
                    }}
                    className="bgu-button"
                  >
                    <span className="emoji">←</span>
                    חזרה לדף הבית
                  </button>
                  <motion.p
                    key={currentMessage}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-lg font-medium gradient-text"
                  >
                    {currentMessage}
                  </motion.p>
                </div>
              </div>
              
              <div className="pt-20">
                <AccountingQuiz 
                  questions={questionBank} 
                  isInfiniteMode={isInfiniteMode}
                  maxErrors={5}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* פוטר */}
      <footer className="w-full max-w-5xl mx-auto mt-8 text-center">
        <div className="clean-card">
          <p className="text-game-dark mb-2">
            האתר נבנה על ידי{" "}
            <span className="gradient-text font-bold">נתי מימון</span>
          </p>
          <a 
            href="https://wa.me/972544445567" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bgu-button inline-flex mx-auto"
          >
            <span className="emoji">💬</span>
            יצירת קשר
          </a>
        </div>
      </footer>
    </main>
  )
}

