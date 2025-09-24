import { useState, useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppContext } from '../App.jsx'
import { 
  HomeIcon, 
  UserIcon, 
  SparklesIcon, 
  ChatBubbleLeftRightIcon,
  WifiIcon,
  MicrophoneIcon,
  ExclamationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import {
  HomeIcon as HomeIconSolid,
  UserIcon as UserIconSolid,
  SparklesIcon as SparklesIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid
} from '@heroicons/react/24/solid'

export default function BottomNav() {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const {
    userProfile,
    recommendations,
    isVoiceMode,
    setIsVoiceMode,
    isOfflineMode,
    isChatBotOpen,
    setIsChatBotOpen
  } = useAppContext()

  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState(null)
  const [lastVoiceCommand, setLastVoiceCommand] = useState('')
  const [profileCompleteness, setProfileCompleteness] = useState(0)

  // Initialize voice navigation
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()
      
      recognitionInstance.continuous = true
      recognitionInstance.interimResults = false
      recognitionInstance.lang = userProfile.preferredLanguage === 'hi' ? 'hi-IN' : 'en-IN'
      
      recognitionInstance.onresult = (event) => {
        const command = event.results[event.results.length - 1][0].transcript.toLowerCase()
        handleVoiceCommand(command)
        setLastVoiceCommand(command)
      }
      
      recognitionInstance.onstart = () => setIsListening(true)
      recognitionInstance.onend = () => setIsListening(false)
      recognitionInstance.onerror = () => setIsListening(false)
      
      setRecognition(recognitionInstance)
    }
  }, [userProfile.preferredLanguage])

  // Calculate profile completeness
  useEffect(() => {
    const fields = ['name', 'skills', 'education', 'location', 'interests']
    const completed = fields.filter(field => {
      const value = userProfile[field]
      return value && (Array.isArray(value) ? value.length > 0 : value.trim())
    }).length
    setProfileCompleteness(Math.round((completed / fields.length) * 100))
  }, [userProfile])

  // Voice command handler
  const handleVoiceCommand = (command) => {
    const lowerCommand = command.toLowerCase()
    
    // Navigation commands
    if (lowerCommand.includes('home') || lowerCommand.includes('घर')) {
      navigate('/')
      announceNavigation('home')
    } else if (lowerCommand.includes('profile') || lowerCommand.includes('प्रोफाइल')) {
      navigate('/profile')
      announceNavigation('profile')
    } else if (lowerCommand.includes('recommend') || lowerCommand.includes('match') || lowerCommand.includes('सिफारिश')) {
      navigate('/recommendations')
      announceNavigation('recommendations')
    } else if (lowerCommand.includes('feedback') || lowerCommand.includes('फीडबैक')) {
      navigate('/feedback')
      announceNavigation('feedback')
    } else if (lowerCommand.includes('chat') || lowerCommand.includes('help') || lowerCommand.includes('चैट')) {
      setIsChatBotOpen(true)
      announceAction('chatbot_opened')
    } else if (lowerCommand.includes('voice off') || lowerCommand.includes('आवाज बंद')) {
      setIsVoiceMode(false)
      announceAction('voice_disabled')
    }
  }

  // Voice announcements
  const announceNavigation = (page) => {
    const message = t(`nav.announced.${page}`, `Navigated to ${page}`)
    speakMessage(message)
  }

  const announceAction = (action) => {
    const message = t(`nav.action.${action}`, action.replace('_', ' '))
    speakMessage(message)
  }

  const speakMessage = (message) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message)
      utterance.lang = userProfile.preferredLanguage === 'hi' ? 'hi-IN' : 'en-IN'
      utterance.rate = 0.9
      window.speechSynthesis.speak(utterance)
    }
  }

  // Navigation items with enhanced information
  const navItems = [
    {
      to: '/',
      icon: HomeIcon,
      solidIcon: HomeIconSolid,
      label: t('nav.home', 'Home'),
      badge: null,
      voiceCommands: ['home', 'start', 'घर', 'शुरू']
    },
    {
      to: '/recommendations',
      icon: SparklesIcon,
      solidIcon: SparklesIconSolid,
      label: t('nav.matches', 'Matches'),
      badge: recommendations.length > 0 ? recommendations.length : null,
      badgeColor: recommendations.length > 0 ? 'bg-blue-500' : null,
      voiceCommands: ['matches', 'recommendations', 'मैच', 'सिफारिश']
    },
    {
      to: '/feedback',
      icon: ChatBubbleLeftRightIcon,
      solidIcon: ChatBubbleLeftRightIconSolid,
      label: t('nav.feedback', 'Feedback'),
      badge: null,
      voiceCommands: ['feedback', 'फीडबैक']
    },
    {
      to: '/profile',
      icon: UserIcon,
      solidIcon: UserIconSolid,
      label: t('nav.profile', 'Profile'),
      badge: profileCompleteness < 100 ? '!' : null,
      badgeColor: profileCompleteness < 100 ? 'bg-blue-500' : 'bg-blue-500',
      voiceCommands: ['profile', 'प्रोफाइल']
    }
  ]

  // Voice navigation toggle
  const toggleVoiceNavigation = () => {
    if (isVoiceMode && recognition) {
      if (isListening) {
        recognition.stop()
      } else {
        recognition.start()
      }
    }
  }

  return (
    <nav className="bg-white border-t border-gray-200 sticky bottom-0 z-40 shadow-lg">
      {/* Voice Command Indicator - Compact */}
      {isVoiceMode && (
        <div className="bg-blue-50 border-b border-blue-100 px-2 py-1">
          <div className="max-w-sm mx-auto flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <div className={`w-1.5 h-1.5 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-blue-500'}`}></div>
              <span className="text-gray-700 truncate">
                {isListening ? 'Listening...' : 'Voice ready'}
              </span>
            </div>
            
            <button
              onClick={toggleVoiceNavigation}
              className={`p-1 rounded-full transition-colors ${
                isListening ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
              }`}
            >
              <MicrophoneIcon className="h-3 w-3" />
            </button>
          </div>
          
          {/* Last Command Display - Compact */}
          {lastVoiceCommand && (
            <div className="max-w-sm mx-auto">
              <p className="text-xs text-gray-600 italic truncate">
                "{lastVoiceCommand}"
              </p>
            </div>
          )}
        </div>
      )}

      {/* Offline Mode Indicator - Compact */}
      {isOfflineMode && (
        <div className="bg-blue-50 border-b border-blue-200 px-2 py-1">
          <div className="max-w-sm mx-auto flex items-center justify-center gap-1 text-xs text-blue-800">
            <WifiIcon className="h-3 w-3" />
            <span>Offline Mode</span>
          </div>
        </div>
      )}

      {/* Main Navigation - Compact */}
      <div className="max-w-sm mx-auto px-2 py-2">
        <div className="grid grid-cols-4 gap-1">
          {navItems.map(({ to, icon: Icon, solidIcon: SolidIcon, label, badge, badgeColor }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `relative flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'text-blue-600 bg-blue-50 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`
              }
              onClick={() => {
                // Voice announcement for navigation
                if (isVoiceMode) {
                  announceNavigation(to.replace('/', '') || 'home')
                }
              }}
            >
              {({ isActive }) => (
                <>
                  {/* Icon */}
                  <div className="relative">
                    {isActive ? (
                      <SolidIcon className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                    
                    {/* Badge */}
                    {badge && (
                      <div className={`absolute -top-1 -right-1 min-w-[16px] h-[16px] ${badgeColor || 'bg-blue-500'} text-white text-xs rounded-full flex items-center justify-center font-bold`}>
                        {typeof badge === 'number' && badge > 99 ? '99+' : badge}
                      </div>
                    )}
                  </div>
                  
                  {/* Label */}
                  <span className="text-xs font-medium leading-tight text-center">
                    {label}
                  </span>
                  
                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-0.5 bg-blue-600 rounded-full"></div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Quick Actions Bar - Compact */}
      <div className="max-w-sm mx-auto px-2 pb-1">
        <div className="flex items-center justify-center gap-2 pt-1 border-t border-gray-100">
          {/* Voice Toggle */}
          <button
            onClick={() => setIsVoiceMode(!isVoiceMode)}
            className={`p-1.5 rounded-full transition-all duration-200 ${
              isVoiceMode 
                ? 'bg-blue-100 text-blue-600 shadow-sm' 
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
            title={isVoiceMode 
              ? 'Disable voice navigation'
              : 'Enable voice navigation'
            }
          >
            <MicrophoneIcon className="h-3 w-3" />
          </button>

          {/* ChatBot Toggle */}
          <button
            onClick={() => setIsChatBotOpen(!isChatBotOpen)}
            className={`p-1.5 rounded-full transition-all duration-200 ${
              isChatBotOpen 
                ? 'bg-blue-100 text-blue-600 shadow-sm' 
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
            title="Toggle AI assistant"
          >
            <ChatBubbleLeftRightIcon className="h-3 w-3" />
          </button>

          {/* Status Indicators - Compact */}
          <div className="flex items-center gap-1">
            {/* Profile Completeness */}
            {profileCompleteness < 100 && (
              <div className="flex items-center gap-0.5" title={`${profileCompleteness}% profile complete`}>
                <ExclamationCircleIcon className="h-3 w-3 text-blue-500" />
                <span className="text-xs text-blue-600">{profileCompleteness}%</span>
              </div>
            )}

            {/* Recommendations Status */}
            {recommendations.length > 0 && (
              <div className="flex items-center gap-0.5" title={`${recommendations.length} recommendations available`}>
                <CheckCircleIcon className="h-3 w-3 text-blue-500" />
                <span className="text-xs text-blue-600">{recommendations.length}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Voice Commands Help */}
      {isVoiceMode && (
        <div className="sr-only" aria-live="polite" aria-label="Voice navigation instructions">
          Say "home", "profile", "matches", or "feedback" to navigate. Say "help" to open assistant.
        </div>
      )}
    </nav>
  )
}