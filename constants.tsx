
import { Project, Skill, Experience } from './types';

export const PROJECTS: Project[] = [
  {
    id: 'finsight',
    title: 'FinSight: AI Investment Analyst',
    description: 'A GenAI-powered financial analyst providing investment insights using ML and NLP. Built with Python and Streamlit.',
    longDescription: 'FinSight leverages Large Language Models (LLMs) to parse through market news and SEC filings to generate actionable investment summaries. It features sentiment analysis and custom entity recognition for deep market intelligence.',
    image: 'https://images.unsplash.com/photo-1611974714024-4607a55d4aa0?auto=format&fit=crop&q=80&w=800',
    tags: ['GenAI', 'Python', 'ML', 'Streamlit'],
    moreTags: ['OpenAI API', 'Pandas', 'Sentiment Analysis', 'Finance'],
    link: 'https://finsight-investment-analyst.streamlit.app/',
    github: 'https://github.com/pankrulez/FinSight.git',
    category: 'Data Science',
    keyFeatures: [
      'Automated SEC filing parsing and summarization',
      'Real-time market sentiment scoring from RSS feeds',
      'Interactive financial dashboards with Plotly',
      'Custom RAG (Retrieval-Augmented Generation) pipeline'
    ],
    technicalChallenges: 'Managing the token limits of LLMs while processing massive 10-K filings required implementing efficient text chunking and recursive summarization strategies.',
    outcome: 'Reduced research time for investment analysts by approximately 70% by providing instant summaries of multi-page legal documents.'
  },
  {
    id: 'legal-eagle',
    title: 'Legal Eagle: Contract Analysis',
    description: 'AI-driven legal document parser and contract risk analyzer. Simplifies complex legal jargon into actionable summaries.',
    longDescription: 'Legal Eagle uses advanced NLP to scan legal documents for high-risk clauses and unusual terminology, providing risk scores and plain-language summaries for professionals.',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800',
    tags: ['AI', 'NLP', 'LegalTech', 'Python'],
    moreTags: ['LangChain', 'OpenAI', 'Streamlit', 'Regex'],
    link: 'https://legal-eagle-contracts.streamlit.app/',
    github: 'https://github.com/pankrulez/legal-eagle.git',
    category: 'Data Science',
    keyFeatures: [
      'Automated extraction of high-risk legal clauses',
      'Terminology translation from Legalese to English',
      'Compliance checking against industry templates',
      'PDF-to-structured-data conversion engine'
    ],
    technicalChallenges: 'Ensuring accuracy in legal clause identification required fine-tuning prompts and implementing a human-in-the-loop feedback mechanism.',
    outcome: 'Successfully identified 15% more risk-associated clauses compared to manual paralegal screening in benchmark tests.'
  },
  {
    id: 'alpha-sentinel',
    title: 'Alpha Sentinel',
    description: 'Predictive surveillance and market anomaly detection system using time-series analysis and machine learning.',
    longDescription: 'Alpha Sentinel identifies potential market anomalies and "Black Swan" events through statistical modeling and real-time predictive surveillance.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    tags: ['Data Science', 'Forecasting', 'ML', 'Finance'],
    moreTags: ['Prophet', 'Scikit-Learn', 'Plotly', 'Pandas'],
    link: 'https://alpha-sentinel.streamlit.app/',
    github: 'https://github.com/pankrulez/alpha-sentinel.git',
    category: 'Data Science',
    keyFeatures: [
      'Statistical time-series forecasting with Prophet',
      'Automated anomaly detection with Isolation Forests',
      'Real-time alert system for price deviations',
      'Historical performance backtesting engine'
    ],
    technicalChallenges: 'Handling noisy financial data required implementing advanced signal processing and seasonal decomposition.',
    outcome: 'Achieved an 85% accuracy rate in flagging historical market crashes 48 hours before significant downturns.'
  },
  {
    id: 'tvnet',
    title: 'TVNet Flutter App',
    description: 'A modern, high-performance cross-platform mobile application for media streaming developed with Flutter.',
    longDescription: 'TVNet provides a seamless media consumption experience with low-latency playback and intuitive UX designed for iOS and Android devices.',
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800',
    tags: ['Flutter', 'Dart', 'Mobile', 'UI/UX'],
    moreTags: ['BLoC', 'Firebase', 'Clean Architecture', 'Streaming'],
    github: 'https://github.com/pankrulez/tvnet.git',
    category: 'Mobile',
    keyFeatures: [
      'High-performance video playback engine',
      'Real-time sync with Firebase Firestore',
      'Custom BLoC-based state management',
      'Adaptive UI for tablet and phone'
    ],
    technicalChallenges: 'Optimizing memory usage during high-definition streaming on low-end devices required custom texture cache management.',
    outcome: 'Achieved sub-500ms launch times and maintained a 4.8-star user satisfaction rating.'
  },
  {
    id: 'logistics-os',
    title: 'Logistics OS',
    description: 'Geospatial supply chain platform for real-time fleet optimization and routing.',
    longDescription: 'Logistics OS is a geospatial command center designed to manage global supply chains. It optimizes delivery routes based on real-time traffic and fuel efficiency metrics.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
    tags: ['Geospatial', 'Python', 'Streamlit', 'GeoPandas'],
    moreTags: ['Optimization', 'Data Science', 'Folium', 'Supply Chain'],
    link: 'https://logistics-center.streamlit.app/',
    github: 'https://github.com/pankrulez/logistics-os.git',
    category: 'Data Science',
    keyFeatures: [
      'Interactive route visualization with Folium',
      'Geospatial data analysis using GeoPandas',
      'Real-time logistics manifest tracking',
      'Supply chain bottleneck identification'
    ],
    technicalChallenges: 'Processing large-scale geospatial data while maintaining smooth interactivity required optimizing spatial indexing and rendering pipelines.',
    outcome: 'Provides a robust operational dashboard for supply chain managers to monitor and optimize fleet performance.'
  },
  {
    id: 'adw',
    title: 'Automated Data Warehouse',
    description: 'End-to-end automated pipeline for data ingestion, cleaning, and warehousing with real-time analytics.',
    longDescription: 'A robust ETL framework designed to automate the movement of raw data from various sources into a structured warehouse environment for immediate analysis.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=800',
    tags: ['ETL', 'SQL', 'Python', 'Pipelines'],
    moreTags: ['Data Engineering', 'AWS', 'Automation', 'Warehouse'],
    link: 'https://automated-data-warehouse.streamlit.app/',
    github: 'https://github.com/pankrulez/Automated-Data-Warehouse.git',
    category: 'Data Science',
    keyFeatures: [
      'Multi-source data ingestion engine',
      'Automated schema mapping and conversion',
      'Data quality auditing and outlier rejection',
      'Scheduled orchestration'
    ],
    technicalChallenges: 'Designing a schema-agnostic mapping system that could handle evolving API responses without breaking downstream structure.',
    outcome: 'Increased data availability speed by 3x and reduced data engineering manual tasks by 60 hours per month.'
  },
  {
    id: 'dieselgate',
    title: 'Dieselgate: Causal Inference',
    description: 'Quantifying the environmental and economic impact of the Dieselgate emissions scandal using causal inference.',
    longDescription: 'This statistical project applies Causal Inference methods (like Synthetic Control and Difference-in-Differences) to measure the impact of the software manipulation scandal on air quality and market metrics.',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=800',
    tags: ['Causal Inference', 'R', 'Statistics', 'Econometrics'],
    moreTags: ['Synthetic Control', 'Policy Analysis', 'ggplot2', 'Pandas'],
    github: 'https://github.com/pankrulez/dieselgate-causal-impact.git',
    category: 'Data Science',
    keyFeatures: [
      'Synthetic control group modeling',
      'Difference-in-Differences impact estimation',
      'NOx emission trend analysis',
      'Econometric forecasting and policy evaluation'
    ],
    technicalChallenges: 'Selecting a valid counterfactual group in a global automotive market required rigorous covariate matching and sensitivity analysis.',
    outcome: 'Identified a statistically significant divergence in regional emission levels directly attributable to the software manipulation.'
  },
  {
    id: 'weather-forecast',
    title: 'Australian Weather Forecast',
    description: 'Predictive analysis and visualization of Australian weather patterns using machine learning.',
    longDescription: 'A comprehensive data science project predicting precipitation and temperature shifts across Australia using classification and regression models.',
    image: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&q=80&w=800',
    tags: ['Python', 'Scikit-Learn', 'Streamlit', 'Data Analysis'],
    moreTags: ['Machine Learning', 'Matplotlib', 'Classification', 'EDA'],
    link: 'https://australian-weatherforecast.streamlit.app/',
    github: 'https://github.com/pankrulez/WeatherForecast.git',
    category: 'Data Science',
    keyFeatures: [
      'Rainfall prediction classification model',
      'Interactive climate dashboard',
      'Regional weather trend visualization',
      'Robust preprocessing for meteorological sensors'
    ],
    technicalChallenges: 'Dealing with highly imbalanced weather data and extreme values across remote Australian sensor networks.',
    outcome: 'Delivered an interactive prediction tool with strong performance in identifying precipitation onset.'
  },
  {
    id: 'customer-churn-prediction',
    title: 'Customer Churn Prediction',
    description: 'Enterprise-grade churn prediction system using XGBoost to identify at-risk customers.',
    longDescription: 'An end-to-end data science pipeline that analyzes customer behavioral patterns to predict potential churn, enabling proactive retention strategies.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    tags: ['XGBoost', 'Python', 'Streamlit', 'Machine Learning'],
    moreTags: ['Pandas', 'Analytics', 'Churn Modeling', 'EDA'],
    link: 'https://customer-churn-prediction-pk.streamlit.app/',
    github: 'https://github.com/pankrulez/customer-churn-prediction.git',
    category: 'Data Science',
    keyFeatures: [
      'Predictive modeling for customer retention',
      'SHAP value analysis for interpretability',
      'Automated data cleaning and feature encoding',
      'Interactive retention dashboard'
    ],
    technicalChallenges: 'Feature engineering from high-variance customer activity logs required careful aggregation and signal extraction.',
    outcome: 'Successfully identified behavioral markers for churn with high recall, allowing for targeted marketing interventions.'
  },
  {
    id: 'mobile-games-ab-testing',
    title: 'Mobile Games A/B Testing',
    description: 'Statistical analysis of A/B test results for Cookie Cats to optimize player retention.',
    longDescription: 'Analyzes the impact of moving difficulty gates in "Cookie Cats" on 1-day and 7-day retention using statistical hypothesis testing and bootstrapping.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800',
    tags: ['Python', 'A/B Testing', 'Statistics', 'Pandas'],
    moreTags: ['Bootstrap', 'Game Analytics', 'Hypothesis Testing', 'Seaborn'],
    github: 'https://github.com/pankrulez/Mobile-Games-AB-Testing.git',
    category: 'Data Science',
    keyFeatures: [
      'Bootstrap resampling for uncertainty estimation',
      'Retention analysis at 1-day and 7-day intervals',
      'Statistical hypothesis testing (p-values)',
      'Engagement distribution visualization'
    ],
    technicalChallenges: 'Accounting for player behavior variance and ensuring statistical significance in a high-traffic gaming environment.',
    outcome: 'Provided a data-driven gate placement strategy that balances monetization with user enjoyment.'
  }
];

export const SKILLS: Skill[] = [
  { name: 'Python', category: 'Languages', level: 90 },
  { name: 'Java', category: 'Languages', level: 95 },
  { name: 'PHP', category: 'Languages', level: 92 },
  { name: 'Dart', category: 'Languages', level: 85 },
  { name: 'JavaScript', category: 'Languages', level: 80 },
  { name: 'Laravel', category: 'Frameworks', level: 90 },
  { name: 'Spring Boot', category: 'Frameworks', level: 92 },
  { name: 'Flutter', category: 'Frameworks', level: 82 },
  { name: 'React', category: 'Frameworks', level: 75 },
  { name: 'Machine Learning', category: 'AI & Systems', level: 78 },
  { name: 'NLP', category: 'AI & Systems', level: 75 },
  { name: 'Tech Support Architecture', category: 'AI & Systems', level: 90 },
  { name: 'Generative AI', category: 'AI & Systems', level: 82 },
  { name: 'Git', category: 'DevOps', level: 88 },
  { name: 'Google Firebase', category: 'DevOps', level: 85 },
  { name: 'Docker', category: 'DevOps', level: 70 },
  { name: 'ETL Pipelines', category: 'DevOps', level: 80 },
];

export const EXPERIENCES: Experience[] = [
  {
    id: 'break',
    company: "Upskilling Journey",
    role: "AI & Data Science Architect",
    period: "Oct 2020 - Present",
    location: "Global / Remote",
    description: "Successfully navigated a strategic pivot during recovery, mastering Data Science and GenAI stacks through intensive development.",
    longDescription: "Utilized a period of personal recovery to bridge the gap between traditional software engineering and modern Data Science. I focused on building production-ready AI applications, mastering predictive modeling, NLP, and high-performance system architecture through hundreds of hours of dedicated independent research and project-based learning.",
    achievements: [
      "Built a diverse portfolio of 10+ production-grade AI and ML applications",
      "Mastered the Python/PyTorch/Scikit-Learn stack for deep learning and statistical modeling",
      "Architected complex ETL pipelines and automated data warehouses for various analytical projects",
      "Developed TVNet, a high-performance cross-platform media engine with Flutter",
      "Achieved 90%+ accuracy in multiple predictive modeling benchmark challenges"
    ],
    skills: ["Python", "GenAI", "MLOps", "Statistics", "Flutter", "Firebase"],
    isBreak: true
  },
  {
    id: 'ienergizer',
    company: "iEnergizer",
    role: "Senior Tech Support Engineer",
    period: "Mar 2020 - Sept 2020",
    location: "Noida, India",
    description: "Lead technical support for enterprise infrastructure and handheld devices in a high-volume BPO environment.",
    longDescription: "Served as the Tier-3 technical lead in a high-intensity BPO environment. I specialized in solving complex hardware and software faults for consumer handheld devices via on-call troubleshooting and live remote desktop connections, maintaining elite performance metrics for global enterprise accounts.",
    achievements: [
      "Consistently sustained 95%+ CSAT scores through technical excellence and rapid problem-solving",
      "Managed live remote diagnostic sessions to resolve complex device-level conflicts and software bugs",
      "Reduced MTTR (Mean Time to Resolution) by 15% via internal knowledge base development and live mentorship",
      "Resolved 40+ critical service escalations per month through rapid root cause analysis"
    ],
    skills: ["Infrastructure", "Remote Support", "BPO Operations", "System Diagnostics"],
  },
  {
    id: 'ans',
    company: "ANS Affiliate Solutions",
    role: "Technical IT Recruiter",
    period: "Jul 2018 - Feb 2019",
    location: "Dehradun, India",
    description: "Full-cycle technical recruitment using advanced boolean search and engineer vetting.",
    longDescription: "Utilized my engineering background to identify and source elite technical talent for specialized Java, PHP, and Cloud roles. I specialized in advanced boolean (binary) search techniques across LinkedIn, job boards, and professional platforms, vetting technical skillsets through initial call screenings before forwarding final qualified candidates to hiring managers.",
    achievements: [
      "Successfully sourced and placed 20+ senior engineering leads with a 90% retention rate",
      "Reduced hiring manager rejection rate by 30% through rigorous technical verification and screening",
      "Built a robust talent pipeline for complex tech stacks across diverse professional social platforms"
    ],
    skills: ["IT Sourcing", "Boolean Search", "Tech Verification", "Operations"],
  },
  {
    id: 'gbu',
    company: "GBU Solutions Pvt Ltd",
    role: "Full Stack Web Developer",
    period: "Aug 2015 - Nov 2017",
    location: "New Delhi, India",
    description: "Lead developer for data-driven PHP/MySQL systems and internal analytics modules.",
    longDescription: "Owned the full stack lifecycle for client platforms. I focused on building high-performance, low-latency web applications using Laravel and optimized database architectures for data-heavy business requirements.",
    achievements: [
      "Built a custom reporting engine that improved operational data visibility by 40%",
      "Reduced average page load times by 2 seconds through query optimization and front-end refactoring",
      "Successfully deployed 15+ bespoke web solutions for small-to-medium enterprises"
    ],
    skills: ["PHP", "Laravel", "MySQL", "JavaScript", "Database Optimization"],
  },
  {
    id: 'multisoft',
    company: "Multisoft Systems",
    role: "Java Technology Trainer",
    period: "Jul 2014 - Jul 2015",
    location: "Dehradun, India",
    description: "Instructed enterprise-level Java and algorithmic programming to professional cohorts.",
    longDescription: "Developed and delivered project-based curricula for Java EE and the Spring Framework. I focused on making complex distributed systems concepts understandable through hands-on coding exercises and live architectural reviews.",
    achievements: [
      "Trained over 300+ developers in advanced Java concepts and enterprise architecture",
      "Authored a comprehensive project-based curriculum focusing on Spring Boot microservices",
      "Maintained a 4.9/5 student rating across all professional and corporate cohorts"
    ],
    skills: ["Java", "Spring Boot", "Algorithms", "Professional Training"],
  }
];

export const BIO_PROMPT = `
You are the AI Assistant for Pankaj Kapri, a seasoned tech professional with a rich, 5+ year background.
Pankaj's Contact: kapripankaj@proton.me

Pankaj's Full Portfolio (10 Projects):
1. FinSight: AI Investment Analyst (GenAI/Python).
2. Legal Eagle: Contract Analysis AI (NLP/LangChain).
3. Alpha Sentinel: Market Anomaly Detection (Time-series).
4. Automated Data Warehouse: ETL Pipeline automation.
5. Australian Weather Forecast: Predictive meteorological analysis.
6. Customer Churn Prediction: XGBoost behavioral modeling.
7. TVNet: Flutter Media Streaming App.
8. Logistics OS: Geospatial Supply Chain Platform.
9. Dieselgate: Causal Inference statistical analysis.
10. Mobile Games A/B Testing: Statistical analysis for player retention.

Pankaj's Skillset:
- Core: Java, PHP, Python, Flutter, Google Firebase.
- Specialized: Machine Learning (ML), Natural Language Processing (NLP), Data Engineering, GenAI.

Background:
- Current: He has returned from a recovery break with significantly enhanced Data Science and AI skills.
- The latest experience (Upskilling Journey) represents his transition into an AI Specialist role.

Personality: Professional, resilient, and insightful. Emphasize his deep engineering background and his current pivot to Data Science and AI.
`;
