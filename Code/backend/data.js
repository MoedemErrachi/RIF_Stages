/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const INITIAL_INTERNSHIPS = [
  {
    id: 'internship-1',
    title: 'Développeur Fullstack Junior',
    company: 'TechCorp Solutions',
    specialty: 'Développement Web',
    duration: '3 mois',
    location: 'Paris / Hybride',
    description: `Nous recherchons un(e) stagiaire développeur(se) passionné(e) pour rejoindre notre équipe produit dynamique. Vous interviendrez directement sur la conception, l'optimisation et le développement de nouvelles fonctionnalités stratégiques de notre plateforme SaaS B2B. L'environnement technique de pointe s'articule autour de React pour la création d'interfaces fluides, Node.js et Spring Boot pour des architectures backend robustes, le tout orchestré de manière collaborative dans un contexte Agile.`,
    status: 'Ouverte',
    applicantsCount: 12,
    publishedAt: 'Il y a 2 jours',
    skills: ['React', 'Node.js', 'Spring Boot', 'Méthodologie Agile'],
    requirements: [
      "Étudiant(e) en école d'ingénieur ou master informatique (Bac+4/5), en recherche d'un stage de césure ou de fin d'études formateur.",
      "Première expérience concrète (projet académique significatif ou précédent stage) avec l'écosystème React et/ou un framework backend moderne.",
      "Forte capacité d'adaptation, esprit d'équipe prononcé et appétence pour les bonnes pratiques d'ingénierie logicielle (Clean Code, TDD)."
    ]
  },
  {
    id: 'internship-2',
    title: 'Ingénieur Cloud & DevOps',
    company: 'TechCorp Solutions',
    specialty: 'Infrastructure',
    duration: '6 mois',
    location: 'Paris / Hybride',
    description: `Participez à l'automatisation de nos déploiements et à la gestion de notre infrastructure cloud sur AWS. Une opportunité unique de travailler sur des architectures microservices complexes et de mettre en œuvre des pipelines CI/CD modernes. Vous collaborerez étroitement avec les équipes de développement pour optimiser la scalabilité, la sécurité et la haute disponibilité de nos services.`,
    status: 'Ouverte',
    applicantsCount: 5,
    publishedAt: 'Il y a 5 jours',
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
    requirements: [
      "Étudiant(e) en dernière année d'école d'ingénieur spécialité cloud, système ou équivalent.",
      "Connaissances de base de Docker et d'un fournisseur cloud (AWS, GCP ou Azure).",
      "Passion pour l'automatisation, scripting (Bash, Python) et l'approche DevOps."
    ]
  },
  {
    id: 'internship-3',
    title: 'Stage Marketing',
    company: 'TechCorp Solutions',
    specialty: 'Marketing',
    duration: '6 mois',
    location: 'Paris / Distanciel',
    description: `Rejoignez notre équipe marketing pour booster notre visibilité et notre croissance B2B. Vous participerez à la création de contenu, à l'analyse des campagnes d'acquisition, à l'optimisation du référencement (SEO/SEA) et à la gestion des réseaux sociaux. Une expérience transverse au cœur de l'écosystème Tech SaaS.`,
    status: 'Fermée',
    applicantsCount: 24,
    publishedAt: 'Fermée le 10/10',
    skills: ['SEO', 'Content Marketing', 'Google Analytics', 'Growth Hacking'],
    requirements: [
      "Étudiant(e) en école de commerce ou master marketing (Bac+4/5).",
      "Excellentes compétences rédactionnelles en français et bon niveau d'anglais.",
      "Créativité, esprit d'analyse et intérêt pour l'écosystème technologique."
    ]
  },
  {
    id: 'internship-4',
    title: 'Développeur Mobile Flutter',
    company: 'TechCorp Solutions',
    specialty: 'Développement Mobile',
    duration: '6 mois',
    location: 'Tunis / Hybride',
    description: `Contribuez au développement de notre application mobile multiplateforme avec Flutter. Vous serez impliqué(e) de la conception UI/UX à l'intégration des API et aux tests automatisés. Vous participerez également à l'optimisation des performances de l'application et à la publication sur les stores Google Play et App Store.`,
    status: 'Ouverte',
    applicantsCount: 3,
    publishedAt: 'Il y a 4 jours',
    skills: ['Flutter', 'Dart', 'State Management', 'REST APIs', 'Git'],
    requirements: [
      "Étudiant(e) en informatique ou télécommunication passionné(e) par le développement mobile.",
      "Avoir déjà développé au moins un projet personnel ou académique avec Flutter.",
      "Bonne compréhension des concepts de programmation orientée objet et d'intégration d'API REST."
    ]
  }
];

export const INITIAL_APPLICATIONS = [
  {
    id: 'app-1',
    internshipId: 'internship-1',
    internshipTitle: 'Développeur Fullstack Junior',
    candidateLastName: 'Ben Ali',
    candidateFirstName: 'Ahmed',
    candidateEmail: 'ahmed.benali@example.com',
    candidatePhone: '+33 6 12 34 56 78',
    cvName: 'Ahmed_Ben_Ali_CV.pdf',
    motivation: `Madame, Monsieur,\n\nActuellement étudiant en dernière année de Master en Ingénierie Logicielle, je suis particulièrement intéressé par l'offre de stage que vous avez publiée. Passionné par l'écosystème React et Node.js, j'ai eu l'opportunité de travailler sur plusieurs projets web complexes durant mon cursus académique. J'aimerais beaucoup intégrer votre équipe pour approfondir mes compétences et contribuer activement au développement de votre plateforme SaaS B2B.`,
    status: 'En revue',
    history: [
      { status: 'En revue', date: '14 Octobre 2023' },
      { status: 'Soumise', date: '12 Octobre 2023' }
    ],
    comments: "Excellent profil académique. Entretien technique à planifier prochainement.",
    submittedAt: '28/06/2026'
  },
  {
    id: 'app-2',
    internshipId: 'internship-2',
    internshipTitle: 'Ingénieur Cloud & DevOps',
    candidateLastName: 'Mansour',
    candidateFirstName: 'Sarah',
    candidateEmail: 'sarah.mansour@example.com',
    candidatePhone: '+33 6 98 76 54 32',
    cvName: 'Sarah_Mansour_DevOps.pdf',
    motivation: `Bonjour,\n\nJe postule pour le stage d'Ingénieur Cloud & DevOps. J'ai de solides bases sur Linux, Docker et AWS que j'ai pu mettre en pratique dans un projet de déploiement de microservices à l'école. Motivée et rigoureuse, je souhaite rejoindre TechCorp Solutions.`,
    status: 'Acceptée',
    history: [
      { status: 'Acceptée', date: '15 Juin 2026' },
      { status: 'En revue', date: '12 Juin 2026' },
      { status: 'Soumise', date: '10 Juin 2026' }
    ],
    comments: "Candidature acceptée. Contrat de stage envoyé.",
    submittedAt: '15/06/2026'
  },
  {
    id: 'app-3',
    internshipId: 'internship-4',
    internshipTitle: 'Développeur Mobile Flutter',
    candidateLastName: 'Rezgui',
    candidateFirstName: 'Mehdi',
    candidateEmail: 'mehdi.rezgui@example.com',
    candidatePhone: '+216 98 123 456',
    cvName: 'Mehdi_Rezgui_Flutter.pdf',
    motivation: `Madame, Monsieur,\n\nDéveloppeur passionné par Flutter, je souhaite rejoindre votre équipe pour ce stage mobile. J'ai créé deux applications mobiles publiées sur GitHub et je maîtrise Dart et la gestion d'état Bloc.`,
    status: 'Refusée',
    history: [
      { status: 'Refusée', date: '11 Octobre 2023' },
      { status: 'Soumise', date: '09 Octobre 2023' }
    ],
    comments: "Profil intéressant mais manque d'expérience sur l'intégration d'API complexes par rapport aux autres candidats.",
    submittedAt: '09/10/2023'
  },
  {
    id: 'app-4',
    internshipId: 'internship-1',
    internshipTitle: 'Développeur Front-end H/F',
    candidateLastName: 'Dupont',
    candidateFirstName: 'Jean',
    candidateEmail: 'jean.dupont@example.com',
    candidatePhone: '+33 6 11 22 33 44',
    cvName: 'CV_Jean_Dupont.pdf',
    motivation: `Madame, Monsieur,\n\nJe suis très enthousiaste à l'idée de postuler à votre de stage. Maîtrisant React, CSS (Tailwind) et TypeScript, je suis prêt à m'investir pleinement au sein de votre équipe produit pour concevoir des parcours utilisateurs intuitifs et performants.`,
    status: 'En revue',
    history: [
      { status: 'En revue', date: '12 Octobre 2023' },
      { status: 'Soumise', date: '10 Octobre 2023' }
    ],
    comments: "Bon portfolio de projets personnels React. À recontacter.",
    submittedAt: '10/10/2023'
  },
  {
    id: 'app-5',
    internshipId: 'internship-1',
    internshipTitle: 'UX/UI Designer Senior',
    candidateLastName: 'Laurent',
    candidateFirstName: 'Marie',
    candidateEmail: 'marie.laurent@example.com',
    candidatePhone: '+33 6 55 66 77 88',
    cvName: 'Portfolio_Marie_Laurent.pdf',
    motivation: `Chère équipe de recrutement,\n\nJe souhaite postuler à votre opportunité de stage en design UX/UI. J'ai hâte d'apporter ma créativité, mes compétences de recherche utilisateur et mes wireframes interactifs réalisés sur Figma pour sublimer l'expérience utilisateur de votre plateforme SaaS B2B.`,
    status: 'Soumise',
    history: [
      { status: 'Soumise', date: '11 Octobre 2023' }
    ],
    comments: "",
    submittedAt: '11/10/2023'
  },
  {
    id: 'app-6',
    internshipId: 'internship-2',
    internshipTitle: 'Data Scientist Junior',
    candidateLastName: 'Martin',
    candidateFirstName: 'Lucas',
    candidateEmail: 'lucas.martin@example.com',
    candidatePhone: '+33 6 88 99 00 11',
    cvName: 'Lucas_Martin_Data_Scientist.pdf',
    motivation: `Bonjour,\n\nÉtudiant en Master Data Science, je possède de solides compétences en Machine Learning et traitement de données avec Python (Pandas, Scikit-learn). Intéressé par vos problématiques d'optimisation SaaS, je serais ravi de réaliser mon stage chez vous.`,
    status: 'Acceptée',
    history: [
      { status: 'Acceptée', date: '10 Octobre 2023' }
    ],
    comments: "Excellent niveau technique. Entretien passé avec succès.",
    submittedAt: '10/10/2023'
  },
  {
    id: 'app-7',
    internshipId: 'internship-2',
    internshipTitle: 'Chef de Projet IT',
    candidateLastName: 'Tremblay',
    candidateFirstName: 'Sophie',
    candidateEmail: 'sophie.tremblay@example.com',
    candidatePhone: '+33 7 12 34 56 78',
    cvName: 'CV_Sophie_Tremblay.pdf',
    motivation: `Madame, Monsieur,\n\nJe souhaite réaliser mon stage de fin d'études en tant que chef de projet IT. J'ai une première expérience de coordination d'équipe et d'application de la méthode Scrum.`,
    status: 'Refusée',
    history: [
      { status: 'Refusée', date: '08 Octobre 2023' }
    ],
    comments: "Manque d'expérience technique requise pour piloter nos équipes d'ingénieurs.",
    submittedAt: '08/10/2023'
  }
];
