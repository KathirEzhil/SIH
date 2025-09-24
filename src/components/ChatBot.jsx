import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppContext } from '../App.jsx'

const ChatBot = ({ isOpen, onClose }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const {
    userProfile,
    recommendations,
    skillGaps,
    isVoiceMode,
    setIsVoiceMode,
    generateRecommendations,
    generateResume,
    sendSMSRecommendations,
    isOfflineMode
  } = useAppContext()

  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [currentStep, setCurrentStep] = useState('welcome')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Speech Recognition Setup
  const [recognition, setRecognition] = useState(null)
  const [speechSynthesis, setSpeechSynthesis] = useState(null)

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()
      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false
      recognitionInstance.lang = userProfile.preferredLanguage === 'hi' ? 'hi-IN' : 'en-IN'
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInputMessage(transcript)
        setIsListening(false)
      }
      
      recognitionInstance.onerror = () => {
        setIsListening(false)
      }
      
      setRecognition(recognitionInstance)
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis)
    }

    // Welcome message when chatbot opens
    if (isOpen && messages.length === 0) {
      addBotMessage(getWelcomeMessage())
    }
  }, [isOpen, userProfile.preferredLanguage])

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const getWelcomeMessage = () => {
    const currentPage = location.pathname
    let contextualGreeting = t('chatbot.welcome', 'Hi! I\'m your InternPath assistant. How can I help you today?')
    
    switch (currentPage) {
      case '/':
        contextualGreeting += ' ' + t('chatbot.landing_help', 'I can help you get started with finding internships!')
        break
      case '/profile':
        contextualGreeting += ' ' + t('chatbot.profile_help', 'I can help you complete your profile or explain what information we need.')
        break
      case '/recommendations':
        contextualGreeting += ' ' + t('chatbot.recommendations_help', 'I can explain your matches, help you understand skill gaps, or assist with applications!')
        break
      case '/feedback':
        contextualGreeting += ' ' + t('chatbot.feedback_help', 'I can help you provide feedback or answer any questions.')
        break
    }
    
    return contextualGreeting
  }

  const addBotMessage = (message, options = {}) => {
    setIsTyping(true)
    setTimeout(() => {
      const botMessage = {
        id: Date.now(),
        text: message,
        sender: 'bot',
        timestamp: new Date(),
        ...options
      }
      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
      
      // Text-to-speech for bot messages if voice mode is on
      if (isVoiceMode && speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(message)
        utterance.lang = userProfile.preferredLanguage === 'hi' ? 'hi-IN' : 'en-IN'
        utterance.rate = 0.9
        speechSynthesis.speak(utterance)
      }
    }, 500 + Math.random() * 1000) // Realistic typing delay
  }

  const addUserMessage = (message) => {
    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
  }

  const processUserMessage = async (message) => {
    addUserMessage(message)
    setInputMessage('')
    
    const lowerMessage = message.toLowerCase()
    
    // Intent recognition
    if (lowerMessage.includes('profile') || lowerMessage.includes('complete profile') || lowerMessage.includes('fill profile')) {
      handleProfileHelp()
    } else if (lowerMessage.includes('recommendation') || lowerMessage.includes('internship') || lowerMessage.includes('match')) {
      handleRecommendationHelp()
    } else if (lowerMessage.includes('skill') && lowerMessage.includes('gap')) {
      handleSkillGapHelp()
    } else if (lowerMessage.includes('resume') || lowerMessage.includes('cv')) {
      handleResumeHelp()
    } else if (lowerMessage.includes('sms') || lowerMessage.includes('offline')) {
      handleSMSHelp()
    } else if (lowerMessage.includes('voice') || lowerMessage.includes('speak')) {
      handleVoiceHelp()
    } else if (lowerMessage.includes('navigate') || lowerMessage.includes('go to') || lowerMessage.includes('page')) {
      handleNavigationHelp(lowerMessage)
    } else if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
      handleGeneralHelp()
    } else if (lowerMessage.includes('apply') || lowerMessage.includes('application')) {
      handleApplicationHelp()
    } else {
      handleDefaultResponse(message)
    }
  }

  const handleProfileHelp = () => {
    if (!userProfile.name || userProfile.skills.length === 0) {
      addBotMessage(
        t('chatbot.profile_incomplete', 'I see your profile is incomplete. Let me help you fill it out!'),
        {
          actions: [
            { text: t('chatbot.go_to_profile', 'Go to Profile'), action: () => navigate('/profile') },
            { text: t('chatbot.profile_tips', 'Profile Tips'), action: () => showProfileTips() }
          ]
        }
      )
    } else {
      addBotMessage(
        t('chatbot.profile_complete', 'Your profile looks good! Would you like to update anything or get recommendations?'),
        {
          actions: [
            { text: t('chatbot.update_profile', 'Update Profile'), action: () => navigate('/profile') },
            { text: t('chatbot.get_recommendations', 'Get Recommendations'), action: () => navigate('/recommendations') }
          ]
        }
      )
    }
  }

  const handleRecommendationHelp = () => {
    if (recommendations.length === 0) {
      addBotMessage(
        t('chatbot.no_recommendations', 'You don\'t have recommendations yet. Let me help you generate some!'),
        {
          actions: [
            { text: t('chatbot.complete_profile_first', 'Complete Profile'), action: () => navigate('/profile') },
            { text: t('chatbot.generate_now', 'Generate Now'), action: async () => {
              await generateRecommendations(userProfile)
              navigate('/recommendations')
            }}
          ]
        }
      )
    } else {
      addBotMessage(
        t('chatbot.recommendations_available', `You have ${recommendations.length} recommendations! I can explain matches, skill gaps, or help with applications.`),
        {
          actions: [
            { text: t('chatbot.view_recommendations', 'View Recommendations'), action: () => navigate('/recommendations') },
            { text: t('chatbot.explain_matches', 'Explain My Matches'), action: () => explainRecommendations() }
          ]
        }
      )
    }
  }

  const handleSkillGapHelp = () => {
    const totalGaps = Object.values(skillGaps).flat().length
    if (totalGaps > 0) {
      addBotMessage(
        t('chatbot.skill_gaps_found', `I found ${totalGaps} skill gaps. I can recommend courses to help you improve!`),
        {
          actions: [
            { text: t('chatbot.show_courses', 'Show Courses'), action: () => showSkillCourses() },
            { text: t('chatbot.view_gaps', 'View in Recommendations'), action: () => navigate('/recommendations') }
          ]
        }
      )
    } else {
      addBotMessage(t('chatbot.no_skill_gaps', 'Great! You don\'t have any major skill gaps for your current recommendations.'))
    }
  }

  const handleResumeHelp = () => {
    addBotMessage(
      t('chatbot.resume_help', 'I can generate a professional resume for you automatically! This makes applying much easier.'),
      {
        actions: [
          { text: t('chatbot.generate_resume', 'Generate Resume'), action: async () => {
            try {
              await generateResume(userProfile)
              addBotMessage(t('chatbot.resume_generated', 'Resume generated successfully! Check your downloads.'))
            } catch (error) {
              addBotMessage(t('chatbot.resume_error', 'Sorry, there was an error generating your resume. Please try again.'))
            }
          }},
          { text: t('chatbot.resume_tips', 'Resume Tips'), action: () => showResumeTips() }
        ]
      }
    )
  }

  const handleSMSHelp = () => {
    if (isOfflineMode) {
      addBotMessage(
        t('chatbot.sms_offline', 'Since you\'re offline, I can send your top recommendations via SMS!'),
        {
          actions: [
            { text: t('chatbot.setup_sms', 'Setup SMS'), action: () => showSMSSetup() },
            { text: t('chatbot.sms_info', 'How SMS Works'), action: () => showSMSInfo() }
          ]
        }
      )
    } else {
      addBotMessage(t('chatbot.sms_online', 'SMS recommendations are available for offline access. Would you like to set it up for later?'))
    }
  }

  const handleVoiceHelp = () => {
    if (isVoiceMode) {
      addBotMessage(
        t('chatbot.voice_active', 'Voice mode is currently active! You can speak to me in your preferred language.'),
        {
          actions: [
            { text: t('chatbot.disable_voice', 'Disable Voice'), action: () => setIsVoiceMode(false) },
            { text: t('chatbot.voice_tips', 'Voice Tips'), action: () => showVoiceTips() }
          ]
        }
      )
    } else {
      addBotMessage(
        t('chatbot.voice_inactive', 'Voice mode is not active. I can help you enable it!'),
        {
          actions: [
            { text: t('chatbot.enable_voice', 'Enable Voice'), action: () => setIsVoiceMode(true) },
            { text: t('chatbot.voice_features', 'Voice Features'), action: () => showVoiceFeatures() }
          ]
        }
      )
    }
  }

  const handleNavigationHelp = (message) => {
    let destination = ''
    if (message.includes('profile')) destination = '/profile'
    else if (message.includes('recommendation')) destination = '/recommendations'
    else if (message.includes('feedback')) destination = '/feedback'
    else if (message.includes('home') || message.includes('start')) destination = '/'
    
    if (destination) {
      addBotMessage(
        t('chatbot.navigation_help', `Taking you to ${destination === '/' ? 'home' : destination.slice(1)}!`),
        {
          actions: [
            { text: t('chatbot.go_now', 'Go Now'), action: () => navigate(destination) }
          ]
        }
      )
    } else {
      showNavigationOptions()
    }
  }

  const handleApplicationHelp = () => {
    addBotMessage(
      t('chatbot.application_help', 'I can help you with applications! I can generate your resume and explain the process.'),
      {
        actions: [
          { text: t('chatbot.application_process', 'Application Process'), action: () => showApplicationProcess() },
          { text: t('chatbot.generate_resume', 'Generate Resume'), action: async () => {
            await generateResume(userProfile)
          }}
        ]
      }
    )
  }

  const handleGeneralHelp = () => {
    addBotMessage(
      t('chatbot.general_help', 'Here are the main things I can help you with:'),
      {
        actions: [
          { text: '👤 Profile Help', action: () => handleProfileHelp() },
          { text: '🎯 Find Internships', action: () => handleRecommendationHelp() },
          { text: '📄 Resume Generation', action: () => handleResumeHelp() },
          { text: '🔊 Voice Features', action: () => handleVoiceHelp() },
          { text: '📱 SMS Setup', action: () => handleSMSHelp() },
          { text: '🧭 Navigation', action: () => showNavigationOptions() }
        ]
      }
    )
  }

  const handleDefaultResponse = (message) => {
    const responses = [
      t('chatbot.default_1', 'I\'m here to help with your internship search! Try asking about profiles, recommendations, or navigation.'),
      t('chatbot.default_2', 'Not sure what you meant, but I can help with internships, resumes, and more!'),
      t('chatbot.default_3', 'Let me know what you need help with - profiles, recommendations, or voice features!')
    ]
    addBotMessage(responses[Math.floor(Math.random() * responses.length)])
  }

  // Helper functions for complex actions
  const showNavigationOptions = () => {
    addBotMessage(
      t('chatbot.navigation_options', 'Where would you like to go?'),
      {
        actions: [
          { text: '🏠 Home', action: () => navigate('/') },
          { text: '👤 Profile', action: () => navigate('/profile') },
          { text: '🎯 Recommendations', action: () => navigate('/recommendations') },
          { text: '💬 Feedback', action: () => navigate('/feedback') }
        ]
      }
    )
  }

  const explainRecommendations = () => {
    if (recommendations.length > 0) {
      const explanations = recommendations.map(rec => 
        `${rec.title}: ${rec.explanation || 'Good match based on your profile'}`
      ).join('\n\n')
      addBotMessage(`Here's why these internships match you:\n\n${explanations}`)
    }
  }

  const showSkillCourses = () => {
    const allMissingSkills = Object.values(skillGaps).flat()
    const courseRecommendations = allMissingSkills
      .filter(skill => SKILL_COURSES[skill])
      .map(skill => `• ${skill}: ${SKILL_COURSES[skill].title} (${SKILL_COURSES[skill].provider})`)
      .join('\n')
    
    if (courseRecommendations) {
      addBotMessage(`Here are courses to improve your skills:\n\n${courseRecommendations}`)
    } else {
      addBotMessage('No specific courses found, but you can check NPTEL and SWAYAM for relevant skills.')
    }
  }

  // Voice input handling
  const handleVoiceInput = () => {
    if (recognition && !isListening) {
      setIsListening(true)
      recognition.start()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputMessage.trim()) {
      processUserMessage(inputMessage.trim())
    }
  }

  const handleActionClick = (action) => {
    action.action()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center sm:justify-center">
      <div className="bg-white w-full h-[80vh] sm:w-96 sm:h-[600px] sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              🤖
            </div>
            <div>
              <h3 className="font-semibold">{t('chatbot.title', 'InternPath Assistant')}</h3>
              <p className="text-xs text-blue-100">
                {isTyping ? t('chatbot.typing', 'Typing...') : t('chatbot.online', 'Online')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-700 p-2 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-3 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                <p className="text-sm">{message.text}</p>
                {message.actions && (
                  <div className="mt-3 space-y-2">
                    {message.actions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => handleActionClick(action)}
                        className="block w-full text-left p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-xs transition-colors"
                      >
                        {action.text}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-3 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-gray-50">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={t('chatbot.input_placeholder', 'Ask me anything...')}
                className="w-full p-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {recognition && (
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full ${
                    isListening ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-blue-500'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChatBot