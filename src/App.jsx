import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState, useEffect, createContext, useContext } from 'react'
import Landing from './pages/Landing.jsx'
import Profile from './pages/Profile.jsx'
import Recommendations from './pages/Recommendations.jsx'
import Feedback from './pages/Feedback.jsx'
import BottomNav from './components/BottomNav.jsx'
import LanguageToggle from './components/LanguageToggle.jsx'
import VoiceButton from './components/VoiceButton.jsx'
import ChatBot from './components/ChatBot.jsx'
import ResumeBuilder from './pages/ResumeBuilder.jsx'

// Global App Context for sharing state across components
const AppContext = createContext()

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return context
}

export default function App() {
  const location = useLocation()
  const { t } = useTranslation()
  
  // Global state for the entire app
  const [userProfile, setUserProfile] = useState({
    name: '',
    skills: [],
    education: '',
    location: '',
    interests: [],
    experience: '',
    preferredLanguage: 'en'
  })
  
  const [recommendations, setRecommendations] = useState([])
  const [skillGaps, setSkillGaps] = useState({})
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [isChatBotOpen, setIsChatBotOpen] = useState(false)
  const [isOfflineMode, setIsOfflineMode] = useState(false)
  
  // Check for offline/online status
  useEffect(() => {
    const handleOnline = () => setIsOfflineMode(false)
    const handleOffline = () => setIsOfflineMode(true)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    // Initial check
    setIsOfflineMode(!navigator.onLine)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // AI Recommendation Engine Function
  const generateRecommendations = async (profile) => {
    try {
      const mockRecommendations = [
        {
          id: 1,
          title: "Frontend Developer Intern",
          company: "Tech Corp",
          location: profile.location || "Remote",
          skillMatch: 87,
          requiredSkills: ["React", "JavaScript", "CSS"],
          missingSkills: ["TypeScript", "Node.js"],
          description: "Build modern web applications",
          applyUrl: "#",
          explanation: "87% Skill Match, Location Fit, Education Match",
          stipend: "₹25,000/month",
          duration: "3 months",
          workMode: "remote"
        },
        {
          id: 2,
          title: "UI/UX Design Intern",
          company: "Design Studio",
          location: profile.location || "Remote",
          skillMatch: 72,
          requiredSkills: ["Figma", "Design Thinking", "Prototyping"],
          missingSkills: ["Adobe XD", "User Research"],
          description: "Create beautiful user experiences",
          applyUrl: "#",
          explanation: "72% Skill Match, Creative Background Fit",
          stipend: "₹22,000/month",
          duration: "4 months",
          workMode: "hybrid"
        }
      ]
      
      setRecommendations(mockRecommendations)
      
      // Generate skill gaps
      const gaps = {}
      mockRecommendations.forEach(rec => {
        gaps[rec.id] = rec.missingSkills
      })
      setSkillGaps(gaps)
      
      return mockRecommendations
    } catch (error) {
      console.error('Error generating recommendations:', error)
      return []
    }
  }

  // Auto-Resume Generator Function
  const generateResume = async (profileData) => {
    try {
      const resumeData = {
        name: profileData.name,
        skills: profileData.skills.join(', '),
        education: profileData.education,
        location: profileData.location,
        experience: profileData.experience
      }
      
      console.log('Generating resume with data:', resumeData)
      return 'resume-generated-successfully'
    } catch (error) {
      console.error('Error generating resume:', error)
      throw error
    }
  }

  // SMS Fallback Function
  const sendSMSRecommendations = async (phoneNumber, recommendations) => {
    try {
      const topRecommendations = recommendations.slice(0, 3)
      const smsContent = topRecommendations.map(rec => 
        `${rec.title} at ${rec.company} - ${rec.skillMatch}% match`
      ).join('\n')
      
      console.log(`SMS to ${phoneNumber}:`, smsContent)
      return true
    } catch (error) {
      console.error('Error sending SMS:', error)
      return false
    }
  }

  // Context value to be shared across all components
  const contextValue = {
    userProfile,
    setUserProfile,
    recommendations,
    setRecommendations,
    skillGaps,
    setSkillGaps,
    isVoiceMode,
    setIsVoiceMode,
    isChatBotOpen,
    setIsChatBotOpen,
    isOfflineMode,
    generateRecommendations,
    generateResume,
    sendSMSRecommendations
  }

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Simple Header - Back to Original */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-600 text-white grid place-items-center font-bold">
                IP
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-gray-800">InternPath</span>
                {isOfflineMode && (
                  <span className="text-xs text-orange-600">Offline Mode</span>
                )}
              </div>
            </Link>
            
            <div className="flex items-center gap-3">
              {/* Voice Mode Indicator */}
              {isVoiceMode && (
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 rounded-full">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-blue-700">Voice Active</span>
                </div>
              )}
              
              <LanguageToggle />
              <VoiceButton />
              
              {/* ChatBot Toggle Button */}
              <button
                onClick={() => setIsChatBotOpen(!isChatBotOpen)}
                className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
                aria-label="Open ChatBot"
              >
                <svg 
                  className="w-5 h-5 text-blue-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                  />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Offline Mode Banner */}
          {isOfflineMode && (
            <div className="bg-orange-100 border-b border-orange-200 px-4 py-2">
              <div className="max-w-6xl mx-auto text-center">
                <p className="text-sm text-orange-800">
                  {t('offline_mode_message', 'You are offline. Some features may be limited.')}
                </p>
                <p className="text-xs text-orange-600 mt-1">
                  {t('sms_available', 'SMS recommendations are still available!')}
                </p>
              </div>
            </div>
          )}
        </header>

        {/* Main Content - Wider Container */}
        <main className="flex-1 mx-auto w-full max-w-6xl px-4 relative">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/resume-builder" element={<ResumeBuilder />} />
          </Routes>
        </main>

        {/* ChatBot Component */}
        <ChatBot isOpen={isChatBotOpen} onClose={() => setIsChatBotOpen(false)} />

        {/* Bottom Navigation - Original */}
        <BottomNav />
        
        {/* Accessibility Announcements for Voice Mode */}
        <div 
          id="voice-announcements" 
          className="sr-only" 
          aria-live="polite" 
          aria-atomic="true"
        ></div>
      </div>
    </AppContext.Provider>
  )
}