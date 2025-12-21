
import { Project, Skill, Experience } from './types';

export const PROJECTS: Project[] = [
  {
    id: 'finsight',
    title: 'FinSight: AI Investment Analyst',
    description: 'A GenAI-powered financial analyst providing investment insights using ML and NLP. Built with Python and Streamlit.',
    longDescription: 'FinSight leverages Large Language Models (LLMs) to parse through market news and SEC filings to generate actionable investment summaries. It features sentiment analysis and custom entity recognition for deep market intelligence.',
    image: 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?auto=format&fit=crop&q=80&w=800',
    tags: ['GenAI', 'Python', 'ML', 'Streamlit'],
    moreTags: ['OpenAI API', 'Pandas', 'Sentiment Analysis', 'Finance'],
    link: 'https://finsight-investment-analyst.streamlit.app/',
    github: 'https://github.com/pankrulez/FinSight.git',
    category: 'Data Science',
    keyFeatures: [
      'Automated SEC filing parsing and summarization',
      'Real-time market sentiment scoring from RSS feeds',
      'Interactive financial dashboards with Plotly',
      'Custom RAG (Retrieval-Augmented Generation) pipeline for financial docs'
    ],
    technicalChallenges: 'Managing the token limits of LLMs while processing massive 10-K filings required implementing efficient text chunking and recursive summarization strategies.',
    outcome: 'Reduced research time for investment analysts by approximately 70% by providing instant summaries of multi-page legal documents.'
  },
  {
    id: 'legal-eagle',
    title: 'Legal Eagle: Contract Analysis',
    description: 'AI-driven legal document parser and contract risk analyzer. Simplifies complex legal jargon into actionable summaries.',
    longDescription: 'Legal Eagle uses advanced NLP to scan legal documents for high-risk clauses and unusual terminology, providing risk scores and plain-language summaries for professionals.',
    image: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=800',
    tags: ['AI', 'NLP', 'LegalTech', 'Python'],
    moreTags: ['LangChain', 'OpenAI', 'Streamlit', 'Regex'],
    link: 'https://legal-eagle-contracts.streamlit.app/',
    github: 'https://github.com/pankrulez/legal-eagle.git',
    category: 'Data Science',
    keyFeatures: [
      'Automated extraction of high-risk legal clauses',
      'Terminology translation from "Legalese" to plain English',
      'Compliance checking against standard industry templates',
      'PDF-to-structured-data conversion engine'
    ],
    technicalChallenges: 'Ensuring accuracy in legal clause identification required fine-tuning prompts and implementing a "human-in-the-loop" feedback mechanism for high-confidence scoring.',
    outcome: 'Successfully identified 15% more risk-associated clauses compared to manual paralegal screening in benchmark tests.'
  },
  {
    id: 'alpha-sentinel',
    title: 'Alpha Sentinel',
    description: 'Predictive surveillance and market anomaly detection system using time-series analysis and machine learning.',
    longDescription: 'Alpha Sentinel identifies potential market anomalies and "Black Swan" events through statistical modeling and real-time predictive surveillance.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800',
    tags: ['Data Science', 'Forecasting', 'ML', 'Finance'],
    moreTags: ['Prophet', 'Scikit-Learn', 'Plotly', 'Pandas'],
    link: 'https://alpha-sentinel.streamlit.app/',
    github: 'https://github.com/pankrulez/alpha-sentinel.git',
    category: 'Data Science',
    keyFeatures: [
      'Statistical time-series forecasting using Facebook Prophet',
      'Automated anomaly detection with Isolation Forests',
      'Real-time alert system for price/volume deviations',
      'Historical performance backtesting engine'
    ],
    technicalChallenges: 'Handling noisy financial data required implementing advanced signal processing techniques and seasonal decomposition before feeding data to the ML model.',
    outcome: 'Achieved an 85% accuracy rate in flagging historical market crashes 48 hours before significant downturns in test datasets.'
  },
  {
    id: 'adw',
    title: 'Automated Data Warehouse',
    description: 'End-to-end automated pipeline for data ingestion, cleaning, and warehousing with real-time analytics.',
    longDescription: 'A robust ETL framework designed to automate the movement of raw data from various sources into a structured warehouse environment for immediate analysis.',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800',
    tags: ['ETL', 'SQL', 'Python', 'Pipelines'],
    moreTags: ['Data Engineering', 'AWS', 'Automation', 'Warehouse'],
    link: 'https://automated-data-warehouse.streamlit.app/',
    github: 'https://github.com/pankrulez/Automated-Data-Warehouse.git',
    category: 'Data Science',
    keyFeatures: [
      'Multi-source data ingestion (APIs, SQL, CSV, JSON)',
      'Automated schema mapping and type conversion',
      'Data quality auditing and outlier rejection',
      'Scheduled orchestration without manual intervention'
    ],
    technicalChallenges: 'Designing a schema-agnostic mapping system that could handle evolving API responses without breaking the downstream warehouse structure.',
    outcome: 'Increased data availability speed by 3x and reduced data engineering manual tasks by 60 hours per month.'
  },
  {
    id: 'weather-forecast',
    title: 'Weather Forecast AI',
    description: 'Accurate meteorological forecasting for Australia using deep learning on historical atmospheric data.',
    longDescription: 'Uses historical BOM data to predict temperature and rain events, focusing on regional Australian climate patterns with high-resolution modeling.',
    image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&q=80&w=800',
    tags: ['Deep Learning', 'PyTorch', 'Meteorology'],
    moreTags: ['Keras', 'Matplotlib', 'Data Cleaning', 'Forecasting'],
    link: 'https://australian-weatherforecast.streamlit.app/',
    github: 'https://github.com/pankrulez/WeatherForecast.git',
    category: 'Data Science',
    keyFeatures: [
      'Long Short-Term Memory (LSTM) network implementation',
      'Geospatial heatmapping of temperature trends',
      'Integration with Bureau of Meteorology (BOM) API',
      'Probability mapping for precipitation events'
    ],
    technicalChallenges: 'The extreme variability of Australian regional climates required a localized weight-sharing approach in the deep learning model to maintain accuracy across states.',
    outcome: 'Outperformed standard linear regression models by 22% in 7-day temperature prediction accuracy.'
  },
  {
    id: 'churn-prediction',
    title: 'Customer Churn Predictor',
    description: 'BI tool that predicts customer attrition and provides retention strategies using behavioral analytics.',
    longDescription: 'Built with XGBoost to identify high-risk customers based on behavioral patterns and usage frequency to drive better business retention.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    tags: ['ML', 'Business Analytics', 'XGBoost'],
    moreTags: ['EDA', 'Feature Engineering', 'SMOTE', 'Analytics'],
    link: 'https://customer-churn-prediction-pk.streamlit.app/',
    github: 'https://github.com/pankrulez/customer-churn-prediction.git',
    category: 'Data Science',
    keyFeatures: [
      'SHAP value visualization for individual prediction explanation',
      'Automated feature selection using Mutual Information',
      'Synthetic Minority Over-sampling Technique (SMOTE) for class balance',
      'Retention strategy generator based on churn risk segments'
    ],
    technicalChallenges: 'Dealing with highly imbalanced datasets where only a small fraction of customers actually churned, requiring precise cross-validation strategies.',
    outcome: 'Identified top 10 indicators of churn, allowing the marketing team to target retention campaigns with 40% higher ROI.'
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
      'High-performance video playback engine with buffering optimization',
      'Real-time sync with Firebase Cloud Firestore',
      'Custom BLoC-based state management',
      'Adaptive UI for tablet and phone form factors'
    ],
    technicalChallenges: 'Optimizing memory usage during high-definition video streaming on low-end Android devices required custom texture cache management.',
    outcome: 'Achieved sub-500ms launch times and maintained a 4.8-star user satisfaction rating in internal testing.'
  },
  {
    id: 'logistics-os',
    title: 'Logistics OS',
    description: 'Data science platform for logistics center management and geospatial optimization.',
    longDescription: 'Logistics OS helps supply chain managers optimize delivery routes and manage logistics centers through geospatial data visualization.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
    tags: ['Data Science', 'Pydeck', 'Geospatial'],
    moreTags: ['Deck.gl', 'Route Optimization', 'Python', 'Supply Chain'],
    link: 'https://logistics-center.streamlit.app/',
    github: 'https://github.com/pankrulez/logistics-os.git',
    category: 'Data Science',
    keyFeatures: [
      'Interactive 3D geospatial visualizations with Pydeck',
      'Dijkstra-based route optimization for last-mile delivery',
      'Real-time fleet tracking simulation',
      'Demand-driven warehouse placement analysis'
    ],
    technicalChallenges: 'Visualizing hundreds of thousands of concurrent data points on a map without degrading browser performance required implementing spatial indexing.',
    outcome: 'Reduced theoretical delivery fuel consumption by 12% through optimized routing algorithms.'
  },
  {
    id: 'dieselgate',
    title: 'Dieselgate Causal Impact',
    description: 'Statistical analysis of the environmental impact of the Dieselgate scandal using causal inference methods.',
    longDescription: 'Investigates air quality changes in European cities post-Dieselgate using Bayesian structural time-series models and intervention analysis.',
    image: 'https://images.unsplash.com/photo-1517404215738-15263e9f9178?auto=format&fit=crop&q=80&w=800',
    tags: ['Statistics', 'Causal Inference', 'Environment'],
    moreTags: ['R', 'Python', 'Pandas', 'Bayesian Statistics'],
    github: 'https://github.com/pankrulez/dieselgate-causal-impact.git',
    category: 'Data Science',
    keyFeatures: [
      'CausalImpact Bayesian model implementation',
      'Intervention analysis on multi-city NO2 datasets',
      'Counterfactual projection development',
      'Automated data cleaning for environmental sensor arrays'
    ],
    technicalChallenges: 'Separating the impact of policy changes from general environmental trends required building a robust synthetic control group.',
    outcome: 'Quantified a statistically significant decrease in specific pollutants that correlated directly with post-scandal vehicle buy-back programs.'
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
    role: "Resilience & Growth",
    period: "Oct 2020 - Present",
    location: "Personal",
    description: "Successfully navigated an extended break due to surgeries and COVID-19 related disruptions.",
    longDescription: "During this significant period, I focused on comprehensive physical recovery and cognitive growth. This hiatus became a strategic pivot point, where I deep-dived into the world of Data Science and Artificial Intelligence, mastering tools that complement my existing software engineering background. I also spent time developing high-performance mobile solutions like TVNet.",
    achievements: [
      "Completed intensive Data Science & ML certification",
      "Built a portfolio of 9+ high-impact AI/Data projects",
      "Mastered Python-based statistical analysis and deep learning",
      "Developed high-performance cross-platform apps with Flutter & Firebase",
      "Developed high resilience and adaptability through recovery"
    ],
    skills: ["Python", "ML", "Statistics", "AI Architecture", "Flutter", "Google Firebase"],
    isBreak: true
  },
  {
    id: 'ienergizer',
    company: "iEnergizer",
    role: "Senior Engineer · Tech Support",
    period: "Mar 2020 - Sept 2020",
    location: "Noida, UP, India",
    description: "Diagnosed and resolved complex technical customer issues for high-profile clients.",
    longDescription: "Acted as the final point of escalation for complex technical faults. I specialized in infrastructure and software-level troubleshooting, ensuring 99%+ service availability for critical systems.",
    achievements: [
      "Maintained top-tier CSAT scores (>95%) consistently",
      "Reduced average resolution time by 15% through internal documentation",
      "Mentored junior engineers on network-level diagnostic tools"
    ],
    skills: ["Tech Support", "Infrastructure", "Troubleshooting", "Leadership"],
  },
  {
    id: 'ans',
    company: "ANS Affiliate Solutions",
    role: "Technical Recruiter",
    period: "Jul 2018 - Feb 2019",
    location: "Dehradun, India",
    description: "Managed end-to-end recruitment for high-end software engineering roles.",
    longDescription: "Bridged the gap between business requirements and technical talent. Leveraged my engineering background to accurately vet candidates for complex technical stacks including Java, Python, and cloud services.",
    achievements: [
      "Successfully closed 20+ senior-level engineering positions",
      "Optimized the technical vetting process, reducing 'hiring-manager-rejects' by 30%",
      "Developed a custom internal dashboard for tracking candidate pipelines"
    ],
    skills: ["Recruitment", "IT Sourcing", "Interviewing", "Tech Vetting"],
  },
  {
    id: 'gbu',
    company: "GBU Solutions Pvt Ltd",
    role: "Software Developer · PHP Web Developer",
    period: "Aug 2015 - Nov 2017",
    location: "New Delhi, India",
    description: "Designed and deployed robust PHP/MySQL systems with custom analytic reporting.",
    longDescription: "Lead developer for multiple client-facing web applications. I was responsible for the full stack development lifecycle, from database design to frontend implementation using Laravel and core PHP frameworks.",
    achievements: [
      "Built a custom reporting module improving data visibility for clients by 40%",
      "Implemented automated database backups and recovery protocols",
      "Optimized legacy SQL queries, reducing page load times by 2s on average"
    ],
    skills: ["PHP", "Laravel", "MySQL", "JavaScript", "Reporting Systems"],
  },
  {
    id: 'multisoft',
    company: "Multisoft Systems",
    role: "Tech Trainer · Associate Java Trainer",
    period: "Jul 2014 - Jul 2015",
    location: "Dehradun, India",
    description: "Delivered intensive, project-based Java and algorithmic programming courses.",
    longDescription: "Empowered the next generation of developers by teaching core programming principles. I focused on making complex concepts like Multi-threading and Data Structures accessible through practical, real-world examples.",
    achievements: [
      "Trained over 300+ students across various Java modules",
      "Designed a new project-based curriculum focusing on Spring framework",
      "Maintained a 4.9/5 instructor rating across all cohorts"
    ],
    skills: ["Java", "Training", "Mentorship", "Public Speaking", "Curriculum Design"],
  }
];

export const BIO_PROMPT = `
You are the AI Assistant for Pankaj Kapri, a seasoned tech professional with a rich, 5+ year background.
Pankaj's Contact: kapripankaj@proton.me

Pankaj's Full Portfolio (9 Projects):
1. FinSight: AI Investment Analyst (GenAI/Python).
2. Legal Eagle: Contract Analysis AI (NLP/LangChain).
3. Alpha Sentinel: Market Anomaly Detection (Time-series).
4. Automated Data Warehouse: ETL Pipeline automation.
5. Weather Forecast AI: Deep Learning on meteorological data.
6. Customer Churn Predictor: XGBoost Business Intelligence.
7. TVNet: Flutter Media Streaming App.
8. Logistics OS: Geospatial Supply Chain Platform.
9. Dieselgate: Causal Inference statistical analysis.

Pankaj's Skillset:
- Core: Java, PHP, Python, Flutter, Google Firebase.
- Specialized: Machine Learning (ML), Natural Language Processing (NLP), Data Engineering, GenAI.

Background:
- Career Break (2020-Present): Resilience through surgeries and recovery. He is now returning with specialized Data Science expertise.

Personality: Professional, resilient, and insightful. Emphasize his deep engineering background and his current pivot to Data Science and AI.
`;
