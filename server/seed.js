require('dotenv').config();
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Skill = require('./models/Skill');
const SwapRequest = require('./models/SwapRequest');
const Message = require('./models/Message');
const Transaction = require('./models/Transaction');
const Internship = require('./models/Internship');
const Application = require('./models/Application');
const { connectDB } = require('./utils/db');
const { avatarUrl } = require('./utils/helpers');

const skillsData = [
  // ── Semester 1 Subjects ──
  { name: 'Engineering Mathematics-I', category: 'Semester 1', description: 'Differential calculus, Taylor & Maclaurin series, partial differentiation, matrices.', icon: '📐' },
  { name: 'Engineering Physics', category: 'Semester 1', description: 'Interference, diffraction, polarization, laser, fiber optics, quantum mechanics.', icon: '⚛️' },
  { name: 'Engineering Chemistry', category: 'Semester 1', description: 'Polymers, electrochemistry, corrosion, fuels & combustion, spectroscopy.', icon: '🧪' },
  { name: 'Basic Electrical Engineering', category: 'Semester 1', description: 'DC & AC circuits, network theorems, single & 3-phase, transformers, machines.', icon: '⚡' },
  { name: 'Basic Electronics Engineering', category: 'Semester 1', description: 'Semiconductor diodes, BJT, FET, operational amplifiers, logic gates.', icon: '🔌' },
  { name: 'Engineering Graphics', category: 'Semester 1', description: 'Orthographic projections, lines, planes, solids, isometric views.', icon: '📏' },
  { name: 'Fundamentals of Programming Languages', category: 'Semester 1', description: 'C programming — data types, control flow, arrays, strings, pointers, file handling.', icon: '💻' },
  { name: 'Professional Communication Skills', category: 'Semester 1', description: 'Technical writing, presentation skills, group discussions, professional etiquette.', icon: '🗣️' },

  // ── Semester 2 & Technical Subjects ──
  { name: 'Mathematics-2', category: 'Semester 2', description: 'Engineering mathematics: integral calculus, linear algebra, differential equations, transforms, and numerical methods.', icon: '🔢' },
  { name: 'Engineering Mechanics', category: 'Semester 2', description: 'Coplanar force systems, friction, kinematics, kinetics of particles.', icon: '⚙️' },
  { name: 'Programming and Problem Solving', category: 'Semester 2', description: 'Data structures (linked lists, stacks, queues), algorithms, searching & sorting.', icon: '🖥️' },
  { name: 'Design Thinking & Idea Lab', category: 'Semester 2', description: 'Design thinking methodology — empathize, define, ideate, prototype, test.', icon: '💡' },
  { name: 'Web Development (React & Node)', category: 'Technical Skills', description: 'Full-stack web applications with React, Tailwind CSS, REST APIs, and Node.js.', icon: '🌐' },
  { name: 'Python & Machine Learning', category: 'Technical Skills', description: 'Python data science stack: Pandas, NumPy, Scikit-learn, Neural Networks.', icon: '🤖' },
  { name: 'C++ Programming', category: 'Computer Science', description: 'Modern C++, memory basics, STL, and object-oriented programming.', icon: '💻' },
  { name: 'Java Programming', category: 'Computer Science', description: 'Core Java, object-oriented design, collections, and exception handling.', icon: '☕' },
  { name: 'Data Structures & Algorithms', category: 'Computer Science', description: 'Complexity, trees, graphs, dynamic programming, and interview problem solving.', icon: '🧩' },
  { name: 'Object-Oriented Programming', category: 'Computer Science', description: 'Classes, interfaces, composition, and common design principles.', icon: '🧱' },
  { name: 'SQL & Database Design', category: 'Computer Science', description: 'Relational modeling, SQL queries, joins, indexes, and normalization.', icon: '🗄️' },
  { name: 'Git & GitHub', category: 'Engineering Tools', description: 'Version control, branches, pull requests, and collaborative workflows.', icon: '🔀' },
  { name: 'Linux & Command Line', category: 'Engineering Tools', description: 'Shell basics, files, permissions, processes, and developer tooling.', icon: '🐧' },
  { name: 'REST API Development', category: 'Computer Science', description: 'HTTP methods, API design, validation, authentication, and documentation.', icon: '🔌' },
  { name: 'UI/UX & Figma', category: 'Engineering Tools', description: 'Wireframes, prototypes, design systems, and usability fundamentals.', icon: '🎨' },
  { name: 'Arduino & Microcontrollers', category: 'Electrical & Electronics', description: 'Microcontroller basics, sensors, actuators, and prototype circuits.', icon: '🛠️' },
  { name: 'Embedded C', category: 'Electrical & Electronics', description: 'Low-level C, microcontroller peripherals, interrupts, and firmware basics.', icon: '📟' },
  { name: 'PCB Design', category: 'Electrical & Electronics', description: 'Schematic capture, component selection, PCB layout, and design checks.', icon: '🧩' },
  { name: 'MATLAB & Simulink', category: 'Electrical & Electronics', description: 'Numerical computing, plotting, control systems, and simulation models.', icon: '📈' },
  { name: 'Digital Electronics', category: 'Electrical & Electronics', description: 'Combinational logic, sequential circuits, counters, and state machines.', icon: '🔋' },
  { name: 'AutoCAD', category: 'Engineering Tools', description: '2D drafting, dimensions, layers, layouts, and technical drawings.', icon: '📐' },
  { name: 'SolidWorks & CAD Modeling', category: 'Mechanical Engineering', description: 'Part modeling, assemblies, drawings, and basic mechanical design.', icon: '⚙️' },
  { name: 'Thermodynamics', category: 'Mechanical Engineering', description: 'Properties, energy balances, cycles, and engineering applications.', icon: '🌡️' },
  { name: '3D Printing & Prototyping', category: 'Mechanical Engineering', description: 'Design for additive manufacturing, slicers, tolerances, and iteration.', icon: '🖨️' },
  { name: 'Strength of Materials', category: 'Mechanical Engineering', description: 'Stress, strain, bending, torsion, and material behavior.', icon: '🏗️' },
  { name: 'Structural Analysis', category: 'Civil Engineering', description: 'Loads, reactions, determinate structures, and analysis fundamentals.', icon: '🏢' },
  { name: 'Surveying & GIS Basics', category: 'Civil Engineering', description: 'Survey methods, coordinate systems, maps, and spatial data basics.', icon: '🗺️' },
  { name: 'Engineering Mathematics & Calculus', category: 'Semester 2', description: 'Calculus, linear algebra, differential equations, and engineering applications.', icon: '∑' },
  { name: 'Excel for Engineering', category: 'Engineering Tools', description: 'Formulas, charts, data cleaning, and engineering calculation sheets.', icon: '📊' },
  { name: 'LaTeX & Technical Reports', category: 'Career Skills', description: 'Structured technical writing, equations, citations, and report formatting.', icon: '📝' },
  { name: 'Technical Presentation Skills', category: 'Career Skills', description: 'Presenting engineering work with clear visuals and concise explanations.', icon: '🎤' },
  { name: 'Project Planning & Teamwork', category: 'Career Skills', description: 'Breaking down project work, coordinating tasks, and documenting progress.', icon: '🤝' },
  { name: 'Resume & Interview Practice', category: 'Career Skills', description: 'Explain projects clearly, prepare for technical interviews, and improve resumes.', icon: '🧑‍💼' },
  { name: 'Mathematics-3', category: 'Engineering Mathematics', description: 'Vector calculus, complex variables, Laplace transforms, and engineering applications.', icon: '∫' },
  { name: 'Mathematics-4', category: 'Engineering Mathematics', description: 'Probability, statistics, numerical methods, and optimization for engineers.', icon: '📉' },
  { name: 'Discrete Mathematics', category: 'Computer Science', description: 'Logic, sets, relations, combinatorics, graph theory, and proofs.', icon: '🔣' },
  { name: 'Operating Systems', category: 'Computer Science', description: 'Processes, threads, scheduling, memory, file systems, and concurrency.', icon: '🖥️' },
  { name: 'Computer Networks', category: 'Computer Science', description: 'Network layers, TCP/IP, routing, DNS, HTTP, and network troubleshooting.', icon: '🌐' },
  { name: 'Computer Organization & Architecture', category: 'Computer Science', description: 'Digital logic, instruction sets, processors, memory hierarchy, and I/O.', icon: '🧠' },
  { name: 'Software Engineering & Testing', category: 'Computer Science', description: 'Requirements, architecture, test design, debugging, and maintainable delivery.', icon: '🧪' },
  { name: 'Cybersecurity Fundamentals', category: 'Computer Science', description: 'Threat modeling, secure coding, encryption basics, and web security.', icon: '🔐' },
  { name: 'Cloud Computing & DevOps', category: 'Engineering Tools', description: 'Cloud concepts, deployment, CI/CD pipelines, containers, and monitoring.', icon: '☁️' },
  { name: 'Mobile App Development', category: 'Computer Science', description: 'Build and test mobile interfaces, navigation, API calls, and app releases.', icon: '📱' },
  { name: 'Data Analytics', category: 'Computer Science', description: 'Data cleaning, exploratory analysis, visualization, and communicating results.', icon: '📊' },
  { name: 'Power Systems', category: 'Electrical & Electronics', description: 'Generation, transmission, distribution, protection, and power-flow basics.', icon: '🔌' },
  { name: 'Control Systems', category: 'Electrical & Electronics', description: 'System modeling, transfer functions, stability, feedback, and response.', icon: '🎛️' },
  { name: 'Signals & Signal Processing', category: 'Electrical & Electronics', description: 'Continuous and discrete signals, transforms, filters, and sampling.', icon: '〰️' },
  { name: 'Fluid Mechanics', category: 'Mechanical Engineering', description: 'Fluid statics, flow, Bernoulli equation, losses, and dimensional analysis.', icon: '💧' },
  { name: 'Heat Transfer', category: 'Mechanical Engineering', description: 'Conduction, convection, radiation, heat exchangers, and applications.', icon: '🔥' },
  { name: 'Manufacturing Processes', category: 'Mechanical Engineering', description: 'Casting, machining, forming, joining, process selection, and quality.', icon: '🏭' },
  { name: 'Machine Design', category: 'Mechanical Engineering', description: 'Design loads, shafts, fasteners, fatigue, and component selection.', icon: '⚙️' },
  { name: 'Concrete & Reinforced Concrete Design', category: 'Civil Engineering', description: 'Concrete materials, reinforcement, beams, slabs, and design basics.', icon: '🧱' },
  { name: 'Geotechnical Engineering', category: 'Civil Engineering', description: 'Soil classification, compaction, shear strength, and foundations.', icon: '⛰️' },
  { name: 'Hydraulics & Water Resources', category: 'Civil Engineering', description: 'Open-channel flow, pipes, water systems, and resource planning.', icon: '🌊' },
  { name: 'Chemical Process Principles', category: 'Chemical Engineering', description: 'Material and energy balances, process diagrams, and unit operations.', icon: '⚗️' },
  { name: 'Mass Transfer & Separation', category: 'Chemical Engineering', description: 'Diffusion, absorption, distillation, extraction, and separation equipment.', icon: '🧫' },
  { name: 'Engineering Research & Paper Reading', category: 'Career Skills', description: 'Find credible papers, evaluate methods, and present technical findings.', icon: '🔎' }
];

async function ensureSkillCatalog() {
  const legacyMath2 = await Skill.findOne({ name: 'Engineering Mathematics-II' });
  const canonicalMath2 = await Skill.findOne({ name: 'Mathematics-2' });
  if (legacyMath2 && !canonicalMath2) {
    legacyMath2.name = 'Mathematics-2';
    legacyMath2.description = 'Engineering mathematics: integral calculus, linear algebra, differential equations, transforms, and numerical methods.';
    await legacyMath2.save();
  }
  const missing = [];
  for (const skill of skillsData) {
    if (!(await Skill.findOne({ name: skill.name }))) missing.push(skill);
  }
  if (missing.length) await Skill.insertMany(missing);
  return missing.length;
}

const demoPassword = 'Password123';

const usersData = [
  {
    name: 'Anchal Singh',
    username: 'anchal',
    email: 'anchal@skillswap.dev',
    erpId: 'ERP202601',
    role: 'student',
    bio: 'Strong in maths and programming, happy to help peers with Sem 1 & Sem 2 topics.',
    location: 'Pune',
    teach: ['Engineering Mathematics-I', 'Fundamentals of Programming Languages', 'Mathematics-2', 'Programming and Problem Solving'],
    learn: ['Engineering Physics', 'Engineering Graphics'],
    rating: 4.9,
    completedSwaps: 4,
    radarMetrics: { resume: 85, skills: 90, projects: 78, aiMatch: 86, consistency: 92, interview: 85 }
  },
  {
    name: 'Gargi Bothara',
    username: 'gargi',
    email: 'gargi@skillswap.dev',
    erpId: 'ERP202602',
    role: 'student',
    bio: 'Love design and creativity — can teach graphics and design thinking to anyone!',
    location: 'Mumbai',
    teach: ['Engineering Graphics', 'Design Thinking & Idea Lab', 'Professional Communication Skills'],
    learn: ['Engineering Mathematics-I', 'Basic Electrical Engineering'],
    rating: 4.9,
    completedSwaps: 3,
    radarMetrics: { resume: 80, skills: 82, projects: 88, aiMatch: 84, consistency: 85, interview: 85 }
  },
  {
    name: 'Shreya Ashtekar',
    username: 'shreya',
    email: 'shreya@skillswap.dev',
    erpId: 'ERP202603',
    role: 'student',
    bio: 'Physics and chemistry nerd — always excited to explain tricky concepts.',
    location: 'Bengaluru',
    teach: ['Engineering Physics', 'Engineering Chemistry', 'Engineering Mechanics'],
    learn: ['Fundamentals of Programming Languages', 'Programming and Problem Solving'],
    rating: 4.8,
    completedSwaps: 2,
    radarMetrics: { resume: 78, skills: 84, projects: 70, aiMatch: 80, consistency: 80, interview: 88 }
  },
  {
    name: 'Shravani Deshmukh',
    username: 'shravani',
    email: 'shravani@skillswap.dev',
    erpId: 'ERP202604',
    role: 'student',
    bio: 'Electrical and electronics geek who loves hands-on workshop practice.',
    location: 'Delhi',
    teach: ['Basic Electrical Engineering', 'Basic Electronics Engineering'],
    learn: ['Mathematics-2', 'Engineering Chemistry'],
    rating: 4.7,
    completedSwaps: 2,
    radarMetrics: { resume: 75, skills: 80, projects: 72, aiMatch: 78, consistency: 75, interview: 82 }
  },
  {
    name: 'Demo Student',
    username: 'student',
    email: 'student@skilltern.com',
    erpId: 'ERP202600',
    role: 'student',
    bio: 'Eager computer engineering student looking to swap skills, prepare for interviews, and land internships!',
    location: 'Pune',
    teach: ['Fundamentals of Programming Languages', 'Web Development (React & Node)'],
    learn: ['Python & Machine Learning', 'Mathematics-2'],
    rating: 4.8,
    completedSwaps: 0,
    radarMetrics: { resume: 72, skills: 80, projects: 65, aiMatch: 78, consistency: 60, interview: 70 }
  },
  {
    name: 'Sarah Connor',
    username: 'recruiter',
    email: 'recruiter@skilltern.com',
    erpId: 'HR202601',
    role: 'recruiter',
    company: 'Tech Corp',
    bio: 'Talent Acquisition Lead at Tech Corp. Interested in students who collaborate and build practical skills.',
    location: 'Pune',
    teach: [],
    learn: [],
    rating: 5.0,
    radarMetrics: { resume: 90, skills: 90, projects: 90, aiMatch: 90, consistency: 90, interview: 90 }
  }
];

const internshipsData = [
  {
    title: 'Software Engineering Intern',
    company: 'Tech Corp',
    location: 'Pune / Hybrid',
    type: 'Internship',
    duration: '6 Months',
    stipend: '₹25,000 / month',
    requiredSkills: ['Fundamentals of Programming Languages', 'Programming and Problem Solving', 'Web Development (React & Node)'],
    description: 'Join our core platform engineering team to build scalable microservices and student-facing portal features.',
    requirements: ['Strong foundations in C/C++ or JavaScript', 'Understanding of Git and data structures', 'Good problem-solving ability'],
    baseScore: 92
  },
  {
    title: 'Data Science & AI Intern',
    company: 'Data Inc',
    location: 'Bengaluru / Remote',
    type: 'Internship',
    duration: '3 Months',
    stipend: '₹30,000 / month',
    requiredSkills: ['Engineering Mathematics-I', 'Python & Machine Learning', 'Programming and Problem Solving'],
    description: 'Work alongside data scientists on predictive modeling, NLP evaluation metrics, and data visualization pipelines.',
    requirements: ['Proficiency with Python, Pandas, and Scikit-learn', 'Solid grasp of linear algebra and statistics', 'Familiarity with REST APIs'],
    baseScore: 88
  },
  {
    title: 'Frontend Developer Intern',
    company: 'Web Solutions',
    location: 'Mumbai / Remote',
    type: 'Internship',
    duration: '3 Months',
    stipend: '₹20,000 / month',
    requiredSkills: ['Web Development (React & Node)', 'Design Thinking & Idea Lab', 'Professional Communication Skills'],
    description: 'Craft responsive, pixel-perfect user interfaces with modern React, Tailwind CSS, and TypeScript.',
    requirements: ['Hands-on experience with modern React components', 'Good eye for design and typography', 'Strong communication skills'],
    baseScore: 85
  },
  {
    title: 'AI & Cloud Solutions Intern',
    company: 'CloudScale AI',
    location: 'Hyderabad / Hybrid',
    type: 'Internship',
    duration: '6 Months',
    stipend: '₹35,000 / month',
    requiredSkills: ['Python & Machine Learning', 'Web Development (React & Node)', 'Basic Electronics Engineering'],
    description: 'Build automated AI cloud workflows, LLM agents, and high-performance serverless endpoints.',
    requirements: ['Experience with cloud APIs and containerization', 'Passion for AI agents and automation', 'Self-driven curiosity'],
    baseScore: 80
  }
];

async function seedData() {
  await Promise.all([
    User.deleteMany({}),
    Skill.deleteMany({}),
    SwapRequest.deleteMany({}),
    Message.deleteMany({}),
    Transaction.deleteMany({}),
    Internship.deleteMany({}),
    Application.deleteMany({})
  ]);

  const skills = await Skill.insertMany(skillsData);
  const byName = Object.fromEntries(skills.map((s) => [s.name, s._id]));
  const defaultPasswordHash = await bcrypt.hash(demoPassword, 10);
  const studentPasswordHash = await bcrypt.hash('student123', 10);
  const recruiterPasswordHash = await bcrypt.hash('recruiter123', 10);

  const users = [];
  for (const u of usersData) {
    let password = defaultPasswordHash;
    if (u.email === 'student@skilltern.com') password = studentPasswordHash;
    if (u.email === 'recruiter@skilltern.com') password = recruiterPasswordHash;

    const user = await User.create({
      name: u.name,
      username: u.username,
      email: u.email,
      password,
      role: u.role || 'student',
      company: u.company || '',
      erpId: u.erpId,
      isErpVerified: false,
      bio: u.bio,
      location: u.location,
      profileImage: avatarUrl(u.name),
      skillsToTeach: (u.teach || []).map((n) => byName[n]).filter(Boolean),
      skillsToLearn: (u.learn || []).map((n) => byName[n]).filter(Boolean),
      credits: 100,
      rating: u.rating,
      completedSwaps: u.completedSwaps || 0,
      radarMetrics: u.radarMetrics
    });

    await Transaction.create({
      user: user._id,
      amount: 100,
      type: 'welcome_bonus',
      description: 'Welcome account bonus'
    });
    users.push(user);
  }

  const [anchal, gargi, shreya, shravani, studentUser, recruiterUser] = users;

  // Create Swaps
  const accepted = await SwapRequest.create({
    sender: anchal._id,
    receiver: gargi._id,
    skillOffered: byName['Engineering Mathematics-I'],
    skillWanted: byName['Engineering Graphics'],
    message: 'Happy to walk you through calculus and matrices if you help me with projection drawings.',
    status: 'accepted'
  });

  await SwapRequest.create({
    sender: shreya._id,
    receiver: anchal._id,
    skillOffered: byName['Engineering Physics'],
    skillWanted: byName['Fundamentals of Programming Languages'],
    message: 'I can explain optics and quantum mechanics if you help me with C programming.',
    status: 'pending'
  });

  await SwapRequest.create({
    sender: shravani._id,
    receiver: gargi._id,
    skillOffered: byName['Basic Electrical Engineering'],
    skillWanted: byName['Design Thinking & Idea Lab'],
    message: 'Would love a design thinking session in exchange for circuit analysis help.',
    status: 'pending'
  });

  // Messages between Anchal & Gargi
  await Message.create({
    sender: anchal._id,
    receiver: gargi._id,
    text: 'Hey Gargi! Excited to swap Engineering Maths-I and Engineering Graphics this week.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60)
  });
  await Message.create({
    sender: gargi._id,
    receiver: anchal._id,
    text: 'Hey Anchal! Sounds great — let us go over projections and isometric views on Thursday.',
    timestamp: new Date(Date.now() - 1000 * 60 * 40)
  });

  // Seed Internships
  const seededInternships = [];
  for (const item of internshipsData) {
    const internship = await Internship.create({
      ...item,
      postedBy: recruiterUser._id,
      status: 'open',
      applicantsCount: 2
    });
    seededInternships.push(internship);
  }

  // Seed Applications
  if (seededInternships.length >= 2) {
    await Application.create({
      internship: seededInternships[0]._id,
      applicant: studentUser._id,
      status: 'applied',
      profileFitScore: 95,
      verifiedSwaps: studentUser.completedSwaps,
      coverLetter: 'Excited to apply for Software Engineering Intern. I have completed peer swaps on C and web dev.'
    });

    await Application.create({
      internship: seededInternships[1]._id,
      applicant: studentUser._id,
      status: 'reviewing',
      profileFitScore: 88,
      verifiedSwaps: studentUser.completedSwaps,
      coverLetter: 'Passionate about machine learning and mathematical modeling.'
    });

    await Application.create({
      internship: seededInternships[0]._id,
      applicant: anchal._id,
      status: 'shortlisted',
      profileFitScore: 92,
      verifiedSwaps: anchal.completedSwaps,
      coverLetter: 'Top performer in maths and programming with a strong peer collaboration record.'
    });
  }

  console.log('✅ Skill-TERN Unified Database Seed complete!');
  console.log('Slogan: "Identify your skill gaps → Swap skills with peers to master them → Earn credits and boost your readiness → Get matched with internships."');
  console.log('\nDemo Logins (all accept Password123 or role-specific passwords):');
  console.log('  🎓 Student: student@skilltern.com / student123 (ERP: ERP202600)');
  console.log('  🎓 Anchal:  anchal@skillswap.dev / Password123 (ERP: ERP202601)');
  console.log('  🎓 Gargi:   gargi@skillswap.dev / Password123 (ERP: ERP202602)');
  console.log('  🎓 Shreya:  shreya@skillswap.dev / Password123 (ERP: ERP202603)');
  console.log('  🎓 Shravani:shravani@skillswap.dev / Password123 (ERP: ERP202604)');
  console.log('  💼 Recruiter: recruiter@skilltern.com / recruiter123 (HR: HR202601)');
  return { users, skills, accepted, internships: seededInternships };
}

async function runSeedCli() {
  if (process.env.NODE_ENV === 'production' && !process.env.SUPABASE_URL) {
    throw new Error('Refusing to seed the local JSON demo database in production. Configure Supabase first.');
  }
  await connectDB();
  await seedData();
  process.exit(0);
}

if (require.main === module) {
  runSeedCli().catch((err) => {
    console.error('Seed error:', err);
    process.exit(1);
  });
}

module.exports = { seedData, ensureSkillCatalog, skillsData, usersData, internshipsData };
