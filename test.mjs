//tests
import {Person} from './students.mjs';

let passed = 0;
let failed = 0;

function test(title, condition){
    if (condition){
        console.log(`OK ${title}`);
        passed++;
    }else{
        console.log(`NOK ${title}`);
        failed++;
    }
}

// Test Person
console.log('\n=== Person Tests ===');

const Jachym = new Person('Jachym', 25);
test('Person created with name', Jachym.name === 'Jachym');
test('Person created with age', Jachym.age === 25);

const intro = Jachym.introduce();
test('introduce() returns correct text', intro === 'Hello, I am Jachym and I am 25.');

const newAge = Jachym.celebrateBirthday();
test('celebrateBirthday() adds one year', Jachym.age === 26);
test('celebrateBirthday() returns new age', newAge === 26);

// Test Student conversion
console.log('\n=== Student Conversion Tests ===');

const person = new Person('Alice', 20);
const result = person.goToUniversity();
test('goToUniversity() returns this', result === person);
test('enrolledCourses is Set after goToUniversity', person.enrolledCourses instanceof Set);
test('studyResultsProvider initialized', person.studyResultsProvider === null);

// Test Student enrollment
console.log('\n=== Student Enrollment Tests ===');

person.enroll('Math');
test('enroll() adds course', person.enrolledCourses.has('Math'));

person.enroll('Physics');
person.enroll('Chemistry');
test('enroll() adds multiple courses', person.enrolledCourses.size === 3);

// No duplicate
person.enroll('Math');
test('enroll() prevents duplicates', person.enrolledCourses.size === 3);

// Test exam provider
console.log('\n=== Exam Provider Tests ===');

class MockProvider{
    constructor(exams){
        this.exams = exams;
        this.index = 0;
    }

    next(){
        if (this.index < this.exams.length){
            const val = this.exams[this.index];
            this.index++;
            return Promise.resolve({ value: val, done: false });
        }
        return Promise.resolve({ done: true, value: undefined });
    }
}

const student = new Person('Bob', 21);
student.goToUniversity();

for (let i = 1; i <= 12; i++){
    student.enroll(`Course${i}`);
}

const exams = [
    { course: 'Course1', score: 85, passed: true },
    { course: 'Course2', score: 90, passed: true },
    { course: 'Course3', score: 92, passed: true },
    { course: 'Course4', score: 88, passed: true },
    { course: 'Course5', score: 95, passed: true },
    { course: 'Course6', score: 87, passed: true },
    { course: 'Course7', score: 89, passed: true },
    { course: 'Course8', score: 91, passed: true },
    { course: 'Course9', score: 86, passed: true },
    { course: 'Course10', score: 93, passed: true },
    { course: 'Course11', score: 82, passed: true },
    { course: 'UnknownCourse', score: 80, passed: true },
    { course: 'Course12', score: 88, passed: true },
];

const provider = new MockProvider(exams);
student.assignStudyResultsProvider(provider);

// Test async generator
(async () =>{
    const results = [];
    for await (const result of student.goToExam()){
        results.push(result);
    }

    test('goToExam() yields results', results.length === 12);
    test('goToExam() ignores unenrolled course', results.every(r => r.course !== 'UnknownCourse'));
    test('goToExam() counts passed courses', student.passedCoursesCount === 12);

    // Test final exam
    console.log('\n=== Final Exam Tests ===');

    test('readyForFinalExam() true with 10+ passed', student.readyForFinalExam() === true);

    const passed2 = student.passFinalExam();
    test('passFinalExam() returns true when ready', passed2 === true);
    test('passFinalExam() converts to Alumni', student.introduce().includes('I graduated'));

    // Test not ready for final exam
    const student2 = new Person('Carol', 22);
    student2.goToUniversity();
    student2.enroll('C1');
    student2.enroll('C2');
    student2.enroll('C3');
    const p = new MockProvider([
        { course: 'C1', score: 80, passed: true },
        { course: 'C2', score: 80, passed: true },
        { course: 'C3', score: 80, passed: true },
    ]);
    student2.assignStudyResultsProvider(p);

    const results2 = [];
    for await (const result of student2.goToExam()){
        results2.push(result);
    }

    test('readyForFinalExam() false with < 10 passed', student2.readyForFinalExam() === false);
    test('passFinalExam() returns false when not ready', student2.passFinalExam() === false);
    test('Student stays Student when not ready', student2.enrolledCourses !== undefined);

    // Test Alumni
    console.log('\n=== Alumni Tests ===');

    const intro2 = student.introduce();
    test('Alumni.introduce() has graduation text', intro2.includes('I graduated university.'));
    test('Alumni.introduce() has base text', intro2.includes('Hello, I am'));

    // Test independent person
    console.log('\n=== Independent Person Tests ===');

    const person2 = new Person('Dave', 30);
    test('Person still works independently', person2.introduce() === 'Hello, I am Dave and I am 30.');

    // Summary
    console.log('\n=== Test Summary ===');
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Total: ${passed + failed}\n`);

    process.exit(failed > 0 ? 1 : 0);
})();
