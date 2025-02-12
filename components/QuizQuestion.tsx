"use client"

import React from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const correctAnswerMessages = [
  "שנהב הייתה גאה בך אם היא הייתה רואה אותך עכשיו! 🌟",
  "וואו! אתה ממש מבין בחשבונאות! 🎯",
  "אתה בטוח שאתה לא רואה חשבון מוסמך? 🤔",
  "ככה עונים על שאלה! 💪",
  "אפילו המאזן מחייך עכשיו! 📊",
  "הדוחות הכספיים מצדיעים לך! 📈",
  "שנהב תהיה חייבת להעלות לך ציון אחרי זה! 🎓",
  "אתה כזה חכם, אפילו החובה והזכות מסכימים! ⚖️",
  "הנה מי שיציל את כולנו במבחן! 🦸‍♂️",
  "תשובה מושלמת! שנהב הייתה נותנת לך 100! 💯"
]

const incorrectAnswerMessages = [
  "לא נורא, גם שנהב טעתה פעם בחישוב פחת... (כנראה) 😅",
  "היי, טעויות קורות לטובים ביותר! 🌈",
  "בשביל זה יש תיקוני טעויות בדוחות הכספיים! 📝",
  "לפחות זו לא טעות במבחן האמיתי! 🎯",
  "זה בסדר, נרשום את זה כהוצאה נדחית... 😉",
  "אופס! נראה שצריך לבצע התאמה קטנה... 🔧",
  "לא נורא, נתייחס לזה כמו להפרשי עיתוי - זמני בלבד! ⏳",
  "גם המאזן לא תמיד מאוזן בניסיון הראשון... 📊",
  "בוא נגיד שזו הייתה טעות מהותית שדורשת תיקון... 🛠️",
  "אל דאגה, יש לנו עוד הרבה שאלות להצליח בהן! 🎯"
]

interface QuizQuestionProps {
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
  onAnswer: (isCorrect: boolean) => void
  onNextQuestion: () => void
}

export function QuizQuestion({ 
  question, 
  options, 
  correctAnswer, 
  explanation, 
  onAnswer,
  onNextQuestion 
}: QuizQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = React.useState("")
  const [showFeedback, setShowFeedback] = React.useState(false)
  const [shuffledOptions, setShuffledOptions] = React.useState<string[]>([])
  const [feedbackMessage, setFeedbackMessage] = React.useState("")

  React.useEffect(() => {
    setShuffledOptions([...options].sort(() => Math.random() - 0.5))
  }, [options])

  const getRandomMessage = (messages: string[]) => {
    const randomIndex = Math.floor(Math.random() * messages.length)
    return messages[randomIndex]
  }

  const handleSubmit = () => {
    if (selectedAnswer) {
      const isCorrect = selectedAnswer === correctAnswer
      const message = isCorrect 
        ? getRandomMessage(correctAnswerMessages)
        : getRandomMessage(incorrectAnswerMessages)
      setFeedbackMessage(message)
      setShowFeedback(true)
      onAnswer(isCorrect)
    }
  }

  const handleNext = () => {
    setShowFeedback(false)
    setSelectedAnswer("")
    onNextQuestion()
  }

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-xl shadow-lg">
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-game-dark leading-relaxed">
              {question}
            </h2>
            
            <RadioGroup 
              value={selectedAnswer} 
              onValueChange={setSelectedAnswer} 
              className="grid gap-3"
            >
              {shuffledOptions.map((option, index) => (
                <Label
                  key={index}
                  htmlFor={`option-${index}`}
                  className={`relative p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer
                    ${selectedAnswer === option 
                      ? 'border-game-primary bg-game-primary/10' 
                      : 'border-game-secondary/30 hover:border-game-primary/50 hover:bg-game-primary/5'}`}
                >
                  <div className="flex items-start gap-3">
                    <RadioGroupItem 
                      value={option} 
                      id={`option-${index}`}
                      className="mt-1 w-4 h-4 border-2 border-game-primary"
                    />
                    <span className="flex-1 text-base sm:text-lg text-game-dark font-medium leading-relaxed">{option}</span>
                  </div>
                </Label>
              ))}
            </RadioGroup>

            <Button
              onClick={handleSubmit}
              disabled={!selectedAnswer || showFeedback}
              className="w-full bgu-button mt-4"
            >
              <span className="emoji">✨</span>
              בדוק תשובה
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
        <DialogContent className="dialog-content sm:max-w-2xl p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className={`text-xl sm:text-2xl font-bold ${selectedAnswer === correctAnswer ? "text-game-secondary" : "text-game-primary"}`}>
              {selectedAnswer === correctAnswer ? "כל הכבוד! 🎉" : "לא נכון 😕"}
            </DialogTitle>
            <DialogDescription className="text-lg sm:text-xl font-medium mt-3">
              {selectedAnswer === correctAnswer 
                ? "תשובה נכונה!"
                : <span>התשובה הנכונה היא: <span className="text-game-primary font-bold">{correctAnswer}</span></span>}
            </DialogDescription>
          </DialogHeader>

          <div className="bg-game-light/50 p-4 sm:p-5 rounded-xl border-2 border-game-secondary/20">
            <h4 className="font-bold text-lg sm:text-xl mb-2 text-game-dark">הסבר:</h4>
            <p className="text-base sm:text-lg leading-relaxed text-game-dark/80">{explanation}</p>
          </div>

          <div className={`p-4 sm:p-5 rounded-xl text-center ${
            selectedAnswer === correctAnswer 
              ? "bg-game-secondary/10 border-2 border-game-secondary/20" 
              : "bg-game-primary/10 border-2 border-game-primary/20"
          }`}>
            <p className="text-lg sm:text-xl font-medium text-game-dark">{feedbackMessage}</p>
          </div>

          <DialogFooter>
            <Button
              onClick={handleNext}
              className="w-full bgu-button"
            >
              <span className="emoji">➡️</span>
              המשך לשאלה הבאה
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

