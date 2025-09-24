import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'
import { useAppContext } from '../App.jsx'
import { 
  SparklesIcon, 
  ArrowRightIcon,
  MicrophoneIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  DevicePhoneMobileIcon,
  AcademicCapIcon,
  BoltIcon
} from '@heroicons/react/24/outline'

export default function Landing() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { 
    isVoiceMode, 
    setIsVoiceMode, 
    isOfflineMode,
    setIsChatBotOpen,
    generateRecommendations,
    userProfile
  } = useAppContext()

  const [demoStep, setDemoStep] = useState(0)
  const [showResumeBuilder, setShowResumeBuilder] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [showSMSForm, setShowSMSForm] = useState(false)

  // Trust highlights - Single blue color theme
  const trustHighlights = [
    { 
      icon: SparklesIcon, 
      text: 'AI-Powered',
      description: 'Smart matching algorithm'
    },
    { 
      icon: MicrophoneIcon, 
      text: 'Voice Ready',
      description: 'Speak in your language'
    },
    { 
      icon: AcademicCapIcon, 
      text: 'Skill Gaps',
      description: 'Learn what you need'
    },
    { 
      icon: DevicePhoneMobileIcon, 
      text: 'SMS Support',
      description: 'Works without internet'
    }
  ]

  // Demo animation steps
  const demoSteps = [
    "Analyzing your profile...",
    "Matching with 1000+ internships...",
    "Finding skill gaps...",
    "Preparing recommendations..."
  ]

  // Resume building steps
  const resumeSteps = [
    "Loading resume templates...",
    "Analyzing your skills...",
    "Formatting professional layout...",
    "Generating PDF resume..."
  ]

  useEffect(() => {
    if (showResumeBuilder) {
      const timer = setInterval(() => {
        setDemoStep(prev => (prev + 1) % resumeSteps.length)
      }, 1500)
      return () => clearInterval(timer)
    }
  }, [showResumeBuilder])

  const handleVoiceStart = () => {
    setIsVoiceMode(true)
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        t('voice_welcome', 'Welcome to InternPath! Tell me about your skills and interests.')
      )
      utterance.lang = 'en-US'
      speechSynthesis.speak(utterance)
    }
    navigate('/profile')
  }

  const handleSMSRequest = async (e) => {
    e.preventDefault()
    if (phoneNumber) {
      alert(`SMS recommendations will be sent to ${phoneNumber}`)
      setShowSMSForm(false)
      setPhoneNumber('')
    }
  }

  const handleResumeBuilder = async () => {
    setShowResumeBuilder(true)
    
    setTimeout(() => {
      // Navigate to resume builder or show resume template
      navigate('/resume-builder') // or wherever your resume builder is
      // Alternatively, you could open a modal or show templates inline
    }, 6000)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-lg mx-auto">
          {/* Logo - Clean blue theme */}
          <div className="w-20 h-20 mx-auto mb-6 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 relative">
            <SparklesIcon className="w-10 h-10 text-white" />
            {isVoiceMode && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Intern<span className="text-blue-600">Path</span>
          </h1>
          
          <p className="text-blue-600 font-medium mb-3">
            AI-Powered Internship Recommender
          </p>
          
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Find your perfect internship with AI that speaks your language
          </p>

          {/* CTAs */}
          <div className="space-y-3 mb-8">
            {/* Primary CTA */}
            <Link
              to="/profile"
              className="group w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3 text-lg"
            >
              <SparklesIcon className="w-6 h-6" />
              <span>Get My Recommendations</span>
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Voice CTA */}
            <button
              onClick={handleVoiceStart}
              className="group w-full bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 hover:border-blue-300 text-blue-700 font-medium py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3"
            >
              <MicrophoneIcon className="w-5 h-5" />
              <span>Start with Voice</span>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            </button>

            {/* Resume Builder CTA */}
            <button
              onClick={handleResumeBuilder}
              disabled={showResumeBuilder}
              className="group w-full bg-green-50 hover:bg-green-100 border-2 border-green-200 hover:border-green-300 text-green-700 font-medium py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {showResumeBuilder ? (
                <>
                  <DocumentTextIcon className="w-5 h-5 animate-pulse" />
                  <span>{resumeSteps[demoStep]}</span>
                </>
              ) : (
                <>
                  <DocumentTextIcon className="w-5 h-5" />
                  <span>Create Resume</span>
                </>
              )}
            </button>
          </div>

          {/* SMS Fallback for Offline Users */}
          {isOfflineMode && (
            <div className="mb-8 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <DevicePhoneMobileIcon className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-800">Offline? No problem!</span>
              </div>
              
              {!showSMSForm ? (
                <button
                  onClick={() => setShowSMSForm(true)}
                  className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 py-2 px-4 rounded-lg transition-colors"
                >
                  Get Recommendations via SMS
                </button>
              ) : (
                <form onSubmit={handleSMSRequest} className="space-y-3">
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Send SMS
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSMSForm(false)}
                      className="px-4 py-2 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-4 mt-12">
        <div className="text-center mb-8">
          <p className="text-gray-600 mb-6">Trusted by thousands of students</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {trustHighlights.map((item, index) => {
            const Icon = item.icon
            return (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 text-center border border-gray-200"
                onClick={() => {
                  if (item.text === 'Voice Ready') handleVoiceStart()
                  if (item.text === 'SMS Support') setShowSMSForm(true)
                }}
              >
                <Icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">{item.text}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto px-4 mt-12">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-1">15k+</div>
              <div className="text-sm text-gray-600">Students</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-1">800+</div>
              <div className="text-sm text-gray-600">Companies</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-1">97%</div>
              <div className="text-sm text-gray-600">Success</div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="max-w-6xl mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <AcademicCapIcon className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="font-semibold text-gray-800 mb-2">Skill Gap Analysis</h3>
            <p className="text-sm text-gray-600">Learn exactly what skills you need</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <DocumentTextIcon className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="font-semibold text-gray-800 mb-2">Auto-Resume Generator</h3>
            <p className="text-sm text-gray-600">One-click PDF resume creation</p>
          </div>
          
          <button
            onClick={() => setIsChatBotOpen(true)}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow text-left w-full"
          >
            <ChatBubbleLeftRightIcon className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="font-semibold text-gray-800 mb-2">AI Assistant</h3>
            <p className="text-sm text-gray-600">Get help navigating your career</p>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto px-4 mt-12 text-center">
        <p className="text-sm text-gray-500 mb-2">
          Inclusive • Fast • Transparent • Voice-Ready
        </p>
        <p className="text-sm text-gray-400">
          Supporting 10+ Indian languages • Works offline via SMS
        </p>
      </div>
    </div>
  )
}