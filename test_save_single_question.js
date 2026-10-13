// Step 4 Test Suite: Saving ONE MCQ Question to Firestore
const fs = require('fs');
const path = require('path');

console.log('Running Step 4 Single MCQ Save Tests...');
console.log('=======================================');

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

// Extract functions
const normalizeTaxonomyLabel = extractFunction('normalizeTaxonomyLabel');
const slugify = extractFunction('slugify');
const taxonomyId = extractFunction('taxonomyId');
const buildTaxonomyPath = extractFunction('buildTaxonomyPath');
const saveQuestionToQuestionBank = extractFunction('saveQuestionToQuestionBank');
const newQuestion = extractFunction('newQuestion');

// Global mock environment
global.normalizeTaxonomyLabel = normalizeTaxonomyLabel;
global.slugify = slugify;
global.taxonomyId = taxonomyId;
global.buildTaxonomyPath = buildTaxonomyPath;
global.saveQuestionToQuestionBank = saveQuestionToQuestionBank;
global.newQuestion = newQuestion;
global.uid = (prefix) => `${prefix}_test_${Math.random().toString(36).slice(2, 7)}`;
global.newOption = (index, text = '') => ({ id: `opt${index}`, text });

let lastToastMessage = '';
global.toast = (msg) => { lastToastMessage = msg; };

const mockLocalStorage = new Map();
global.localStorage = {
    getItem(k) { return mockLocalStorage.get(k) || null; },
    setItem(k, v) { mockLocalStorage.set(k, String(v)); },
    clear() { mockLocalStorage.clear(); }
};
global.STORAGE_KEY = 'school_mcq_paper_studio_v1';

global.state = {
    papers: [
        {
            id: 'paper_1',
            meta: {
                className: 'VIII',
                subject: 'Mathematics'
            },
            sections: [{ id: 'sec_1', questions: [] }]
        }
    ],
    activePaperId: 'paper_1',
    currentUser: null
};
global.getActivePaper = () => global.state.papers[0];
global.save = () => {
    global.localStorage.setItem(global.STORAGE_KEY, JSON.stringify(global.state));
};
global.currentUser = null;

// Mock in-memory Firestore Database
const firestoreDb = {
    taxonomy: new Map(),
    questions: new Map()
};

let autoDocIdCounter = 1000;
function generateFirestoreId(prefix = 'doc') {
    return `${prefix}_${++autoDocIdCounter}_${Date.now()}`;
}

const mockDb = {
    batch() {
        const ops = [];
        return {
            set(ref, data, opts = {}) { ops.push({ ref, data, opts }); },
            async commit() {
                for (const op of ops) {
                    const col = op.ref.col;
                    const id = op.ref.id;
                    if (op.opts.merge && firestoreDb[col].has(id)) {
                        firestoreDb[col].set(id, { ...firestoreDb[col].get(id), ...op.data });
                    } else {
                        firestoreDb[col].set(id, { ...op.data });
                    }
                }
            }
        };
    },
    async addDoc(colName, data) {
        const id = generateFirestoreId('q');
        firestoreDb[colName].set(id, { id, ...data });
        return { id };
    },
    async updateDoc(docRef, data) {
        const colName = docRef.col;
        const id = docRef.id;
        if (!firestoreDb[colName].has(id)) throw new Error(`Document ${id} not found in ${colName}`);
        firestoreDb[colName].set(id, { ...firestoreDb[colName].get(id), ...data });
    },
    async getDoc(docRef) {
        const colName = docRef.col;
        const id = docRef.id;
        const exists = firestoreDb[colName].has(id);
        return {
            exists() { return exists; },
            data() { return exists ? firestoreDb[colName].get(id) : null; }
        };
    }
};

// Setup mock window.firebaseBridge with Firestore functionality matching firebase-init.js
const mockAuthUser = {
    uid: 'teacher_sethvika_01',
    displayName: 'Sethvika Bonthu',
    email: 'sethvika@example.com'
};

const mockFirebaseBridge = {
    app: {},
    auth: { currentUser: null },
    db: mockDb,
    COLLECTIONS: {
        taxonomy: 'qb_taxonomy_v1',
        questions: 'qb_questions_v1'
    },
    getCurrentUser: () => mockFirebaseBridge.auth.currentUser,
    ensureTaxonomyPath: async (labels) => {
        if (!mockFirebaseBridge.auth.currentUser) {
            throw new Error('User must be signed in to create or update taxonomy in Firestore.');
        }
        const path = buildTaxonomyPath(labels);
        const batch = mockDb.batch();
        path.nodes.forEach(node => {
            batch.set({ col: 'taxonomy', id: node.id }, {
                ...node,
                updatedAt: '2026-09-17T16:50:00.000Z'
            }, { merge: true });
        });
        await batch.commit();
        return path.ids;
    },
    saveQuestionToQuestionBank: async (question, context = {}) => {
        const user = mockFirebaseBridge.auth.currentUser;
        if (!user || !user.uid) {
            const msg = 'Please sign in with Google before saving to the Question Bank.';
            global.toast(msg);
            return { success: false, error: msg };
        }

        if (!question || typeof question !== 'object') {
            const msg = 'Unable to save question to Question Bank: Question data is missing.';
            global.toast(msg);
            return { success: false, error: msg };
        }

        if (question.type && question.type !== 'mcq') {
            const msg = 'Unable to save question to Question Bank: Question must be an MCQ.';
            global.toast(msg);
            return { success: false, error: msg };
        }

        if (!Array.isArray(question.options) || question.options.length !== 4) {
            const msg = 'Unable to save question to Question Bank: Question must have exactly four options.';
            global.toast(msg);
            return { success: false, error: msg };
        }

        const correctIndexes = Array.isArray(question.correctIndexes) && question.correctIndexes.length > 0
            ? question.correctIndexes
            : (Number.isInteger(question.correctIndex) ? [question.correctIndex] : []);
        const hasCorrectOption = correctIndexes.length > 0 || question.options.some(opt => opt && opt.correct === true);
        if (!hasCorrectOption) {
            const msg = 'Unable to save question to Question Bank: Question must have at least one correct answer.';
            global.toast(msg);
            return { success: false, error: msg };
        }

        const className = String(question.className || context.className || global.getActivePaper()?.meta?.className || '').trim();
        if (!className) {
            const msg = 'Unable to save question to Question Bank: Class is required.';
            global.toast(msg);
            return { success: false, error: msg };
        }

        const subjectName = String(question.subject || question.subjectName || context.subjectName || context.subject || global.getActivePaper()?.meta?.subject || '').trim();
        if (!subjectName) {
            const msg = 'Unable to save question to Question Bank: Subject is required.';
            global.toast(msg);
            return { success: false, error: msg };
        }

        const chapterName = String(question.chapter || question.chapterName || context.chapterName || context.chapter || '').trim();
        const topicName = String(question.topic || question.topicName || context.topicName || context.topic || '').trim();
        if (!chapterName || !topicName) {
            const msg = 'Unable to save question to Question Bank: Chapter and topic are required.';
            global.toast(msg);
            return { success: false, error: msg };
        }

        try {
            const taxonomyIds = await mockFirebaseBridge.ensureTaxonomyPath({
                className,
                subjectName,
                chapterName,
                topicName
            });

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
                updatedAt: '2026-09-17T16:50:00.000Z'
            };

            let docId = question.firestoreQuestionId;
            let isUpdate = false;

            if (docId) {
                isUpdate = true;
                await mockDb.updateDoc({ col: 'questions', id: docId }, payload);
                global.toast('Question updated in Question Bank.');
            } else {
                payload.createdAt = '2026-09-17T16:50:00.000Z';
                const docRef = await mockDb.addDoc('questions', payload);
                docId = docRef.id;
                question.firestoreQuestionId = docId;
                global.save();
                global.toast('Question saved to Question Bank.');
            }

            return {
                success: true,
                id: docId,
                isUpdate,
                payload,
                taxonomyIds
            };
        } catch (err) {
            const msg = `Unable to save question to Question Bank: ${err.message || 'Unknown error'}`;
            global.toast(msg);
            return { success: false, error: msg };
        }
    }
};

global.window = {
    firebaseBridge: mockFirebaseBridge
};

// Tests array
const tests = [];
function test(name, fn) {
    tests.push({ name, fn });
}

// TEST 1: Unauthenticated user attempt
test('Test 1: Fails gracefully when user is not signed in', async () => {
    mockFirebaseBridge.auth.currentUser = null;
    global.currentUser = null;
    global.state.currentUser = null;

    const dummyQ = newQuestion('Sample question?', ['A', 'B', 'C', 'D'], 0);
    dummyQ.chapter = 'Algebra';
    dummyQ.topic = 'Polynomials';

    const result = await saveQuestionToQuestionBank(dummyQ);
    if (result.success !== false) throw new Error('Should have failed when logged out');
    if (!result.error.includes('Please sign in with Google before saving to the Question Bank.')) {
        throw new Error(`Unexpected error message: "${result.error}"`);
    }
    if (firestoreDb.questions.size !== 0) throw new Error('No question documents should have been written');
});

// TEST 2: Validation failure on invalid MCQ data
test('Test 2: Validation prevents saving invalid question data', async () => {
    mockFirebaseBridge.auth.currentUser = mockAuthUser;
    global.currentUser = mockAuthUser;
    global.state.currentUser = mockAuthUser;

    // A. Less than 4 options
    const badQ1 = { text: 'Bad options?', options: [{ text: '1' }, { text: '2' }], correctIndex: 0, chapter: 'Real Numbers', topic: 'Rational Numbers' };
    const res1 = await saveQuestionToQuestionBank(badQ1);
    if (res1.success !== false) throw new Error('Expected failure for < 4 options');

    // B. Missing correct answer
    const badQ2 = { text: 'No correct answer?', options: [{ text: '1' }, { text: '2' }, { text: '3' }, { text: '4' }], correctIndexes: [], chapter: 'Real Numbers', topic: 'Rational Numbers' };
    const res2 = await saveQuestionToQuestionBank(badQ2);
    if (res2.success !== false) throw new Error('Expected failure when no correct option selected');

    // C. Missing chapter/topic
    const badQ3 = { text: 'No chapter topic?', options: [{ text: '1' }, { text: '2' }, { text: '3' }, { text: '4' }], correctIndex: 0, chapter: '', topic: '' };
    const res3 = await saveQuestionToQuestionBank(badQ3);
    if (res3.success !== false) throw new Error('Expected failure when chapter/topic missing');

    if (firestoreDb.questions.size !== 0) throw new Error('No question documents should have been written for invalid data');
});

// TEST 3 & 4: IMPORTANT TEST - Save ONE test MCQ and verify all fields
let savedQuestionDocId = null;
let testQuestionObject = null;

test('Test 3: Save ONE test question matching requirements (Class VIII, Math, Real Numbers, Rational Numbers)', async () => {
    mockFirebaseBridge.auth.currentUser = mockAuthUser;
    global.currentUser = mockAuthUser;
    global.state.currentUser = mockAuthUser;

    // Create the test MCQ
    testQuestionObject = newQuestion(
        'Which of the following is a rational number?',
        ['1/2', '√2', 'π', '√3'],
        0 // Correct answer: A (index 0)
    );
    testQuestionObject.chapter = 'Real Numbers';
    testQuestionObject.topic = 'Rational Numbers';

    // Add to section in paper
    global.state.papers[0].sections[0].questions.push(testQuestionObject);

    // Save ONE question
    const result = await saveQuestionToQuestionBank(testQuestionObject);

    if (!result.success) throw new Error(`Save failed: ${result.error}`);
    if (!result.id) throw new Error('Result did not return Firestore document ID');
    if (result.isUpdate !== false) throw new Error('First save should be an insert (isUpdate === false)');

    savedQuestionDocId = result.id;

    // Verify toast
    if (!lastToastMessage.includes('Question saved to Question Bank.')) {
        throw new Error(`Unexpected toast message: "${lastToastMessage}"`);
    }

    // Verify question.firestoreQuestionId is stored on question object
    if (testQuestionObject.firestoreQuestionId !== savedQuestionDocId) {
        throw new Error(`Expected question.firestoreQuestionId "${savedQuestionDocId}", got "${testQuestionObject.firestoreQuestionId}"`);
    }

    // Verify persisted through localStorage
    const storedState = JSON.parse(mockLocalStorage.get(global.STORAGE_KEY));
    const storedQ = storedState.papers[0].sections[0].questions.find(q => q.id === testQuestionObject.id);
    if (!storedQ) throw new Error('Question not found in localStorage');
    if (storedQ.firestoreQuestionId !== savedQuestionDocId) {
        throw new Error('firestoreQuestionId not persisted to localStorage');
    }
});

// TEST 5: Verify the actual Firestore document in qb_questions_v1
test('Test 5: Verify the created document in qb_questions_v1 has exact expected schema and values', () => {
    if (firestoreDb.questions.size !== 1) {
        throw new Error(`Expected EXACTLY 1 question in Firestore, found: ${firestoreDb.questions.size}`);
    }

    const doc = firestoreDb.questions.get(savedQuestionDocId);
    if (!doc) throw new Error(`Document ${savedQuestionDocId} not found in Firestore questions collection`);

    // Verify schema fields
    if (doc.type !== 'mcq') throw new Error(`Expected type == 'mcq', got: "${doc.type}"`);
    if (doc.status !== 'draft') throw new Error(`Expected status == 'draft', got: "${doc.status}"`);
    if (doc.authorUid !== mockAuthUser.uid) throw new Error(`Expected authorUid == "${mockAuthUser.uid}", got: "${doc.authorUid}"`);
    if (doc.authorName !== mockAuthUser.displayName) throw new Error(`Expected authorName == "${mockAuthUser.displayName}", got: "${doc.authorName}"`);

    // Taxonomy IDs
    if (doc.classId !== 'class_viii') throw new Error(`Expected classId == 'class_viii', got: "${doc.classId}"`);
    if (doc.subjectId !== 'class_viii__subject_mathematics') throw new Error(`Expected subjectId == 'class_viii__subject_mathematics', got: "${doc.subjectId}"`);
    if (doc.chapterId !== 'class_viii__subject_mathematics__chapter_real-numbers') throw new Error(`Expected chapterId == 'class_viii__subject_mathematics__chapter_real-numbers', got: "${doc.chapterId}"`);
    if (doc.topicId !== 'class_viii__subject_mathematics__chapter_real-numbers__topic_rational-numbers') throw new Error(`Expected topicId == 'class_viii__subject_mathematics__chapter_real-numbers__topic_rational-numbers', got: "${doc.topicId}"`);

    // Prompt preservation
    if (doc.promptHtml !== 'Which of the following is a rational number?') {
        throw new Error(`Prompt html altered: "${doc.promptHtml}"`);
    }

    // Options (exact 4 entries, rich text preserved, only option A correct)
    if (!Array.isArray(doc.options) || doc.options.length !== 4) {
        throw new Error(`Expected exactly 4 options, got: ${doc.options?.length}`);
    }
    if (doc.options[0].html !== '1/2' || doc.options[0].correct !== true) {
        throw new Error(`Option A incorrect: ${JSON.stringify(doc.options[0])}`);
    }
    if (doc.options[1].html !== '√2' || doc.options[1].correct !== false) {
        throw new Error(`Option B incorrect: ${JSON.stringify(doc.options[1])}`);
    }
    if (doc.options[2].html !== 'π' || doc.options[2].correct !== false) {
        throw new Error(`Option C incorrect: ${JSON.stringify(doc.options[2])}`);
    }
    if (doc.options[3].html !== '√3' || doc.options[3].correct !== false) {
        throw new Error(`Option D incorrect: ${JSON.stringify(doc.options[3])}`);
    }

    // Timestamps
    if (!doc.createdAt) throw new Error('createdAt timestamp missing');
    if (!doc.updatedAt) throw new Error('updatedAt timestamp missing');
});

// TEST 6: Verify taxonomy documents in qb_taxonomy_v1
test('Test 6: Verify taxonomy documents were correctly created in qb_taxonomy_v1', () => {
    if (firestoreDb.taxonomy.size !== 4) {
        throw new Error(`Expected 4 taxonomy documents, got: ${firestoreDb.taxonomy.size}`);
    }
    if (!firestoreDb.taxonomy.has('class_viii')) throw new Error('class_viii taxonomy missing');
    if (!firestoreDb.taxonomy.has('class_viii__subject_mathematics')) throw new Error('subject taxonomy missing');
    if (!firestoreDb.taxonomy.has('class_viii__subject_mathematics__chapter_real-numbers')) throw new Error('chapter taxonomy missing');
    if (!firestoreDb.taxonomy.has('class_viii__subject_mathematics__chapter_real-numbers__topic_rational-numbers')) throw new Error('topic taxonomy missing');
});

// TEST 7: Save the question again and verify it UPDATES instead of duplicating
test('Test 7: Second save updates the existing document and does NOT create a duplicate', async () => {
    const initialQuestionCount = firestoreDb.questions.size;
    const initialTaxonomyCount = firestoreDb.taxonomy.size;

    // Modify the question text
    testQuestionObject.text = 'Which of the following is a rational number? (Updated)';

    // Save again
    const result = await saveQuestionToQuestionBank(testQuestionObject);

    if (!result.success) throw new Error(`Second save failed: ${result.error}`);
    if (result.isUpdate !== true) throw new Error('Second save should have isUpdate === true');
    if (result.id !== savedQuestionDocId) {
        throw new Error(`Document ID changed on update! Old: ${savedQuestionDocId}, New: ${result.id}`);
    }

    // Verify count did NOT increase
    if (firestoreDb.questions.size !== initialQuestionCount) {
        throw new Error(`Duplicate question created! Expected ${initialQuestionCount}, found ${firestoreDb.questions.size}`);
    }
    if (firestoreDb.taxonomy.size !== initialTaxonomyCount) {
        throw new Error(`Duplicate taxonomy created! Expected ${initialTaxonomyCount}, found ${firestoreDb.taxonomy.size}`);
    }

    // Verify update took effect
    const updatedDoc = firestoreDb.questions.get(savedQuestionDocId);
    if (updatedDoc.promptHtml !== 'Which of the following is a rational number? (Updated)') {
        throw new Error(`Document prompt was not updated in Firestore`);
    }

    if (!lastToastMessage.includes('Question updated in Question Bank.')) {
        throw new Error(`Unexpected update toast: "${lastToastMessage}"`);
    }
});

// TEST 8: Multiple-correct questions preserve all correct answers
test('Test 8: Multiple correct options preserve all correct: true flags', async () => {
    const multiQ = newQuestion('Select all even numbers', ['2', '3', '4', '5'], 0);
    multiQ.correctIndexes = [0, 2]; // Both A and C are correct
    multiQ.chapter = 'Real Numbers';
    multiQ.topic = 'Rational Numbers';

    const result = await saveQuestionToQuestionBank(multiQ);
    if (!result.success) throw new Error(`Save multiQ failed: ${result.error}`);

    const doc = firestoreDb.questions.get(result.id);
    if (!doc.options[0].correct || !doc.options[2].correct) {
        throw new Error('Multiple correct options not preserved in Firestore');
    }
    if (doc.options[1].correct || doc.options[3].correct) {
        throw new Error('Incorrect options incorrectly marked true in Firestore');
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
    console.log('=======================================');
    console.log(`Summary: ${passed} passed, ${failed} failed.`);
    if (failed > 0) process.exit(1);
})();
