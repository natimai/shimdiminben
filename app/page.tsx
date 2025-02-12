"use client"

import { AccountingQuiz } from "@/components/AccountingQuiz"
import { questionBank } from "@/data/questionBank"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

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
  const [currentMessage, setCurrentMessage] = useState("")

  useEffect(() => {
    if (showQuiz) {
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * motivationalMessages.length)
        setCurrentMessage(motivationalMessages[randomIndex])
      }, 5000) // מחליף הודעה כל 5 שניות

      return () => clearInterval(interval)
    }
  }, [showQuiz])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 md:p-24 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white overflow-hidden">
      <div className="relative z-10 w-full max-w-5xl">
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
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 text-right bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100 drop-shadow-lg">
                שימדים בבן גוריון
              </h1>
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-right text-blue-100">
                  חשבונאות למנהל עסקים
                </h2>
                <motion.div 
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-3xl mx-auto transform hover:scale-105 transition-transform duration-300"
                  whileHover={{ boxShadow: "0 0 30px rgba(255,255,255,0.2)" }}
                >
                  <p className="text-lg sm:text-xl text-right leading-relaxed mb-6">
                    ברוכים הבאים לבוחן האינטראקטיבי בחשבונאות! 🎯
                    <br />
                    <span className="text-blue-100">
                      כאן תוכלו לתרגל את החומר בצורה חווייתית ומהנה
                    </span>
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-right text-sm text-blue-100 mb-8">
                    <div className="space-y-3">
                      <p className="flex items-center justify-end gap-2">
                        <span>שאלות מגוונות מכל החומר</span>
                        <span className="text-xl">✨</span>
                      </p>
                      <p className="flex items-center justify-end gap-2">
                        <span>הסברים מפורטים לכל תשובה</span>
                        <span className="text-xl">📚</span>
                      </p>
                    </div>
                    <div className="space-y-3">
                      <p className="flex items-center justify-end gap-2">
                        <span>ממשק ידידותי ונוח</span>
                        <span className="text-xl">🎮</span>
                      </p>
                      <p className="flex items-center justify-end gap-2">
                        <span>שאלות חדשות בכל פעם</span>
                        <span className="text-xl">🔄</span>
                      </p>
                    </div>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={() => setShowQuiz(true)}
                      className="w-full bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white text-xl font-bold py-4 px-8 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-2xl"
                    >
                      התחל בוחן 🚀
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative pt-28 sm:pt-24"
            >
              {/* Header with motivational message */}
              <div className="fixed top-0 left-0 right-0 z-50 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 px-4 py-3 bg-white/10 backdrop-blur-md">
                <Button
                  onClick={() => setShowQuiz(false)}
                  variant="ghost"
                  className="text-white hover:bg-white/20 transition-colors order-1 sm:order-1 w-full sm:w-auto"
                >
                  ← חזרה לדף הבית
                </Button>
                <motion.p
                  key={currentMessage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-base sm:text-lg font-medium text-white order-2 sm:order-2 text-center sm:text-right px-2 py-1"
                >
                  {currentMessage}
                </motion.p>
              </div>
              
              <AccountingQuiz questions={questionBank} numberOfQuestions={10} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-[20%] right-[5%] w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[10%] left-[35%] w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
    </main>
  )
}

