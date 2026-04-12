import { evaluateCandidate } from "../services/atsPipeline.service.js";

const jdText = `
Job Overview
The Spec Analytics Analyst is a trainee professional role. Requires a good knowledge of the range of processes, procedures and systems to be used in carrying out assigned tasks and a basic understanding of the underlying concepts and principles upon which the job is based. Good understanding of how the team interacts with others in accomplishing the objectives of the area. Makes evaluative judgements based on the analysis of factual information. They are expected to resolve problems by identifying and selecting solutions through the application of acquired technical experience and will be guided by precedents. Must be able to exchange information in a concise way as well as be sensitive to audience diversity. Limited but direct impact on the business through the quality of the tasks/services provided. Impact of the job holder is restricted to own job.

Key Responsibilities

Data Collection & Cleaning: Assist in collecting, cleaning, and preprocessing large datasets to ensure data quality and integrity.
Exploratory Data Analysis (EDA): Conduct basic exploratory data analysis to identify trends, patterns, and insights.
Feature Engineering Support: Support the creation and selection of features for machine learning models.
Model Development Assistance: Help in building, training, and evaluating basic machine learning models under guidance.
Documentation: Maintain clear and concise documentation of data processes, models, and analytical findings.
Collaboration: Work closely with senior data scientists, engineers, and business stakeholders.
Learning & Development: Actively participate in training programs, workshops, and self-study to enhance data science skills.
Reporting: Assist in preparing reports and visualizations to communicate findings effectively.
Qualifications

Education

Bachelor's or Master's degree in a quantitative field such as Computer Science, Statistics, Mathematics, Economics, Engineering, or a related discipline.
Essential Skills (Technical)

Programming: Foundational knowledge in Python (Pandas, NumPy, Scikit-learn) or R.
Database Skills: Basic understanding of SQL for data extraction and manipulation.
Statistical Concepts: Solid understanding of basic statistical concepts (e.g., hypothesis testing, regression).
Data Visualization: Familiarity with data visualization tools/libraries (e.g., Matplotlib, Seaborn, Tableau, Power BI).
Machine Learning Basics: Conceptual understanding of common machine learning algorithms (e.g., Linear Regression, Logistic Regression, Decision Trees).
Essential Skills (Soft)

Problem-Solving: Strong analytical and problem-solving abilities.
Communication: Excellent verbal and written communication skills to explain technical concepts to non-technical audiences.
Learning Agility: High curiosity and a strong desire to learn new technologies and methodologies.
Teamwork: Ability to work effectively in a collaborative team environment.
Attention to Detail: Meticulous approach to data handling and analysis.
Preferred Qualifications (Optional but beneficial)

Experience with version control systems (e.g., Git).
Familiarity with cloud platforms (e.g., AWS, Azure, GCP).
Experience with big data technologies (e.g., Spark, Hadoop).
Participation in data science bootcamps, online courses, or personal projects/Kaggle competitions.

`;

const resumeText = `
RIYA MATHEW
Thane, Maharashtra, (+91) 9867320841, riyamathew20052004@gmail.com
SKILLS
Languages: Python, SQL(MySQL), C++
Data Analysis & Visualization: Power BI, Excel, Pandas, Data Analysis, Data Cleaning
Tools: Docker, Git, Google Colab, Pinecone, FastAPI
Subjects: Data Analysis, Product Metrics, Machine Learning, DBMS, Data Structures & Algorithms
Weld Inspector – Weld Surface Defect Detection App:
Developed a mobile-based real-time system for detecting defects on weld surfaces, using YOLO for defect localization
and DeiT for defect classification (cracks, porosity, undercut).
Designed an end-to-end pipeline from image capture to model inference, generating annotated outputs and
automated inspection reports.
Leveraged Explainable AI techniques to generate interpretable reports, improving transparency and usability for industrial
inspection.
Achieved ~94% detection accuracy on custom datasets, enabling portable and reliable defect detection.
Real-Time Data Streaming & Analytics Platform:
Built a Kafka-based real-time streaming platform capable of handling 5,000+ events per second with low-latency
ingestion using FastAPI producer microservices.
Designed a scalable, fault-tolerant pipeline streaming events into a data lake and data warehouse, enabling both real-time
dashboards and historical analytics.
Reduced data availability latency to sub-second levels, powering near real-time insights through Power BI dashboards.
LLM-Based Document Q&A & Extraction System:
Built a RAG pipeline to answer queries from large PDFs beyond token limits, enabling contextual document search
Integrated document-based Q&A into a web application for conversational interaction with uploaded files
Developed an XML extraction pipeline for airway bills with ~77% accuracy through prompt tuning and model selection
Automated document processing, reducing manual effort in information retrieval and data extraction
PROJECTS
EXPERIENCE
Data Science & AI Intern, Geeta eServices June 2025- Aug 2025
Software Development Intern, Kale Logistics Pvt Ltd June 2024 - Jul 2024
Created and curated a custom dataset, gathering, cleaning, and organizing data to ensure it matched the
project’s domain and improved model understanding.
Experimented with multiple open-source LLMs, comparing their accuracy, speed, and ability to handle domainspecific queries to choose the most suitable model.
Optimized the overall system through better prompts, refined retrieval methods, and model tuning, resulting in
more accurate and reliable answers from the dataset.
Built an intelligent chatbot for the Kaite website using GPT-4 Omni API, allowing users to query PDF documents
in real time through a seamless web interface, enhancing knowledge accessibility.
Engineered a scalable Retrieval-Augmented Generation (RAG) pipeline with Pinecone to handle large PDFs,
overcome token limits, and boost response accuracy by improving retrieval efficiency.
Optimized document retrieval and embedding workflows, reducing latency and delivering fast, context-aware
answers that improved user satisfaction .
EDUCATION
B.E. in Computer Engineering
Fr. C. Rodrigues Institute of Technology, Vashi Nov 2022 - June 2026
CERTIFICATION
The Complete MySQL Bootcamp: Go from Zero to Hero in 2026
Complete Data Analyst Bootcamp From Basics To Advanced (on going)
EXTRACURRICULAR ACTIVITIES :
Head of Dance Club in College (2025-2026)
Communications Head of Artificial Intelligence & Deep Learning Club in college (2024-2025)
Joint Secretary of Mumbai Catholic Youth Organization
ABOUT
Final-year Computer Engineering student interested in data analytics and working with real-world datasets. Enjoy
making sense of data and using it to understand patterns and support decisions.
`;

const run = async () => {
  const result = await evaluateCandidate(jdText, resumeText);

  console.log("===== RESULT =====");
  console.log(JSON.stringify(result, null, 2));
};

run();