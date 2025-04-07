import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

// Define the questions
const questions = [
  {
    id: 1,
    question: "When your code compiles on the first try, you assume:",
    options: [
      "Something's definitely wrong and I just can't see it yet",
      "The compiler is broken",
      "I've accidentally created Skynet",
      "It's a trap"
    ]
  },
  {
    id: 2,
    question: "Your startup fails because:",
    options: [
      "We built something nobody wanted",
      "We scaled before product-market fit",
      "My co-founder insisted our database be a series of Excel files",
      "The VC insisted our MVP needed blockchain"
    ]
  },
  {
    id: 3,
    question: "When a non-technical person asks what you do for a living, you say:",
    options: [
      "I solve puzzles all day, but with computers",
      "I yell at a machine until it does what I want",
      "I convert caffeine into code",
      "I'm in tech (and promptly change the subject)"
    ]
  },
  {
    id: 4,
    question: "Your code documentation philosophy is:",
    options: [
      "Code should be self-documenting",
      "I'll document it later (narrator: they never did)",
      "My variable names are my documentation",
      "Documentation is a love letter to your future self"
    ]
  },
  {
    id: 5,
    question: "The ideal technical co-founder should:",
    options: [
      "Always agree with me to avoid conflict",
      "Challenge my ideas but respect the final decision",
      "Be able to code 18 hours a day like the legends in Silicon Valley",
      "Know when it's time to pivot to an NFT marketplace"
    ]
  },
  {
    id: 6,
    question: "True or False: A good server setup is more satisfying than a good date.",
    options: ["True", "False"],
    isTrueFalse: true
  },
  {
    id: 7,
    question: "Your approach to technical debt is:",
    options: [
      "Ignore it until the whole system collapses",
      "Advocate for regular refactoring sprints",
      "Write perfect code the first time (obviously)",
      "That's a problem for future me"
    ]
  },
  {
    id: 8,
    question: "True or False: It's better to ask forgiveness than permission when deploying to production on Friday at 5pm.",
    options: ["True", "False"],
    isTrueFalse: true
  },
  {
    id: 9,
    question: "The best way to resolve a technical disagreement with your co-founder is:",
    options: [
      "Whoever writes it, decides it",
      "Whoever can explain it better to a rubber duck",
      "Rock-paper-scissors-lizard-Spock",
      "Let the VC decide (they know best)"
    ]
  }
]

function IceBreaker() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [isCompleted, setIsCompleted] = useState(false)
  const navigate = useNavigate()
  const topRef = useRef(null)
  
  const currentQuestion = questions[currentQuestionIndex]
  const progress = Math.round(((currentQuestionIndex) / questions.length) * 100)
  
  // Auto-scroll to the component when loaded or questions change
  useEffect(() => {
    // Add a small delay to avoid scrolling until animation completes
    setTimeout(() => {
      // Only scroll if we're changing questions, not on initial load
      if (currentQuestionIndex > 0 || isCompleted) {
        // Adjust scrolling to account for the sticky header (approx 150px)
        window.scrollTo({
          top: topRef.current ? topRef.current.offsetTop - 180 : 0,
          behavior: 'smooth'
        });
      }
    }, 100);
  }, [currentQuestionIndex, isCompleted])
  
  const handleAnswer = (answer) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: answer
    })
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      // Scroll handled by the useEffect that watches currentQuestionIndex
    } else {
      setIsCompleted(true)
      // Store answers in session storage for potential use later
      sessionStorage.setItem('icebreaker_answers', JSON.stringify({
        ...answers,
        [currentQuestion.id]: answer
      }))
      // Scroll handled by the useEffect that watches isCompleted
    }
  }
  
  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      // Scroll handled by the useEffect that watches currentQuestionIndex
    }
  }
  
  const handleFinish = () => {
    // Redirect to register page
    navigate('/register')
  }
  
  if (isCompleted) {
    return (
      <div ref={topRef} className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-xl p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary-300 mb-6">Icebreaker Complete!</h2>
          <p className="text-xl text-gray-300 mb-8">
            Based on your answers, you're ready to find your shellmate!
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button
              onClick={handleFinish}
              className="px-8 py-3 text-lg font-medium rounded-md bg-primary-600 text-white hover:bg-primary-700 transition-colors"
            >
              Find My Technical Match
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div ref={topRef} className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-xl p-8">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Question {currentQuestionIndex + 1} of {questions.length}</span>
          <span className="text-sm text-gray-400">{progress}% Complete</span>
        </div>
        <div className="w-full bg-gray-600 rounded-full h-2">
          <div 
            className="bg-primary-500 h-2 rounded-full transition-all duration-300 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      <h2 className="text-2xl font-semibold text-primary-300 mb-6">{currentQuestion.question}</h2>
      
      <div className="space-y-3">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            className={`w-full text-left p-4 rounded-md ${
              currentQuestion.isTrueFalse 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            } transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
          >
            {option}
          </button>
        ))}
      </div>
      
      {currentQuestionIndex > 0 && (
        <div className="mt-6">
          <button
            onClick={handlePrev}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Previous Question
          </button>
        </div>
      )}
    </div>
  )
}

export default IceBreaker