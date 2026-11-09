import bcrypt from 'bcryptjs';
import { db } from './db.js';

export async function seedDatabase() {
  const usersCol = db.collection('users');
  const coursesCol = db.collection('courses');
  const lessonsCol = db.collection('lessons');
  const quizzesCol = db.collection('quizzes');
  const achievementsCol = db.collection('achievements');
  const userAchievementsCol = db.collection('user_achievements');
  const studyPlansCol = db.collection('study_plans');
  const flashcardDecksCol = db.collection('flashcard_decks');
  const flashcardsCol = db.collection('flashcards');
  const notificationsCol = db.collection('notifications');
  const userProgressCol = db.collection('user_progress');
  const assignmentsCol = db.collection('assignments');

  if (usersCol.count() > 0) {
    return;
  }

  console.log('🌱 Seeding EduAI database with comprehensive initial data...');

  const studentPassword = await bcrypt.hash('Student123!', 10);
  const teacherPassword = await bcrypt.hash('Teacher123!', 10);
  const adminPassword = await bcrypt.hash('Admin123!', 10);

  const studentUser = usersCol.insert({
    id: 'user_student_1',
    name: 'Sardor Rakhimov',
    email: 'student@eduai.com',
    password: studentPassword,
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    xp: 1420,
    level: 4,
    streak: 6,
    lastActiveDate: new Date().toISOString().split('T')[0],
    preferredLanguage: 'en',
    learningLevel: 'undergraduate',
    favoriteSubjects: ['Programming', 'Mathematics', 'Physics'],
    totalHours: 24.5,
    bio: 'Software engineering student passionate about algorithms, AI, and competitive programming.'
  });

  const teacherUser = usersCol.insert({
    id: 'user_teacher_1',
    name: 'Prof. Alisher Usmanov',
    email: 'teacher@eduai.com',
    password: teacherPassword,
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    specialization: 'Computer Science & Applied Mathematics',
    institution: 'Tashkent University of Information Technologies',
    bio: 'Senior Lecturer and AI researcher with 12+ years of teaching experience.'
  });

  const adminUser = usersCol.insert({
    id: 'user_admin_1',
    name: 'Malika Karimova',
    email: 'admin@eduai.com',
    password: adminPassword,
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    bio: 'EduAI Platform Administrator & Curriculum Director'
  });

  // Seed Achievements
  const achievements = [
    {
      id: 'ach_first_step',
      title: 'First Step',
      description: 'Completed your very first lesson on EduAI.',
      icon: 'Rocket',
      xpReward: 100,
      badgeColor: 'blue'
    },
    {
      id: 'ach_streak_7',
      title: 'Consistency Champion',
      description: 'Maintained a 5+ day continuous learning streak.',
      icon: 'Flame',
      xpReward: 250,
      badgeColor: 'orange'
    },
    {
      id: 'ach_quiz_master',
      title: 'Quiz Prodigy',
      description: 'Scored 90% or higher on any subject quiz.',
      icon: 'Award',
      xpReward: 300,
      badgeColor: 'yellow'
    },
    {
      id: 'ach_flashcard_pro',
      title: 'Memory Guru',
      description: 'Reviewed 30+ flashcards in study mode.',
      icon: 'Layers',
      xpReward: 200,
      badgeColor: 'purple'
    },
    {
      id: 'ach_ai_scholar',
      title: 'AI Scholar',
      description: 'Consulted the AI Tutor for 10+ personalized explanations.',
      icon: 'Bot',
      xpReward: 150,
      badgeColor: 'emerald'
    },
    {
      id: 'ach_polymath',
      title: 'Modern Polymath',
      description: 'Enrolled in courses across 3 distinct subject disciplines.',
      icon: 'Compass',
      xpReward: 400,
      badgeColor: 'pink'
    }
  ];

  achievements.forEach(a => achievementsCol.insert(a));

  // Award achievements to student
  userAchievementsCol.insert({
    userId: studentUser.id,
    achievementId: 'ach_first_step',
    unlockedAt: new Date(Date.now() - 5 * 86400000).toISOString()
  });
  userAchievementsCol.insert({
    userId: studentUser.id,
    achievementId: 'ach_streak_7',
    unlockedAt: new Date(Date.now() - 1 * 86400000).toISOString()
  });
  userAchievementsCol.insert({
    userId: studentUser.id,
    achievementId: 'ach_quiz_master',
    unlockedAt: new Date(Date.now() - 2 * 86400000).toISOString()
  });

  // Seed Courses
  const coursesData = [
    {
      id: 'course_prog_1',
      title: 'Modern Full-Stack Development with React & Node.js',
      subject: 'Programming',
      category: 'Computer Science',
      difficulty: 'Intermediate',
      language: 'en',
      rating: 4.9,
      ratingsCount: 142,
      duration: '18 hours',
      instructorId: teacherUser.id,
      instructorName: teacherUser.name,
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
      description: 'Master modern web applications from frontend components to backend RESTful microservices, database transactions, and real-time APIs.',
      objectives: [
        'Build responsive interactive UIs with modern React and Hooks',
        'Architect scalable REST APIs using Node.js and Express',
        'Implement robust authentication, JWT, and role-based permissions',
        'Deploy production-ready full-stack applications with monitoring'
      ],
      lessonsCount: 4
    },
    {
      id: 'course_math_1',
      title: 'Calculus & Linear Algebra for Data Science & AI',
      subject: 'Mathematics',
      category: 'Mathematics',
      difficulty: 'Advanced',
      language: 'en',
      rating: 4.8,
      ratingsCount: 98,
      duration: '14 hours',
      instructorId: teacherUser.id,
      instructorName: teacherUser.name,
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
      description: 'Deep dive into multivariate derivatives, matrix decomposition, eigenvalues, and gradient descent algorithms powering modern neural networks.',
      objectives: [
        'Understand matrix vectorization and linear transformations',
        'Compute partial derivatives and Jacobians for optimization',
        'Implement gradient descent from scratch in Python',
        'Connect mathematical proofs to practical machine learning models'
      ],
      lessonsCount: 3
    },
    {
      id: 'course_phys_1',
      title: 'Classical Mechanics & Wave Dynamics',
      subject: 'Physics',
      category: 'Natural Sciences',
      difficulty: 'Beginner',
      language: 'en',
      rating: 4.7,
      ratingsCount: 84,
      duration: '12 hours',
      instructorId: teacherUser.id,
      instructorName: teacherUser.name,
      thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600&auto=format&fit=crop&q=80',
      description: 'Explore Newtonian dynamics, rotational equilibrium, harmonic oscillations, and mechanical wave interference through interactive simulations.',
      objectives: [
        'Master free-body diagrams and Newton laws of motion',
        'Calculate conservation of momentum and mechanical energy',
        'Analyze simple harmonic motion and resonant frequencies',
        'Solve real-world physics problems step-by-step'
      ],
      lessonsCount: 3
    },
    {
      id: 'course_chem_1',
      title: 'Organic Chemistry: Reaction Mechanisms & Synthesis',
      subject: 'Chemistry',
      category: 'Natural Sciences',
      difficulty: 'Intermediate',
      language: 'en',
      rating: 4.85,
      ratingsCount: 65,
      duration: '16 hours',
      instructorId: teacherUser.id,
      instructorName: teacherUser.name,
      thumbnail: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=600&auto=format&fit=crop&q=80',
      description: 'Systematic study of nucleophilic substitutions, electrophilic additions, stereochemistry, and retrosynthetic analysis.',
      objectives: [
        'Predict reaction pathways for SN1, SN2, E1, and E2 mechanisms',
        'Determine stereochemical configurations (R/S, cis/trans)',
        'Design multi-step synthetic routes for organic compounds'
      ],
      lessonsCount: 3
    },
    {
      id: 'course_bio_1',
      title: 'Cellular Genetics & Molecular Biotechnology',
      subject: 'Biology',
      category: 'Life Sciences',
      difficulty: 'Intermediate',
      language: 'en',
      rating: 4.9,
      ratingsCount: 110,
      duration: '15 hours',
      instructorId: teacherUser.id,
      instructorName: teacherUser.name,
      thumbnail: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=600&auto=format&fit=crop&q=80',
      description: 'Examine DNA transcription, translation, CRISPR gene editing techniques, and cellular respiration pathways.',
      objectives: [
        'Understand the central dogma of molecular biology',
        'Explain mechanisms of PCR, recombinant DNA, and gene therapy',
        'Analyze Mendelian genetics and complex inheritance patterns'
      ],
      lessonsCount: 3
    },
    {
      id: 'course_hist_1',
      title: 'World History: Global Revolutions & Modern Diplomacy',
      subject: 'History',
      category: 'Humanities',
      difficulty: 'Beginner',
      language: 'en',
      rating: 4.75,
      ratingsCount: 78,
      duration: '10 hours',
      instructorId: teacherUser.id,
      instructorName: teacherUser.name,
      thumbnail: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&auto=format&fit=crop&q=80',
      description: 'Critical perspectives on the Industrial Revolution, geopolitical treaties, the Enlightenment, and the formation of modern international organizations.',
      objectives: [
        'Analyze economic catalysts of 19th-century revolutions',
        'Examine ideological shifts from monarchies to constitutional democracies',
        'Assess the historical roots of contemporary geopolitical alliances'
      ],
      lessonsCount: 3
    },
    {
      id: 'course_eng_1',
      title: 'Academic English Writing & Fluency Mastery',
      subject: 'English',
      category: 'Languages',
      difficulty: 'Intermediate',
      language: 'en',
      rating: 4.92,
      ratingsCount: 156,
      duration: '12 hours',
      instructorId: teacherUser.id,
      instructorName: teacherUser.name,
      thumbnail: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop&q=80',
      description: 'Elevate your critical essays, vocabulary precision, rhetorical strategies, and academic presentations for TOEFL, IELTS, and international university study.',
      objectives: [
        'Structure cohesive academic essays with evidence-based argumentation',
        'Expand formal academic vocabulary and avoid colloquial traps',
        'Refine thesis statements, transition paragraphs, and citation standards'
      ],
      lessonsCount: 3
    },
    {
      id: 'course_geo_1',
      title: 'Physical Geography & Global Climate Systems',
      subject: 'Geography',
      category: 'Earth Sciences',
      difficulty: 'Beginner',
      language: 'en',
      rating: 4.65,
      ratingsCount: 52,
      duration: '9 hours',
      instructorId: teacherUser.id,
      instructorName: teacherUser.name,
      thumbnail: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&auto=format&fit=crop&q=80',
      description: 'Study plate tectonics, atmospheric circulation, hydrological cycles, biome ecosystems, and climate change data models.',
      objectives: [
        'Explain Hadley cells, Coriolis forces, and planetary wind belts',
        'Understand geomorphology and volcanic landform creation',
        'Interpret meteorological maps and GIS satellite imagery'
      ],
      lessonsCount: 3
    }
  ];

  coursesData.forEach(c => coursesCol.insert(c));

  // Seed Lessons for Programming Course
  const lessonsData = [
    {
      id: 'les_prog_1',
      courseId: 'course_prog_1',
      order: 1,
      title: 'Introduction to Modern Component Architecture & State Management',
      duration: '28 min',
      videoUrl: 'https://www.youtube.com/embed/SqcY0GlETPk',
      content: `### 1. The Declarative Paradigm\nIn modern web engineering, UI is a direct projection of application state: \`UI = f(state)\`. Rather than imperatively mutating DOM nodes, declarative frameworks compute atomic differential updates via a virtual representation.\n\n### 2. State vs Props\n- **Props:** Immutable arguments passed downward from parent to child components.\n- **State:** Mutable data maintained within a component that triggers reconciliation upon mutation.\n\n### 3. Best Practices\n1. Keep state as close as possible to where it is needed.\n2. Avoid redundant derived state; compute values on the fly.\n3. Favor composition over deep prop drilling.`,
      resources: [
        { title: 'React Official Architecture Docs', url: 'https://react.dev' },
        { title: 'Cheat Sheet: Modern Hooks', url: 'https://react.dev/reference/react' }
      ]
    },
    {
      id: 'les_prog_2',
      courseId: 'course_prog_1',
      order: 2,
      title: 'Architecting RESTful APIs with Node.js & Express Middleware',
      duration: '35 min',
      videoUrl: 'https://www.youtube.com/embed/Oe421EPjeBE',
      content: `### 1. REST Architectural Constraints\nA robust REST API follows stateless client-server communication, resource-oriented URIs, standard HTTP verbs (GET, POST, PUT, DELETE, PATCH), and predictable status codes.\n\n### 2. Express Middleware Pipeline\nMiddleware functions have access to \`req\`, \`res\`, and \`next\`. They enable cross-cutting concerns like logging, authentication, CORS, rate limiting, and centralized error handling.\n\n\`\`\`javascript\napp.use((req, res, next) => {\n  console.log(\`[\${new Date().toISOString()}] \${req.method} \${req.url}\`);\n  next();\n});\n\`\`\``,
      resources: [
        { title: 'Express.js Guide', url: 'https://expressjs.com' }
      ]
    },
    {
      id: 'les_prog_3',
      courseId: 'course_prog_1',
      order: 3,
      title: 'Database Transactions, Normalization, & Atomic Operations',
      duration: '42 min',
      videoUrl: 'https://www.youtube.com/embed/ztHopE5Wnpc',
      content: `### 1. ACID Guarantees\n- **Atomicity:** All sub-actions succeed or all are rolled back.\n- **Consistency:** Transactions preserve schema constraints and integrity rules.\n- **Isolation:** Concurrent executions produce results equivalent to serial execution.\n- **Durability:** Committed transactions persist through hardware crashes.\n\n### 2. When to Denormalize\nWhile Third Normal Form (3NF) reduces redundancy, read-heavy SaaS applications frequently introduce deliberate denormalization or caching layers (e.g. Redis) to optimize query latency.`,
      resources: []
    },
    {
      id: 'les_prog_4',
      courseId: 'course_prog_1',
      order: 4,
      title: 'Production Security: JWT, RBAC, & Defense in Depth',
      duration: '38 min',
      videoUrl: 'https://www.youtube.com/embed/mbsmsi7l3r4',
      content: `### 1. Token Anatomy\nA JSON Web Token consists of Header, Payload, and Signature (\`base64UrlEncode(header) + "." + base64UrlEncode(payload)\`). It should be signed with strong algorithms (HMAC SHA-256 or RSA) and validated on every privileged request.\n\n### 2. Role-Based Access Control (RBAC)\nDefine granular permissions for each role: Student, Teacher, and Administrator. Validate permissions in backend route guards rather than relying on UI hiding.`,
      resources: []
    },
    // Mathematics Lessons
    {
      id: 'les_math_1',
      courseId: 'course_math_1',
      order: 1,
      title: 'Matrices, Vector Spaces, and Linear Transformations',
      duration: '32 min',
      videoUrl: 'https://www.youtube.com/embed/fNk_zzaMoSs',
      content: `### Linear Transformations\nA transformation $T: V \\to W$ is linear if it preserves addition and scalar multiplication:\n$$T(u + v) = T(u) + T(v)$$\n$$T(cu) = c T(u)$$\n\nMatrices represent linear transformations with respect to standard basis vectors. In machine learning, weights and feature projections are matrices mapping high-dimensional input spaces into latent embeddings.`,
      resources: []
    },
    {
      id: 'les_math_2',
      courseId: 'course_math_1',
      order: 2,
      title: 'Multivariable Derivatives, Gradients, and Hessian Matrices',
      duration: '40 min',
      videoUrl: 'https://www.youtube.com/embed/GkB4vW16QHI',
      content: `### The Gradient Vector\nFor a scalar field $f(x_1, x_2, ..., x_n)$, the gradient $\\nabla f$ points in the direction of greatest rate of increase:\n$$\\nabla f = \\left[ \\frac{\\partial f}{\\partial x_1}, \\frac{\\partial f}{\\partial x_2}, \\dots, \\frac{\\partial f}{\\partial x_n} \\right]^T$$\nIn gradient descent, we update parameters in the opposite direction: $\\theta_{t+1} = \\theta_t - \\eta \\nabla f(\\theta_t)$.`,
      resources: []
    },
    {
      id: 'les_math_3',
      courseId: 'course_math_1',
      order: 3,
      title: 'Eigenvalues, Eigenvectors, & Principal Component Analysis (PCA)',
      duration: '45 min',
      videoUrl: 'https://www.youtube.com/embed/PFDu9oVAE-g',
      content: `### Characteristic Equation\nFor a square matrix $A$, a non-zero vector $v$ is an eigenvector with eigenvalue $\\lambda$ if:\n$$A v = \\lambda v \\implies (A - \\lambda I)v = 0$$\nSetting $\\det(A - \\lambda I) = 0$ yields the eigenvalues. PCA computes the eigenvectors of the data covariance matrix to identify principal axes of maximum variance.`,
      resources: []
    }
  ];

  lessonsData.forEach(l => lessonsCol.insert(l));

  // Seed Quizzes
  const quizzesData = [
    {
      id: 'quiz_prog_1',
      courseId: 'course_prog_1',
      title: 'Full-Stack Development Mastery Assessment',
      subject: 'Programming',
      difficulty: 'Intermediate',
      timeLimitMinutes: 15,
      passingScore: 70,
      xpReward: 150,
      questions: [
        {
          id: 'q1',
          type: 'multiple_choice',
          question: 'What is the primary benefit of declarative UI programming in React?',
          options: [
            'Direct manipulation of DOM nodes for maximum memory usage',
            'Computing UI as a deterministic function of application state',
            'Eliminating the need for CSS and stylesheets',
            'Running JavaScript code natively inside the GPU'
          ],
          correctAnswer: 'Computing UI as a deterministic function of application state',
          explanation: 'In React, the UI is expressed as a pure projection of state, allowing declarative component logic while the library handles minimal DOM reconciliations.'
        },
        {
          id: 'q2',
          type: 'true_false',
          question: 'In RESTful API design, a GET request should be idempotent and have no side effects on server resources.',
          options: ['True', 'False'],
          correctAnswer: 'True',
          explanation: 'GET requests must be safe and idempotent, meaning calling them multiple times produces the same result without modifying server resources.'
        },
        {
          id: 'q3',
          type: 'multiple_choice',
          question: 'Which component of a JWT ensures that the token has not been tampered with by an unauthorized third party?',
          options: [
            'The Base64 encoded payload',
            'The cryptographic signature',
            'The JSON expiration timestamp',
            'The browser LocalStorage key'
          ],
          correctAnswer: 'The cryptographic signature',
          explanation: 'The signature is created by hashing the header and payload with a secret server key. Any tampering invalidates the signature.'
        },
        {
          id: 'q4',
          type: 'written',
          question: 'Explain why database transactions require the Atomicity property in e-commerce or financial applications.',
          options: [],
          correctAnswer: 'Atomicity ensures that all parts of a transaction succeed, or the entire operation is rolled back, preventing partial updates like money deducted without crediting.',
          explanation: 'Atomicity guarantees an "all-or-nothing" execution. Without it, an unexpected crash could deduct a user balance without recording the corresponding order.'
        }
      ]
    },
    {
      id: 'quiz_math_1',
      courseId: 'course_math_1',
      title: 'Linear Algebra & Calculus Diagnostic',
      subject: 'Mathematics',
      difficulty: 'Advanced',
      timeLimitMinutes: 20,
      passingScore: 75,
      xpReward: 200,
      questions: [
        {
          id: 'qm1',
          type: 'multiple_choice',
          question: 'What does the gradient vector of a multivariable function point toward?',
          options: [
            'The direction of steepest decrease',
            'The direction of steepest ascent',
            'Perpendicular to the tangent plane',
            'The global origin (0, 0)'
          ],
          correctAnswer: 'The direction of steepest ascent',
          explanation: 'The gradient vector points in the direction of maximum directional derivative, which corresponds to the steepest rate of increase.'
        },
        {
          id: 'qm2',
          type: 'true_false',
          question: 'If the determinant of a square matrix is zero, the matrix is invertible.',
          options: ['True', 'False'],
          correctAnswer: 'False',
          explanation: 'A matrix is invertible if and only if its determinant is non-zero. A zero determinant indicates linearly dependent columns (singular matrix).'
        },
        {
          id: 'qm3',
          type: 'multiple_choice',
          question: 'In PCA (Principal Component Analysis), principal components correspond to:',
          options: [
            'Eigenvectors of the covariance matrix',
            'Random projections onto a spherical manifold',
            'The lowest eigenvalues of the correlation matrix',
            'The polynomial coefficients of regression'
          ],
          correctAnswer: 'Eigenvectors of the covariance matrix',
          explanation: 'PCA projects data onto the eigenvectors of the covariance matrix corresponding to the largest eigenvalues, maximizing preserved variance.'
        }
      ]
    }
  ];

  quizzesData.forEach(q => quizzesCol.insert(q));

  // Seed User Progress for Student
  userProgressCol.insert({
    userId: studentUser.id,
    courseId: 'course_prog_1',
    completedLessons: ['les_prog_1', 'les_prog_2'],
    progressPercentage: 50,
    lastAccessedAt: new Date().toISOString()
  });
  userProgressCol.insert({
    userId: studentUser.id,
    courseId: 'course_math_1',
    completedLessons: ['les_math_1'],
    progressPercentage: 33,
    lastAccessedAt: new Date(Date.now() - 86400000).toISOString()
  });

  // Seed Flashcard Decks
  const deck1 = flashcardDecksCol.insert({
    id: 'deck_prog_1',
    userId: studentUser.id,
    title: 'Modern Web Engineering & React',
    subject: 'Programming',
    description: 'Core concepts of state reconciliation, hooks, lifecycle, and API architecture.',
    cardCount: 6,
    isPublic: true
  });

  const cardsData = [
    {
      deckId: deck1.id,
      front: 'What is the Virtual DOM and why does React use it?',
      back: 'The Virtual DOM is an in-memory lightweight representation of the real DOM. React reconciles changes between renders using a diffing algorithm, applying only minimal updates to the real DOM for high performance.',
      difficulty: 'medium'
    },
    {
      deckId: deck1.id,
      front: 'What is the fundamental difference between `useEffect` and `useLayoutEffect`?',
      back: '`useEffect` runs asynchronously after the DOM paint, making it non-blocking. `useLayoutEffect` runs synchronously immediately after DOM mutations before browser paint, which is useful for measuring DOM layouts without flicker.',
      difficulty: 'hard'
    },
    {
      deckId: deck1.id,
      front: 'Explain what CORS (Cross-Origin Resource Sharing) protects.',
      back: 'CORS is a browser security mechanism that restricts HTTP requests initiated from scripts to a different origin (domain, protocol, or port) unless explicitly permitted by server response headers (e.g., Access-Control-Allow-Origin).',
      difficulty: 'medium'
    },
    {
      deckId: deck1.id,
      front: 'What does the term "idempotent HTTP method" mean?',
      back: 'An HTTP method is idempotent if performing multiple identical requests produces the exact same side-effect on the server as a single request. Examples include GET, PUT, and DELETE.',
      difficulty: 'easy'
    },
    {
      deckId: deck1.id,
      front: 'What is the difference between authorization and authentication?',
      back: 'Authentication verifies *who you are* (e.g. logging in with password or token). Authorization determines *what you are permitted to do* (e.g. role-based access control for students vs teachers vs admins).',
      difficulty: 'easy'
    },
    {
      deckId: deck1.id,
      front: 'What is SQL Injection and how is it prevented?',
      back: 'SQL injection occurs when untrusted user input is concatenated directly into SQL queries. It is prevented by using parameterized queries / prepared statements or ORM abstractions that escape inputs automatically.',
      difficulty: 'medium'
    }
  ];

  cardsData.forEach(c => flashcardsCol.insert(c));

  // Seed Study Plans
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  studyPlansCol.insert({
    userId: studentUser.id,
    title: 'Complete React Component Architecture Lesson',
    subject: 'Programming',
    dueDate: todayStr,
    priority: 'high',
    status: 'completed',
    estimatedMinutes: 45
  });

  studyPlansCol.insert({
    userId: studentUser.id,
    title: 'Practice Calculus Gradient Descent Problems',
    subject: 'Mathematics',
    dueDate: todayStr,
    priority: 'medium',
    status: 'pending',
    estimatedMinutes: 60
  });

  studyPlansCol.insert({
    userId: studentUser.id,
    title: 'Review 20 Flashcards in Web Engineering Deck',
    subject: 'Programming',
    dueDate: tomorrowStr,
    priority: 'low',
    status: 'pending',
    estimatedMinutes: 20
  });

  studyPlansCol.insert({
    userId: studentUser.id,
    title: 'Take Classical Mechanics Diagnostic Quiz',
    subject: 'Physics',
    dueDate: tomorrowStr,
    priority: 'high',
    status: 'pending',
    estimatedMinutes: 30
  });

  // Seed Notifications
  notificationsCol.insert({
    userId: studentUser.id,
    title: 'Daily Streak Milestone! 🔥',
    message: 'Awesome work! You have maintained a 6-day study streak. Keep going to reach the 7-day badge!',
    type: 'achievement',
    read: false,
    createdAt: new Date().toISOString()
  });

  notificationsCol.insert({
    userId: studentUser.id,
    title: 'New Course Available',
    message: 'Prof. Alisher Usmanov published "Classical Mechanics & Wave Dynamics". Check it out!',
    type: 'course',
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  });

  notificationsCol.insert({
    userId: studentUser.id,
    title: 'Assignment Deadline Reminder',
    message: 'Your practical programming submission is scheduled for tomorrow at 23:59.',
    type: 'reminder',
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  });

  // Seed Teacher Assignments
  assignmentsCol.insert({
    courseId: 'course_prog_1',
    instructorId: teacherUser.id,
    title: 'Build a Secure RESTful API Endpoint with JWT Auth',
    description: 'Implement an Express.js router with registration, password hashing via bcrypt, JWT issuance, and a protected route guard.',
    dueDate: tomorrowStr,
    totalPoints: 100
  });

  console.log('✅ Database seeded successfully with users, courses, lessons, quizzes, flashcards, and plans!');
}
