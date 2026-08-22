const fs = require('fs');
const path = require('path');

// Extract parser functions dynamically from script.js to avoid satisfaction of full browser-only DOM code in Node.js
const scriptCode = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');

function extractFunction(name) {
    const regex = new RegExp(`function\\s+${name}\\s*\\(([^)]*)\\)\\s*\\{`, 'g');
    const match = regex.exec(scriptCode);
    if (!match) throw new Error(`Function ${name} not found in script.js`);
    const args = match[1].split(',').map(s => s.trim()).filter(Boolean);
    const startIdx = match.index + match[0].length - 1;
    
    let braceCount = 0;
    let endIdx = -1;
    for (let i = startIdx; i < scriptCode.length; i++) {
        if (scriptCode[i] === '{') braceCount++;
        else if (scriptCode[i] === '}') braceCount--;
        if (braceCount === 0) {
            endIdx = i + 1;
            break;
        }
    }
    if (endIdx === -1) throw new Error(`Matching brace not found for ${name}`);
    const body = scriptCode.substring(startIdx + 1, endIdx - 1);
    return new Function(...args, body);
}

// Set up the context variables that the functions reference
global.IMPORT_QUESTIONS_REQUIRED_HEADERS = ['section', 'question', 'option1', 'option2', 'option3', 'option4', 'correct_option'];
global.LABELS = ['A', 'B', 'C', 'D'];
global.normalizeImportCsvHeader = (header) => String(header || '').trim().toLowerCase();
global.getUploadedFilename = () => null;
global.uid = (prefix) => `${prefix}_test_${Math.random()}`;
global.newOption = (index, text = '') => ({ id: `opt${index}`, text });

// Dynamically compile functions
const parseImportQuestionsPlainText = extractFunction('parseImportQuestionsPlainText');
const parseImportQuestionsCsv = extractFunction('parseImportQuestionsCsv');
const validateStudentAnswer = extractFunction('validateStudentAnswer');
const newQuestion = extractFunction('newQuestion');
const getAnswerKeyLabel = extractFunction('getAnswerKeyLabel');

// Expose parseImportQuestionsPlainText to parseImportQuestionsCsv inside global context
global.parseImportQuestionsPlainText = parseImportQuestionsPlainText;
global.newQuestion = newQuestion;
global.getAnswerKeyLabel = getAnswerKeyLabel;

// Run the tests
const tests = [];
function test(name, fn) {
    tests.push({ name, fn });
}

test('Standard CSV Import', () => {
    const csvContent = `"section","question","option1","option2","option3","option4","correct_option"
"Mathematics","Degree measure of a circle is ___ degrees","90","180","270","360","D"
"Mathematics","If a line intersects a circle at two distinct points, then it is called","Secant","Tangent","Median","Altitude","A"`;

    const result = parseImportQuestionsCsv(csvContent);
    if (result.errors.length) throw new Error(`Should have no errors, got: ${result.errors.join(', ')}`);
    if (result.totalValidRows !== 2) throw new Error(`Expected 2 valid rows, got ${result.totalValidRows}`);
    
    const row1 = result.validRows[0];
    if (row1.section !== 'Mathematics') throw new Error(`Row 1 section wrong: ${row1.section}`);
    if (row1.question !== 'Degree measure of a circle is ___ degrees') throw new Error(`Row 1 question wrong: ${row1.question}`);
    if (row1.options[3] !== '360') throw new Error(`Row 1 option4 wrong: ${row1.options[3]}`);
    if (row1.correctOption !== 'D') throw new Error(`Row 1 correct_option wrong: ${row1.correctOption}`);
});

test('Plain AI-Generated Text', () => {
    const textContent = `Physics

1. The quantity which is measurable is called ______.

a) Physical quantity
b) Standard quantity
c) Natural quantity
d) General quantity

Answer: A`;

    const result = parseImportQuestionsCsv(textContent);
    if (result.errors.length) throw new Error(`Should have no errors, got: ${result.errors.join(', ')}`);
    if (result.totalValidRows !== 1) throw new Error(`Expected 1 valid row, got ${result.totalValidRows}`);
    
    const row = result.validRows[0];
    if (row.section !== 'Physics') throw new Error(`Section wrong: ${row.section}`);
    if (row.question !== 'The quantity which is measurable is called ______.') throw new Error(`Question wrong: ${row.question}`);
    if (row.options[0] !== 'Physical quantity') throw new Error(`Option A wrong: ${row.options[0]}`);
    if (row.correctOption !== 'A') throw new Error(`Correct option wrong: ${row.correctOption}`);
});

test('ChatGPT Output', () => {
    const chatGptContent = `**Mathematics**

**Q1. What is the value of pi?**
A) 3.14
B) 2.71
C) 1.41
D) 1.62

**Correct Answer:** A`;

    const result = parseImportQuestionsCsv(chatGptContent);
    if (result.errors.length) throw new Error(`Should have no errors, got: ${result.errors.join(', ')}`);
    const row = result.validRows[0];
    if (row.section !== 'Mathematics') throw new Error(`Section wrong: ${row.section}`);
    if (row.question !== 'What is the value of pi?') throw new Error(`Question wrong: ${row.question}`);
    if (row.options[0] !== '3.14') throw new Error(`Option A wrong: ${row.options[0]}`);
    if (row.correctOption !== 'A') throw new Error(`Correct option wrong: ${row.correctOption}`);
});

test('Gemini Output', () => {
    const geminiContent = `### Chemistry

* Q1: What is H2O?
  * a. Water
  * b. Oxygen
  * c. Hydrogen
  * d. Nitrogen
Ans. A`;

    const result = parseImportQuestionsCsv(geminiContent);
    if (result.errors.length) throw new Error(`Should have no errors, got: ${result.errors.join(', ')}`);
    const row = result.validRows[0];
    if (row.section !== 'Chemistry') throw new Error(`Section wrong: ${row.section}`);
    if (row.question !== 'What is H2O?') throw new Error(`Question wrong: ${row.question}`);
    if (row.options[0] !== 'Water') throw new Error(`Option A wrong: ${row.options[0]}`);
});

test('Claude Output', () => {
    const claudeContent = `Question 1: What is force?
A. mass x acceleration
B. mass / acceleration
C. mass + acceleration
D. mass - acceleration
Correct Answer: A`;

    const result = parseImportQuestionsCsv(claudeContent);
    if (result.errors.length) throw new Error(`Should have no errors, got: ${result.errors.join(', ')}`);
    const row = result.validRows[0];
    if (row.section !== 'General') throw new Error(`Default fallback section wrong: ${row.section}`);
    if (row.question !== 'What is force?') throw new Error(`Question wrong: ${row.question}`);
    if (row.options[0] !== 'mass x acceleration') throw new Error(`Option A wrong: ${row.options[0]}`);
});

test('Numbered MCQs / Validation Errors', () => {
    const incompleteContent = `Physics

12. Another question
a) Option 1
b) Option 2
d) Option 4
Answer: B`;

    const result = parseImportQuestionsCsv(incompleteContent);
    if (result.errors.length === 0) throw new Error('Expected validation errors for missing Option C');
    if (!result.errors.includes('Question 12 is missing Option C')) {
        throw new Error(`Expected specific error message "Question 12 is missing Option C", got: ${result.errors.join(', ')}`);
    }
});

test('Markdown Formatted MCQs', () => {
    const markdownContent = `### Section 1
1. Question with *italic* and **bold**
a) *Option 1*
b) **Option 2**
c) Option 3
d) Option 4
Correct Answer: B`;

    const result = parseImportQuestionsCsv(markdownContent);
    if (result.errors.length) throw new Error(`Should have no errors, got: ${result.errors.join(', ')}`);
    const row = result.validRows[0];
    if (row.question !== 'Question with *italic* and **bold**') throw new Error(`Question formatting mismatch: ${row.question}`);
    if (row.options[0] !== 'Option 1') throw new Error(`Option 1 markdown strip wrong: ${row.options[0]}`);
    if (row.options[1] !== 'Option 2') throw new Error(`Option 2 markdown strip wrong: ${row.options[1]}`);
});

test('Mixed Line Endings (Windows/Linux/Mac)', () => {
    const mixedContent = 'Physics\r\n1. Question\ra) Option 1\nb) Option 2\r\nc) Option 3\nd) Option 4\r\nAnswer: A';
    const result = parseImportQuestionsCsv(mixedContent);
    if (result.errors.length) throw new Error(`Should have no errors, got: ${result.errors.join(', ')}`);
    if (result.totalValidRows !== 1) throw new Error(`Expected 1 valid row, got ${result.totalValidRows}`);
});

test('Multiple Correct Options Import', () => {
    const csvContent = `"section","question","option1","option2","option3","option4","correct_option"
"Mathematics","Select all prime numbers","1","2","3","4","B, C"`;

    const result = parseImportQuestionsCsv(csvContent);
    if (result.errors.length) throw new Error(`Should have no errors, got: ${result.errors.join(', ')}`);
    if (result.totalValidRows !== 1) throw new Error(`Expected 1 valid row, got ${result.totalValidRows}`);
    
    const row = result.validRows[0];
    if (row.correctOption !== 'B, C') throw new Error(`Expected correct_option to be "B, C", got "${row.correctOption}"`);
});

test('TEST 1: Single Correct - Student selects Correct option', () => {
    const question = newQuestion('What is 2+2?', ['2', '3', '4', '5'], 2); // Correct = C (index 2)
    question.qType = 'single';
    question.allowMultiCorrect = false;
    const isCorrect = validateStudentAnswer(question, ['C']);
    if (!isCorrect) throw new Error('TEST 1 failed: Expected A to be correct');
});

test('TEST 2: Single Correct - Student selects Incorrect option', () => {
    const question = newQuestion('What is 2+2?', ['2', '3', '4', '5'], 2); // Correct = C (index 2)
    question.qType = 'single';
    question.allowMultiCorrect = false;
    const isCorrect = validateStudentAnswer(question, ['B']);
    if (isCorrect) throw new Error('TEST 2 failed: Expected B to be incorrect');
});

test('TEST 3: Multiple Correct - Student selects All Correct options', () => {
    const question = newQuestion('Select prime numbers', ['1', '2', '3', '4'], 1); // Correct = B (index 1), C (index 2)
    question.qType = 'multiple';
    question.allowMultiCorrect = true;
    question.correctIndexes = [1, 2];
    const isCorrect = validateStudentAnswer(question, ['B', 'C']);
    if (!isCorrect) throw new Error('TEST 3 failed: Expected B, C to be correct');
});

test('TEST 4: Multiple Correct - Student selects Partial Correct options', () => {
    const question = newQuestion('Select prime numbers', ['1', '2', '3', '4'], 1); // Correct = B (index 1), C (index 2)
    question.qType = 'multiple';
    question.allowMultiCorrect = true;
    question.correctIndexes = [1, 2];
    const isCorrect = validateStudentAnswer(question, ['B']);
    if (isCorrect) throw new Error('TEST 4 failed: Expected B alone to be incorrect');
});

test('TEST 5: Multiple Correct - Student selects Extra Incorrect options', () => {
    const question = newQuestion('Select prime numbers', ['1', '2', '3', '4'], 1); // Correct = B (index 1), C (index 2)
    question.qType = 'multiple';
    question.allowMultiCorrect = true;
    question.correctIndexes = [1, 2];
    const isCorrect = validateStudentAnswer(question, ['B', 'C', 'D']);
    if (isCorrect) throw new Error('TEST 5 failed: Expected B, C, D to be incorrect');
});

test('TEST 6: CSV Import Single Correct', () => {
    const csvContent = `"section","question","option1","option2","option3","option4","correct_option"
"Mathematics","Single Choice Question","1","2","3","4","A"`;
    const result = parseImportQuestionsCsv(csvContent);
    if (result.errors.length) throw new Error('TEST 6 failed: import error');
    const row = result.validRows[0];
    if (row.correctOption !== 'A') throw new Error('TEST 6 failed: wrong correctOption');
});

test('TEST 7: CSV Import Multiple Correct', () => {
    const csvContent = `"section","question","option1","option2","option3","option4","correct_option"
"Mathematics","Multiple Choice Question","1","2","3","4","A,B,D"`;
    const result = parseImportQuestionsCsv(csvContent);
    if (result.errors.length) throw new Error('TEST 7 failed: import error');
    const row = result.validRows[0];
    if (row.correctOption !== 'A,B,D') throw new Error('TEST 7 failed: wrong correctOption');
});

test('TEST 8: Export Multiple Correct answer label', () => {
    const question = newQuestion('Select prime numbers', ['1', '2', '3', '4'], 1);
    question.qType = 'multiple';
    question.allowMultiCorrect = true;
    question.correctIndexes = [0, 1, 3]; // A, B, D
    const label = getAnswerKeyLabel(question);
    if (label !== 'A, B, D') throw new Error(`TEST 8 failed: Expected "A, B, D", got "${label}"`);
});

test('TEST 9: Question duplication preserves multiple correct options', () => {
    const original = newQuestion('Select prime numbers', ['1', '2', '3', '4'], 1);
    original.qType = 'multiple';
    original.allowMultiCorrect = true;
    original.correctIndexes = [1, 2];
    
    const copy = JSON.parse(JSON.stringify(original));
    if (copy.qType !== 'multiple') throw new Error('TEST 9 failed: qType not copied');
    if (copy.allowMultiCorrect !== true) throw new Error('TEST 9 failed: allowMultiCorrect not copied');
    if (!copy.correctIndexes || copy.correctIndexes[0] !== 1 || copy.correctIndexes[1] !== 2) {
        throw new Error('TEST 9 failed: correctIndexes not copied');
    }
});

test('TEST 10: Mixed Paper Verification', () => {
    const paper = {
        title: 'Mixed Exam',
        sections: [
            {
                name: 'Section A',
                questions: [
                    { qType: 'single', correctIndex: 0, correctIndexes: [0] },
                    { qType: 'multiple', correctIndex: 1, correctIndexes: [1, 2], allowMultiCorrect: true },
                    { qType: 'single', correctIndex: 2, correctIndexes: [2] }
                ]
            }
        ]
    };
    
    const labels = paper.sections[0].questions.map(getAnswerKeyLabel);
    if (labels[0] !== 'A') throw new Error('TEST 10 failed: Q1 should be A');
    if (labels[1] !== 'B, C') throw new Error('TEST 10 failed: Q2 should be B, C');
    if (labels[2] !== 'C') throw new Error('TEST 10 failed: Q3 should be C');
});

// Run all tests
let failedCount = 0;
console.log('Running MCQ Importer Unit Tests...');
console.log('==================================');
tests.forEach(t => {
    try {
        t.fn();
        console.log(`[PASS] ${t.name}`);
    } catch (err) {
        console.error(`[FAIL] ${t.name}`);
        console.error(err);
        failedCount++;
    }
});
console.log('==================================');
if (failedCount > 0) {
    console.error(`${failedCount} test(s) failed.`);
    process.exit(1);
} else {
    console.log('All tests passed successfully!');
}
