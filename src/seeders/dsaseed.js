
// This file seeds the database with initial data for the DSA C++ track, including an assessment quiz and 3 courses with topics and quizzes.


// const assessmentQuiz = {
//   isAssessment: true,
//   questions: [
//     // ================= EASY =================
//     {
//       text: 'Which data structure follows LIFO (Last In First Out)?',
//       options: ['Queue', 'Stack', 'Linked List', 'Heap'],
//       correctAnswer: 1,
//       difficulty: 'beginner',
//       track: 'dsa-cpp'
//     },
//     {
//       text: 'Time complexity of accessing an element in an array by index?',
//       options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'],
//       correctAnswer: 2,
//       difficulty: 'beginner',
//       track: 'dsa-cpp'
//     },
//     {
//       text: 'Which data structure is used for BFS traversal?',
//       options: ['Stack', 'Queue', 'Priority Queue', 'Set'],
//       correctAnswer: 1,
//       difficulty: 'beginner',
//       track: 'dsa-cpp'
//     },

//     // ================= INTERMEDIATE =================
//     {
//       text: 'Time complexity of binary search on a sorted array?',
//       options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'],
//       correctAnswer: 2,
//       difficulty: 'intermediate',
//       track: 'dsa-cpp'
//     },
//     {
//       text: 'What is the average time complexity of QuickSort?',
//       options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
//       correctAnswer: 1,
//       difficulty: 'intermediate',
//       track: 'dsa-cpp'
//     },
//     {
//       text: 'In C++, what is the main advantage of using a reference over a pointer?',
//       options: ['Can be null', 'Cannot be reassigned and safer to use', 'Uses more memory', 'Faster execution always'],
//       correctAnswer: 1,
//       difficulty: 'intermediate',
//       track: 'dsa-cpp'
//     },
//     {
//       text: 'Which traversal of a Binary Search Tree gives sorted output?',
//       options: ['Preorder', 'Postorder', 'Inorder', 'Level order'],
//       correctAnswer: 2,
//       difficulty: 'intermediate',
//       track: 'dsa-cpp'
//     },

//     // ================= HARD =================
//     {
//       text: 'Worst-case time complexity of QuickSort?',
//       options: ['O(n log n)', 'O(n)', 'O(n²)', 'O(log n)'],
//       correctAnswer: 2,
//       difficulty: 'advanced',
//       track: 'dsa-cpp'
//     },
//     {
//       text: 'What is the time complexity of Dijkstra’s algorithm using a priority queue?',
//       options: ['O(V²)', 'O(V + E)', 'O((V + E) log V)', 'O(E²)'],
//       correctAnswer: 2,
//       difficulty: 'advanced',
//       track: 'dsa-cpp'
//     },
//     {
//       text: 'Which technique is used to optimize overlapping subproblems in recursion?',
//       options: ['Backtracking', 'Greedy', 'Memoization (Dynamic Programming)', 'Divide and Conquer'],
//       correctAnswer: 2,
//       difficulty: 'advanced',
//       track: 'dsa-cpp'
//     }
//   ],
// };






require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Course   = require('../models/Course.model');
const Topic    = require('../models/Topic.model');
const Quiz     = require('../models/Quiz.model');

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI || typeof MONGO_URI !== 'string') {
  console.error('Missing MONGO_URI. Ensure .env exists at project root (app/.env) and contains MONGO_URI=<mongodb-uri>.');
  process.exit(1);
}

// =====================================================================
//  ASSESSMENT QUIZ — 10 questions (5 nodejs + 5 dsa-cpp)
//  Track detection: whichever section student scores highest on
//  Level:  < 40% = beginner | 40-74% = intermediate | >= 75% = advanced
// =====================================================================
const assessmentQuiz = {
  isAssessment: true,
  questions: [
    // ================= EASY =================
    {
      text: 'Which data structure follows LIFO (Last In First Out)?',
      options: ['Queue', 'Stack', 'Linked List', 'Heap'],
      correctAnswer: 1,
      difficulty: 'beginner',
      track: 'dsa-cpp'
    },
    {
      text: 'Time complexity of accessing an element in an array by index?',
      options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'],
      correctAnswer: 2,
      difficulty: 'beginner',
      track: 'dsa-cpp'
    },
    {
      text: 'Which data structure is used for BFS traversal?',
      options: ['Stack', 'Queue', 'Priority Queue', 'Set'],
      correctAnswer: 1,
      difficulty: 'beginner',
      track: 'dsa-cpp'
    },

    // ================= INTERMEDIATE =================
    {
      text: 'Time complexity of binary search on a sorted array?',
      options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'],
      correctAnswer: 2,
      difficulty: 'intermediate',
      track: 'dsa-cpp'
    },
    {
      text: 'What is the average time complexity of QuickSort?',
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
      correctAnswer: 1,
      difficulty: 'intermediate',
      track: 'dsa-cpp'
    },
    {
      text: 'In C++, what is the main advantage of using a reference over a pointer?',
      options: ['Can be null', 'Cannot be reassigned and safer to use', 'Uses more memory', 'Faster execution always'],
      correctAnswer: 1,
      difficulty: 'intermediate',
      track: 'dsa-cpp'
    },
    {
      text: 'Which traversal of a Binary Search Tree gives sorted output?',
      options: ['Preorder', 'Postorder', 'Inorder', 'Level order'],
      correctAnswer: 2,
      difficulty: 'intermediate',
      track: 'dsa-cpp'
    },

    // ================= HARD =================
    {
      text: 'Worst-case time complexity of QuickSort?',
      options: ['O(n log n)', 'O(n)', 'O(n²)', 'O(log n)'],
      correctAnswer: 2,
      difficulty: 'advanced',
      track: 'dsa-cpp'
    },
    {
      text: 'What is the time complexity of Dijkstra’s algorithm using a priority queue?',
      options: ['O(V²)', 'O(V + E)', 'O((V + E) log V)', 'O(E²)'],
      correctAnswer: 2,
      difficulty: 'advanced',
      track: 'dsa-cpp'
    },
    {
      text: 'Which technique is used to optimize overlapping subproblems in recursion?',
      options: ['Backtracking', 'Greedy', 'Memoization (Dynamic Programming)', 'Divide and Conquer'],
      correctAnswer: 2,
      difficulty: 'advanced',
      track: 'dsa-cpp'
    }
  ],
};
// =====================================================================
//  DSA C++ TRACK — 3 COURSES
// =====================================================================
const dsaCppCourses = [

  // ==================================================================
  //  COURSE 1: C++ Programming Fundamentals — BEGINNER
  // ==================================================================
  {
    course: {
      title: 'C++ Programming Fundamentals',
      description: 'Build a solid C++ foundation — syntax, data types, pointers, memory management, OOP with classes and inheritance, the STL, and recursion. Essential before DSA.',
      level: 'beginner',
      track: 'dsa-cpp',
      tags: ['cpp', 'oop', 'stl', 'pointers', 'recursion'],
    },
    topics: [
      {
        title: 'C++ Syntax, Variables and Control Flow',
        order: 1, duration: 30,
        content: `## Getting Started with C++

C++ is a compiled, statically-typed language widely used in competitive programming, systems, and game development.

### Data Types and Variables
\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    // Primitive types
    int    age    = 21;
    double gpa    = 9.5;
    char   grade  = 'A';
    bool   passed = true;
    string name   = "Alice";   // requires <string>

    cout << "Name: " << name << ", Age: " << age << endl;

    // Constants
    const int MAX_SCORE = 100;
    const double PI     = 3.14159;

    // Auto — compiler infers type
    auto x = 42;       // int
    auto y = 3.14;     // double
    auto z = "hello";  // const char*
    return 0;
}
\`\`\`

### Input and Output
\`\`\`cpp
int n;
cin >> n;              // read integer

string s;
getline(cin, s);       // read full line including spaces

cout << "Value: " << n << "\n";
cout << fixed << setprecision(2) << 3.14159;  // 3.14
\`\`\`

### Conditionals and Loops
\`\`\`cpp
// if-else if-else
if (score >= 90)      cout << "A";
else if (score >= 70) cout << "B/C — passed";
else                  cout << "Failed";

// for loop
for (int i = 0; i < 10; i++) cout << i << " ";

// range-based for (C++11)
vector<int> v = {1, 2, 3, 4, 5};
for (int x : v) cout << x << " ";

// while loop
int count = 0;
while (count < 5) { cout << count++; }
\`\`\`

### Functions
\`\`\`cpp
// Regular function
int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);  // recursive
}

// Function overloading — same name, different params
int    add(int a, int b)       { return a + b; }
double add(double a, double b) { return a + b; }

// Default parameter
void greet(string name, string msg = "Hello") {
    cout << msg << ", " << name << "!\n";
}
\`\`\``,
      },
      {
        title: 'Pointers, References and Memory Management',
        order: 2, duration: 40,
        content: `## Pointers and References in C++

Understanding memory is essential for DSA — linked lists, trees, and graphs all use pointers.

### Pointers
\`\`\`cpp
int x = 10;

int* ptr = &x;        // ptr stores the memory address of x
cout << ptr;          // prints memory address e.g. 0x61ff08
cout << *ptr;         // dereference: prints 10 (value at address)
*ptr = 20;            // modifies x through the pointer
cout << x;            // prints 20

int* p = nullptr;     // safe null pointer (never leave uninitialized)
if (p == nullptr) cout << "Pointer is null";
\`\`\`

### References — alias for a variable
\`\`\`cpp
int x = 10;
int& ref = x;  // ref is another name for x — same memory location
ref = 30;      // x is now 30
cout << x;     // 30

// References in function parameters — avoids copying
void swap(int& a, int& b) {
    int temp = a; a = b; b = temp;
}
int m=5, n=8;
swap(m, n);  // m=8, n=5 — modifies originals
\`\`\`

### Dynamic Memory Allocation
\`\`\`cpp
// Allocate single value on heap
int* num = new int(42);
cout << *num;   // 42
delete num;     // MUST free — prevents memory leak

// Allocate array on heap
int* arr = new int[5];
for (int i = 0; i < 5; i++) arr[i] = i * 2;
delete[] arr;   // MUST use delete[] for arrays

// Modern C++ — smart pointers (auto-delete)
#include <memory>
unique_ptr<int> smart = make_unique<int>(42);
unique_ptr<int[]> smartArr = make_unique<int[]>(5);
// No need to delete — destructor handles cleanup
\`\`\`

### Pointer vs Reference
| Feature            | Pointer \`int* p\`  | Reference \`int& r\` |
|-------------------|---------------------|----------------------|
| Can be null        | Yes (nullptr)        | No                   |
| Can be reassigned  | Yes                  | No (always same)     |
| Syntax for access  | *p (dereference)    | r (direct)           |
| Primary use        | Dynamic memory       | Function params      |`,
      },
      {
        title: 'Object-Oriented Programming in C++',
        order: 3, duration: 40,
        content: `## OOP in C++

### Classes and Objects
\`\`\`cpp
class Student {
private:
    string name;
    int    score;

public:
    // Constructor with initialiser list (preferred)
    Student(string n, int s) : name(n), score(s) {}

    // Destructor — called when object is destroyed
    ~Student() {}

    // Getters (const — doesn't modify object)
    string getName()  const { return name; }
    int    getScore() const { return score; }

    // Method
    void display() const {
        cout << name << ": " << score << endl;
    }

    // Static method — belongs to class not instance
    static string schoolName() { return "Tech University"; }
};

Student alice("Alice", 95);
alice.display();                  // Alice: 95
cout << Student::schoolName();    // Tech University
\`\`\`

### Inheritance
\`\`\`cpp
class GradStudent : public Student {
    string thesis;
public:
    // Call parent constructor with : Student(n, s)
    GradStudent(string n, int s, string t) : Student(n, s), thesis(t) {}

    void display() const {        // override parent method
        Student::display();       // call parent version
        cout << "Thesis: " << thesis << endl;
    }
};

GradStudent bob("Bob", 88, "ML in Education");
bob.display();
\`\`\`

### Polymorphism — virtual functions
\`\`\`cpp
class Shape {
public:
    virtual double area() const = 0;   // pure virtual — MUST override
    virtual void print() const {
        cout << "Area: " << area() << endl;
    }
    virtual ~Shape() {}                // virtual destructor — essential!
};

class Circle : public Shape {
    double r;
public:
    Circle(double r) : r(r) {}
    double area() const override { return 3.14159 * r * r; }
};

class Rectangle : public Shape {
    double w, h;
public:
    Rectangle(double w, double h) : w(w), h(h) {}
    double area() const override { return w * h; }
};

// Runtime polymorphism — actual type decided at runtime
vector<Shape*> shapes = { new Circle(5), new Rectangle(3, 4) };
for (auto s : shapes) s->print();
// Always clean up: for (auto s : shapes) delete s;
\`\`\``,
      },
      {
        title: 'STL: Vectors, Maps, Sets and Algorithms',
        order: 4, duration: 35,
        content: `## Standard Template Library (STL)

The STL provides ready-made data structures and algorithms used in every C++ DSA solution.

### vector — dynamic array
\`\`\`cpp
#include <vector>
#include <algorithm>

vector<int> v = {5, 2, 8, 1, 9, 3};

// Add / remove
v.push_back(7);           // add to end — O(1) amortised
v.pop_back();             // remove last — O(1)
v.insert(v.begin(), 0);   // insert at front — O(n)
v.erase(v.begin() + 2);   // erase at index 2 — O(n)

// Access
cout << v[0];             // O(1) — no bounds check
cout << v.at(0);          // O(1) — throws if out of range
cout << v.front();        // first element
cout << v.back();         // last element
cout << v.size();         // number of elements
v.clear();                // remove all

// Algorithms
sort(v.begin(), v.end());              // sort ascending O(n log n)
sort(v.begin(), v.end(), greater<int>()); // sort descending
reverse(v.begin(), v.end());
auto it = find(v.begin(), v.end(), 5); // linear search
binary_search(v.begin(), v.end(), 5);  // O(log n) on sorted
int cnt = count(v.begin(), v.end(), 3); // count occurrences
\`\`\`

### map — sorted key-value (Red-Black Tree)
\`\`\`cpp
#include <map>
map<string, int> scores;       // O(log n) operations
scores["Alice"] = 95;
scores["Bob"]   = 82;
scores["Carol"] = 91;

// Iterate in sorted order by key
for (auto& [name, score] : scores)      // C++17 structured binding
    cout << name << ": " << score << "\n";

// Lookup and existence
if (scores.count("Alice")) cout << scores["Alice"];
scores.erase("Bob");

// unordered_map — hash table O(1) average
#include <unordered_map>
unordered_map<string, int> freq;
freq["hello"]++;    // count word frequencies
\`\`\`

### set — unique sorted elements
\`\`\`cpp
#include <set>
set<int> s = {3, 1, 4, 1, 5, 9, 2, 6};   // {1,2,3,4,5,6,9}
s.insert(7);
s.erase(3);
cout << s.count(5);    // 1 if present, 0 if not
auto it = s.find(5);   // iterator, s.end() if not found
\`\`\``,
      },
      {
        title: 'Recursion and Backtracking',
        order: 5, duration: 40,
        content: `## Recursion

Every recursive function needs exactly two things:
1. **Base case** — stops the recursion (without it → infinite loop → stack overflow)
2. **Recursive case** — calls itself with a smaller/simpler version of the problem

### Classic Examples
\`\`\`cpp
// Fibonacci — O(2^n) naive, O(n) with memoisation
int fib(int n) {
    if (n <= 1) return n;          // base case
    return fib(n-1) + fib(n-2);   // recursive case
}

// With memoisation — store computed results
int memo[100];
fill(memo, memo+100, -1);
int fibMemo(int n) {
    if (n <= 1) return n;
    if (memo[n] != -1) return memo[n];   // already computed
    return memo[n] = fibMemo(n-1) + fibMemo(n-2);
}

// Tower of Hanoi — O(2^n) moves, provably optimal
void hanoi(int n, char from, char to, char aux) {
    if (n == 0) return;                     // base case
    hanoi(n-1, from, aux, to);             // move n-1 disks to aux
    cout << "Move disk " << n << ": " << from << " -> " << to << "\n";
    hanoi(n-1, aux, to, from);             // move n-1 from aux to target
}
// Moves needed = 2^n - 1
\`\`\`

### Backtracking
Backtracking systematically explores all options and **undoes** a choice when it leads to a dead end.

\`\`\`cpp
// Generate all subsets of {0..n-1}
void subsets(int idx, int n, vector<int>& current, vector<vector<int>>& result) {
    result.push_back(current);             // save current subset
    for (int i = idx; i < n; i++) {
        current.push_back(i);              // choose element i
        subsets(i+1, n, current, result);  // explore with i included
        current.pop_back();                // BACKTRACK — remove i
    }
}

// N-Queens — place N queens so none attack each other
bool isSafe(vector<int>& board, int row, int col) {
    for (int i = 0; i < row; i++) {
        if (board[i] == col) return false;                 // same column
        if (abs(board[i]-col) == abs(i-row)) return false; // diagonal
    }
    return true;
}

int solveNQueens(int n) {
    vector<int> board(n);
    int count = 0;
    function<void(int)> solve = [&](int row) {
        if (row == n) { count++; return; }
        for (int col = 0; col < n; col++) {
            if (isSafe(board, row, col)) {
                board[row] = col;
                solve(row + 1);
                // backtrack: just move to next col, board[row] overwritten
            }
        }
    };
    solve(0);
    return count;   // number of solutions
}
\`\`\``,
      },
    ],
    quizzes: [
      { topicIndex: 0, questions: [
        { text: 'Which C++ data type stores a single character?',
          options: ['string', 'char', 'byte', 'rune'],
          correctAnswer: 1 },
        { text: 'What does the range-based for loop "for (int x : v)" do?',
          options: ['Iterates with index only', 'Iterates over each element of container v', 'Iterates n times from 0', 'Iterates in reverse order'],
          correctAnswer: 1 },
        { text: 'What must int main() return in C++?',
          options: ['void', 'bool', 'int', 'string'],
          correctAnswer: 2 },
        { text: 'How do you read a full line including spaces in C++?',
          options: ['cin >> s', 'scanf("%s", s)', 'getline(cin, s)', 'cin.read(s)'],
          correctAnswer: 2 },
        { text: 'What is function overloading in C++?',
          options: ['Calling a function twice', 'Multiple functions with same name but different parameter lists', 'Overriding a virtual function', 'A type of recursion'],
          correctAnswer: 1 },
      ]},
      { topicIndex: 1, questions: [
        { text: 'What does the * operator do when applied to a pointer variable?',
          options: ['Gets the memory address', 'Dereferences — accesses the value at the address', 'Multiplies by pointer', 'Declares a pointer type'],
          correctAnswer: 1 },
        { text: 'Key difference between pointer and reference in C++?',
          options: ['No difference', 'Pointer can be null and reassigned; reference is always bound to one variable', 'Reference uses more memory', 'Pointers are only used for arrays'],
          correctAnswer: 1 },
        { text: 'Which keyword allocates memory on the heap in C++?',
          options: ['malloc', 'alloc', 'new', 'create'],
          correctAnswer: 2 },
        { text: 'After "int* arr = new int[5]", what must you call to prevent a memory leak?',
          options: ['delete arr', 'delete[] arr', 'free(arr)', 'Nothing — automatically freed'],
          correctAnswer: 1 },
        { text: 'What is nullptr used for in modern C++?',
          options: ['Initialise integer variables', 'Represent a safe null pointer value', 'Deallocate heap memory', 'Create reference variables'],
          correctAnswer: 1 },
      ]},
      { topicIndex: 2, questions: [
        { text: 'What does the "virtual" keyword enable in C++?',
          options: ['Heap allocation instead of stack', 'Runtime polymorphism — JVM picks correct overriding function at runtime', 'Compile-time function overloading', 'Thread-safe function execution'],
          correctAnswer: 1 },
        { text: 'What is a pure virtual function (declared with = 0)?',
          options: ['A function with no parameters', 'A virtual function that must be overridden in derived classes — makes class abstract', 'A function that returns void', 'A static class method'],
          correctAnswer: 1 },
        { text: 'What does the "override" keyword ensure in C++?',
          options: ['The function runs faster', 'Compiler verifies this function actually overrides a virtual base function', 'The function is inlined', 'Thread-safe execution'],
          correctAnswer: 1 },
        { text: 'What is a constructor in C++?',
          options: ['A function that destroys the object', 'A special function called automatically when an object is created to initialise it', 'A pointer to class methods', 'A static factory method'],
          correctAnswer: 1 },
        { text: 'Why must a base class destructor be declared virtual?',
          options: ['For performance', 'Ensures the derived class destructor is called when deleting through a base class pointer', 'Required by the compiler', 'Makes the destructor faster'],
          correctAnswer: 1 },
      ]},
      { topicIndex: 3, questions: [
        { text: 'What does vector.push_back(x) do?',
          options: ['Adds x at the front', 'Adds x at the end of the vector', 'Inserts x at a sorted position', 'Replaces the last element with x'],
          correctAnswer: 1 },
        { text: 'Average time complexity of unordered_map lookup?',
          options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'],
          correctAnswer: 2 },
        { text: 'What makes std::set special compared to vector?',
          options: ['Faster iteration', 'Stores only unique elements in sorted order', 'Allows duplicate keys', 'Supports random access by index'],
          correctAnswer: 1 },
        { text: 'What does std::sort() require as arguments?',
          options: ['Pointers to array elements only', 'Iterators to the beginning and end of the range', 'A comparison lambda always', 'Only integer element containers'],
          correctAnswer: 1 },
        { text: 'Time complexity of std::map find() and insert()?',
          options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
          correctAnswer: 1 },
      ]},
      { topicIndex: 4, questions: [
        { text: 'What is the mandatory component every recursive function must have?',
          options: ['A loop inside the function', 'A base case that stops the recursion', 'A return type of void', 'A global variable for state'],
          correctAnswer: 1 },
        { text: 'What is backtracking?',
          options: ['Iterating backwards through an array', 'Exploring choices and undoing them if they lead to a dead end', 'Reversing a data structure', 'Recursion without a base case'],
          correctAnswer: 1 },
        { text: 'Time complexity of naive recursive Fibonacci(n)?',
          options: ['O(n)', 'O(n log n)', 'O(2^n)', 'O(log n)'],
          correctAnswer: 2 },
        { text: 'Tower of Hanoi with n disks requires exactly how many moves?',
          options: ['n²', 'n log n', '2^n - 1', 'n!'],
          correctAnswer: 2 },
        { text: 'What technique transforms the O(2^n) recursive Fibonacci into O(n)?',
          options: ['Backtracking', 'Memoisation — caching previously computed results', 'Binary search', 'Greedy approach'],
          correctAnswer: 1 },
      ]},
    ],
  },

  // ==================================================================
  //  COURSE 2: Data Structures and Algorithms in C++ — INTERMEDIATE
  // ==================================================================
  {
    course: {
      title: 'Data Structures and Algorithms in C++',
      description: 'Master arrays, linked lists, stacks, queues, trees, graphs, and classic sorting and searching algorithms — all implemented in C++ using STL and custom structures.',
      level: 'intermediate',
      track: 'dsa-cpp',
      tags: ['dsa', 'cpp', 'algorithms', 'trees', 'graphs', 'sorting'],
    },
    topics: [
      {
        title: 'Arrays, Strings and Two-Pointer Technique',
        order: 1, duration: 45,
        content: `## Arrays and the Two-Pointer Technique

### Arrays in C++ — prefer vector
\`\`\`cpp
#include <vector>
#include <algorithm>
#include <numeric>

vector<int> v = {3, 1, 4, 1, 5, 9, 2, 6};
sort(v.begin(), v.end());         // [1,1,2,3,4,5,6,9]
cout << v[0];                     // O(1) random access
cout << v.size();                 // 8

// Accumulate — sum of elements
int total = accumulate(v.begin(), v.end(), 0);  // 31

// 2D array
vector<vector<int>> matrix(3, vector<int>(3, 0));
matrix[1][2] = 5;
\`\`\`

### Two-Pointer Technique
Two pointers that move toward each other (or in the same direction) to solve problems in O(n) instead of O(n²).

\`\`\`cpp
// Check palindrome — O(n) time, O(1) space
bool isPalindrome(string s) {
    int l = 0, r = s.size() - 1;
    while (l < r) {
        if (s[l++] != s[r--]) return false;
    }
    return true;
}

// Two-sum on sorted array — O(n)
bool hasPairWithSum(vector<int>& arr, int target) {
    sort(arr.begin(), arr.end());
    int l = 0, r = arr.size() - 1;
    while (l < r) {
        int sum = arr[l] + arr[r];
        if (sum == target) return true;
        else if (sum < target) l++;
        else r--;
    }
    return false;
}

// Remove duplicates from sorted array in-place — O(n)
int removeDuplicates(vector<int>& nums) {
    if (nums.empty()) return 0;
    int slow = 0;
    for (int fast = 1; fast < nums.size(); fast++) {
        if (nums[fast] != nums[slow])
            nums[++slow] = nums[fast];
    }
    return slow + 1;  // length of unique portion
}
\`\`\`

### Sliding Window
Fixed or variable window that slides across the array.

\`\`\`cpp
// Maximum sum subarray of exactly size k — O(n)
int maxSumSubarray(vector<int>& arr, int k) {
    int sum = 0, maxSum = 0;
    for (int i = 0; i < k; i++) sum += arr[i];
    maxSum = sum;
    for (int i = k; i < arr.size(); i++) {
        sum += arr[i] - arr[i-k];
        maxSum = max(maxSum, sum);
    }
    return maxSum;
}

// Longest substring with at most k distinct characters — variable window
int lengthOfLongestSubstringKDistinct(string s, int k) {
    unordered_map<char, int> freq;
    int l = 0, maxLen = 0;
    for (int r = 0; r < s.size(); r++) {
        freq[s[r]]++;
        while (freq.size() > k) {
            if (--freq[s[l]] == 0) freq.erase(s[l]);
            l++;
        }
        maxLen = max(maxLen, r - l + 1);
    }
    return maxLen;
}
\`\`\``,
      },
      {
        title: 'Linked Lists, Stacks and Queues',
        order: 2, duration: 45,
        content: `## Linear Data Structures

### Singly Linked List — Custom Implementation
\`\`\`cpp
struct Node {
    int   data;
    Node* next;
    Node(int d) : data(d), next(nullptr) {}
};

class LinkedList {
    Node* head = nullptr;
public:
    // Insert at front — O(1)
    void pushFront(int val) {
        Node* n = new Node(val);
        n->next  = head;
        head     = n;
    }

    // Reverse in-place — O(n), O(1) space
    void reverse() {
        Node *prev=nullptr, *cur=head;
        while (cur) {
            Node* nxt = cur->next;
            cur->next = prev;
            prev = cur;
            cur  = nxt;
        }
        head = prev;
    }

    // Detect cycle — Floyd slow/fast pointer
    bool hasCycle() {
        Node *slow=head, *fast=head;
        while (fast && fast->next) {
            slow = slow->next;
            fast = fast->next->next;
            if (slow == fast) return true;
        }
        return false;
    }

    // Find middle — slow/fast pointer
    Node* findMiddle() {
        Node *slow=head, *fast=head;
        while (fast && fast->next) {
            slow = slow->next;
            fast = fast->next->next;
        }
        return slow;   // slow is at middle when fast reaches end
    }

    void print() {
        for (Node* cur=head; cur; cur=cur->next)
            cout << cur->data << " -> ";
        cout << "NULL\n";
    }
};
\`\`\`

### Stack (LIFO) — using STL
\`\`\`cpp
#include <stack>
stack<int> st;
st.push(10); st.push(20); st.push(30);
cout << st.top();     // 30 — peek without removing
st.pop();             // removes 30
cout << st.empty();   // false
cout << st.size();    // 2

// Classic application: balanced parentheses
bool isBalanced(string s) {
    stack<char> st;
    unordered_map<char,char> pairs = {{')', '('}, {']', '['}, {'}', '{'}};
    for (char c : s) {
        if (c=='(' || c=='[' || c=='{') st.push(c);
        else if (pairs.count(c)) {
            if (st.empty() || st.top()!=pairs[c]) return false;
            st.pop();
        }
    }
    return st.empty();
}
\`\`\`

### Queue (FIFO) and Priority Queue
\`\`\`cpp
#include <queue>

// Regular queue
queue<int> q;
q.push(1); q.push(2); q.push(3);
cout << q.front();   // 1
q.pop();

// Min-heap priority queue
priority_queue<int, vector<int>, greater<int>> minPQ;
minPQ.push(5); minPQ.push(1); minPQ.push(3);
cout << minPQ.top();  // 1 — always minimum
minPQ.pop();
\`\`\``,
      },
      {
        title: 'Trees and Binary Search Trees',
        order: 3, duration: 50,
        content: `## Trees

### Binary Tree Node
\`\`\`cpp
struct TreeNode {
    int val;
    TreeNode *left, *right;
    TreeNode(int v) : val(v), left(nullptr), right(nullptr) {}
};
\`\`\`

### Tree Traversals
\`\`\`cpp
// Inorder: Left → Root → Right
// For a BST this gives SORTED ascending output
void inorder(TreeNode* root, vector<int>& result) {
    if (!root) return;
    inorder(root->left, result);
    result.push_back(root->val);
    inorder(root->right, result);
}

// Preorder: Root → Left → Right (used to clone trees)
void preorder(TreeNode* root) {
    if (!root) return;
    cout << root->val << " ";
    preorder(root->left);
    preorder(root->right);
}

// Postorder: Left → Right → Root (used to delete trees)
void postorder(TreeNode* root) {
    if (!root) return;
    postorder(root->left);
    postorder(root->right);
    cout << root->val << " ";
}

// Level-order (BFS) — uses a queue
vector<vector<int>> levelOrder(TreeNode* root) {
    vector<vector<int>> result;
    if (!root) return result;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        int sz = q.size();
        vector<int> level;
        while (sz--) {
            TreeNode* node = q.front(); q.pop();
            level.push_back(node->val);
            if (node->left)  q.push(node->left);
            if (node->right) q.push(node->right);
        }
        result.push_back(level);
    }
    return result;
}

// Height of tree
int height(TreeNode* root) {
    if (!root) return 0;
    return 1 + max(height(root->left), height(root->right));
}
\`\`\`

### Binary Search Tree (BST)
\`\`\`cpp
// Insert — O(log n) average, O(n) worst (unbalanced)
TreeNode* insert(TreeNode* root, int val) {
    if (!root) return new TreeNode(val);
    if (val < root->val)      root->left  = insert(root->left,  val);
    else if (val > root->val) root->right = insert(root->right, val);
    return root;  // equal: don't insert duplicate
}

// Search — O(log n) average
bool search(TreeNode* root, int val) {
    if (!root) return false;
    if (root->val == val) return true;
    return val < root->val ? search(root->left,  val)
                           : search(root->right, val);
}

// Validate BST — pass min/max bounds
bool isValidBST(TreeNode* root, long lo=LONG_MIN, long hi=LONG_MAX) {
    if (!root) return true;
    if (root->val <= lo || root->val >= hi) return false;
    return isValidBST(root->left,  lo, root->val)
        && isValidBST(root->right, root->val, hi);
}
\`\`\``,
      },
      {
        title: 'Sorting and Searching Algorithms',
        order: 4, duration: 50,
        content: `## Classic Algorithms

### Merge Sort — Divide and Conquer — O(n log n) guaranteed
\`\`\`cpp
void merge(vector<int>& arr, int l, int m, int r) {
    // Copy left and right halves
    vector<int> left (arr.begin()+l,   arr.begin()+m+1);
    vector<int> right(arr.begin()+m+1, arr.begin()+r+1);

    int i=0, j=0, k=l;
    while (i < left.size() && j < right.size())
        arr[k++] = (left[i] <= right[j]) ? left[i++] : right[j++];
    while (i < left.size())  arr[k++] = left[i++];
    while (j < right.size()) arr[k++] = right[j++];
}

void mergeSort(vector<int>& arr, int l, int r) {
    if (l >= r) return;                    // base case: 0 or 1 element
    int m = l + (r - l) / 2;
    mergeSort(arr, l, m);                  // sort left half
    mergeSort(arr, m+1, r);               // sort right half
    merge(arr, l, m, r);                  // merge two sorted halves
}
// Usage: mergeSort(v, 0, v.size()-1);
\`\`\`

### QuickSort — Average O(n log n), Worst O(n²)
\`\`\`cpp
int partition(vector<int>& arr, int l, int r) {
    int pivot = arr[r], i = l;
    for (int j = l; j < r; j++)
        if (arr[j] <= pivot) swap(arr[i++], arr[j]);
    swap(arr[i], arr[r]);
    return i;
}

void quickSort(vector<int>& arr, int l, int r) {
    if (l >= r) return;
    int p = partition(arr, l, r);
    quickSort(arr, l, p-1);
    quickSort(arr, p+1, r);
}
// Worst case: already sorted input with last-element pivot
// Fix: random pivot or median-of-three
\`\`\`

### Binary Search — O(log n)
\`\`\`cpp
// Iterative — preferred (no recursion overhead)
int binarySearch(vector<int>& arr, int target) {
    int l = 0, r = arr.size() - 1;
    while (l <= r) {
        int mid = l + (r - l) / 2;      // avoids overflow vs (l+r)/2
        if      (arr[mid] == target) return mid;  // found
        else if (arr[mid] <  target) l = mid + 1; // target in right half
        else                         r = mid - 1; // target in left half
    }
    return -1;  // not found
}

// lower_bound — first element >= target
auto it = lower_bound(v.begin(), v.end(), 5);
int pos = it - v.begin();  // index of first >= 5
\`\`\`

### Complexity Summary
| Algorithm     | Best       | Average    | Worst      | Space   |
|--------------|-----------|-----------|-----------|---------|
| Bubble Sort  | O(n)      | O(n²)     | O(n²)     | O(1)    |
| Merge Sort   | O(n log n)| O(n log n)| O(n log n)| O(n)    |
| Quick Sort   | O(n log n)| O(n log n)| O(n²)     | O(log n)|
| Binary Search| O(1)      | O(log n)  | O(log n)  | O(1)    |`,
      },
      {
        title: 'Graphs and Dynamic Programming',
        order: 5, duration: 55,
        content: `## Graphs

### Representation — Adjacency List
\`\`\`cpp
int n = 5;   // vertices 0..4
vector<vector<int>> graph(n);

// Add undirected edge
auto addEdge = [&](int u, int v) {
    graph[u].push_back(v);
    graph[v].push_back(u);
};
addEdge(0, 1); addEdge(0, 2); addEdge(1, 3);
\`\`\`

### BFS — Breadth First Search — O(V + E)
\`\`\`cpp
vector<int> bfs(int start, vector<vector<int>>& g) {
    int n = g.size();
    vector<bool> visited(n, false);
    vector<int>  order;
    queue<int> q;
    q.push(start);
    visited[start] = true;
    while (!q.empty()) {
        int v = q.front(); q.pop();
        order.push_back(v);
        for (int u : g[v])
            if (!visited[u]) { visited[u]=true; q.push(u); }
    }
    return order;
}
// Use BFS for: shortest path in unweighted graph, level-order traversal
\`\`\`

### DFS — Depth First Search — O(V + E)
\`\`\`cpp
void dfs(int v, vector<vector<int>>& g, vector<bool>& vis) {
    vis[v] = true;
    cout << v << " ";
    for (int u : g[v])
        if (!vis[u]) dfs(u, g, vis);
}
// Use DFS for: cycle detection, topological sort, connected components
\`\`\`

### Dynamic Programming

**Key insight:** if the same subproblem appears multiple times in recursion, DP stores results to avoid recomputation.

\`\`\`cpp
// Coin Change — minimum coins to make amount
int coinChange(vector<int>& coins, int amount) {
    vector<int> dp(amount+1, INT_MAX);
    dp[0] = 0;                                   // base case: 0 coins for 0
    for (int i = 1; i <= amount; i++)
        for (int c : coins)
            if (c <= i && dp[i-c] != INT_MAX)
                dp[i] = min(dp[i], dp[i-c] + 1);
    return dp[amount] == INT_MAX ? -1 : dp[amount];
}

// Longest Common Subsequence — O(m*n) time and space
int lcs(string& a, string& b) {
    int m=a.size(), n=b.size();
    vector<vector<int>> dp(m+1, vector<int>(n+1, 0));
    for (int i=1; i<=m; i++)
        for (int j=1; j<=n; j++)
            dp[i][j] = (a[i-1]==b[j-1]) ? dp[i-1][j-1]+1
                                         : max(dp[i-1][j], dp[i][j-1]);
    return dp[m][n];
}

// 0/1 Knapsack
int knapsack(vector<int>& weight, vector<int>& value, int W) {
    int n = weight.size();
    vector<vector<int>> dp(n+1, vector<int>(W+1, 0));
    for (int i=1; i<=n; i++)
        for (int j=0; j<=W; j++) {
            dp[i][j] = dp[i-1][j];   // don't take item i
            if (weight[i-1] <= j)
                dp[i][j] = max(dp[i][j], dp[i-1][j-weight[i-1]] + value[i-1]);
        }
    return dp[n][W];
}
\`\`\``,
      },
    ],
    quizzes: [
      { topicIndex: 0, questions: [
        { text: 'Time complexity of accessing a vector element by index?',
          options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
          correctAnswer: 2 },
        { text: 'The two-pointer technique is most effective for which type of problem?',
          options: ['Hash table operations', 'Sorted array pair-finding or string palindrome problems', 'Graph traversal', 'Dynamic programming problems'],
          correctAnswer: 1 },
        { text: 'What is the time complexity of the sliding window approach?',
          options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(1)'],
          correctAnswer: 2 },
        { text: 'Binary search requires the input array to be?',
          options: ['Unsorted', 'Sorted', 'Containing unique elements only', 'Containing integers only'],
          correctAnswer: 1 },
        { text: 'What does std::accumulate(v.begin(), v.end(), 0) compute?',
          options: ['Finds the maximum element', 'Counts elements equal to 0', 'Computes the sum of all elements', 'Counts non-zero elements'],
          correctAnswer: 2 },
      ]},
      { topicIndex: 1, questions: [
        { text: 'What ordering does a Stack follow?',
          options: ['FIFO (First In First Out)', 'LIFO (Last In First Out)', 'Sorted ascending order', 'Random order'],
          correctAnswer: 1 },
        { text: 'What ordering does a Queue follow?',
          options: ['LIFO', 'FIFO (First In First Out)', 'Sorted ascending', 'Priority order'],
          correctAnswer: 1 },
        { text: 'Time complexity of inserting at the front of a singly linked list?',
          options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
          correctAnswer: 2 },
        { text: 'Which data structure is classically used to check balanced parentheses?',
          options: ['Queue', 'Stack', 'Linked List', 'Heap'],
          correctAnswer: 1 },
        { text: "Floyd cycle detection uses slow and fast pointers that move at speeds?",
          options: ['1 step and 2 steps per iteration', '1 step and 3 steps', '2 steps and 3 steps', 'Same speed'],
          correctAnswer: 0 },
      ]},
      { topicIndex: 2, questions: [
        { text: 'Inorder traversal of a BST produces elements in which order?',
          options: ['Random order', 'Reverse sorted', 'Sorted ascending', 'Level by level'],
          correctAnswer: 2 },
        { text: 'Average time complexity of BST insert and search?',
          options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'],
          correctAnswer: 1 },
        { text: 'Which traversal uses a Queue as its primary data structure?',
          options: ['Inorder', 'Preorder', 'Postorder', 'Level-order (BFS)'],
          correctAnswer: 3 },
        { text: 'BST property: for every node, values in the left subtree are?',
          options: ['Greater than the node', 'Less than the node', 'Equal to the node', 'Random'],
          correctAnswer: 1 },
        { text: 'Worst-case time complexity of BST operations on an unbalanced tree?',
          options: ['O(log n)', 'O(n)', 'O(1)', 'O(n²)'],
          correctAnswer: 1 },
      ]},
      { topicIndex: 3, questions: [
        { text: 'Which sorting algorithm guarantees O(n log n) in ALL cases?',
          options: ['Quick Sort', 'Bubble Sort', 'Merge Sort', 'Insertion Sort'],
          correctAnswer: 2 },
        { text: 'Why use mid = l + (r-l)/2 instead of mid = (l+r)/2 in binary search?',
          options: ['It is computationally faster', 'Avoids integer overflow for large values of l and r', 'Works on unsorted arrays', 'Required by the C++ STL'],
          correctAnswer: 1 },
        { text: 'Time complexity of binary search?',
          options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'],
          correctAnswer: 2 },
        { text: 'QuickSort worst case occurs when?',
          options: ['Array is random', 'Array is already sorted or reverse sorted with bad pivot choice', 'Array has all duplicate elements', 'Array has odd length'],
          correctAnswer: 1 },
        { text: 'Space complexity of Merge Sort?',
          options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
          correctAnswer: 2 },
      ]},
      { topicIndex: 4, questions: [
        { text: 'BFS uses which data structure internally to process nodes?',
          options: ['Stack', 'Queue', 'Priority Queue', 'Array'],
          correctAnswer: 1 },
        { text: 'The key idea of Dynamic Programming is?',
          options: ['Divide into independent subproblems', 'Store and reuse solutions to overlapping subproblems to avoid recomputation', 'Try all possibilities in random order', 'Make the locally optimal choice at each step'],
          correctAnswer: 1 },
        { text: 'Time complexity of BFS on a graph with V vertices and E edges?',
          options: ['O(V²)', 'O(V + E)', 'O(V log E)', 'O(E²)'],
          correctAnswer: 1 },
        { text: 'What is memoisation in the context of Dynamic Programming?',
          options: ['Storing past user inputs', 'Caching computed results so subproblems are never solved more than once', 'A type of backtracking', 'Sorting data before processing'],
          correctAnswer: 1 },
        { text: 'Adjacency list is preferred over adjacency matrix when the graph is?',
          options: ['Dense (many edges close to V²)', 'Sparse (few edges)', 'Acyclic (no cycles)', 'All edge weights are equal'],
          correctAnswer: 1 },
      ]},
    ],
  },

  // ==================================================================
  //  COURSE 3: Advanced DSA and Competitive Programming — ADVANCED
  // ==================================================================
  {
    course: {
      title: 'Advanced DSA and Competitive Programming in C++',
      description: 'Tackle advanced topics: heaps, Dijkstra, Floyd-Warshall, advanced DP (bitmask, interval), tries, Union-Find, segment trees, and competitive programming patterns.',
      level: 'advanced',
      track: 'dsa-cpp',
      tags: ['competitive-programming', 'cpp', 'graphs', 'advanced-dp', 'trie', 'union-find'],
    },
    topics: [
      {
        title: 'Heaps, Priority Queues and Applications',
        order: 1, duration: 50,
        content: `## Heaps

A heap is a complete binary tree satisfying the heap property:
- **Max-heap:** parent ≥ children (maximum at root)
- **Min-heap:** parent ≤ children (minimum at root)

\`\`\`cpp
#include <queue>

// Max-heap (default in C++ STL)
priority_queue<int> maxPQ;
maxPQ.push(5); maxPQ.push(1); maxPQ.push(9);
cout << maxPQ.top();   // 9 — always the maximum
maxPQ.pop();           // removes 9

// Min-heap
priority_queue<int, vector<int>, greater<int>> minPQ;
minPQ.push(5); minPQ.push(1); minPQ.push(9);
cout << minPQ.top();   // 1 — always the minimum

// Custom comparator — sort pairs by second element
priority_queue<pair<int,int>,
               vector<pair<int,int>>,
               greater<pair<int,int>>> pqPairs;
pqPairs.push({3, 10}); pqPairs.push({1, 20}); pqPairs.push({2, 5});
cout << pqPairs.top().first;  // 1 (smallest first element)
\`\`\`

### K Largest Elements — O(n log k)
\`\`\`cpp
// Use min-heap of size k — maintain k largest seen so far
vector<int> kLargest(vector<int>& nums, int k) {
    priority_queue<int, vector<int>, greater<int>> minPQ; // min-heap
    for (int x : nums) {
        minPQ.push(x);
        if ((int)minPQ.size() > k) minPQ.pop(); // remove smallest
    }
    // Remaining k elements are the k largest
    vector<int> result;
    while (!minPQ.empty()) { result.push_back(minPQ.top()); minPQ.pop(); }
    return result;  // in ascending order
}
\`\`\`

### Heap Sort — O(n log n)
\`\`\`cpp
void heapSort(vector<int>& arr) {
    // Build max-heap using make_heap
    make_heap(arr.begin(), arr.end());
    // Repeatedly extract max to end
    for (int i = arr.size()-1; i > 0; i--) {
        pop_heap(arr.begin(), arr.begin()+i+1); // move max to position i
    }
}
\`\`\`

### Heap Operations Complexity
| Operation        | Time     |
|-----------------|----------|
| Insert (push)   | O(log n) |
| Get min/max     | O(1)     |
| Delete min/max  | O(log n) |
| Build from n    | O(n)     |
| Search          | O(n)     |`,
      },
      {
        title: 'Graph Algorithms: Dijkstra and Floyd-Warshall',
        order: 2, duration: 60,
        content: `## Shortest Path Algorithms

### Dijkstra — Single Source, Non-negative Weights — O((V+E) log V)
\`\`\`cpp
#include <climits>
typedef pair<int,int> pii;  // {distance, vertex}

vector<int> dijkstra(int src, vector<vector<pii>>& graph, int n) {
    // graph[u] = { {weight, dest}, ... }
    vector<int> dist(n, INT_MAX);
    priority_queue<pii, vector<pii>, greater<pii>> pq;  // min-heap

    dist[src] = 0;
    pq.push({0, src});

    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;  // stale entry — skip

        for (auto [w, v] : graph[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;  // dist[i] = shortest distance from src to i
}
\`\`\`

### Why we skip stale entries
When we update dist[v] and push {dist[v], v} to the priority queue, the old entry {old_dist, v} is still there. We skip it because we have already found a shorter path.

### Dijkstra — Build the graph
\`\`\`cpp
int n = 5;  // vertices 0..4
vector<vector<pii>> graph(n);

// Add directed weighted edge u→v with weight w
auto addEdge = [&](int u, int v, int w) {
    graph[u].push_back({w, v});
};

addEdge(0, 1, 4); addEdge(0, 2, 2);
addEdge(1, 3, 5); addEdge(2, 1, 1);
addEdge(2, 3, 8); addEdge(3, 4, 2);

vector<int> distances = dijkstra(0, graph, n);
for (int i=0; i<n; i++)
    cout << "0 to " << i << ": " << distances[i] << "\n";
\`\`\`

### Floyd-Warshall — All Pairs Shortest Path — O(V³)
\`\`\`cpp
// dist[i][j] = shortest path from i to j
// Initialise: dist[i][i]=0, dist[i][j]=edge weight if edge exists, else INF

void floydWarshall(vector<vector<int>>& dist, int n) {
    for (int k = 0; k < n; k++)          // try each vertex as intermediate
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                if (dist[i][k] != INT_MAX && dist[k][j] != INT_MAX)
                    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);
    // After: dist[i][i] < 0 means vertex i is on a negative cycle
}
\`\`\`

### Algorithm Comparison
| Algorithm        | Source   | Negative Weights | Complexity     |
|-----------------|----------|-----------------|----------------|
| Dijkstra         | Single   | No              | O((V+E) log V) |
| Bellman-Ford     | Single   | Yes             | O(VE)          |
| Floyd-Warshall   | All      | Yes (no cycle)  | O(V³)          |`,
      },
      {
        title: 'Advanced Dynamic Programming',
        order: 3, duration: 60,
        content: `## Advanced DP Patterns

### Longest Common Subsequence — O(mn)
\`\`\`cpp
int lcs(string& a, string& b) {
    int m=a.size(), n=b.size();
    vector<vector<int>> dp(m+1, vector<int>(n+1, 0));
    for (int i=1; i<=m; i++)
        for (int j=1; j<=n; j++)
            dp[i][j] = (a[i-1]==b[j-1]) ? dp[i-1][j-1]+1
                                         : max(dp[i-1][j], dp[i][j-1]);
    return dp[m][n];
    // Space: can reduce to O(n) by keeping only two rows
}
\`\`\`

### Edit Distance (Levenshtein) — O(mn)
\`\`\`cpp
int editDistance(string& a, string& b) {
    int m=a.size(), n=b.size();
    vector<vector<int>> dp(m+1, vector<int>(n+1, 0));
    for (int i=0; i<=m; i++) dp[i][0]=i;  // delete all of a
    for (int j=0; j<=n; j++) dp[0][j]=j;  // insert all of b
    for (int i=1; i<=m; i++)
        for (int j=1; j<=n; j++)
            dp[i][j] = (a[i-1]==b[j-1]) ? dp[i-1][j-1]
                : 1 + min({dp[i-1][j-1],   // replace
                            dp[i-1][j],     // delete from a
                            dp[i][j-1]});   // insert into a
    return dp[m][n];
}
\`\`\`

### Matrix Chain Multiplication — Interval DP — O(n³)
\`\`\`cpp
// dims = dimensions: matrix i has size dims[i] x dims[i+1]
int matrixChain(vector<int>& dims) {
    int n = dims.size() - 1;   // number of matrices
    vector<vector<int>> dp(n, vector<int>(n, 0));
    for (int len = 2; len <= n; len++) {      // chain length
        for (int i = 0; i <= n-len; i++) {
            int j = i + len - 1;
            dp[i][j] = INT_MAX;
            for (int k = i; k < j; k++) {    // split point
                int cost = dp[i][k] + dp[k+1][j]
                         + dims[i]*dims[k+1]*dims[j+1];
                dp[i][j] = min(dp[i][j], cost);
            }
        }
    }
    return dp[0][n-1];
}
\`\`\`

### Bitmask DP — Travelling Salesman — O(2^n × n²)
\`\`\`cpp
// dp[mask][i] = min cost to visit exactly cities in mask, ending at city i
int tsp(vector<vector<int>>& dist, int n) {
    int full = (1<<n) - 1;
    vector<vector<int>> dp(1<<n, vector<int>(n, INT_MAX));
    dp[1][0] = 0;  // start at city 0 with mask=0001
    for (int mask=1; mask<=full; mask++)
        for (int u=0; u<n; u++) {
            if (!(mask>>u&1) || dp[mask][u]==INT_MAX) continue;
            for (int v=0; v<n; v++) {
                if (mask>>v&1) continue;        // already visited
                int nm = mask | (1<<v);
                int cost = dp[mask][u] + dist[u][v];
                dp[nm][v] = min(dp[nm][v], cost);
            }
        }
    int ans = INT_MAX;
    for (int i=1; i<n; i++)
        if (dp[full][i] != INT_MAX)
            ans = min(ans, dp[full][i] + dist[i][0]);
    return ans;
}
\`\`\``,
      },
      {
        title: 'Tries and String Algorithms',
        order: 4, duration: 55,
        content: `## Trie Data Structure

A trie (prefix tree) stores strings character by character. Every node represents a character.

\`\`\`cpp
struct TrieNode {
    TrieNode* ch[26] = {};    // one child per lowercase letter
    bool isEnd = false;       // true if a word ends here
};

class Trie {
    TrieNode* root;
public:
    Trie() : root(new TrieNode()) {}

    // Insert a word — O(m) where m = word length
    void insert(const string& word) {
        TrieNode* node = root;
        for (char c : word) {
            int idx = c - 'a';
            if (!node->ch[idx]) node->ch[idx] = new TrieNode();
            node = node->ch[idx];
        }
        node->isEnd = true;
    }

    // Search for exact word — O(m)
    bool search(const string& word) {
        TrieNode* node = root;
        for (char c : word) {
            if (!node->ch[c-'a']) return false;
            node = node->ch[c-'a'];
        }
        return node->isEnd;
    }

    // Check if any stored word starts with prefix — O(m)
    bool startsWith(const string& prefix) {
        TrieNode* node = root;
        for (char c : prefix) {
            if (!node->ch[c-'a']) return false;
            node = node->ch[c-'a'];
        }
        return true;  // prefix exists in trie
    }

    // Count words with given prefix — O(m + subtree size)
    int countWithPrefix(const string& prefix) {
        TrieNode* node = root;
        for (char c : prefix) {
            if (!node->ch[c-'a']) return 0;
            node = node->ch[c-'a'];
        }
        return countWords(node);
    }

private:
    int countWords(TrieNode* node) {
        if (!node) return 0;
        int cnt = node->isEnd ? 1 : 0;
        for (int i=0; i<26; i++) cnt += countWords(node->ch[i]);
        return cnt;
    }
};
\`\`\`

### KMP String Matching — O(n + m)
\`\`\`cpp
// Build LPS (Longest Proper Prefix which is also Suffix) array
vector<int> buildLPS(const string& pat) {
    int m = pat.size();
    vector<int> lps(m, 0);
    for (int i=1, len=0; i<m;) {
        if (pat[i] == pat[len]) lps[i++] = ++len;
        else if (len)            len = lps[len-1];
        else                     lps[i++] = 0;
    }
    return lps;
}

// Find all occurrences of pattern in text — O(n + m)
vector<int> kmpSearch(const string& text, const string& pat) {
    vector<int> lps = buildLPS(pat);
    vector<int> matches;
    int n=text.size(), m=pat.size(), j=0;
    for (int i=0; i<n;) {
        if (text[i] == pat[j]) { i++; j++; }
        if (j == m) {
            matches.push_back(i - j);  // match at position i-j
            j = lps[j-1];
        } else if (i<n && text[i]!=pat[j]) {
            if (j) j = lps[j-1];
            else   i++;
        }
    }
    return matches;
}
\`\`\``,
      },
      {
        title: 'Competitive Programming Patterns',
        order: 5, duration: 60,
        content: `## Essential CP Patterns

### Bit Manipulation
\`\`\`cpp
// Check if n is a power of 2
bool isPowerOf2(int n) { return n>0 && (n & (n-1))==0; }

// Count set bits (1s) in binary representation
int countBits(int n)   { return __builtin_popcount(n); }  // fast intrinsic

// XOR trick: find the unique element when all others appear twice
int findUnique(vector<int>& arr) {
    int res = 0;
    for (int x : arr) res ^= x;  // all pairs cancel, unique remains
    return res;
}

// Check if bit i is set
bool isBitSet(int n, int i) { return (n >> i) & 1; }

// Enumerate all 2^n subsets
for (int mask = 0; mask < (1<<n); mask++) {
    cout << "Subset: ";
    for (int i=0; i<n; i++)
        if (mask >> i & 1) cout << i << " ";
    cout << "\n";
}
\`\`\`

### Union-Find (Disjoint Set Union) — nearly O(1) per operation
\`\`\`cpp
struct DSU {
    vector<int> parent, rank_;
    int components;

    DSU(int n) : parent(n), rank_(n, 0), components(n) {
        iota(parent.begin(), parent.end(), 0);
    }

    // Find with path compression
    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }

    // Union by rank
    bool unite(int x, int y) {
        int px=find(x), py=find(y);
        if (px == py) return false;     // already connected — cycle!
        if (rank_[px] < rank_[py]) swap(px, py);
        parent[py] = px;
        if (rank_[px] == rank_[py]) rank_[px]++;
        components--;
        return true;
    }

    bool connected(int x, int y) { return find(x) == find(y); }
};

// Usage: count connected components
DSU dsu(n);
for (auto [u, v] : edges) dsu.unite(u, v);
cout << dsu.components << " connected components\n";
\`\`\`

### Prefix Sums — O(n) build, O(1) range query
\`\`\`cpp
// 1D prefix sum
vector<int> prefix(n+1, 0);
for (int i=0; i<n; i++) prefix[i+1] = prefix[i] + arr[i];
// Sum from index l to r inclusive:
int rangeSum = prefix[r+1] - prefix[l];

// 2D prefix sum for matrix range queries
int m=3, nc=4;
vector<vector<int>> P(m+1, vector<int>(nc+1, 0));
for (int i=1;i<=m;i++) for (int j=1;j<=nc;j++)
    P[i][j] = grid[i-1][j-1] + P[i-1][j] + P[i][j-1] - P[i-1][j-1];
// Sum in rectangle (r1,c1) to (r2,c2):
int rectSum = P[r2+1][c2+1] - P[r1][c2+1] - P[r2+1][c1] + P[r1][c1];
\`\`\`

### Segment Tree — O(log n) range query and point update
\`\`\`cpp
class SegTree {
    int n;
    vector<int> tree;
public:
    SegTree(int n) : n(n), tree(4*n, 0) {}

    void update(int node, int l, int r, int idx, int val) {
        if (l == r) { tree[node] = val; return; }
        int mid = (l+r)/2;
        if (idx<=mid) update(2*node, l, mid, idx, val);
        else          update(2*node+1, mid+1, r, idx, val);
        tree[node] = tree[2*node] + tree[2*node+1]; // range sum
    }

    int query(int node, int l, int r, int ql, int qr) {
        if (qr<l || r<ql) return 0;               // out of range
        if (ql<=l && r<=qr) return tree[node];     // fully in range
        int mid = (l+r)/2;
        return query(2*node, l, mid, ql, qr)
             + query(2*node+1, mid+1, r, ql, qr);
    }

    void update(int idx, int val) { update(1, 0, n-1, idx, val); }
    int  query(int l, int r)      { return query(1, 0, n-1, l, r); }
};
\`\`\``,
      },
    ],
    quizzes: [
      { topicIndex: 0, questions: [
        { text: 'Time complexity of inserting an element into a heap?',
          options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
          correctAnswer: 1 },
        { text: 'What does priority_queue<int, vector<int>, greater<int>> create?',
          options: ['Max-heap — largest element at top', 'Min-heap — smallest element at top', 'A sorted vector', 'A balanced BST'],
          correctAnswer: 1 },
        { text: 'Time to get the maximum element from a max-heap?',
          options: ['O(log n)', 'O(n)', 'O(1)', 'O(n log n)'],
          correctAnswer: 2 },
        { text: 'Time complexity of building a heap from n elements?',
          options: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'],
          correctAnswer: 2 },
        { text: 'To find the K largest elements using a min-heap, the heap should maintain size?',
          options: ['n elements', 'k elements — evict smallest when size exceeds k', 'n-k elements', '1 element'],
          correctAnswer: 1 },
      ]},
      { topicIndex: 1, questions: [
        { text: 'Time complexity of Dijkstra with a priority queue?',
          options: ['O(V²)', 'O(V + E)', 'O((V + E) log V)', 'O(VE)'],
          correctAnswer: 2 },
        { text: 'Time complexity of Floyd-Warshall?',
          options: ['O(V²)', 'O(V³)', 'O(V + E)', 'O(E log V)'],
          correctAnswer: 1 },
        { text: 'Dijkstra does NOT work correctly when?',
          options: ['Graph has cycles', 'Graph has negative edge weights', 'Graph is disconnected', 'Graph is undirected'],
          correctAnswer: 1 },
        { text: 'What problem does Floyd-Warshall solve?',
          options: ['Single source shortest path only', 'Single destination shortest path', 'All pairs shortest path between every pair of vertices', 'Minimum spanning tree'],
          correctAnswer: 2 },
        { text: 'Why do we skip stale entries in Dijkstra priority queue?',
          options: ['To avoid visiting all nodes', 'The stored distance is outdated — a shorter path was already found and processed', 'To handle negative edges', 'To reduce memory usage'],
          correctAnswer: 1 },
      ]},
      { topicIndex: 2, questions: [
        { text: 'Time complexity of the LCS DP solution for strings of length m and n?',
          options: ['O(m + n)', 'O(m × n)', 'O(m × n × min(m,n))', 'O(2^(m+n))'],
          correctAnswer: 1 },
        { text: 'What does Edit Distance (Levenshtein) measure?',
          options: ['Length difference between strings', 'Minimum number of insert/delete/replace operations to transform one string into another', 'Number of common characters', 'Hamming distance between strings'],
          correctAnswer: 1 },
        { text: 'What characterises an Interval DP problem?',
          options: ['Subproblems are defined by 1D ranges', 'Subproblems are defined by an interval [i, j] — combining smaller intervals builds larger ones', 'All subproblems are of size 1', 'Problems always involve strings only'],
          correctAnswer: 1 },
        { text: 'Bitmask DP is practical when n (number of elements) is?',
          options: ['Up to 10^6', 'Up to 10^5', 'Small — typically n ≤ 20', 'Exactly a power of 2'],
          correctAnswer: 2 },
        { text: 'What does the bitmask "mask" represent in TSP bitmask DP?',
          options: ['Binary encoding of the shortest path cost', 'The set of cities that have been visited — bit i is set if city i was visited', 'The current city being visited', 'The number of remaining cities'],
          correctAnswer: 1 },
      ]},
      { topicIndex: 3, questions: [
        { text: 'What is a Trie optimised for compared to a HashMap?',
          options: ['Faster exact key-value lookup', 'Native prefix-based search — find all words with a given prefix in O(prefix length)', 'Uses less memory than HashMap', 'Faster for numeric keys'],
          correctAnswer: 1 },
        { text: 'Time complexity of inserting a word of length m into a Trie?',
          options: ['O(n) where n is number of stored words', 'O(m) — one node created per character', 'O(m log n)', 'O(1)'],
          correctAnswer: 1 },
        { text: 'What does trie.startsWith("pre") return true for?',
          options: ['Only if "pre" is a complete stored word', 'If any stored word begins with the prefix "pre"', 'If "pre" is the shortest word in the trie', 'If the trie has exactly 3-character words'],
          correctAnswer: 1 },
        { text: 'Time complexity of KMP string matching for text of length n and pattern of length m?',
          options: ['O(n × m)', 'O(n + m)', 'O(n log m)', 'O(m²)'],
          correctAnswer: 1 },
        { text: 'What does the LPS array in KMP represent for each position i?',
          options: ['Longest palindromic substring ending at i', 'Length of longest proper prefix of pat[0..i] that is also a suffix', 'Length of the longest pattern match at i', 'Position of the last mismatch'],
          correctAnswer: 1 },
      ]},
      { topicIndex: 4, questions: [
        { text: 'What does XORing all elements return when all elements appear twice except one?',
          options: ['0', 'The unique element that appears once', 'The sum of all elements', 'The maximum element'],
          correctAnswer: 1 },
        { text: 'How do you check if integer n is a power of 2 using bit manipulation?',
          options: ['n % 2 == 0', 'n & (n-1) == 0 and n > 0', 'n >> 1 == 0', 'n | 1 == n'],
          correctAnswer: 1 },
        { text: 'What does path compression in Union-Find achieve?',
          options: ['Balances the tree by rank after every union', 'Flattens the tree so future find() calls are nearly O(1)', 'Removes duplicate elements from sets', 'Sorts elements within each component'],
          correctAnswer: 1 },
        { text: 'After O(n) preprocessing, time for a prefix sum range query?',
          options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'],
          correctAnswer: 2 },
        { text: 'What is a Segment Tree used for?',
          options: ['Storing strings with prefix search', 'Efficient range queries and point updates on arrays in O(log n)', 'Graph shortest path computation', 'Cycle detection in directed graphs'],
          correctAnswer: 1 },
      ]},
    ],
  },
];

// =====================================================================
//  SEED RUNNER
// =====================================================================
async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('\nConnected to MongoDB');
    console.log('URI:', MONGO_URI.replace(/:([^@]+)@/, ':****@'), '\n');

    // Clear only existing DSA track data while preserving non-DSA content.
    const dsaCourseTitles = dsaCppCourses.map((item) => item.course.title);
    const existingDsaCourses = await Course.find({
      $or: [
        { track: 'dsa-cpp' },
        { title: { $in: dsaCourseTitles } },
      ],
    })
      .select('_id')
      .lean();

    const dsaCourseIds = existingDsaCourses.map((course) => course._id);
    const dsaTopics = await Topic.find({ courseId: { $in: dsaCourseIds } })
      .select('_id')
      .lean();
    const dsaTopicIds = dsaTopics.map((topic) => topic._id);

    const [deletedTopicQuizzes, deletedTopics, deletedCourses] = await Promise.all([
      Quiz.deleteMany({ topicId: { $in: dsaTopicIds } }),
      Topic.deleteMany({ courseId: { $in: dsaCourseIds } }),
      Course.deleteMany({ _id: { $in: dsaCourseIds } }),
    ]);

    console.log(
      `Cleared DSA data: ${deletedCourses.deletedCount} courses, ${deletedTopics.deletedCount} topics, ${deletedTopicQuizzes.deletedCount} quizzes`
    );

    // Clear or update assessment quiz
    const existing = await Quiz.findOne({ isAssessment: true });
    if (existing) {
      await Quiz.findByIdAndUpdate(existing._id, { questions: assessmentQuiz.questions });
      console.log(`Updated assessment quiz — ${assessmentQuiz.questions.length} questions\n`);
    } else {
      await Quiz.create(assessmentQuiz);
      console.log(`Created assessment quiz — ${assessmentQuiz.questions.length} questions\n`);
    }

    let totalTopics = 0, totalQuestions = 0;

    for (const data of dsaCppCourses) {
      const course = await Course.create(data.course);
      console.log(`[${course.level.toUpperCase().padEnd(12)}] ${course.title}`);

      const createdTopics = [];
      for (const t of data.topics) {
        const topic = await Topic.create({ ...t, courseId: course._id });
        createdTopics.push(topic);
        totalTopics++;
        console.log(`  topic ${t.order}: ${t.title}`);
      }

      for (const q of data.quizzes) {
        const topic   = createdTopics[q.topicIndex];
        const created = await Quiz.create({
          topicId:      topic._id,
          isAssessment: false,
          questions:    q.questions,
        });
        totalQuestions += created.questions.length;
      }
    }

    console.log('\n' + '='.repeat(56));
    console.log('SEED COMPLETE');
    console.log('='.repeat(56));
    console.log(`  Track:    dsa-cpp`);
    console.log(`  Courses:  ${dsaCppCourses.length}  (beginner / intermediate / advanced)`);
    console.log(`  Topics:   ${totalTopics}  (5 per course)`);
    console.log(`  Quizzes:  ${totalTopics}  (1 per topic)`);
    console.log(`  Questions: ${totalQuestions} topic quiz questions`);
    console.log(`  Assessment: ${assessmentQuiz.questions.length} questions (Q0-4 nodejs, Q5-9 dsa-cpp)`);
    console.log('='.repeat(56) + '\n');

    process.exit(0);
  } catch (err) {
    console.error('\nSeed failed:', err.message);
    if (err.code === 11000) {
      console.error('Duplicate key — some topics already exist. Re-run to clear and reseed.');
    }
    process.exit(1);
  }
}

seed();