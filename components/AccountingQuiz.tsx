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
  isInfiniteMode?: boolean
  maxErrors?: number
}

export function AccountingQuiz({ 
  questions, 
  numberOfQuestions = 10, 
  isInfiniteMode = false,
  maxErrors = 5 
}: AccountingQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0)
  const [score, setScore] = React.useState(0)
  const [quizQuestions, setQuizQuestions] = React.useState<Question[]>([])
  const [quizCompleted, setQuizCompleted] = React.useState(false)
  const [answers, setAnswers] = React.useState<QuizAnswer[]>([])
  const [errorCount, setErrorCount] = React.useState(0)
  const [answeredQuestions, setAnsweredQuestions] = React.useState<Set<number>>(new Set())

  React.useEffect(() => {
    if (isInfiniteMode) {
      // במוד אינסופי, נערבב את כל השאלות
      setQuizQuestions([...questions].sort(() => Math.random() - 0.5))
    } else {
      // במוד רגיל, ניקח מספר מוגבל של שאלות
      const randomQuestions = getRandomQuestions(questions, numberOfQuestions)
      setQuizQuestions(randomQuestions)
    }
    setAnswers([])
    setScore(0)
    setCurrentQuestionIndex(0)
    setQuizCompleted(false)
    setErrorCount(0)
    setAnsweredQuestions(new Set())
  }, [questions, numberOfQuestions, isInfiniteMode])

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore((prev) => prev + 1)
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    } else {
      if (isInfiniteMode) {
        setErrorCount(prev => prev + 1)
        if (errorCount + 1 >= maxErrors) {
          setQuizCompleted(true)
          return
        }
      }
    }
    
    setAnswers(prev => [...prev, {
      question: quizQuestions[currentQuestionIndex],
      userAnswer: quizQuestions[currentQuestionIndex].options.find(
        option => option === quizQuestions[currentQuestionIndex].correctAnswer
      ) || "",
      isCorrect
    }])

    if (isInfiniteMode) {
      setAnsweredQuestions(prev => new Set(prev).add(currentQuestionIndex))
    }
  }

  const handleNextQuestion = () => {
    if (!isInfiniteMode && currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else if (isInfiniteMode) {
      // במוד אינסופי, נמצא את השאלה הבאה שעוד לא נענתה
      let nextIndex = (currentQuestionIndex + 1) % quizQuestions.length
      while (answeredQuestions.has(nextIndex) && answeredQuestions.size < quizQuestions.length) {
        nextIndex = (nextIndex + 1) % quizQuestions.length
      }
      
      if (answeredQuestions.size >= quizQuestions.length) {
        setQuizCompleted(true)
      } else {
        setCurrentQuestionIndex(nextIndex)
      }
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
    <Card className="w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-xl shadow-lg quiz-container">
      <CardHeader className="p-3 sm:p-4 border-b border-game-secondary/20">
        <CardTitle className="text-lg sm:text-xl font-bold text-game-dark">
          בוחן עצמי בחשבונאות
          <p className="text-sm sm:text-base font-medium text-game-dark/70 mt-2">
            {isInfiniteMode 
              ? `מוד אינסופי - נותרו ${maxErrors - errorCount} טעויות` 
              : `נבחרו ${numberOfQuestions} שאלות אקראיות מתוך המאגר`}
          </p>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {!quizCompleted ? (
            <motion.div
              key="question"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4 flex-1 flex flex-col"
            >
              <div className="bg-game-light/50 p-3 sm:p-4 rounded-xl border-2 border-game-secondary/20">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-game-dark">
                    {isInfiniteMode ? (
                      <>שאלה {answeredQuestions.size + 1}</>
                    ) : (
                      <>שאלה {currentQuestionIndex + 1} מתוך {quizQuestions.length}</>
                    )}
                  </h2>
                  <p className="text-sm sm:text-base text-game-dark/80">
                    ניקוד: {score} {isInfiniteMode ? `(טעויות: ${errorCount}/${maxErrors})` : `מתוך ${currentQuestionIndex + 1}`}
                  </p>
                </div>
                <div className="mt-2 sm:mt-3">
                  <Progress
                    value={((currentQuestionIndex + 1) / quizQuestions.length) * 100}
                    className="h-2 sm:h-3 bg-game-secondary/20"
                  />
                  <p className="mt-1 text-xs sm:text-sm text-game-dark/60">
                    התקדמות: {Math.round(((currentQuestionIndex + 1) / quizQuestions.length) * 100)}%
                  </p>
                </div>
              </div>

              <div className="flex-1">
                <QuizQuestion
                  question={currentQuestion.question}
                  options={currentQuestion.options}
                  correctAnswer={currentQuestion.correctAnswer}
                  explanation={currentQuestion.explanation}
                  onAnswer={handleAnswer}
                  onNextQuestion={handleNextQuestion}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="bg-gradient-to-r from-game-secondary/10 to-game-primary/10 p-4 rounded-xl border-2 border-game-secondary/20">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 text-game-dark">סיכום המבחן</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <p className="text-lg sm:text-xl text-game-dark">
                      הציון שלך: {score} מתוך {quizQuestions.length}
                    </p>
                    <p className="text-base sm:text-lg text-game-dark/80">
                      אחוז הצלחה: {Math.round((score / quizQuestions.length) * 100)}%
                    </p>
                  </div>
                  <Progress
                    value={(score / quizQuestions.length) * 100}
                    className="h-3 sm:h-4 bg-game-secondary/20"
                  />
                </div>
              </div>

              {incorrectAnswers.length > 0 && (
                <div className="bg-white p-4 rounded-xl border-2 border-game-primary/20">
                  <h3 className="text-lg sm:text-xl font-bold mb-4 text-game-primary">
                    שאלות שטעית בהן:
                  </h3>
                  <div className="space-y-3 max-h-[40vh] overflow-y-auto">
                    {incorrectAnswers.map((answer, index) => (
                      <div key={index} className="p-3 bg-game-light rounded-xl border-2 border-game-secondary/20">
                        <p className="font-bold mb-2 text-base sm:text-lg text-game-dark">{answer.question.question}</p>
                        <p className="text-game-primary mb-2 text-sm sm:text-base">התשובה הנכונה: {answer.question.correctAnswer}</p>
                        <p className="text-game-dark/80 text-xs sm:text-sm">{answer.question.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button
                onClick={restartQuiz}
                className="w-full bgu-button"
              >
                <span className="emoji">🔄</span>
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

