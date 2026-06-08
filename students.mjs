
/**
 * Create a new Person
 * @param {string} name - person name
 * @param {number} age - person age
 */
export function Person(name, age) {
    this.name = name;
    this.age = age;
}

/**
 * Say hello with name and age
 * @returns {string} introduction message
 */
Person.prototype.introduce = function () {
    return `Hello, I am ${this.name} and I am ${this.age}.`;
};

/**
 * Add one year to age
 * @returns {number} new age
 */
Person.prototype.celebrateBirthday = function () {
    this.age++;
    return this.age;
};

/**
 * Change person to student
 * @returns {Object} this person as student
 */
Person.prototype.goToUniversity = function () {
    Object.setPrototypeOf(this, Student.prototype);
    this.enrolledCourses = new Set();
    this.studyResultsProvider = null;
    this.passedCoursesCount = 0;
    return this;
};

/**
 * Student constructor
 */
export function Student() { }

Object.setPrototypeOf(Student.prototype, Person.prototype);

/**
 * Join a course
 * @param {string} courseName - course name
 * @returns {Object} this for chaining
 */
Student.prototype.enroll = function (courseName) {
    this.enrolledCourses.add(courseName);
    return this;
};

/**
 * Set exam results provider
 * @param {Object} provider - object with next() method
 * @returns {Object} this for chaining
 */
Student.prototype.assignStudyResultsProvider = function (provider) {
    this.studyResultsProvider = provider;
    return this;
};

/**
 * Get exam results from provider
 * Only get results for enrolled courses
 */
Student.prototype.goToExam = async function* () {
    if (!this.studyResultsProvider) return;

    while (true) {
        const result = await this.studyResultsProvider.next();

        if (result.done) break;

        const val = result.value;

        if (this.enrolledCourses.has(val.course)) {
            if (val.passed) {
                this.passedCoursesCount++;
            }

            yield {
                course: val.course,
                score: val.score,
                passed: val.passed
            };
        }
    }
};

/**
 * Check if student passed 10 courses
 * @returns {boolean} true if ready
 */
Student.prototype.readyForFinalExam = function () {
    return this.passedCoursesCount >= 10;
};

/**
 * Take final exam
 * Change to alumni if ready
 * @returns {boolean} true if passed
 */
Student.prototype.passFinalExam = function () {
    if (this.readyForFinalExam()) {
        Object.setPrototypeOf(this, Alumni.prototype);
        return true;
    }
    return false;
};

/**
 * Alumni constructor
 */
export function Alumni() { }

Object.setPrototypeOf(Alumni.prototype, Person.prototype);

/**
 * Alumni introduction with graduation message
 * @returns {string} frajerintroduction with graduation
 */
Alumni.prototype.introduce = function () {
    const introduction = Person.prototype.introduce.call(this);
    return introduction + " I graduated university.";
};

export default Person;