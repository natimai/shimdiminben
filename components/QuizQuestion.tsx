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
        <CardContent className="p-4 sm:p-6 md:p-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 text-gray-800 leading-relaxed">{question}</h2>
          <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="space-y-4 radio-group">
            {shuffledOptions.map((option, index) => (
              <div key={index} className="relative">
                <Label
                  htmlFor={`option-${index}`}
                  className={`flex items-center w-full p-4 sm:p-5 rounded-xl border-2 transition-all duration-300 cursor-pointer
                    ${selectedAnswer === option 
                      ? 'border-blue-500 bg-blue-50/50 shadow-md transform scale-[1.02]' 
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50/50 hover:shadow-md hover:scale-[1.01]'}`}
                >
                  <RadioGroupItem 
                    value={option} 
                    id={`option-${index}`} 
                    className={`h-5 w-5 border-2 ml-4 ${
                      selectedAnswer === option 
                        ? 'border-blue-500' 
                        : 'border-gray-300'
                    }`} 
                  />
                  <div className="flex-grow">
                    <p className="text-base sm:text-lg md:text-xl text-gray-700">{option}</p>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
          <Button
            onClick={handleSubmit}
            disabled={!selectedAnswer || showFeedback}
            className="mt-8 sm:mt-10 w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-lg sm:text-xl font-bold py-4 sm:py-5 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:hover:scale-100 disabled:hover:shadow-lg"
          >
            בדוק תשובה
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
        <DialogContent className="dialog-content sm:max-w-2xl p-4 sm:p-6 md:p-8 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-gray-100 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-3 sm:space-y-4">
            <DialogTitle className={`text-2xl sm:text-3xl md:text-4xl font-bold ${selectedAnswer === correctAnswer ? "text-green-600" : "text-red-600"}`}>
              {selectedAnswer === correctAnswer ? "כל הכבוד! 🎉" : "לא נכון 😕"}
            </DialogTitle>
            <DialogDescription className="text-xl sm:text-2xl font-medium text-gray-700">
              {selectedAnswer === correctAnswer 
                ? "תשובה נכונה!"
                : <span>התשובה הנכונה היא: <span className="text-blue-600 font-semibold">{correctAnswer}</span></span>}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-200">
            <h4 className="font-bold text-xl sm:text-2xl mb-3 sm:mb-4 text-gray-800">הסבר:</h4>
            <p className="text-gray-700 text-lg sm:text-xl leading-relaxed">{explanation}</p>
          </div>
          <div className={`mt-6 p-4 sm:p-6 rounded-xl text-center ${
            selectedAnswer === correctAnswer 
              ? "bg-green-50 border-2 border-green-200" 
              : "bg-blue-50 border-2 border-blue-200"
          }`}>
            <p className={`text-lg sm:text-xl font-medium ${
              selectedAnswer === correctAnswer ? "text-green-600" : "text-blue-600"
            }`}>
              {feedbackMessage}
            </p>
          </div>
          <DialogFooter className="mt-8">
            <Button
              type="button"
              variant="default"
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-lg sm:text-xl font-bold py-4 sm:py-5 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              המשך לשאלה הבאה
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

