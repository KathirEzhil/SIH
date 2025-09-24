import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppContext } from '../App.jsx'
import {
  StarIcon,
  MapPinIcon,
  ClockIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  BuildingOfficeIcon,
  HeartIcon,
  DocumentTextIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline'
import {
  HeartIcon as HeartIconSolid
} from '@heroicons/react/24/solid'

export default function Recommendations() {
  const { t } = useTranslation()
  const {
    recommendations,
    userProfile,
    generateRecommendations,
    generateResume,
    skillGaps,
    isVoiceMode
  } = useAppContext()

  const [savedInternships, setSavedInternships] = useState(new Set())
  const [expandedCards, setExpandedCards] = useState(new Set())
  const [expandedSkillGaps, setExpandedSkillGaps] = useState(new Set())
  const [isGeneratingResume, setIsGeneratingResume] = useState({})

  // Sample data if no recommendations exist
  const sampleRecommendations = [
    {
      id: 1,
      title: 'Frontend Developer Intern',
      company: 'TechCorp India',
      location: 'Chennai, Remote',
      skillMatch: 92,
      rating: 4.5,
      duration: '6 months',
      stipend: '₹25,000/month',
      deadline: '15/11/2025',
      description: 'Build responsive web applications using modern frameworks like React and Vue.js',
      matchingSkills: ['JavaScript', 'React', 'Communication'],
      missingSkills: ['TypeScript', 'Node.js'],
      explanation: '92% Skill Match based on your JavaScript skills, Location preference, and Education level'
    },
    {
      id: 2,
      title: 'UI/UX Design Intern',
      company: 'DesignHub',
      location: 'Bangalore, Hybrid',
      skillMatch: 78,
      rating: 4.3,
      duration: '5 months',
      stipend: '₹22,000/month',
      deadline: '20/11/2025',
      description: 'Design user-centered interfaces for mobile and web applications',
      matchingSkills: ['Design Thinking', 'Creative Skills'],
      missingSkills: ['Figma', 'Adobe XD', 'User Research'],
      explanation: '78% Skill Match - Your creative background and design thinking align well'
    },
    {
      id: 3,
      title: 'Data Analyst Intern',
      company: 'DataInsights',
      location: 'Delhi, On-site',
      skillMatch: 83,
      rating: 4.7,
      duration: '4 months',
      stipend: '₹30,000/month',
      deadline: '25/11/2025',
      description: 'Analyze data patterns and create insightful reports using Python and SQL',
      matchingSkills: ['Excel', 'Python', 'Analysis'],
      missingSkills: ['SQL', 'Tableau'],
      explanation: '83% Skill Match - Your analytical and Python skills are excellent for this role'
    }
  ]

  // Course data for skill gap recommendations
  const SKILL_COURSES = {
    'TypeScript': { title: 'TypeScript Fundamentals', provider: 'NPTEL', duration: '4 weeks' },
    'Node.js': { title: 'Node.js Backend Development', provider: 'SWAYAM', duration: '6 weeks' },
    'SQL': { title: 'Database Management with SQL', provider: 'NPTEL', duration: '5 weeks' },
    'Tableau': { title: 'Data Visualization with Tableau', provider: 'SWAYAM', duration: '4 weeks' },
    'Figma': { title: 'UI/UX Design with Figma', provider: 'NPTEL', duration: '3 weeks' },
    'Adobe XD': { title: 'Prototyping with Adobe XD', provider: 'SWAYAM', duration: '3 weeks' },
    'User Research': { title: 'UX Research Methods', provider: 'SWAYAM', duration: '5 weeks' }
  }

  const displayRecommendations = recommendations.length > 0 ? recommendations : sampleRecommendations

  // Load saved internships
  useEffect(() => {
    const saved = JSON.parse(sessionStorage.getItem('savedInternships') || '[]')
    setSavedInternships(new Set(saved))
  }, [])

  // Handle save/unsave
  const handleSave = (internshipId) => {
    const newSaved = new Set(savedInternships)
    if (newSaved.has(internshipId)) {
      newSaved.delete(internshipId)
    } else {
      newSaved.add(internshipId)
    }
    setSavedInternships(newSaved)
    sessionStorage.setItem('savedInternships', JSON.stringify([...newSaved]))
  }

  // Handle card expansion
  const toggleExpanded = (cardId) => {
    const newExpanded = new Set(expandedCards)
    if (newExpanded.has(cardId)) {
      newExpanded.delete(cardId)
    } else {
      newExpanded.add(cardId)
    }
    setExpandedCards(newExpanded)
  }

  // Handle skill gap expansion
  const toggleSkillGap = (cardId) => {
    const newExpanded = new Set(expandedSkillGaps)
    if (newExpanded.has(cardId)) {
      newExpanded.delete(cardId)
    } else {
      newExpanded.add(cardId)
    }
    setExpandedSkillGaps(newExpanded)
  }

  // Handle resume generation
  const handleGenerateResume = async (internship) => {
    setIsGeneratingResume(prev => ({ ...prev, [internship.id]: true }))
    
    try {
      await generateResume({
        ...userProfile,
        targetInternship: internship
      })
      
      alert(`Resume generated for ${internship.title}!`)
    } catch (error) {
      console.error('Resume generation failed:', error)
      alert('Resume generation failed. Please try again.')
    } finally {
      setIsGeneratingResume(prev => ({ ...prev, [internship.id]: false }))
    }
  }

  // Calculate average match
  const averageMatch = Math.round(
    displayRecommendations.reduce((sum, rec) => sum + (rec.skillMatch || 0), 0) / displayRecommendations.length
  )

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Your Perfect Matches
          </h1>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span>{displayRecommendations.length} matches found</span>
            </div>
            <div className="flex items-center gap-2">
              <StarIcon className="h-5 w-5 text-blue-600" />
              <span>Avg {averageMatch}% match</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {displayRecommendations.map((internship, index) => {
            const isExpanded = expandedCards.has(internship.id)
            const isSkillGapExpanded = expandedSkillGaps.has(internship.id)
            const isSaved = savedInternships.has(internship.id)
            const isGeneratingResumeForThis = isGeneratingResume[internship.id]

            return (
              <div key={internship.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200">
                {/* Card Content */}
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {index === 0 && (
                          <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                            TOP MATCH
                          </span>
                        )}
                        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                          {internship.skillMatch}% Match
                        </div>
                      </div>
                      
                      <h2 className="text-xl font-bold text-gray-900 mb-2">
                        {internship.title}
                      </h2>
                      
                      <div className="flex items-center gap-2 text-gray-600 mb-3">
                        <BuildingOfficeIcon className="h-4 w-4" />
                        <span className="font-medium">{internship.company}</span>
                        {internship.rating && (
                          <>
                            <span className="mx-2">•</span>
                            <StarIcon className="h-4 w-4 text-blue-600" />
                            <span>{internship.rating}</span>
                          </>
                        )}
                      </div>

                      {/* Skill Match Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Skill Match Progress</span>
                          <span className="text-sm font-bold text-blue-600">{internship.skillMatch}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${internship.skillMatch}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Save Button */}
                    <button
                      onClick={() => handleSave(internship.id)}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      {isSaved ? (
                        <HeartIconSolid className="h-6 w-6 text-blue-600" />
                      ) : (
                        <HeartIcon className="h-6 w-6 text-gray-400" />
                      )}
                    </button>
                  </div>

                  {/* Key Details */}
                  <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-700">{internship.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BanknotesIcon className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-semibold text-gray-900">{internship.stipend}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-700">{internship.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDaysIcon className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-700">Apply by: {internship.deadline}</span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="space-y-4">
                    {/* Matching Skills */}
                    {internship.matchingSkills && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          Your matching skills:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {internship.matchingSkills.map(skill => (
                            <span key={skill} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skills to Improve */}
                    {internship.missingSkills && internship.missingSkills.length > 0 && (
                      <div>
                        <button
                          onClick={() => toggleSkillGap(internship.id)}
                          className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors"
                        >
                          <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                          Skills to improve:
                          <ChevronDownIcon 
                            className={`h-4 w-4 transition-transform ${isSkillGapExpanded ? 'rotate-180' : ''}`}
                          />
                        </button>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {internship.missingSkills.map(skill => (
                            <span key={skill} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>

                        {/* Course Recommendations - No Enroll Button */}
                        {isSkillGapExpanded && (
                          <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                            <h5 className="font-semibold text-blue-800 text-sm">
                              📚 View recommended courses
                            </h5>
                            <div className="space-y-2">
                              {internship.missingSkills
                                .filter(skill => SKILL_COURSES[skill])
                                .map(skill => {
                                  const course = SKILL_COURSES[skill]
                                  return (
                                    <div key={skill} className="bg-white rounded-lg p-3 border border-blue-200">
                                      <h6 className="font-medium text-gray-800 text-sm">{course.title}</h6>
                                      <p className="text-xs text-gray-600">{course.provider} • {course.duration}</p>
                                    </div>
                                  )
                                })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Why this match? */}
                  {isExpanded && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        💡 Why this match?
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">{internship.explanation}</p>
                      <p className="text-gray-600 text-sm leading-relaxed">{internship.description}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => toggleExpanded(internship.id)}
                      className="px-4 py-2 text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors text-sm font-medium"
                    >
                      {isExpanded ? 'Show Less' : 'Why this match?'} ↓
                    </button>

                    <button
                      onClick={() => handleGenerateResume(internship)}
                      disabled={isGeneratingResumeForThis}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm font-medium"
                    >
                      {isGeneratingResumeForThis ? (
                        <>⏳ Generating...</>
                      ) : (
                        <>
                          <DocumentTextIcon className="h-4 w-4" />
                          Quick Apply
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}