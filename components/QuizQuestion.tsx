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
    // ערבוב התשובות בטעינת השאלה
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
    <>
      <Card className="w-full max-w-2xl mx-auto bg-white/95 backdrop-blur-md rounded-xl shadow-lg">
        <CardContent className="p-4 sm:p-8">
          <h2 className="text-xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-right text-gray-800 leading-relaxed">{question}</h2>
          <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="space-y-4">
            {shuffledOptions.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 space-x-reverse">
                <Label
                  htmlFor={`option-${index}`}
                  className="text-base sm:text-xl text-gray-700 flex-grow text-right cursor-pointer p-4 rounded-lg transition-colors duration-200 ease-in-out hover:bg-gray-100 border-2 border-gray-200"
                >
                  {option}
                </Label>
                <RadioGroupItem value={option} id={`option-${index}`} className="border-2 border-gray-300 h-5 w-5" />
              </div>
            ))}
          </RadioGroup>
          <Button
            onClick={handleSubmit}
            disabled={!selectedAnswer || showFeedback}
            className="mt-6 sm:mt-8 w-full bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white text-lg sm:text-xl font-bold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
          >
            בדוק תשובה
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
        <DialogContent className="sm:max-w-xl p-4 sm:p-6 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-gray-100 text-right max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-2 sm:space-y-3">
            <DialogTitle className={`text-2xl sm:text-4xl font-bold ${selectedAnswer === correctAnswer ? "text-green-600" : "text-red-600"}`}>
              {selectedAnswer === correctAnswer ? "כל הכבוד! 🎉" : "לא נכון 😕"}
            </DialogTitle>
            <DialogDescription className="text-xl sm:text-2xl font-medium text-gray-700">
              {selectedAnswer === correctAnswer 
                ? "תשובה נכונה!"
                : <span>התשובה הנכונה היא: <span className="text-blue-600 font-semibold">{correctAnswer}</span></span>}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 sm:mt-6 bg-gray-50 p-4 sm:p-6 rounded-xl">
            <h4 className="font-bold text-xl sm:text-2xl mb-2 sm:mb-3 text-gray-800">הסבר:</h4>
            <p className="text-gray-700 text-lg sm:text-xl leading-relaxed">{explanation}</p>
          </div>
          <div className={`mt-4 sm:mt-6 p-4 sm:p-6 rounded-xl text-center ${
            selectedAnswer === correctAnswer 
              ? "bg-green-50 border-2 border-green-100" 
              : "bg-blue-50 border-2 border-blue-100"
          }`}>
            <p className={`text-lg sm:text-xl font-medium ${
              selectedAnswer === correctAnswer ? "text-green-600" : "text-blue-600"
            }`}>
              {feedbackMessage}
            </p>
          </div>
          <DialogFooter className="mt-6 sm:mt-8">
            <Button
              type="button"
              variant="default"
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white text-lg sm:text-xl font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-[0.98]"
            >
              המשך לשאלה הבאה
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

