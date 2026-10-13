// Test suite for Step 5: Save Entire MCQ Paper to Firestore Question Bank
const fs = require('fs');
const path = require('path');

console.log('Running Step 5 Entire MCQ Paper Save Tests...');
console.log('=============================================');

const scriptCode = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');

// Helper to extract function from script.js
function extractFunction(name) {
    const regex = new RegExp(`(?:async\\s+)?function\\s+${name}\\s*\\(([^)]*)\\)\\s*\\{`, 'g');
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
    const isAsync = match[0].startsWith('async');
    const body = scriptCode.substring(startIdx + 1, endIdx - 1);
    const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
    return isAsync ? new AsyncFunction(...args, body) : new Function(...args, body);
}

const normalizeTaxonomyLabel = extractFunction('normalizeTaxonomyLabel');
const slugify = extractFunction('slugify');
const taxonomyId = extractFunction('taxonomyId');
const buildTaxonomyPath = extractFunction('buildTaxonomyPath');
const validatePaperForQuestionBank = extractFunction('validatePaperForQuestionBank');
const savePaperToQuestionBank = extractFunction('savePaperToQuestionBank');

let uidCounter = 1;
function uid(prefix = 'id') {
    return `${prefix}_${uidCounter++}`;
}

function newQuestion(text = '', options = ['', '', '', ''], correctIndex = 0) {
    return {
        id: uid('q'),
        text,
        layout: 'row',
        correctIndex,
        correctIndexes: [correctIndex],
        allowMultiCorrect: false,
        marks: 1,
        chapter: '',
        topic: '',
        subtopic: '',
        options: options.map((value, index) => ({ id: uid(`opt${index}`), text: value }))
    };
}

// Global state simulation
let toastMessages = [];
function toast(msg) {
    toastMessages.push(msg);
}

const mockLocalStorage = new Map();
const STORAGE_KEY = 'school_mcq_paper_studio_v1';
let state = {
    papers: [],
    activePaperId: null,
    activeSectionId: null,
    currentUser: null
};

function save() {
    mockLocalStorage.set(STORAGE_KEY, JSON.stringify(state));
}

function getActivePaper() {
    return state.papers.find(p => p.id === state.activePaperId) || null;
}

// In-memory Firestore database mock
const firestoreDb = {
    questions: new Map(),
    taxonomy: new Map()
};

let autoDocIdCounter = 5000;
function generateFirestoreId(prefix = 'doc') {
    return `${prefix}_${++autoDocIdCounter}_${Date.now()}`;
}

const mockAuthUser = {
    uid: 'teacher-auth-456',
    displayName: 'Math Teacher',
    email: 'teacher@school.edu'
};

const mockFirebaseBridge = {
    getCurrentUser() {
        return mockFirebaseBridge.auth?.currentUser || null;
    },
    auth: {
        currentUser: mockAuthUser
    },
    async ensureTaxonomyPath(labels) {
        const path = buildTaxonomyPath(labels);
        path.nodes.forEach(n => {
            firestoreDb.taxonomy.set(n.id, { ...n, updatedAt: new Date().toISOString() });
        });
        return path.ids;
    },
    async saveQuestionToQuestionBank(question, context = {}) {
        const user = mockFirebaseBridge.getCurrentUser();
        if (!user || !user.uid) {
            const msg = 'Please sign in with Google before saving to the Question Bank.';
            toast(msg);
            return { success: false, error: msg };
        }

        const className = String(question.className || context.className || getActivePaper()?.meta?.className || '').trim();
        const subjectName = String(question.subject || question.subjectName || context.subjectName || context.subject || getActivePaper()?.meta?.subject || '').trim();
        const chapterName = String(question.chapter || question.chapterName || context.chapterName || context.chapter || '').trim();
        const topicName = String(question.topic || question.topicName || context.topicName || context.topic || '').trim();

        const taxonomyIds = await mockFirebaseBridge.ensureTaxonomyPath({
            className,
            subjectName,
            chapterName,
            topicName
        });

        const correctIndexes = Array.isArray(question.correctIndexes) && question.correctIndexes.length > 0
            ? question.correctIndexes
            : (Number.isInteger(question.correctIndex) ? [question.correctIndex] : []);

        const optionsPayload = question.options.map((opt, index) => {
            const isCorrect = correctIndexes.includes(index) || (opt && opt.correct === true);
            const html = opt && opt.html !== undefined ? opt.html : (opt && opt.text !== undefined ? opt.text : String(opt || ''));
            return {
                html,
                correct: Boolean(isCorrect)
            };
        });

        const promptHtml = question.promptHtml !== undefined ? question.promptHtml : (question.text !== undefined ? question.text : '');

        const payload = {
            type: 'mcq',
            classId: taxonomyIds.classId,
            subjectId: taxonomyIds.subjectId,
            chapterId: taxonomyIds.chapterId,
            topicId: taxonomyIds.topicId,
            status: 'draft',
            promptHtml,
            options: optionsPayload,
            authorUid: user.uid,
            authorName: user.displayName || user.email || 'Teacher',
            updatedAt: new Date().toISOString()
        };

        let docId = question.firestoreQuestionId;
        let isUpdate = false;

        if (docId) {
            isUpdate = true;
            if (!firestoreDb.questions.has(docId)) {
                throw new Error(`Document ${docId} not found in Firestore questions collection`);
            }
            firestoreDb.questions.set(docId, { ...firestoreDb.questions.get(docId), ...payload });
            if (!context.silent) toast('Question updated in Question Bank.');
        } else {
            payload.createdAt = new Date().toISOString();
            docId = generateFirestoreId('q');
            payload.id = docId;
            firestoreDb.questions.set(docId, payload);
            question.firestoreQuestionId = docId;
            save();
            if (!context.silent) toast('Question saved to Question Bank.');
        }

        return {
            success: true,
            id: docId,
            isUpdate,
            payload,
            taxonomyIds
        };
    }
};

global.normalizeTaxonomyLabel = normalizeTaxonomyLabel;
global.slugify = slugify;
global.taxonomyId = taxonomyId;
global.buildTaxonomyPath = buildTaxonomyPath;
global.toast = toast;
global.save = save;
global.state = state;
global.getActivePaper = getActivePaper;
global.STORAGE_KEY = STORAGE_KEY;
global.currentUser = mockAuthUser;
global.isSavingPaperToQuestionBank = false;
global.validatePaperForQuestionBank = validatePaperForQuestionBank;
global.saveQuestionToQuestionBank = mockFirebaseBridge.saveQuestionToQuestionBank;
global.window = {
    firebaseBridge: mockFirebaseBridge
};

// Document mock for document.getElementById('saveQbBtn')
const mockSaveBtn = {
    disabled: false,
    textContent: 'Save to Question Bank',
    dataset: {}
};
global.document = {
    getElementById(id) {
        if (id === 'saveQbBtn') return mockSaveBtn;
        return null;
    }
};

// Test runner setup
const tests = [];
function test(name, fn) {
    tests.push({ name, fn });
}

// TEST 1: Reject unauthenticated teacher
test('Test 1: Fails gracefully when teacher is not signed in', async () => {
    mockFirebaseBridge.auth.currentUser = null;
    global.currentUser = null;
    global.state.currentUser = null;

    const dummyPaper = {
        id: 'p1',
        meta: { className: 'VIII', subject: 'Mathematics' },
        sections: [{ id: 's1', questions: [newQuestion('Q1?', ['A', 'B', 'C', 'D'], 0)] }]
    };

    const res = await savePaperToQuestionBank(dummyPaper);
    if (res.success !== false) throw new Error('Expected failure when unauthenticated');
    if (!toastMessages.some(m => m.includes('Please sign in with Google before saving to the Question Bank.'))) {
        throw new Error('Sign-in prompt toast was not displayed');
    }
    if (firestoreDb.questions.size !== 0) throw new Error('No Firestore documents should be created when unauthenticated');
});

// TEST 2: Pre-save paper validation with specific question numbers and error reasons
test('Test 2: Pre-save validation catches invalid questions with exact question number and reason', async () => {
    mockFirebaseBridge.auth.currentUser = mockAuthUser;
    global.currentUser = mockAuthUser;
    global.state.currentUser = mockAuthUser;

    const invalidPaper = {
        id: 'p_invalid',
        meta: { className: 'VIII', subject: 'Mathematics' },
        sections: [
            {
                id: 'sec1',
                name: 'Section 1',
                questions: [
                    // Question 1: Valid
                    {
                        text: 'Valid Question 1',
                        options: [{ text: 'A' }, { text: 'B' }, { text: 'C' }, { text: 'D' }],
                        correctIndex: 0,
                        chapter: 'Real Numbers',
                        topic: 'Rational Numbers'
                    },
                    // Question 2: Missing correct answer
                    {
                        text: 'Question 2 without correct answer',
                        options: [{ text: 'A' }, { text: 'B' }, { text: 'C' }, { text: 'D' }],
                        correctIndexes: [],
                        chapter: 'Real Numbers',
                        topic: 'Rational Numbers'
                    }
                ]
            },
            {
                id: 'sec2',
                name: 'Section 2',
                questions: [
                    // Question 3: Not 4 options
                    {
                        text: 'Question 3 with 2 options',
                        options: [{ text: 'A' }, { text: 'B' }],
                        correctIndex: 0,
                        chapter: 'Real Numbers',
                        topic: 'Rational Numbers'
                    },
                    // Question 4: Missing topic
                    {
                        text: 'Question 4 missing topic',
                        options: [{ text: 'A' }, { text: 'B' }, { text: 'C' }, { text: 'D' }],
                        correctIndex: 0,
                        chapter: 'Real Numbers',
                        topic: ''
                    }
                ]
            }
        ]
    };

    const validation = validatePaperForQuestionBank(invalidPaper);
    if (validation.valid !== false) throw new Error('Expected validation to fail');
    if (validation.errors.length < 3) throw new Error(`Expected at least 3 errors, got ${validation.errors.length}`);

    // Verify exact error messages identify affected questions
    const errStr = validation.errors.join(' | ');
    if (!errStr.includes('Question 2 cannot be saved: no correct answer selected.')) {
        throw new Error(`Missing expected Question 2 error in: "${errStr}"`);
    }
    if (!errStr.includes('Question 3 cannot be saved: question must have exactly four options.')) {
        throw new Error(`Missing expected Question 3 error in: "${errStr}"`);
    }
    if (!errStr.includes('Question 4 cannot be saved: Topic is required.')) {
        throw new Error(`Missing expected Question 4 error in: "${errStr}"`);
    }

    // Call savePaperToQuestionBank with invalid paper and confirm save aborts with no Firestore writes
    toastMessages = [];
    const saveRes = await savePaperToQuestionBank(invalidPaper);
    if (saveRes.success !== false) throw new Error('savePaperToQuestionBank should fail for invalid paper');
    if (firestoreDb.questions.size !== 0) throw new Error('No documents should have been written to Firestore on validation failure');
});

// TEST 3: Create and save the temporary test paper matching Requirement 27
let testPaper = null;
let savedIds = [];

test('Test 3: Save the ENTIRE test paper (3 questions across 2 sections) to Firestore', async () => {
    mockFirebaseBridge.auth.currentUser = mockAuthUser;
    global.currentUser = mockAuthUser;
    global.state.currentUser = mockAuthUser;

    // Build the exact test paper from Requirement 27:
    // Section 1:
    // Q1: "Which of the following is a rational number?" (A: 1/2, B: √2, C: π, D: √3), Correct: A
    // Q2: "Which are prime numbers?" (A: 2, B: 3, C: 4, D: 5), Correct: A, B, D
    // Section 2:
    // Q3: "Find the value of √1.1664" (A: 1.08, B: 2.04, C: 2.08, D: 3.35), Correct: A

    const q1 = {
        id: uid('q'),
        text: 'Which of the following is a rational number?',
        options: [{ text: '1/2' }, { text: '√2' }, { text: 'π' }, { text: '√3' }],
        correctIndex: 0,
        correctIndexes: [0],
        chapter: 'Real Numbers',
        topic: 'Rational Numbers'
    };

    const q2 = {
        id: uid('q'),
        text: 'Which are prime numbers?',
        options: [{ text: '2' }, { text: '3' }, { text: '4' }, { text: '5' }],
        correctIndexes: [0, 1, 3], // A, B, D are correct
        chapter: 'Real Numbers',
        topic: 'Prime Numbers'
    };

    const q3 = {
        id: uid('q'),
        text: 'Find the value of √1.1664',
        options: [{ text: '1.08' }, { text: '2.04' }, { text: '2.08' }, { text: '3.35' }],
        correctIndex: 0,
        correctIndexes: [0],
        chapter: 'Squares and Square Roots',
        topic: 'Square Roots'
    };

    testPaper = {
        id: uid('paper'),
        title: 'Class VIII Test Paper',
        meta: {
            className: 'VIII',
            subject: 'Mathematics'
        },
        sections: [
            {
                id: uid('section'),
                name: 'Section 1',
                questions: [q1, q2]
            },
            {
                id: uid('section'),
                name: 'Section 2',
                questions: [q3]
            }
        ]
    };

    state.papers = [testPaper];
    state.activePaperId = testPaper.id;

    toastMessages = [];
    const result = await savePaperToQuestionBank(testPaper);

    if (!result.success) throw new Error(`Saving paper failed: ${JSON.stringify(result)}`);
    if (result.savedCount !== 3) throw new Error(`Expected 3 questions saved, got: ${result.savedCount}`);
    if (result.failedCount !== 0) throw new Error(`Expected 0 failed questions, got: ${result.failedCount}`);

    // Verify all 3 questions received firestoreQuestionId
    if (!q1.firestoreQuestionId) throw new Error('Q1 missing firestoreQuestionId');
    if (!q2.firestoreQuestionId) throw new Error('Q2 missing firestoreQuestionId');
    if (!q3.firestoreQuestionId) throw new Error('Q3 missing firestoreQuestionId');

    savedIds = [q1.firestoreQuestionId, q2.firestoreQuestionId, q3.firestoreQuestionId];
    if (new Set(savedIds).size !== 3) throw new Error('Expected 3 unique Firestore document IDs');

    // Verify Firestore collection size
    if (firestoreDb.questions.size !== 3) {
        throw new Error(`Expected exactly 3 documents in Firestore questions, got: ${firestoreDb.questions.size}`);
    }

    // Verify completion toast
    if (!toastMessages.some(m => m.includes('3 questions saved to Question Bank.'))) {
        throw new Error(`Expected toast "3 questions saved to Question Bank.", got: ${JSON.stringify(toastMessages)}`);
    }
});

// TEST 4: Verify schema, content, and multiple-correct flags of the 3 stored questions
test('Test 4: Verify stored questions schema, content preservation, and multiple-correct flags', () => {
    const [id1, id2, id3] = savedIds;
    const doc1 = firestoreDb.questions.get(id1);
    const doc2 = firestoreDb.questions.get(id2);
    const doc3 = firestoreDb.questions.get(id3);

    // Common schema checks
    [doc1, doc2, doc3].forEach(doc => {
        if (doc.type !== 'mcq') throw new Error(`Expected type 'mcq', got '${doc.type}'`);
        if (doc.status !== 'draft') throw new Error(`Expected status 'draft', got '${doc.status}'`);
        if (doc.authorUid !== mockAuthUser.uid) throw new Error(`Expected authorUid '${mockAuthUser.uid}', got '${doc.authorUid}'`);
        if (doc.authorName !== mockAuthUser.displayName) throw new Error(`Expected authorName '${mockAuthUser.displayName}', got '${doc.authorName}'`);
        if (doc.classId !== 'class_viii') throw new Error(`Expected classId 'class_viii', got '${doc.classId}'`);
        if (doc.subjectId !== 'class_viii__subject_mathematics') throw new Error(`Expected subjectId 'class_viii__subject_mathematics', got '${doc.subjectId}'`);
        if (!doc.createdAt) throw new Error('Missing createdAt');
        if (!doc.updatedAt) throw new Error('Missing updatedAt');
    });

    // Question 1: Single correct
    if (doc1.promptHtml !== 'Which of the following is a rational number?') throw new Error('Q1 prompt altered');
    if (doc1.options.length !== 4) throw new Error('Q1 options count != 4');
    if (!doc1.options[0].correct || doc1.options[0].html !== '1/2') throw new Error('Q1 Option A incorrect');
    if (doc1.options[1].correct || doc1.options[1].html !== '√2') throw new Error('Q1 Option B incorrect');
    if (doc1.options[2].correct || doc1.options[2].html !== 'π') throw new Error('Q1 Option C incorrect');
    if (doc1.options[3].correct || doc1.options[3].html !== '√3') throw new Error('Q1 Option D incorrect');

    // Question 2: Multiple correct (A: true, B: true, C: false, D: true)
    if (doc2.promptHtml !== 'Which are prime numbers?') throw new Error('Q2 prompt altered');
    if (doc2.options.length !== 4) throw new Error('Q2 options count != 4');
    if (doc2.options[0].correct !== true || doc2.options[0].html !== '2') throw new Error('Q2 Option A should be true');
    if (doc2.options[1].correct !== true || doc2.options[1].html !== '3') throw new Error('Q2 Option B should be true');
    if (doc2.options[2].correct !== false || doc2.options[2].html !== '4') throw new Error('Q2 Option C should be false');
    if (doc2.options[3].correct !== true || doc2.options[3].html !== '5') throw new Error('Q2 Option D should be true');

    // Question 3: Section 2 MathLive formula question
    if (doc3.promptHtml !== 'Find the value of √1.1664') throw new Error('Q3 prompt altered');
    if (doc3.options[0].correct !== true || doc3.options[0].html !== '1.08') throw new Error('Q3 Option A should be true');
    if (doc3.options[1].correct !== false || doc3.options[1].html !== '2.04') throw new Error('Q3 Option B should be false');
    if (doc3.chapterId !== 'class_viii__subject_mathematics__chapter_squares-and-square-roots') {
        throw new Error(`Q3 chapterId mismatch: ${doc3.chapterId}`);
    }
});

// TEST 5: Verify localStorage persistence
test('Test 5: Verify question.firestoreQuestionId persisted to localStorage across all sections', () => {
    const raw = mockLocalStorage.get(STORAGE_KEY);
    if (!raw) throw new Error('localStorage empty');
    const parsed = JSON.parse(raw);
    const paper = parsed.papers.find(p => p.id === testPaper.id);
    if (!paper) throw new Error('Paper missing in localStorage');

    const storedQ1 = paper.sections[0].questions[0];
    const storedQ2 = paper.sections[0].questions[1];
    const storedQ3 = paper.sections[1].questions[0];

    if (storedQ1.firestoreQuestionId !== savedIds[0]) throw new Error('Q1 firestoreQuestionId not in localStorage');
    if (storedQ2.firestoreQuestionId !== savedIds[1]) throw new Error('Q2 firestoreQuestionId not in localStorage');
    if (storedQ3.firestoreQuestionId !== savedIds[2]) throw new Error('Q3 firestoreQuestionId not in localStorage');
});

// TEST 6: Second save updates in-place and produces 0 duplicates
test('Test 6: Second save updates existing documents with 0 duplicate documents created', async () => {
    const countBefore = firestoreDb.questions.size;
    if (countBefore !== 3) throw new Error(`Expected 3 questions before second save, got: ${countBefore}`);

    // Update Q1 prompt text
    testPaper.sections[0].questions[0].text = 'Which of the following is a rational number? (Updated)';

    toastMessages = [];
    const result = await savePaperToQuestionBank(testPaper);

    if (!result.success) throw new Error(`Second save failed: ${JSON.stringify(result)}`);
    if (result.updatedCount !== 3) throw new Error(`Expected 3 updated questions, got: ${result.updatedCount}`);
    if (result.savedCount !== 0) throw new Error(`Expected 0 newly created questions, got: ${result.savedCount}`);

    const countAfter = firestoreDb.questions.size;
    if (countAfter !== countBefore) {
        throw new Error(`Duplicates created! Before: ${countBefore}, After: ${countAfter}`);
    }

    // Verify updated text took effect on document
    const updatedDoc1 = firestoreDb.questions.get(savedIds[0]);
    if (updatedDoc1.promptHtml !== 'Which of the following is a rational number? (Updated)') {
        throw new Error('Q1 updated prompt was not saved to Firestore');
    }
});

// TEST 7: Double-click prevention
test('Test 7: Double-clicking Save button is prevented while save is in progress', async () => {
    // Simulate isSavingPaperToQuestionBank active
    let duplicateCreated = false;
    const initialCount = firestoreDb.questions.size;

    // Trigger savePaperToQuestionBank and concurrent call immediately
    const firstCallPromise = savePaperToQuestionBank(testPaper);
    const concurrentCallRes = await savePaperToQuestionBank(testPaper);

    if (concurrentCallRes.inProgress !== true) {
        throw new Error('Concurrent call should have returned inProgress === true');
    }

    await firstCallPromise;

    const finalCount = firestoreDb.questions.size;
    if (finalCount !== initialCount) {
        throw new Error(`Double click created duplicate documents! Initial: ${initialCount}, Final: ${finalCount}`);
    }

    // Verify button was re-enabled after save completes
    if (mockSaveBtn.disabled !== false) {
        throw new Error('Save button should be re-enabled after save completes');
    }
});

// Run all tests sequentially
(async () => {
    let passed = 0;
    let failed = 0;
    for (const t of tests) {
        try {
            await t.fn();
            console.log(`[PASS] ${t.name}`);
            passed++;
        } catch (err) {
            console.error(`[FAIL] ${t.name}: ${err.message}`);
            failed++;
        }
    }
    console.log('=============================================');
    console.log(`Summary: ${passed} passed, ${failed} failed.`);
    if (failed > 0) process.exit(1);
})();
