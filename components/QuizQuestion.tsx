"use client"

import React from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"

interface QuizQuestionProps {
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
  onAnswer: (isCorrect: boolean) => void
}

export function QuizQuestion({ question, options, correctAnswer, explanation, onAnswer }: QuizQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = React.useState("")
  const [showFeedback, setShowFeedback] = React.useState(false)
  const [shuffledOptions, setShuffledOptions] = React.useState<string[]>([])

  React.useEffect(() => {
    // ערבוב התשובות בטעינת השאלה
    setShuffledOptions([...options].sort(() => Math.random() - 0.5))
  }, [options])

  const handleSubmit = () => {
    if (selectedAnswer) {
      const isCorrect = selectedAnswer === correctAnswer
      setShowFeedback(true)
      onAnswer(isCorrect)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg">
      <CardContent className="p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-right text-gray-800">{question}</h2>
        <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="space-y-4">
          {shuffledOptions.map((option, index) => (
            <div key={index} className="flex items-center space-x-2 space-x-reverse">
              <Label
                htmlFor={`option-${index}`}
                className="text-base sm:text-lg text-gray-700 flex-grow text-right cursor-pointer p-3 rounded-lg transition-colors duration-200 ease-in-out hover:bg-gray-100"
              >
                {option}
              </Label>
              <RadioGroupItem value={option} id={`option-${index}`} className="border-gray-300" />
            </div>
          ))}
        </RadioGroup>
        <Button
          onClick={handleSubmit}
          disabled={!selectedAnswer || showFeedback}
          className="mt-8 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          בדוק תשובה
        </Button>
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`mt-6 p-4 rounded-lg ${selectedAnswer === correctAnswer ? "bg-green-100" : "bg-red-100"}`}
            >
              <p className="font-bold mb-2 text-gray-800 text-right text-lg">
                {selectedAnswer === correctAnswer
                  ? "נכון! כל הכבוד! 🎉"
                  : `לא נכון. התשובה הנכונה היא: ${correctAnswer}`}
              </p>
              <p className="text-gray-700 text-right">{explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

