# Students Library

JavaScript library for managing persons, students, and alumni with prototype-based inheritance.

## Features

- **Person**: Base constructor with name, age, introduce(), celebrateBirthday(), goToUniversity()
- **Student**: Inherits from Person; enroll() courses, assignStudyResultsProvider(), goToExam() async generator
- **Alumni**: Inherits from Person; extends introduce() with graduation message
- **Prototype chain**: Dynamic prototype conversion using Object.setPrototypeOf()
- **Set-based enrollment**: Efficient O(1) course lookup

## API

### Person(name, age)

Methods:
- `introduce()` → "Hello, I am {name} and I am {age}."
- `celebrateBirthday()` → new age (increments by 1)
- `goToUniversity()` → converts to Student

### Student (via goToUniversity)

Methods:
- `enroll(course)` → adds to Set, stores exam results
- `assignStudyResultsProvider(provider)` → sets provider with next() returning Promise
- `goToExam()` → async generator yielding {course, score, passed} for enrolled courses
- `readyForFinalExam()` → boolean, true if ≥10 courses passed
- `passFinalExam()` → converts to Alumni if ready

### Alumni (via passFinalExam)

Methods:
- `introduce()` → "Hello, I am {name} and I am {age}. I graduated university."

## Usage

```javascript
import { Person } from './students.mjs';

const Jachym = new Person('Jachym', 22);
console.log(john.introduce());

Jachym.goToUniversity();
Jachym.enroll('IAL').enroll('IFJ');

Jachym.examResults['IAL'] = [{ score: 90, passed: true }]; //process through goToExam()


if (Jachym.readyForFinalExam()) {
  Jachym.passFinalExam();
  console.log(Jachym.introduce()); // includes "I graduated university."
}
```

## Running

```bash

./test.sh # Run tests

node example.mjs # Run example

./doc.sh # Generate documentation
```

## Files

- `students.mjs` - Main library with JSDoc comments
- `test.mjs` - Test suite
- `test.sh` - Test runner (supports `test.sh install`)
- `doc.sh` - Documentation generator (supports `doc.sh install`)
- `example.mjs` - Usage example
- `jsdoc.json` - JSDoc configuration
- `README.md` - This file
