import { AccountingQuiz } from "@/components/AccountingQuiz"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 md:p-24 bg-gradient-to-br from-blue-500 to-purple-600 text-white overflow-hidden">
      <div className="relative z-10 w-full max-w-5xl">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-4 sm:mb-8 text-right">שימדים בבן גוריון</h1>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 sm:mb-8 text-right">חשבונאות למנהל עסקים</h2>
        <p className="text-lg sm:text-xl text-right mb-8">בחן את הידע שלך בחשבונאות עם הבוחן האינטראקטיבי שלנו!</p>
        <AccountingQuiz />
      </div>
    </main>
  )
}

