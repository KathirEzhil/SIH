def recommend_internship(domain, skills=None, duration=None):
    internships = {
        "ai": ["AI Research Intern", "ML Developer Intern", "Data Science Intern"],
        "web": ["Frontend Developer Intern", "Backend Developer Intern", "Fullstack Intern"],
        "iot": ["IoT Research Intern", "Embedded Systems Intern"],
        "education": ["EdTech Content Intern", "Instructional Designer Intern"]
    }

    if domain in internships:
        return f"Based on your interest in {domain.upper()}, recommended internships are: {', '.join(internships[domain])}"
    else:
        return "No direct match found. Please try another domain like AI, Web, IoT, or Education."
def recommend_internship(domain, skills=None, duration=None):
    internships = {
        "ai": ["AI Research Intern", "ML Developer Intern", "Data Science Intern"],
        "web": ["Frontend Developer Intern", "Backend Developer Intern", "Fullstack Intern"],
        "iot": ["IoT Research Intern", "Embedded Systems Intern"],
        "education": ["EdTech Content Intern", "Instructional Designer Intern"]
    }

    if domain in internships:
        return f"Based on your interest in {domain.upper()}, recommended internships are: {', '.join(internships[domain])}"
    else:
        return "No direct match found. Please try another domain like AI, Web, IoT, or Education."
# internship_advisor.py

def recommend_internship(query):
    """
    Recommend internship domain based on user query.
    Supports multiple domains + keyword mapping.
    """

    query = query.lower()

    # 🔹 Keywords mapped to domains
    domains = {
        "ai": ["ai", "artificial intelligence", "machine learning", "ml", "deep learning"],
        "web": ["web", "frontend", "backend", "full stack", "react", "node"],
        "iot": ["iot", "internet of things", "embedded", "sensor", "automation"],
        "education": ["education", "teaching", "edtech", "training"],
        "data science": ["data science", "data", "analytics", "python", "statistics"],
        "cybersecurity": ["cyber", "security", "hacking", "network security"],
        "cloud": ["cloud", "aws", "azure", "gcp", "devops"]
    }

    # 🔹 Check which domain matches
    for domain, keywords in domains.items():
        if any(word in query for word in keywords):
            return internship_suggestions(domain)

    return "I can help you find internships. Please ask about AI, Web, IoT, Education, Data Science, Cybersecurity, or Cloud."


def internship_suggestions(domain):
    """
    Returns internship suggestions for a given domain.
    """

    suggestions = {
        "ai": [
            "AI Research Intern at a startup",
            "Machine Learning Intern in FinTech",
            "Deep Learning Intern in Healthcare"
        ],
        "web": [
            "Frontend Web Developer Intern (React)",
            "Backend Development Intern (Node.js, Django)",
            "Full Stack Intern in an EdTech company"
        ],
        "iot": [
            "IoT Hardware Intern (Arduino, Raspberry Pi)",
            "IoT Software Intern (Python, MQTT)",
            "Automation Intern in Smart Farming project"
        ],
        "education": [
            "Content Development Intern in EdTech",
            "Teaching Assistant Intern",
            "Curriculum Design Internship"
        ],
        "data science": [
            "Data Analysis Intern (Excel, Python, SQL)",
            "Data Science Intern in E-commerce",
            "AI/ML Data Intern for Predictive Analytics"
        ],
        "cybersecurity": [
            "Cybersecurity Research Intern",
            "Network Security Intern",
            "Ethical Hacking Intern in IT firm"
        ],
        "cloud": [
            "AWS Cloud Intern",
            "DevOps Intern with Azure",
            "Cloud Support Intern at GCP"
        ]
    }

    return f"Here are some {domain} internships:\n- " + "\n- ".join(suggestions.get(domain, []))

# internship_advisor.py

def recommend_internship(query):
    query = query.lower()

    if "skill" in query or "learn" in query:
        return skill_recommendations(query)

    elif "company" in query or "organisation" in query:
        return company_suggestions(query)

    elif "resume" in query:
        return resume_tips(query)

    elif "interview" in query or "question" in query:
        return interview_questions(query)

    else:
        return internship_suggestions(query)


def internship_suggestions(query):
    if "ai" in query or "ml" in query:
        return "AI/ML Internship: Work on data, models, and algorithms."
    elif "web" in query:
        return "Web Development Internship: Frontend (React) or Backend (Node, Django)."
    elif "iot" in query:
        return "IoT Internship: Work with sensors, hardware, and automation."
    elif "data" in query:
        return "Data Science Internship: Python, SQL, analytics, and ML."
    elif "cloud" in query:
        return "Cloud Internship: AWS, Azure, or Google Cloud DevOps projects."
    elif "cyber" in query:
        return "Cybersecurity Internship: Network security, ethical hacking."
    else:
        return "I can suggest internships in AI, Web, IoT, Data Science, Cloud, or Cybersecurity."


def skill_recommendations(query):
    if "ai" in query or "ml" in query:
        return "Learn Python, Machine Learning, TensorFlow/PyTorch, and Data Analysis."
    elif "web" in query:
        return "Learn HTML, CSS, JavaScript, React, Node.js, and Git."
    elif "iot" in query:
        return "Learn Arduino/Raspberry Pi, C/C++, Python, and IoT protocols."
    elif "data" in query:
        return "Learn Python, SQL, Pandas, Statistics, and Machine Learning."
    elif "cloud" in query:
        return "Learn AWS, Azure, Google Cloud, Docker, and Kubernetes."
    elif "cyber" in query:
        return "Learn Networking, Linux, Firewalls, and Ethical Hacking."
    else:
        return "Please specify a domain to get skill recommendations."


def company_suggestions(query):
    if "ai" in query or "ml" in query:
        return "Top AI companies: Google AI, OpenAI, TCS, Infosys."
    elif "web" in query:
        return "Top Web Dev companies: Zoho, Wipro, Microsoft, Freshworks."
    elif "iot" in query:
        return "Top IoT companies: Bosch, Intel, Tata Elxsi, Honeywell."
    elif "data" in query:
        return "Top Data Science companies: Mu Sigma, Fractal, Accenture."
    elif "cloud" in query:
        return "Top Cloud companies: AWS, Azure, Google Cloud, IBM."
    elif "cyber" in query:
        return "Top Cybersecurity companies: Palo Alto, Cisco, K7, Quick Heal."
    else:
        return "I can suggest companies for AI, Web, IoT, Data Science, Cloud, or Cybersecurity."


def resume_tips(query):
    return "Resume Tips: Keep it 1-page, highlight skills & projects, use action words, and tailor it to the internship domain."


def interview_questions(query):
    if "ai" in query or "ml" in query:
        return "AI/ML Interview Questions: Explain overfitting, difference between supervised and unsupervised learning, gradient descent."
    elif "web" in query:
        return "Web Dev Interview Questions: Explain React vs Angular, REST API, CSS flex vs grid."
    elif "data" in query:
        return "Data Science Interview Questions: SQL queries, probability, regression, data cleaning."
    elif "cloud" in query:
        return "Cloud Interview Questions: What is Docker vs Kubernetes, cloud deployment models, load balancing."
    elif "cyber" in query:
        return "Cybersecurity Interview Questions: Explain firewall, encryption vs hashing, SQL injection."
    else:
        return "General Internship Interview Questions: Tell me about yourself, why this internship, and describe a project you worked on."


def get_internship_companies(query: str) -> str:
    """
    Recommend internship companies based on query.
    Ordered from popular → less popular.
    """
    query = query.lower()

    companies = {
        "ai": [
            "Google AI",
            "Microsoft Research",
            "Amazon Web Services (AWS)",
            "NVIDIA",
            "OpenAI"
        ],
        "agriculture": [
            "AgroStar",
            "Ninjacart",
            "DeHaat",
            "CropIn Technology",
            "EM3 AgriServices"
        ],
        "it": [
            "Tata Consultancy Services (TCS)",
            "Infosys",
            "Wipro",
            "HCL Technologies",
            "Tech Mahindra"
        ]
    }

    if "ai" in query or "artificial intelligence" in query:
        return "Top AI Internship Companies: " + ", ".join(companies["ai"])
    elif "agriculture" in query or "agri" in query:
        return "Top Agriculture Internship Companies: " + ", ".join(companies["agriculture"])
    elif "it" in query or "software" in query or "technology" in query:
        return "Top IT Internship Companies: " + ", ".join(companies["it"])
    else:
        return "Please specify your field of interest, like AI, IT, or Agriculture."
