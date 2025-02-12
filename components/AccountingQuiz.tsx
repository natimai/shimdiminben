"use client"

import React from "react"
import { QuizQuestion } from "./QuizQuestion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import { type Question } from "../data/questionBank"
import confetti from "canvas-confetti"

interface QuizAnswer {
  question: Question
  userAnswer: string
  isCorrect: boolean
}

interface AccountingQuizProps {
  questions: Question[]
  numberOfQuestions?: number
}

export function AccountingQuiz({ questions, numberOfQuestions = 10 }: AccountingQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0)
  const [score, setScore] = React.useState(0)
  const [quizQuestions, setQuizQuestions] = React.useState<Question[]>([])
  const [quizCompleted, setQuizCompleted] = React.useState(false)
  const [answers, setAnswers] = React.useState<QuizAnswer[]>([])

  React.useEffect(() => {
    const randomQuestions = getRandomQuestions(questions, numberOfQuestions)
    setQuizQuestions(randomQuestions)
    setAnswers([])
    setScore(0)
    setCurrentQuestionIndex(0)
    setQuizCompleted(false)
  }, [questions, numberOfQuestions])

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore((prev) => prev + 1)
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
    
    setAnswers(prev => [...prev, {
      question: quizQuestions[currentQuestionIndex],
      userAnswer: quizQuestions[currentQuestionIndex].options.find(
        option => option === quizQuestions[currentQuestionIndex].correctAnswer
      ) || "",
      isCorrect
    }])
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      setQuizCompleted(true)
    }
  }

  const restartQuiz = () => {
    const randomQuestions = getRandomQuestions(questions, numberOfQuestions)
    setQuizQuestions(randomQuestions)
    setAnswers([])
    setScore(0)
    setCurrentQuestionIndex(0)
    setQuizCompleted(false)
  }

  if (quizQuestions.length === 0) {
    return <div className="text-center text-xl text-white">טוען שאלות...</div>
  }

  const currentQuestion = quizQuestions[currentQuestionIndex]
  const incorrectAnswers = answers.filter(answer => !answer.isCorrect)

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-xl shadow-2xl">
      <CardHeader className="p-4 sm:p-6 md:p-8 border-b border-gray-100">
        <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
          בוחן עצמי בחשבונאות
          <p className="text-base sm:text-lg font-medium text-gray-600 mt-2">
            בכל פעם נבחרות {numberOfQuestions} שאלות באופן אקראי מתוך מאגר השאלות
          </p>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 md:p-8">
        <AnimatePresence mode="wait">
          {!quizCompleted ? (
            <motion.div
              key="question"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6 sm:mb-8 bg-gray-50/50 p-4 sm:p-6 rounded-xl border border-gray-200">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 text-gray-800">
                  שאלה {currentQuestionIndex + 1} מתוך {quizQuestions.length}
                </h2>
                <p className="text-lg sm:text-xl text-gray-700">
                  ניקוד: {score} מתוך {currentQuestionIndex + 1}
                </p>
              </div>
              <QuizQuestion
                question={currentQuestion.question}
                options={currentQuestion.options}
                correctAnswer={currentQuestion.correctAnswer}
                explanation={currentQuestion.explanation}
                onAnswer={handleAnswer}
                onNextQuestion={handleNextQuestion}
              />
              <div className="mt-6 sm:mt-8">
                <Progress
                  value={((currentQuestionIndex + 1) / quizQuestions.length) * 100}
                  className="h-3 sm:h-4 w-full bg-gray-200 dark:bg-gray-700 progress"
                />
                <p className="mt-2 text-base sm:text-lg text-gray-600">
                  התקדמות: {Math.round(((currentQuestionIndex + 1) / quizQuestions.length) * 100)}%
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 sm:p-8 rounded-xl mb-8 border-2 border-blue-100/50">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-gray-800">סיכום המבחן</h2>
                <div className="space-y-4">
                  <p className="text-xl sm:text-2xl md:text-3xl mb-4 text-gray-700">
                    הציון שלך: {score} מתוך {quizQuestions.length}
                  </p>
                  <div className="relative">
                    <Progress
                      value={(score / quizQuestions.length) * 100}
                      className="h-4 sm:h-5 w-full bg-gray-200 dark:bg-gray-700 progress"
                    />
                    <p className="absolute top-full mt-2 text-lg sm:text-xl text-gray-600">
                      אחוז הצלחה: {Math.round((score / quizQuestions.length) * 100)}%
                    </p>
                  </div>
                </div>
              </div>

              {incorrectAnswers.length > 0 && (
                <div className="bg-white p-6 sm:p-8 rounded-xl border-2 border-gray-100 shadow-lg">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 text-red-600">
                    שאלות שטעית בהן:
                  </h3>
                  <div className="space-y-6">
                    {incorrectAnswers.map((answer, index) => (
                      <div key={index} className="p-4 sm:p-6 bg-gray-50 rounded-xl border-2 border-gray-200 transition-all duration-300 hover:shadow-md">
                        <p className="font-bold mb-3 text-lg sm:text-xl text-gray-800">{answer.question.question}</p>
                        <p className="text-red-600 mb-3 text-base sm:text-lg">התשובה הנכונה: {answer.question.correctAnswer}</p>
                        <p className="text-gray-700 text-base sm:text-lg leading-relaxed">{answer.question.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button
                onClick={restartQuiz}
                className="mt-8 sm:mt-10 w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-lg sm:text-xl font-bold py-4 sm:py-5 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-[0.98] shadow-lg hover:shadow-xl"
              >
                התחל מבחן חדש
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

function getRandomQuestions(questions: Question[], count: number): Question[] {
  // מיון השאלות לשתי קבוצות - שאלות מהמבחן של שנהב ושאלות רגילות
  const examQuestions = questions.filter(q => q.question.includes("⭐️ שאלה מהמבחן של שנהב"))
  const regularQuestions = questions.filter(q => !q.question.includes("⭐️ שאלה מהמבחן של שנהב"))

  // בחירת שאלה אחת אקראית מהמבחן של שנהב
  const selectedExamQuestion = examQuestions[Math.floor(Math.random() * examQuestions.length)]

  // ערבוב השאלות הרגילות
  const shuffledRegularQuestions = [...regularQuestions].sort(() => Math.random() - 0.5)

  // בחירת שאר השאלות מהשאלות הרגילות
  const selectedRegularQuestions = shuffledRegularQuestions.slice(0, count - 1)

  // שילוב השאלות וערבוב סופי
  return [...selectedRegularQuestions, selectedExamQuestion].sort(() => Math.random() - 0.5)
}

