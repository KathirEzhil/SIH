import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppContext } from '../App.jsx'
import { 
  ChevronLeftIcon,
  ChevronRightIcon,
  AcademicCapIcon,
  SparklesIcon,
  HeartIcon,
  BriefcaseIcon,
  MapPinIcon,
  CheckCircleIcon,
  UserIcon,
  LightBulbIcon,
  DocumentTextIcon,
  PhoneIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'
import VoiceButton from '../components/VoiceButton.jsx'

const STEPS = [
  { id: 'personal', title: 'Personal Info', icon: UserIcon },
  { id: 'education', title: 'Education Level', icon: AcademicCapIcon },
  { id: 'skills', title: 'Your Skills', icon: SparklesIcon },
  { id: 'interests', title: 'Interests', icon: HeartIcon },
  { id: 'domains', title: 'Preferred Areas', icon: BriefcaseIcon },
  { id: 'location', title: 'Location & Contact', icon: MapPinIcon }
]

const EDUCATION_OPTIONS = [
  { value: 'high_school', label: 'High School', icon: '🎓', desc: '12th grade or equivalent', skillLevel: 'beginner' },
  { value: 'undergraduate', label: 'Bachelor\'s Degree', icon: '📚', desc: 'Currently pursuing or completed', skillLevel: 'intermediate' },
  { value: 'postgraduate', label: 'Master\'s Degree', icon: '🎯', desc: 'Currently pursuing or completed', skillLevel: 'advanced' },
  { value: 'diploma', label: 'Diploma/Certificate', icon: '📜', desc: 'Professional certification', skillLevel: 'intermediate' }
]

const DOMAIN_OPTIONS = [
  { id: 'tech', label: 'Technology', icon: '💻', 
    skills: ['Programming', 'Data Analysis', 'AI/ML', 'Web Development'] },
  { id: 'marketing', label: 'Marketing', icon: '📱',
    skills: ['Digital Marketing', 'Content Creation', 'Social Media', 'Analytics'] },
  { id: 'design', label: 'Design', icon: '🎨',
    skills: ['UI/UX Design', 'Graphic Design', 'Prototyping', 'Creative Thinking'] },
  { id: 'business', label: 'Business', icon: '💼',
    skills: ['Strategy', 'Operations', 'Leadership', 'Project Management'] },
  { id: 'finance', label: 'Finance', icon: '💰',
    skills: ['Financial Analysis', 'Excel', 'Accounting', 'Risk Management'] },
  { id: 'healthcare', label: 'Healthcare', icon: '🏥',
    skills: ['Medical Knowledge', 'Patient Care', 'Research', 'Healthcare IT'] }
]

const SKILL_SUGGESTIONS = {
  beginner: ['Communication', 'Teamwork', 'Time Management', 'Microsoft Office', 'Basic Computer Skills'],
  intermediate: ['Leadership', 'Problem Solving', 'Python', 'Excel', 'Project Management', 'Research'],
  advanced: ['Data Science', 'Machine Learning', 'Advanced Analytics', 'Strategic Planning', 'Mentoring']
}

export default function Profile() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { 
    userProfile, 
    setUserProfile, 
    generateRecommendations, 
    generateResume,
    isVoiceMode,
    isOfflineMode 
  } = useAppContext()
  
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    name: userProfile.name || '',
    email: '',
    phone: '',
    education: userProfile.education || '',
    skills: Array.isArray(userProfile.skills) ? userProfile.skills.join(', ') : (userProfile.skills || ''),
    interests: Array.isArray(userProfile.interests) ? userProfile.interests.join(', ') : (userProfile.interests || ''),
    domains: [],
    location: userProfile.location || '',
    experience: '',
    preferredLanguage: userProfile.preferredLanguage || 'en'
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState([])
  const [showAiSuggestions, setShowAiSuggestions] = useState(false)
  const [skillLevel, setSkillLevel] = useState('beginner')

  const currentStepData = STEPS[currentStep]
  const StepIcon = currentStepData.icon
  const isLastStep = currentStep === STEPS.length - 1
  const canProceed = validateCurrentStep()

  // Update skill level based on education
  useEffect(() => {
    const educationOption = EDUCATION_OPTIONS.find(opt => opt.value === formData.education)
    if (educationOption) {
      setSkillLevel(educationOption.skillLevel)
    }
  }, [formData.education])

  // AI-powered skill suggestions based on domain selection
  useEffect(() => {
    if (formData.domains.length > 0) {
      const suggestions = []
      formData.domains.forEach(domainId => {
        const domain = DOMAIN_OPTIONS.find(d => d.id === domainId)
        if (domain) {
          suggestions.push(...domain.skills)
        }
      })
      setAiSuggestions([...new Set(suggestions)]) // Remove duplicates
      setShowAiSuggestions(true)
    }
  }, [formData.domains])

  function validateCurrentStep() {
    const step = STEPS[currentStep].id
    switch (step) {
      case 'personal': return formData.name.trim() !== ''
      case 'education': return formData.education !== ''
      case 'skills': return formData.skills.trim() !== ''
      case 'interests': return formData.interests.trim() !== ''
      case 'domains': return formData.domains.length > 0
      case 'location': return formData.location.trim() !== ''
      default: return false
    }
  }

  function updateFormData(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  function toggleDomain(domainId) {
    setFormData(prev => ({
      ...prev,
      domains: prev.domains.includes(domainId) 
        ? prev.domains.filter(d => d !== domainId)
        : [...prev.domains, domainId]
    }))
  }

  function addSkillSuggestion(skill) {
    const currentSkills = formData.skills ? formData.skills + ', ' : ''
    if (!formData.skills.includes(skill)) {
      updateFormData('skills', currentSkills + skill)
    }
  }

  function nextStep() {
    if (canProceed && currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  function prevStep() {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  async function handleSubmit() {
    setIsSubmitting(true)
    
    // Prepare profile data
    const profileData = {
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
      interests: formData.interests.split(',').map(i => i.trim()).filter(i => i),
      skillLevel,
      completedAt: new Date().toISOString()
    }
    
    try {
      // Update global context
      setUserProfile(profileData)
      
      // Generate AI recommendations
      const recommendations = await generateRecommendations(profileData)
      
      // Generate resume preview
      await generateResume(profileData)
      
      // Store locally (since we can't use localStorage in artifacts)
      console.log('Profile saved:', profileData)
      
      // Navigate to recommendations
      setTimeout(() => {
        setIsSubmitting(false)
        navigate('/recommendations')
      }, 2000)
      
    } catch (error) {
      console.error('Error processing profile:', error)
      setIsSubmitting(false)
    }
  }

  function renderStepContent() {
    const step = STEPS[currentStep].id

    switch (step) {
      case 'personal':
        return (
          <div className="space-y-4">
            <p className="text-center text-gray-600 mb-6">Let's start with your basic information</p>
            
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  placeholder="Full Name *"
                  className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none bg-white"
                  required
                />
                <div className="absolute top-4 right-4">
                  <VoiceButton targetField="name" />
                </div>
              </div>
              
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                placeholder="Email Address (optional)"
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none bg-white"
              />
              
              <div className="relative">
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  placeholder="Phone Number (for SMS updates)"
                  className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none bg-white"
                />
                <PhoneIcon className="absolute top-4 right-4 w-5 h-5 text-gray-400" />
              </div>
              
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <GlobeAltIcon className="w-4 h-4" />
                Your information helps us provide personalized recommendations
              </div>
            </div>
          </div>
        )

      case 'education':
        return (
          <div className="space-y-4">
            <p className="text-center text-gray-600 mb-6">What's your current education level?</p>
            {EDUCATION_OPTIONS.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => updateFormData('education', option.value)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                  formData.education === option.value
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{option.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">{option.label}</div>
                    <div className="text-sm text-gray-500">{option.desc}</div>
                    <div className="text-xs text-blue-600 mt-1">
                      Skill level: {option.skillLevel}
                    </div>
                  </div>
                  {formData.education === option.value && (
                    <CheckCircleIcon className="w-6 h-6 text-blue-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )

      case 'skills':
        return (
          <div className="space-y-4">
            <p className="text-center text-gray-600 mb-6">What are your key skills?</p>
            <div className="relative">
              <textarea
                value={formData.skills}
                onChange={(e) => updateFormData('skills', e.target.value)}
                placeholder="e.g., Communication, Python, Design..."
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none resize-none h-24 bg-white"
              />
              <div className="absolute top-4 right-4">
                <VoiceButton targetField="skills" />
              </div>
            </div>
            
            {/* AI-powered skill level suggestions */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <LightBulbIcon className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Suggested for {skillLevel} level:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {SKILL_SUGGESTIONS[skillLevel].map(skill => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => addSkillSuggestion(skill)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                  >
                    + {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Domain-based AI suggestions */}
            {showAiSuggestions && aiSuggestions.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <SparklesIcon className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    AI suggests based on your interests:
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {aiSuggestions.map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => addSkillSuggestion(skill)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                    >
                      ✨ {skill}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )

      case 'interests':
        return (
          <div className="space-y-4">
            <p className="text-center text-gray-600 mb-6">What interests you most?</p>
            <div className="relative">
              <textarea
                value={formData.interests}
                onChange={(e) => updateFormData('interests', e.target.value)}
                placeholder="e.g., Artificial Intelligence, Social Impact, Innovation..."
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none resize-none h-24 bg-white"
              />
              <div className="absolute top-4 right-4">
                <VoiceButton targetField="interests" />
              </div>
            </div>
            <div className="text-sm text-gray-500">
              💡 Share what excites you professionally - this helps our AI find better matches
            </div>
          </div>
        )

      case 'domains':
        return (
          <div className="space-y-4">
            <p className="text-center text-gray-600 mb-6">Which areas interest you? (Select multiple)</p>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {DOMAIN_OPTIONS.map(domain => (
                <button
                  key={domain.id}
                  type="button"
                  onClick={() => toggleDomain(domain.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    formData.domains.includes(domain.id)
                      ? 'border-blue-500 bg-blue-50 shadow-lg text-blue-700'
                      : 'border-gray-200 bg-white hover:shadow-md hover:border-blue-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{domain.icon}</div>
                  <div className="text-sm font-semibold mb-1">{domain.label}</div>
                  {formData.domains.includes(domain.id) && (
                    <>
                      <CheckCircleIcon className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                      <div className="text-xs text-blue-600">
                        +{domain.skills.length} skill suggestions
                      </div>
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        )

      case 'location':
        return (
          <div className="space-y-4">
            <p className="text-center text-gray-600 mb-6">Where would you like to work?</p>
            <div className="relative">
              <input
                type="text"
                value={formData.location}
                onChange={(e) => updateFormData('location', e.target.value)}
                placeholder="e.g., Mumbai, Delhi, Remote, Anywhere in India"
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none bg-white"
              />
              <div className="absolute top-4 right-4">
                <VoiceButton targetField="location" />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="text-sm text-gray-500">You can specify cities, states, or 'Remote'</div>
              
              {/* Experience level input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Level (optional)
                </label>
                <select
                  value={formData.experience}
                  onChange={(e) => updateFormData('experience', e.target.value)}
                  className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none bg-white"
                >
                  <option value="">Select experience level</option>
                  <option value="fresher">Fresher / No experience</option>
                  <option value="0-1">0-1 years</option>
                  <option value="1-2">1-2 years</option>
                  <option value="2+">2+ years</option>
                </select>
              </div>
            </div>

            {/* Offline mode notice */}
            {isOfflineMode && formData.phone && (
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <PhoneIcon className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Offline Mode Detected
                  </span>
                </div>
                <p className="text-sm text-blue-700">
                  We'll send your recommendations to {formData.phone} via SMS!
                </p>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      {/* Container - responsive width */}
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Progress Header */}
        <div className="max-w-lg mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="p-2 rounded-xl bg-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow border border-gray-200"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <div className="text-sm font-medium text-gray-600">
              {currentStep + 1} of {STEPS.length}
            </div>
            {isVoiceMode && (
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 rounded-full">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <span className="text-xs text-blue-700">Voice</span>
              </div>
            )}
          </div>

          {/* Enhanced Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-6 overflow-hidden">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            ></div>
          </div>

          {/* Step Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <StepIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentStepData.title}</h2>
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-lg mx-auto mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="max-w-lg mx-auto">
          {isLastStep ? (
            <button
              onClick={handleSubmit}
              disabled={!canProceed || isSubmitting}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                canProceed && !isSubmitting
                  ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl transform hover:scale-[1.02]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating AI Recommendations...</span>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <SparklesIcon className="w-6 h-6" />
                    <DocumentTextIcon className="w-6 h-6" />
                  </div>
                  <span>Generate Recommendations + Resume</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={nextStep}
              disabled={!canProceed}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                canProceed
                  ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl transform hover:scale-[1.02]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span>Continue</span>
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* AI Processing Preview */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-600 rounded-xl flex items-center justify-center">
              <SparklesIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">AI is Working!</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                Analyzing your profile...
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-150"></div>
                Matching with internships...
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-300"></div>
                Generating your resume...
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}