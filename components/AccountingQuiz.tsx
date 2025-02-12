"use client"

import React from "react"
import { QuizQuestion } from "./QuizQuestion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import { questionBank, type Question } from "../data/questionBank"
import confetti from "canvas-confetti"

function getRandomQuestions(n: number): Question[] {
  const shuffled = [...questionBank].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, n)
}

export function AccountingQuiz() {
  const [quizQuestions, setQuizQuestions] = React.useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0)
  const [score, setScore] = React.useState(0)
  const [quizCompleted, setQuizCompleted] = React.useState(false)
  const [showNextButton, setShowNextButton] = React.useState(false)

  React.useEffect(() => {
    setQuizQuestions(getRandomQuestions(20))
  }, [])

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 1)
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }
    setShowNextButton(true)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
      setShowNextButton(false)
    } else {
      setQuizCompleted(true)
    }
  }

  const restartQuiz = () => {
    setQuizQuestions(getRandomQuestions(20))
    setCurrentQuestionIndex(0)
    setScore(0)
    setQuizCompleted(false)
    setShowNextButton(false)
  }

  if (quizQuestions.length === 0) {
    return <div className="text-center text-xl text-white">טוען שאלות...</div>
  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-2xl">
      <CardHeader>
        <CardTitle className="text-2xl sm:text-3xl font-bold text-right text-gray-800">בוחן עצמי בחשבונאות</CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {!quizCompleted ? (
            <motion.div
              key="question"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <QuizQuestion
                key={currentQuestionIndex}
                question={quizQuestions[currentQuestionIndex].question}
                options={quizQuestions[currentQuestionIndex].options}
                correctAnswer={quizQuestions[currentQuestionIndex].correctAnswer}
                explanation={quizQuestions[currentQuestionIndex].explanation}
                onAnswer={handleAnswer}
              />
              <div className="mt-6">
                <Progress
                  value={((currentQuestionIndex + 1) / quizQuestions.length) * 100}
                  className="w-full h-2 bg-gray-200"
                  indicatorClassName="bg-blue-500"
                />
                <p className="text-right mt-2 text-sm text-gray-600">
                  שאלה {currentQuestionIndex + 1} מתוך {quizQuestions.length}
                </p>
              </div>
              {showNextButton && (
                <Button
                  onClick={handleNextQuestion}
                  className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                >
                  {currentQuestionIndex < quizQuestions.length - 1 ? "לשאלה הבאה" : "סיים בוחן"}
                </Button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-right"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800">הבוחן הסתיים!</h2>
              <p className="text-2xl mb-4 text-gray-700">
                הציון שלך: {score} מתוך {quizQuestions.length}
              </p>
              <Progress
                value={(score / quizQuestions.length) * 100}
                className="w-full h-4 mb-4 bg-gray-200"
                indicatorClassName="bg-green-500"
              />
              <Button
                onClick={restartQuiz}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
              >
                התחל בוחן חדש
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

