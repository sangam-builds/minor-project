require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');

const Course = require('../models/Course.model');
const Topic = require('../models/Topic.model');
const Quiz = require('../models/Quiz.model');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/learningpath_db';

// ═══════════════════════════════════════════════════════════════════════════
//  ASSESSMENT QUIZ  —  10 questions spanning all 3 levels
//  Score < 40%  → beginner   (0–3 correct)
//  Score 40–74% → intermediate (4–7 correct)
//  Score ≥ 75%  → advanced   (8–10 correct)
// ═══════════════════════════════════════════════════════════════════════════
const assessmentQuiz = {
  isAssessment: true,
  questions: [
    // BEGINNER range questions
    {
      text: 'Which keyword is used to declare a variable that cannot be reassigned in JavaScript?',
      options: ['var', 'let', 'const', 'static'],
      correctAnswer: 2,
      difficulty: 'beginner',
    },
    {
      text: 'What does the "npm init" command do in a Node.js project?',
      options: [
        'Installs all packages from package.json',
        'Creates a new package.json file with project metadata',
        'Starts the Node.js server',
        'Updates Node.js to the latest version',
      ],
      correctAnswer: 1,
      difficulty: 'beginner',
    },
    {
      text: 'Which HTTP method is typically used to retrieve data from a server?',
      options: ['POST', 'PUT', 'GET', 'DELETE'],
      correctAnswer: 2,
      difficulty: 'beginner',
    },
    // INTERMEDIATE range questions
    {
      text: 'What is the purpose of the "async/await" syntax in JavaScript?',
      options: [
        'To declare class methods',
        'To handle asynchronous operations in a synchronous-looking style',
        'To create generator functions',
        'To define arrow functions',
      ],
      correctAnswer: 1,
      difficulty: 'intermediate',
    },
    {
      text: 'In Express.js, what does the "next()" function do inside middleware?',
      options: [
        'Ends the request-response cycle',
        'Sends a response to the client',
        'Passes control to the next middleware or route handler',
        'Redirects to the next route',
      ],
      correctAnswer: 2,
      difficulty: 'intermediate',
    },
    {
      text: 'What does "JWT" stand for and what is its primary use?',
      options: [
        'JavaScript Web Tool — for bundling scripts',
        'JSON Web Token — for stateless authentication',
        'Java Web Transfer — for file uploads',
        'JSON Web Type — for schema validation',
      ],
      correctAnswer: 1,
      difficulty: 'intermediate',
    },
    {
      text: 'In MongoDB, which method is used to find documents that match multiple conditions using AND logic?',
      options: [
        'Model.find({ $or: [...] })',
        'Model.find({ $and: [...] })',
        'Model.find({ field1: val1, field2: val2 })',
        'Both B and C are correct',
      ],
      correctAnswer: 3,
      difficulty: 'intermediate',
    },
    // ADVANCED range questions
    {
      text: 'What is the primary difference between Mongoose "pre" and "post" middleware hooks?',
      options: [
        'Pre hooks run before the operation, post hooks run after it completes',
        'Pre hooks are for queries, post hooks are for saves',
        'Pre hooks are synchronous, post hooks are asynchronous',
        'There is no difference — they are aliases',
      ],
      correctAnswer: 0,
      difficulty: 'advanced',
    },
    {
      text: 'In a Node.js application, what is the event loop\'s role in handling I/O operations?',
      options: [
        'It blocks execution until I/O completes',
        'It delegates I/O to worker threads and processes callbacks when ready',
        'It creates a new thread for every I/O operation',
        'It converts async operations to synchronous ones',
      ],
      correctAnswer: 1,
      difficulty: 'advanced',
    },
    {
      text: 'Which MongoDB aggregation stage would you use to join data from another collection?',
      options: ['$group', '$lookup', '$unwind', '$facet'],
      correctAnswer: 1,
      difficulty: 'advanced',
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
//  COURSE DATA  —  3 levels × content that actually teaches the INT222 syllabus
// ═══════════════════════════════════════════════════════════════════════════
const coursesData = [

  // ──────────────────────────────────────────────────────────────────────
  //  BEGINNER COURSE  —  Node.js Foundations
  // ──────────────────────────────────────────────────────────────────────
  {
    course: {
      title: 'Node.js Foundations',
      description: 'Start from zero and build confidence with Node.js — covering core modules, async patterns, file I/O, and your first HTTP server. Ideal for students with basic JavaScript knowledge.',
      level: 'beginner',
    },
    topics: [
      {
        title: 'Introduction to Node.js and npm',
        content: `## What is Node.js?

Node.js is a runtime environment that lets you run JavaScript outside the browser — on servers, desktops, and anywhere else you need backend code.

### Why Node.js?
- **Non-blocking I/O** — handles thousands of connections without creating a thread per request
- **Single language** — write JavaScript on both frontend and backend
- **Huge ecosystem** — over 2 million packages on npm

### Installing Node.js
Download from nodejs.org. Verify installation:
\`\`\`bash
node --version    # v20.x.x
npm --version     # 10.x.x
\`\`\`

### npm — Node Package Manager
npm manages third-party libraries for your project.

\`\`\`bash
npm init -y                  # create package.json
npm install express          # install a package
npm install -D nodemon       # install as dev dependency
npm uninstall express        # remove a package
\`\`\`

### Your First Node.js Script
\`\`\`javascript
// hello.js
console.log('Hello from Node.js!');
console.log('Node version:', process.version);
console.log('Platform:', process.platform);
\`\`\`
Run it: \`node hello.js\`

### Key Concept: Modules
Node.js uses CommonJS modules:
\`\`\`javascript
// math.js — export
module.exports = { add: (a, b) => a + b };

// app.js — import
const { add } = require('./math');
console.log(add(2, 3)); // 5
\`\`\``,
        order: 1,
      },
      {
        title: 'Core Modules: fs, path, and os',
        content: `## Built-in Node.js Modules

Core modules come with Node.js — no npm install needed.

### The fs Module (File System)
\`\`\`javascript
const fs = require('fs');

// Read a file (async — preferred)
fs.readFile('data.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});

// Write a file
fs.writeFile('output.txt', 'Hello World!', (err) => {
  if (err) throw err;
  console.log('File written!');
});

// Check if file exists
fs.access('data.txt', fs.constants.F_OK, (err) => {
  console.log(err ? 'Does not exist' : 'File exists');
});
\`\`\`

### Reading and Writing JSON
\`\`\`javascript
const fs = require('fs');

// Read JSON config
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

// Write JSON data
const data = { name: 'Alice', score: 95 };
fs.writeFileSync('result.json', JSON.stringify(data, null, 2));
\`\`\`

### The path Module
\`\`\`javascript
const path = require('path');

path.join('/users', 'alice', 'docs');   // /users/alice/docs
path.basename('/users/alice/file.txt'); // file.txt
path.extname('readme.md');              // .md
path.resolve('src', 'index.js');       // absolute path
\`\`\`

### The os Module
\`\`\`javascript
const os = require('os');

os.platform();   // 'linux', 'darwin', 'win32'
os.cpus().length; // number of CPU cores
os.freemem();    // free memory in bytes
os.homedir();    // /home/alice
\`\`\``,
        order: 2,
      },
      {
        title: 'Callbacks, Promises, and Async/Await',
        content: `## Asynchronous JavaScript in Node.js

Node.js is non-blocking — operations like reading files or querying a database happen asynchronously.

### The Problem with Callbacks (Callback Hell)
\`\`\`javascript
fs.readFile('a.txt', 'utf8', (err, dataA) => {
  fs.readFile('b.txt', 'utf8', (err, dataB) => {
    fs.readFile('c.txt', 'utf8', (err, dataC) => {
      // deeply nested — hard to read and maintain
      console.log(dataA + dataB + dataC);
    });
  });
});
\`\`\`

### Promises — Cleaner Approach
\`\`\`javascript
const fs = require('fs').promises;

fs.readFile('a.txt', 'utf8')
  .then(data => {
    console.log('File content:', data);
    return fs.readFile('b.txt', 'utf8');
  })
  .then(data2 => console.log('Second file:', data2))
  .catch(err => console.error('Error:', err));
\`\`\`

### Async/Await — Best Practice
\`\`\`javascript
const fs = require('fs').promises;

async function readFiles() {
  try {
    const [dataA, dataB] = await Promise.all([
      fs.readFile('a.txt', 'utf8'),
      fs.readFile('b.txt', 'utf8'),
    ]);
    console.log(dataA, dataB);
  } catch (err) {
    console.error('Failed to read files:', err.message);
  }
}

readFiles();
\`\`\`

### EventEmitter
\`\`\`javascript
const EventEmitter = require('events');

class LearningTracker extends EventEmitter {}
const tracker = new LearningTracker();

tracker.on('topicCompleted', (topic) => {
  console.log(\`Completed: \${topic}\`);
});

tracker.emit('topicCompleted', 'Node.js Basics');
\`\`\``,
        order: 3,
      },
      {
        title: 'Your First HTTP Server',
        content: `## Building an HTTP Server with Node.js

### Using the Built-in http Module
\`\`\`javascript
const http = require('http');

const server = http.createServer((req, res) => {
  // req = incoming request, res = outgoing response

  // Set response headers
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;

  // Route handling
  if (req.url === '/' && req.method === 'GET') {
    res.end(JSON.stringify({ message: 'Welcome to my API!' }));
  } else if (req.url === '/about') {
    res.end(JSON.stringify({ app: 'Learning Path API', version: '1.0' }));
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Route not found' }));
  }
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
\`\`\`

### Parsing Request Body
\`\`\`javascript
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/data') {
    let body = '';

    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      const parsed = JSON.parse(body);
      console.log('Received:', parsed);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ received: true, data: parsed }));
    });
  }
});

server.listen(3000);
\`\`\`

### Why We Use Express Instead
The built-in http module requires manual routing, body parsing, and header management. Express automates all of this — you will learn Express in the next course.`,
        order: 4,
      },
      {
        title: 'Streams and Zlib Compression',
        content: `## Streams in Node.js

Streams process data in chunks rather than loading everything into memory — essential for large files.

### Types of Streams
- **Readable** — source of data (file read, HTTP request)
- **Writable** — destination (file write, HTTP response)
- **Transform** — modifies data as it passes through (compression)

### Piping Streams
\`\`\`javascript
const fs = require('fs');

// Copy a large file efficiently
const readStream = fs.createReadStream('large-input.txt');
const writeStream = fs.createWriteStream('output.txt');

readStream.pipe(writeStream);

writeStream.on('finish', () => {
  console.log('File copied successfully!');
});
\`\`\`

### Compressing Files with Zlib
\`\`\`javascript
const fs = require('fs');
const zlib = require('zlib');

// Compress a file
const input = fs.createReadStream('data.txt');
const output = fs.createWriteStream('data.txt.gz');
const gzip = zlib.createGzip();

input.pipe(gzip).pipe(output);
output.on('finish', () => console.log('Compressed!'));

// Decompress a file
const compressed = fs.createReadStream('data.txt.gz');
const decompressed = fs.createWriteStream('data-restored.txt');
const gunzip = zlib.createGunzip();

compressed.pipe(gunzip).pipe(decompressed);
\`\`\`

### Real-World Use: Streaming JSON Data
\`\`\`javascript
const fs = require('fs');
const { Transform } = require('stream');

const upperCaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  }
});

fs.createReadStream('input.txt')
  .pipe(upperCaseTransform)
  .pipe(fs.createWriteStream('upper.txt'));
\`\`\``,
        order: 5,
      },
    ],
    quizzes: [
      {
        topicIndex: 0,
        questions: [
          {
            text: 'What command creates a new package.json file with default values?',
            options: ['npm create', 'npm init -y', 'npm start', 'node init'],
            correctAnswer: 1,
          },
          {
            text: 'What is the correct way to import the built-in "path" module in Node.js?',
            options: [
              'import path from "path"',
              'const path = require("path")',
              'const path = import("path")',
              'include("path")',
            ],
            correctAnswer: 1,
          },
          {
            text: 'Which file defines all dependencies and scripts for a Node.js project?',
            options: ['index.js', 'node_modules/', 'package.json', '.env'],
            correctAnswer: 2,
          },
          {
            text: 'What does "module.exports" do in Node.js?',
            options: [
              'Imports a module from npm',
              'Makes functions or values available to other files',
              'Runs the current module as a script',
              'Exports the entire node_modules folder',
            ],
            correctAnswer: 1,
          },
          {
            text: 'Which flag installs a package as a dev dependency?',
            options: ['-g', '--save', '-D', '--prod'],
            correctAnswer: 2,
          },
        ],
      },
      {
        topicIndex: 1,
        questions: [
          {
            text: 'Which fs method reads a file without blocking the event loop?',
            options: ['fs.readFileSync()', 'fs.readFile()', 'fs.openFile()', 'fs.loadFile()'],
            correctAnswer: 1,
          },
          {
            text: 'What does path.join() do?',
            options: [
              'Merges two arrays',
              'Combines path segments using the OS separator',
              'Reads a file at the given path',
              'Validates whether a path exists',
            ],
            correctAnswer: 1,
          },
          {
            text: 'What is the output of path.extname("server.js")?',
            options: ['server', '.js', 'server.js', 'js'],
            correctAnswer: 1,
          },
          {
            text: 'Which method writes data to a file synchronously?',
            options: ['fs.writeFile()', 'fs.writeFileSync()', 'fs.save()', 'fs.output()'],
            correctAnswer: 1,
          },
          {
            text: 'What does JSON.parse() return when given a valid JSON string?',
            options: ['A string', 'A JavaScript object or array', 'A Buffer', 'A file path'],
            correctAnswer: 1,
          },
        ],
      },
      {
        topicIndex: 2,
        questions: [
          {
            text: 'What is the main advantage of async/await over callbacks?',
            options: [
              'It runs code faster',
              'It makes asynchronous code look synchronous and easier to read',
              'It prevents all errors from occurring',
              'It creates multiple threads',
            ],
            correctAnswer: 1,
          },
          {
            text: 'What does Promise.all() do?',
            options: [
              'Runs promises one after another',
              'Cancels all pending promises',
              'Waits for all promises to resolve and returns all results',
              'Returns only the first resolved promise',
            ],
            correctAnswer: 2,
          },
          {
            text: 'Where should you write error-handling code when using async/await?',
            options: ['.catch()', 'try/catch block', 'finally block', '.then()'],
            correctAnswer: 1,
          },
          {
            text: 'What does EventEmitter.emit() do?',
            options: [
              'Removes an event listener',
              'Triggers an event and calls all registered listeners',
              'Creates a new EventEmitter instance',
              'Logs an event to the console',
            ],
            correctAnswer: 1,
          },
          {
            text: 'Which keyword makes a function return a Promise automatically?',
            options: ['await', 'async', 'promise', 'resolve'],
            correctAnswer: 1,
          },
        ],
      },
      {
        topicIndex: 3,
        questions: [
          {
            text: 'Which Node.js module is used to create a basic HTTP server?',
            options: ['net', 'https', 'http', 'server'],
            correctAnswer: 2,
          },
          {
            text: 'How do you set the HTTP status code in a Node.js response?',
            options: [
              'res.setStatus(200)',
              'res.statusCode = 200',
              'res.code(200)',
              'res.status = 200',
            ],
            correctAnswer: 1,
          },
          {
            text: 'How do you read the body of an incoming POST request in raw Node.js?',
            options: [
              'req.body',
              'req.read()',
              'Listening to "data" and "end" events on req',
              'JSON.parse(req)',
            ],
            correctAnswer: 2,
          },
          {
            text: 'What does server.listen(3000) do?',
            options: [
              'Connects to a remote server on port 3000',
              'Starts the server and listens for connections on port 3000',
              'Sends a request to port 3000',
              'Closes all connections on port 3000',
            ],
            correctAnswer: 1,
          },
          {
            text: 'What header should you set when returning JSON from an HTTP server?',
            options: [
              'Content-Type: text/plain',
              'Content-Type: application/json',
              'Accept: application/json',
              'Authorization: Bearer json',
            ],
            correctAnswer: 1,
          },
        ],
      },
      {
        topicIndex: 4,
        questions: [
          {
            text: 'What is the main benefit of using streams over reading a full file into memory?',
            options: [
              'Streams are always faster',
              'Streams process data in chunks, reducing memory usage for large files',
              'Streams work without Node.js',
              'Streams automatically compress data',
            ],
            correctAnswer: 1,
          },
          {
            text: 'What does readStream.pipe(writeStream) do?',
            options: [
              'Copies a file synchronously',
              'Connects readable output directly to a writable input',
              'Compresses and writes a file',
              'Creates a duplex stream',
            ],
            correctAnswer: 1,
          },
          {
            text: 'Which zlib method is used to compress data into gzip format?',
            options: ['zlib.createDeflate()', 'zlib.createGzip()', 'zlib.createCompress()', 'zlib.gzip()'],
            correctAnswer: 1,
          },
          {
            text: 'What type of stream both reads and transforms data?',
            options: ['Readable', 'Writable', 'Transform', 'Duplex'],
            correctAnswer: 2,
          },
          {
            text: 'Which event fires when a readable stream has no more data to deliver?',
            options: ['"close"', '"finish"', '"end"', '"done"'],
            correctAnswer: 2,
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  //  INTERMEDIATE COURSE  —  Express.js and REST APIs
  // ──────────────────────────────────────────────────────────────────────
  {
    course: {
      title: 'Express.js and REST APIs',
      description: 'Build professional REST APIs with Express — covering routing, middleware, authentication with JWT, input validation, error handling, and session management.',
      level: 'intermediate',
    },
    topics: [
      {
        title: 'Getting Started with Express.js',
        content: `## Express.js — Fast, Unopinionated Web Framework

Express wraps Node's http module and provides clean routing, middleware, and request handling.

### Installation and Setup
\`\`\`bash
npm install express dotenv cors
\`\`\`

### Basic Express App
\`\`\`javascript
const express = require('express');
const app = express();

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

app.listen(5000, () => console.log('Server on port 5000'));
\`\`\`

### Route Methods and Parameters
\`\`\`javascript
// Route parameters
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  res.json({ userId: id });
});

// Query strings: /search?q=node&page=2
app.get('/search', (req, res) => {
  const { q, page = 1 } = req.query;
  res.json({ query: q, page: Number(page) });
});

// POST with body
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  res.status(201).json({ created: { name, email } });
});

// PUT — full update
app.put('/users/:id', (req, res) => {
  res.json({ updated: req.params.id });
});

// DELETE
app.delete('/users/:id', (req, res) => {
  res.json({ deleted: req.params.id });
});
\`\`\`

### express.Router — Organising Routes
\`\`\`javascript
// routes/user.routes.js
const router = require('express').Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;

// server.js
app.use('/api/users', require('./routes/user.routes'));
\`\`\``,
        order: 1,
      },
      {
        title: 'Middleware and Request Validation',
        content: `## Middleware in Express

Middleware functions run between receiving a request and sending a response. They have access to req, res, and next.

### Anatomy of Middleware
\`\`\`javascript
function logger(req, res, next) {
  console.log(\`[\${new Date().toISOString()}] \${req.method} \${req.url}\`);
  next(); // MUST call next() or the request hangs
}

app.use(logger); // apply globally
app.get('/private', logger, handler); // apply to one route
\`\`\`

### Built-in and Third-party Middleware
\`\`\`javascript
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser());
app.use(express.json());
\`\`\`

### Input Validation with express-validator
\`\`\`javascript
const { body, validationResult } = require('express-validator');

// Validation rules
const registerRules = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};

// Usage in route
router.post('/register', registerRules, validate, registerController);
\`\`\`

### Session Management
\`\`\`javascript
const session = require('express-session');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
}));

// Using sessions
app.post('/login', (req, res) => {
  req.session.userId = user._id;
  res.json({ message: 'Logged in' });
});

app.get('/profile', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Not logged in' });
  res.json({ userId: req.session.userId });
});
\`\`\``,
        order: 2,
      },
      {
        title: 'JWT Authentication and RBAC',
        content: `## Authentication with JSON Web Tokens

### How JWT Works
1. User logs in with email + password
2. Server validates credentials and signs a JWT with a secret
3. Client stores the JWT (localStorage or httpOnly cookie)
4. Client sends JWT in every subsequent request header
5. Server verifies the JWT on protected routes

### Signing and Verifying JWTs
\`\`\`javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Generate token
function generateToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Register
async function register(req, res) {
  const { name, email, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });
  const token = generateToken(user._id);
  res.status(201).json({ token, user: { id: user._id, name, email } });
}

// Login
async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

  res.json({ token: generateToken(user._id) });
}
\`\`\`

### Auth Middleware
\`\`\`javascript
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, iat, exp }
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
\`\`\`

### RBAC — Role Based Access Control
\`\`\`javascript
// Role middleware factory
const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  next();
};

// Usage
router.delete('/users/:id', authMiddleware, requireRole('admin'), deleteUser);
router.get('/reports', authMiddleware, requireRole('admin', 'instructor'), getReports);
\`\`\``,
        order: 3,
      },
      {
        title: 'Error Handling and API Design',
        content: `## Professional Error Handling in Express

### Global Error Handler
\`\`\`javascript
// Always register LAST in server.js — 4 parameters
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});
\`\`\`

### Custom Error Class
\`\`\`javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Usage in controllers
throw new AppError('Course not found', 404);
throw new AppError('Email already registered', 409);
\`\`\`

### asyncHandler — No More Try/Catch
\`\`\`javascript
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Usage — errors auto-forwarded to global handler
router.get('/courses', asyncHandler(async (req, res) => {
  const courses = await Course.find();
  res.json({ success: true, data: courses });
}));
\`\`\`

### Consistent API Response Shape
\`\`\`javascript
// Always return this structure
// Success:  { success: true,  data: { ... } }
// Error:    { success: false, message: "..." }

const sendSuccess = (res, data, statusCode = 200) =>
  res.status(statusCode).json({ success: true, data });

const sendError = (res, message, statusCode = 400) =>
  res.status(statusCode).json({ success: false, message });
\`\`\`

### Security Headers with Helmet
\`\`\`javascript
const helmet = require('helmet');
app.use(helmet()); // sets 11 security headers automatically

// Rate limiting to prevent brute force
const rateLimit = require('express-rate-limit');
app.use('/api/auth', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { error: 'Too many requests, slow down' },
}));
\`\`\``,
        order: 4,
      },
      {
        title: 'WebSockets and Real-time with Socket.IO',
        content: `## Real-Time Communication with Socket.IO

HTTP is request-response — the client must ask. WebSockets hold a persistent connection so the server can push data anytime.

### Setup
\`\`\`bash
npm install socket.io
\`\`\`

\`\`\`javascript
// server.js
const http = require('http');
const { Server } = require('socket.io');
const express = require('express');

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:3000' }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

httpServer.listen(5000);
\`\`\`

### Real-Time Learning Path Updates
\`\`\`javascript
io.on('connection', (socket) => {
  // Student joins their personal room
  socket.on('joinRoom', (userId) => {
    socket.join(\`user:\${userId}\`);
    console.log(\`User \${userId} joined their room\`);
  });
});

// In quiz.controller.js — emit after path adjustment
async function submitQuiz(req, res) {
  // ... score quiz, update progress, adjust path ...

  // Notify the student in real-time
  req.app.get('io').to(\`user:\${userId}\`).emit('pathUpdated', {
    message: passed ? 'Great job! Moving to the next topic.' : 'Let us review this topic.',
    newPath: updatedPath,
  });

  res.json({ success: true, data: { score, passed } });
}
\`\`\`

### Frontend — Receiving Real-Time Events
\`\`\`javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

socket.on('connect', () => {
  socket.emit('joinRoom', userId);
});

socket.on('pathUpdated', (data) => {
  console.log(data.message);
  // Update React state to show new path
  setLearningPath(data.newPath);
});
\`\`\``,
        order: 5,
      },
    ],
    quizzes: [
      {
        topicIndex: 0,
        questions: [
          {
            text: 'What does app.use(express.json()) do?',
            options: [
              'Converts all responses to JSON',
              'Parses incoming JSON request bodies and puts them on req.body',
              'Validates JSON schema for all routes',
              'Enables CORS for JSON requests',
            ],
            correctAnswer: 1,
          },
          {
            text: 'How do you access a route parameter ":userId" in Express?',
            options: ['req.query.userId', 'req.params.userId', 'req.body.userId', 'req.id'],
            correctAnswer: 1,
          },
          {
            text: 'What is express.Router() used for?',
            options: [
              'To redirect requests to another server',
              'To group related routes into a modular, mountable handler',
              'To create a new Express application',
              'To serve static files',
            ],
            correctAnswer: 1,
          },
          {
            text: 'What status code should a successful resource creation return?',
            options: ['200', '201', '204', '301'],
            correctAnswer: 1,
          },
          {
            text: 'How do you access query parameters from /search?q=hello in Express?',
            options: ['req.params.q', 'req.body.q', 'req.query.q', 'req.url.q'],
            correctAnswer: 2,
          },
        ],
      },
      {
        topicIndex: 1,
        questions: [
          {
            text: 'What happens if a middleware does NOT call next()?',
            options: [
              'The request automatically continues to the next handler',
              'The request hangs and never receives a response',
              'An error is thrown automatically',
              'Express skips to the error handler',
            ],
            correctAnswer: 1,
          },
          {
            text: 'Which package is used for request body validation in Express routes?',
            options: ['body-parser', 'joi', 'express-validator', 'yup'],
            correctAnswer: 2,
          },
          {
            text: 'What does validationResult(req).isEmpty() return when validation passes?',
            options: ['false', 'null', 'true', 'undefined'],
            correctAnswer: 2,
          },
          {
            text: 'What does the cookieParser middleware do?',
            options: [
              'Creates cookies automatically for each request',
              'Parses Cookie headers and populates req.cookies',
              'Encrypts all cookies',
              'Validates cookie expiration dates',
            ],
            correctAnswer: 1,
          },
          {
            text: 'Which express-session option prevents creating a session for unauthenticated visitors?',
            options: ['resave: false', 'saveUninitialized: false', 'secure: true', 'httpOnly: true'],
            correctAnswer: 1,
          },
        ],
      },
      {
        topicIndex: 2,
        questions: [
          {
            text: 'What does bcrypt.hash(password, 10) do?',
            options: [
              'Encrypts the password using AES with 10 rounds',
              'Hashes the password with a salt factor of 10',
              'Stores the password with 10-character truncation',
              'Validates the password against 10 common patterns',
            ],
            correctAnswer: 1,
          },
          {
            text: 'Where should a JWT be sent by the client on subsequent requests?',
            options: [
              'In the URL as a query parameter',
              'In the request body',
              'In the Authorization header as "Bearer <token>"',
              'In a custom "JWT" header',
            ],
            correctAnswer: 2,
          },
          {
            text: 'What does jwt.verify() throw if the token has expired?',
            options: ['SyntaxError', 'TokenExpiredError', 'AuthError', 'ValidationError'],
            correctAnswer: 1,
          },
          {
            text: 'In RBAC, what does the "requireRole" middleware check?',
            options: [
              'Whether the user is logged in',
              'Whether the authenticated user has one of the allowed roles',
              'Whether the route exists',
              'Whether the request has a valid Content-Type',
            ],
            correctAnswer: 1,
          },
          {
            text: 'Why should you never store plain-text passwords in a database?',
            options: [
              'Plain text passwords take more storage space',
              'If the database is breached, all user passwords are exposed',
              'Databases cannot store strings over 50 characters',
              'Plain text cannot be compared with ===',
            ],
            correctAnswer: 1,
          },
        ],
      },
      {
        topicIndex: 3,
        questions: [
          {
            text: 'How many parameters does a global Express error handler have?',
            options: ['2', '3', '4', '5'],
            correctAnswer: 2,
          },
          {
            text: 'What does the asyncHandler utility do?',
            options: [
              'Makes routes run asynchronously',
              'Wraps async functions to automatically pass errors to next()',
              'Converts callbacks to promises',
              'Validates async middleware chains',
            ],
            correctAnswer: 1,
          },
          {
            text: 'What status code should a "resource not found" error return?',
            options: ['400', '401', '403', '404'],
            correctAnswer: 3,
          },
          {
            text: 'What does helmet() do in an Express app?',
            options: [
              'Adds request rate limiting',
              'Compresses HTTP responses',
              'Sets various security-related HTTP response headers',
              'Validates SSL certificates',
            ],
            correctAnswer: 2,
          },
          {
            text: 'What is the correct status code for a successful DELETE operation?',
            options: ['200 or 204', '201', '301', '404'],
            correctAnswer: 0,
          },
        ],
      },
      {
        topicIndex: 4,
        questions: [
          {
            text: 'What is the main difference between HTTP and WebSocket communication?',
            options: [
              'HTTP is faster than WebSocket',
              'WebSocket maintains a persistent two-way connection; HTTP is request-response',
              'WebSocket only works in browsers',
              'HTTP supports JSON but WebSocket does not',
            ],
            correctAnswer: 1,
          },
          {
            text: 'What does socket.join(roomName) do in Socket.IO?',
            options: [
              'Connects to a remote Socket.IO server',
              'Adds the socket to a named room for targeted broadcasting',
              'Authenticates the socket connection',
              'Creates a new namespace',
            ],
            correctAnswer: 1,
          },
          {
            text: 'How do you emit an event to all sockets in a specific room?',
            options: [
              'io.emit("event", data)',
              'socket.broadcast.emit("event", data)',
              'io.to(roomName).emit("event", data)',
              'socket.to(roomName).send(data)',
            ],
            correctAnswer: 2,
          },
          {
            text: 'Which event fires when a client disconnects from Socket.IO?',
            options: ['"close"', '"end"', '"disconnect"', '"leave"'],
            correctAnswer: 2,
          },
          {
            text: 'What must you use instead of http.listen() when integrating Socket.IO?',
            options: [
              'express.listen()',
              'A Node.js http.createServer() wrapped around the Express app',
              'socket.listen()',
              'io.attach()',
            ],
            correctAnswer: 1,
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  //  ADVANCED COURSE  —  MongoDB, Mongoose, and System Design
  // ──────────────────────────────────────────────────────────────────────
  {
    course: {
      title: 'MongoDB, Mongoose, and System Design',
      description: 'Master MongoDB schema design, Mongoose advanced queries, aggregation pipelines, pagination, indexing, and full REST API deployment. Designed for developers who are comfortable with Node.js and Express.',
      level: 'advanced',
    },
    topics: [
      {
        title: 'MongoDB Schema Design and Mongoose Models',
        content: `## Designing MongoDB Schemas with Mongoose

### When to Embed vs Reference
**Embed** when data is always accessed together and has a 1:few relationship:
\`\`\`javascript
// Embedded — quiz questions always loaded with the quiz
const QuizSchema = new mongoose.Schema({
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
  questions: [{
    text: { type: String, required: true },
    options: { type: [String], validate: v => v.length === 4 },
    correctAnswer: { type: Number, min: 0, max: 3 },
  }],
});
\`\`\`

**Reference** when data is accessed independently or has a 1:many relationship:
\`\`\`javascript
// Referenced — topics exist independently of courses
const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
  topics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }],
});
\`\`\`

### Schema Validation and Middleware Hooks
\`\`\`javascript
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/, 'Invalid email'],
  },
  passwordHash: String,
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  next();
});

// Instance method
UserSchema.methods.comparePassword = async function (plainText) {
  return bcrypt.compare(plainText, this.passwordHash);
};

// Virtual field
UserSchema.virtual('displayName').get(function () {
  return this.name.split(' ')[0];
});
\`\`\``,
        order: 1,
      },
      {
        title: 'CRUD Operations and Population',
        content: `## Advanced Mongoose CRUD

### Create
\`\`\`javascript
// Single document
const course = await Course.create({ title: 'Node.js', level: 'beginner' });

// Multiple documents
await Topic.insertMany([
  { title: 'Variables', order: 1, courseId: course._id },
  { title: 'Functions', order: 2, courseId: course._id },
]);
\`\`\`

### Read with Population
\`\`\`javascript
// Populate nested references
const course = await Course.findById(id)
  .populate('topics', 'title order content')  // select specific fields
  .lean(); // returns plain JS object instead of Mongoose doc (faster)

// Deep population
const path = await LearningPath.findOne({ userId })
  .populate({
    path: 'items.topicId',
    select: 'title order',
    populate: { path: 'courseId', select: 'title level' }
  });
\`\`\`

### Update
\`\`\`javascript
// findByIdAndUpdate — returns updated doc with { new: true }
const user = await User.findByIdAndUpdate(
  id,
  { level: 'intermediate' },
  { new: true, runValidators: true }
);

// Upsert — create if not exists
await Progress.findOneAndUpdate(
  { userId, topicId },           // filter
  { score, passed, completedAt: new Date() }, // update
  { upsert: true, new: true }    // options
);

// Update many at once
await LearningPath.updateMany(
  { 'items.topicId': topicId },
  { $set: { 'items.$.status': 'completed' } }
);
\`\`\`

### Delete
\`\`\`javascript
await Course.findByIdAndDelete(id);
await Progress.deleteMany({ userId }); // clean up on account deletion
\`\`\`

### Transactions (for critical operations)
\`\`\`javascript
const session = await mongoose.startSession();
session.startTransaction();
try {
  await Enrollment.create([{ userId, courseId }], { session });
  await LearningPath.create([{ userId, items }], { session });
  await session.commitTransaction();
} catch (err) {
  await session.abortTransaction();
  throw err;
} finally {
  session.endSession();
}
\`\`\``,
        order: 2,
      },
      {
        title: 'Aggregation Pipelines and Pagination',
        content: `## MongoDB Aggregation

Aggregation pipelines transform and analyse data across documents — more powerful than simple queries.

### Core Pipeline Stages
\`\`\`javascript
// Get course completion statistics per user
const stats = await Progress.aggregate([
  { $match: { userId: mongoose.Types.ObjectId(userId) } },      // filter
  { $lookup: {                                                     // join
      from: 'topics',
      localField: 'topicId',
      foreignField: '_id',
      as: 'topic',
  }},
  { $unwind: '$topic' },                                         // flatten array
  { $group: {                                                     // group + count
      _id: '$topic.courseId',
      totalCompleted: { $sum: 1 },
      averageScore: { $avg: '$score' },
      passed: { $sum: { $cond: ['$passed', 1, 0] } },
  }},
  { $sort: { totalCompleted: -1 } },                            // sort
  { $project: { _id: 1, totalCompleted: 1, averageScore: { $round: ['$averageScore', 1] } } },
]);
\`\`\`

### Pagination — Cursor-Based (Production)
\`\`\`javascript
async function getCourses(req, res) {
  const { page = 1, limit = 10, level } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const filter = level ? { level } : {};

  const [courses, total] = await Promise.all([
    Course.find(filter)
      .populate('topics', 'title order')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Course.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: {
      courses,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    },
  });
}
\`\`\`

### Indexing for Performance
\`\`\`javascript
// Compound index — speeds up common query patterns
ProgressSchema.index({ userId: 1, topicId: 1 }, { unique: true });
EnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true });
TopicSchema.index({ courseId: 1, order: 1 });
\`\`\``,
        order: 3,
      },
      {
        title: 'The Path Engine — Adaptive Learning Algorithm',
        content: `## Building the Core Algorithm

The path engine is the brain of the system. It reads quiz performance and adjusts the learning path dynamically.

### Algorithm Design
\`\`\`
Score ≥ 70% (PASS)     → Mark topic COMPLETED, unlock NEXT topic
Score 40–69% (PARTIAL) → Keep current topic as CURRENT (retry)
Score < 40% (FAIL)     → Insert remedial content before retrying
\`\`\`

### Implementation
\`\`\`javascript
const { PASS_THRESHOLD, REMEDIAL_THRESHOLD, TOPIC_STATUS } = require('../utils/constants');

async function adjustPath(userId, topicId, percentage) {
  const path = await LearningPath.findOne({ userId });
  if (!path) throw new AppError('Learning path not found', 404);

  const currentIndex = path.items.findIndex(
    item => item.topicId.toString() === topicId.toString()
  );

  if (currentIndex === -1) throw new AppError('Topic not in path', 400);

  if (percentage >= PASS_THRESHOLD) {
    // ADVANCE — complete current, unlock next
    path.items[currentIndex].status = TOPIC_STATUS.COMPLETED;

    const nextIndex = currentIndex + 1;
    if (nextIndex < path.items.length) {
      path.items[nextIndex].status = TOPIC_STATUS.CURRENT;
    }

  } else if (percentage < REMEDIAL_THRESHOLD) {
    // REMEDIATE — insert a review topic before the next attempt
    const remedialTopic = await findRemedialTopic(topicId);
    if (remedialTopic) {
      path.items.splice(currentIndex + 1, 0, {
        topicId: remedialTopic._id,
        order: path.items[currentIndex].order + 0.5,
        status: TOPIC_STATUS.CURRENT,
      });
    }
  }
  // else: RETRY — keep current topic as CURRENT (no change needed)

  path.markModified('items');
  await path.save();
  return path;
}
\`\`\`

### Level Progression
\`\`\`javascript
async function checkLevelUp(userId) {
  const path = await LearningPath.findOne({ userId });
  const allCompleted = path.items.every(i => i.status === TOPIC_STATUS.COMPLETED);

  if (allCompleted) {
    const user = await User.findById(userId);
    const levels = ['beginner', 'intermediate', 'advanced'];
    const currentIdx = levels.indexOf(user.level);

    if (currentIdx < levels.length - 1) {
      user.level = levels[currentIdx + 1];
      await user.save();
      // Generate new path for next level
      await generatePathForLevel(userId, user.level);
      return { leveledUp: true, newLevel: user.level };
    }
    return { completed: true, message: 'Congratulations! You have mastered all levels.' };
  }
  return { leveledUp: false };
}
\`\`\``,
        order: 4,
      },
      {
        title: 'Testing, Deployment, and API Versioning',
        content: `## Taking Your API to Production

### Testing REST APIs with Postman
Organise your Postman collection by resource:
\`\`\`
Learning Path API/
  Auth/
    POST Register
    POST Login
  Courses/
    GET All Courses
    GET Course by ID
  Enrollments/
    POST Enroll in Course
    GET My Enrollments
  Quiz/
    GET Assessment Quiz
    GET Topic Quiz
    POST Submit Quiz
  Progress/
    GET My Progress
  Learning Path/
    GET My Path
    POST Regenerate Path
\`\`\`

Use Postman environment variables:
- \`{{baseUrl}}\` = http://localhost:5000/api
- \`{{token}}\` = auto-set by login test script

### API Versioning
\`\`\`javascript
// server.js — version your API from day one
app.use('/api/v1/auth', require('./routes/v1/auth.routes'));
app.use('/api/v1/courses', require('./routes/v1/course.routes'));

// When you release v2 — old clients keep working
app.use('/api/v2/courses', require('./routes/v2/course.routes'));
\`\`\`

### Deployment with GitHub + Render
\`\`\`bash
# 1. Push to GitHub
git init && git add . && git commit -m "initial commit"
git remote add origin https://github.com/yourname/learning-path-api
git push -u origin main

# 2. On Render.com
# - Connect your GitHub repo
# - Build command: npm install
# - Start command: node server.js
# - Add environment variables: MONGO_URI, JWT_SECRET, PORT

# 3. Your API is live at:
# https://learning-path-api.onrender.com/api/v1
\`\`\`

### Environment Configuration
\`\`\`javascript
// config/env.js — validate all env vars on startup
const required = ['MONGO_URI', 'JWT_SECRET', 'PORT'];
required.forEach(key => {
  if (!process.env[key]) {
    console.error(\`FATAL: Missing environment variable: \${key}\`);
    process.exit(1);
  }
});
\`\`\``,
        order: 5,
      },
    ],
    quizzes: [
      {
        topicIndex: 0,
        questions: [
          {
            text: 'When should you use embedding instead of referencing in MongoDB?',
            options: [
              'When the related data is large and accessed independently',
              'When the data is always read together and the relationship is 1:few',
              'When you need SQL-style joins',
              'When documents exceed 16MB',
            ],
            correctAnswer: 1,
          },
          {
            text: 'What does a Mongoose "pre save" hook do?',
            options: [
              'Runs after a document is saved to the database',
              'Validates the document before schema rules run',
              'Runs code just before the save operation completes',
              'Creates an index on the saved field',
            ],
            correctAnswer: 2,
          },
          {
            text: 'What does UserSchema.methods.myMethod = function(){} add?',
            options: [
              'A static method callable on the Model class',
              'An instance method callable on individual documents',
              'A virtual getter property',
              'A pre-save middleware hook',
            ],
            correctAnswer: 1,
          },
          {
            text: 'What is the benefit of calling .lean() on a Mongoose query?',
            options: [
              'It reduces database storage size',
              'It returns a plain JavaScript object instead of a full Mongoose document, improving performance',
              'It automatically populates all references',
              'It enables pagination automatically',
            ],
            correctAnswer: 1,
          },
          {
            text: 'What does the { timestamps: true } option add to a Mongoose schema?',
            options: [
              'A "version" field tracking the number of updates',
              'Automatic "createdAt" and "updatedAt" date fields',
              'A TTL index that expires old documents',
              'Millisecond precision on all date fields',
            ],
            correctAnswer: 1,
          },
        ],
      },
      {
        topicIndex: 1,
        questions: [
          {
            text: 'What does Model.findOneAndUpdate() with { upsert: true } do?',
            options: [
              'Updates the first match, or creates a new document if none found',
              'Updates all matching documents',
              'Finds one document and deletes it',
              'Updates the document only if it already exists',
            ],
            correctAnswer: 0,
          },
          {
            text: 'What does Model.populate() do in Mongoose?',
            options: [
              'Inserts multiple documents at once',
              'Replaces ObjectId references with the actual referenced documents',
              'Creates indexes on reference fields',
              'Validates that referenced documents exist',
            ],
            correctAnswer: 1,
          },
          {
            text: 'When using Mongoose transactions, what must you pass to operations inside the transaction?',
            options: ['The transaction ID', 'The session object', 'A callback function', 'The connection string'],
            correctAnswer: 1,
          },
          {
            text: 'What does the { new: true } option do in findByIdAndUpdate()?',
            options: [
              'Creates a new document if none is found',
              'Returns the document as it was before the update',
              'Returns the updated document instead of the original',
              'Prevents overwriting existing fields',
            ],
            correctAnswer: 2,
          },
          {
            text: 'Which method efficiently inserts multiple documents in one operation?',
            options: [
              'Model.create() called multiple times',
              'Model.insertMany()',
              'Model.save() in a loop',
              'Model.bulkWrite()',
            ],
            correctAnswer: 1,
          },
        ],
      },
      {
        topicIndex: 2,
        questions: [
          {
            text: 'Which aggregation stage is equivalent to SQL\'s WHERE clause?',
            options: ['$project', '$group', '$match', '$filter'],
            correctAnswer: 2,
          },
          {
            text: 'What does the $lookup aggregation stage do?',
            options: [
              'Searches text fields for a keyword',
              'Performs a left outer join with another collection',
              'Looks up an index for faster queries',
              'Finds documents matching a filter',
            ],
            correctAnswer: 1,
          },
          {
            text: 'In server-side pagination, how do you calculate the number of documents to skip for page 3 with 10 items per page?',
            options: ['skip(3)', 'skip(20)', 'skip(30)', 'skip(10)'],
            correctAnswer: 1,
          },
          {
            text: 'What is the main purpose of adding a compound index like { userId: 1, topicId: 1 }?',
            options: [
              'It enforces that userId and topicId are both required fields',
              'It speeds up queries that filter on both userId and topicId together',
              'It automatically populates the referenced documents',
              'It creates a foreign key constraint',
            ],
            correctAnswer: 1,
          },
          {
            text: 'What does $unwind do in an aggregation pipeline?',
            options: [
              'Reverses the sort order of results',
              'Deconstructs an array field so each array element becomes its own document',
              'Removes null fields from documents',
              'Flattens nested embedded objects',
            ],
            correctAnswer: 1,
          },
        ],
      },
      {
        topicIndex: 3,
        questions: [
          {
            text: 'In the path engine, what happens when a student scores exactly 70% on a quiz?',
            options: [
              'The topic is marked for retry',
              'A remedial topic is inserted',
              'The topic is marked completed and the next topic is unlocked',
              'The user level is decreased',
            ],
            correctAnswer: 2,
          },
          {
            text: 'What does path.markModified("items") do before saving?',
            options: [
              'Validates the items array against the schema',
              'Tells Mongoose that the nested "items" array was changed so it gets saved',
              'Creates an index on the items field',
              'Triggers the pre-save hook for each item',
            ],
            correctAnswer: 1,
          },
          {
            text: 'Which TOPIC_STATUS value means the student can currently work on that topic?',
            options: ['LOCKED', 'PENDING', 'CURRENT', 'ACTIVE'],
            correctAnswer: 2,
          },
          {
            text: 'What should happen when a student completes ALL topics in their learning path?',
            options: [
              'The path is deleted and restarted',
              'Check if they can level up and generate a new path for the next level',
              'The system marks them as graduated with no further action',
              'All topics are reset to LOCKED status',
            ],
            correctAnswer: 1,
          },
          {
            text: 'Why is the remedial topic inserted at currentIndex + 1 rather than at the end of the path?',
            options: [
              'Because MongoDB arrays cannot be appended to',
              'So the student reviews the prerequisite material before reattempting the failed topic',
              'Because splice() does not support appending',
              'To preserve the original topic ordering',
            ],
            correctAnswer: 1,
          },
        ],
      },
      {
        topicIndex: 4,
        questions: [
          {
            text: 'What is the main benefit of API versioning (e.g., /api/v1/, /api/v2/)?',
            options: [
              'It makes URLs shorter',
              'It allows you to update the API without breaking existing clients',
              'It automatically handles authentication differently per version',
              'It doubles your API performance',
            ],
            correctAnswer: 1,
          },
          {
            text: 'In a Postman collection, what is an environment variable like {{baseUrl}} used for?',
            options: [
              'To store API responses for later',
              'To switch between development and production URLs without editing every request',
              'To authenticate with the server automatically',
              'To validate response schemas',
            ],
            correctAnswer: 1,
          },
          {
            text: 'Which start command should you use in Render.com for a Node.js production deployment?',
            options: ['npm run dev', 'nodemon server.js', 'node server.js', 'npm test'],
            correctAnswer: 2,
          },
          {
            text: 'Why should you validate required environment variables on application startup?',
            options: [
              'To improve query performance',
              'To fail fast with a clear error rather than crashing later with a confusing message',
              'To automatically generate .env.example files',
              'To prevent hot-reloading in development',
            ],
            correctAnswer: 1,
          },
          {
            text: 'What does process.exit(1) in Node.js indicate?',
            options: [
              'Successful program termination',
              'The process is paused for 1 second',
              'Abnormal termination — exiting due to an error',
              'The process was killed by the OS',
            ],
            correctAnswer: 2,
          },
        ],
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════
//  SEEDER RUNNER
// ═══════════════════════════════════════════════════════════════════════════
async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('\nConnected to MongoDB');
    console.log('URI:', MONGO_URI.replace(/:([^@]+)@/, ':****@'));

    // Clear existing data
    await Promise.all([
      Course.deleteMany({}),
      Topic.deleteMany({}),
      Quiz.deleteMany({}),
    ]);
    console.log('Cleared existing data\n');

    // Create assessment quiz
    const assessment = await Quiz.create(assessmentQuiz);
    console.log(`Assessment quiz created (${assessment.questions.length} questions)`);
    console.log('  Score < 40%  → beginner');
    console.log('  Score 40-74% → intermediate');
    console.log('  Score ≥ 75%  → advanced\n');

    let totalTopics = 0;
    let totalQuizzes = 0;

    // Create each course with its topics and quizzes
    for (const data of coursesData) {
      const course = await Course.create(data.course);
      console.log(`Course [${course.level.toUpperCase()}]: ${course.title}`);

      const createdTopics = [];
      for (const topicData of data.topics) {
        const topic = await Topic.create({ ...topicData, courseId: course._id });
        createdTopics.push(topic);
        totalTopics++;
      }

      for (const quizData of data.quizzes) {
        const topic = createdTopics[quizData.topicIndex];
        await Quiz.create({
          topicId: topic._id,
          isAssessment: false,
          questions: quizData.questions,
        });
        totalQuizzes++;
      }

      console.log(`  ${createdTopics.length} topics, ${data.quizzes.length} quizzes`);
      createdTopics.forEach(t => console.log(`    - ${t.title}`));
    }

    console.log('\n─────────────────────────────────────');
    console.log('Seed complete!');
    console.log(`  3 courses  (beginner / intermediate / advanced)`);
    console.log(`  ${totalTopics} topics  (5 per course)`);
    console.log(`  ${totalQuizzes} topic quizzes  (5 per course)`);
    console.log(`  1  assessment quiz (10 questions)`);
    console.log('─────────────────────────────────────\n');

    process.exit(0);
  } catch (err) {
    console.error('\nSeed failed:', err.message);
    if (err.code === 11000) {
      console.error('Duplicate key error — run "npm run seed" again to clear and re-seed');
    }
    process.exit(1);
  }
}

seed();
