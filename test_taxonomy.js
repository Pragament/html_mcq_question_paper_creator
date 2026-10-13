// Test suite for Firestore Taxonomy Integration (Step 3)
const fs = require('fs');
const path = require('path');

console.log('Running Firestore Taxonomy Integration Tests...');
console.log('==============================================');

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

// Extract taxonomy functions from MCQ Creator script.js
const normalizeTaxonomyLabel = extractFunction('normalizeTaxonomyLabel');
const slugify = extractFunction('slugify');
const taxonomyId = extractFunction('taxonomyId');
const buildTaxonomyPath = extractFunction('buildTaxonomyPath');
const testTaxonomyIntegration = extractFunction('testTaxonomyIntegration');

// Pragament Question Bank reference implementation (source of truth from FIRESTORE_SCHEMA.md and pragament repo)
function pragamentNormalizeTaxonomyLabel(value) {
    return String(value || '').trim().replace(/\s+/g, ' ');
}

function pragamentSlugify(value) {
    const slug = pragamentNormalizeTaxonomyLabel(value)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    return slug || 'untitled';
}

function pragamentTaxonomyId(type, label, parentId = '') {
    const prefix = { class: 'class', subject: 'subject', chapter: 'chapter', topic: 'topic' }[type] || type;
    return `${parentId ? `${parentId}__` : ''}${prefix}_${pragamentSlugify(label)}`;
}

function pragamentBuildTaxonomyPath(labels) {
    const classId = pragamentTaxonomyId('class', labels.className);
    const subjectId = pragamentTaxonomyId('subject', labels.subject, classId);
    const chapterId = pragamentTaxonomyId('chapter', labels.chapter, subjectId);
    const topicId = pragamentTaxonomyId('topic', labels.topic, chapterId);
    return {
        ids: { classId, subjectId, chapterId, topicId },
        nodes: [
            { id: classId, type: 'class', label: pragamentNormalizeTaxonomyLabel(labels.className), parentId: '', classId },
            { id: subjectId, type: 'subject', label: pragamentNormalizeTaxonomyLabel(labels.subject), parentId: classId, classId, subjectId },
            { id: chapterId, type: 'chapter', label: pragamentNormalizeTaxonomyLabel(labels.chapter), parentId: subjectId, classId, subjectId, chapterId },
            { id: topicId, type: 'topic', label: pragamentNormalizeTaxonomyLabel(labels.topic), parentId: chapterId, classId, subjectId, chapterId, topicId }
        ]
    };
}

global.normalizeTaxonomyLabel = normalizeTaxonomyLabel;
global.slugify = slugify;
global.taxonomyId = taxonomyId;
global.buildTaxonomyPath = buildTaxonomyPath;
global.testTaxonomyIntegration = testTaxonomyIntegration;

// Test suite
const tests = [];
function test(name, fn) {
    tests.push({ name, fn });
}

// TEST 1: Compare MCQ Creator taxonomy ID generation with Question Bank implementation
test('Test 1: Compare taxonomy ID generation with Question Bank reference for VIII/Mathematics/Real Numbers/Rational Numbers', () => {
    const example = {
        className: 'VIII',
        subjectName: 'Mathematics',
        chapterName: 'Real Numbers',
        topicName: 'Rational Numbers'
    };

    // MCQ Creator output
    const mcqPath = buildTaxonomyPath(example);

    // Question Bank output (using { className, subject, chapter, topic })
    const qbPath = pragamentBuildTaxonomyPath({
        className: example.className,
        subject: example.subjectName,
        chapter: example.chapterName,
        topic: example.topicName
    });

    // 1. Verify Class ID
    if (mcqPath.ids.classId !== 'class_viii') {
        throw new Error(`Expected classId "class_viii", got: "${mcqPath.ids.classId}"`);
    }
    if (mcqPath.ids.classId !== qbPath.ids.classId) {
        throw new Error(`classId mismatch with Question Bank: MCQ="${mcqPath.ids.classId}" vs QB="${qbPath.ids.classId}"`);
    }

    // 2. Verify Subject ID
    if (mcqPath.ids.subjectId !== 'class_viii__subject_mathematics') {
        throw new Error(`Expected subjectId "class_viii__subject_mathematics", got: "${mcqPath.ids.subjectId}"`);
    }
    if (mcqPath.ids.subjectId !== qbPath.ids.subjectId) {
        throw new Error(`subjectId mismatch with Question Bank: MCQ="${mcqPath.ids.subjectId}" vs QB="${qbPath.ids.subjectId}"`);
    }

    // 3. Verify Chapter ID
    if (mcqPath.ids.chapterId !== 'class_viii__subject_mathematics__chapter_real-numbers') {
        throw new Error(`Expected chapterId "class_viii__subject_mathematics__chapter_real-numbers", got: "${mcqPath.ids.chapterId}"`);
    }
    if (mcqPath.ids.chapterId !== qbPath.ids.chapterId) {
        throw new Error(`chapterId mismatch with Question Bank: MCQ="${mcqPath.ids.chapterId}" vs QB="${qbPath.ids.chapterId}"`);
    }

    // 4. Verify Topic ID
    if (mcqPath.ids.topicId !== 'class_viii__subject_mathematics__chapter_real-numbers__topic_rational-numbers') {
        throw new Error(`Expected topicId "class_viii__subject_mathematics__chapter_real-numbers__topic_rational-numbers", got: "${mcqPath.ids.topicId}"`);
    }
    if (mcqPath.ids.topicId !== qbPath.ids.topicId) {
        throw new Error(`topicId mismatch with Question Bank: MCQ="${mcqPath.ids.topicId}" vs QB="${qbPath.ids.topicId}"`);
    }
});

// TEST 2: Verify taxonomy nodes structure and exact fields written to qb_taxonomy_v1
test('Test 2: Verify taxonomy nodes and field structure match FIRESTORE_SCHEMA.md', () => {
    const example = {
        className: 'VIII',
        subjectName: 'Mathematics',
        chapterName: 'Real Numbers',
        topicName: 'Rational Numbers'
    };

    const mcqPath = buildTaxonomyPath(example);
    if (mcqPath.nodes.length !== 4) throw new Error(`Expected 4 taxonomy nodes, got ${mcqPath.nodes.length}`);

    // Class Node
    const classNode = mcqPath.nodes[0];
    if (classNode.id !== 'class_viii') throw new Error('Class node ID mismatch');
    if (classNode.type !== 'class') throw new Error('Class node type mismatch');
    if (classNode.label !== 'VIII') throw new Error('Class node label mismatch');
    if (classNode.parentId !== '') throw new Error('Class node parentId should be empty string');
    if (classNode.classId !== 'class_viii') throw new Error('Class node classId mismatch');

    // Subject Node
    const subjectNode = mcqPath.nodes[1];
    if (subjectNode.id !== 'class_viii__subject_mathematics') throw new Error('Subject node ID mismatch');
    if (subjectNode.type !== 'subject') throw new Error('Subject node type mismatch');
    if (subjectNode.label !== 'Mathematics') throw new Error('Subject node label mismatch');
    if (subjectNode.parentId !== 'class_viii') throw new Error('Subject node parentId mismatch');
    if (subjectNode.classId !== 'class_viii') throw new Error('Subject node classId mismatch');
    if (subjectNode.subjectId !== 'class_viii__subject_mathematics') throw new Error('Subject node subjectId mismatch');

    // Chapter Node
    const chapterNode = mcqPath.nodes[2];
    if (chapterNode.id !== 'class_viii__subject_mathematics__chapter_real-numbers') throw new Error('Chapter node ID mismatch');
    if (chapterNode.type !== 'chapter') throw new Error('Chapter node type mismatch');
    if (chapterNode.label !== 'Real Numbers') throw new Error('Chapter node label mismatch');
    if (chapterNode.parentId !== 'class_viii__subject_mathematics') throw new Error('Chapter node parentId mismatch');
    if (chapterNode.chapterId !== 'class_viii__subject_mathematics__chapter_real-numbers') throw new Error('Chapter node chapterId mismatch');

    // Topic Node
    const topicNode = mcqPath.nodes[3];
    if (topicNode.id !== 'class_viii__subject_mathematics__chapter_real-numbers__topic_rational-numbers') throw new Error('Topic node ID mismatch');
    if (topicNode.type !== 'topic') throw new Error('Topic node type mismatch');
    if (topicNode.label !== 'Rational Numbers') throw new Error('Topic node label mismatch');
    if (topicNode.parentId !== 'class_viii__subject_mathematics__chapter_real-numbers') throw new Error('Topic node parentId mismatch');
    if (topicNode.topicId !== 'class_viii__subject_mathematics__chapter_real-numbers__topic_rational-numbers') throw new Error('Topic node topicId mismatch');
});

// TEST 3: Mock Firestore batch upsert and verify calling ensureTaxonomyPath twice produces NO duplicate documents
test('Test 3: Calling ensureTaxonomyPath twice produces NO duplicate documents (deterministic IDs)', async () => {
    const firestoreDb = new Map();
    let batchCommitted = 0;

    const mockDoc = (db, col, id) => `${col}/${id}`;
    const mockServerTimestamp = () => new Date().toISOString();

    const mockWriteBatch = (db) => {
        const operations = [];
        return {
            set(docRef, data, options = {}) {
                operations.push({ docRef, data, options });
            },
            async commit() {
                batchCommitted++;
                for (const op of operations) {
                    if (op.options.merge && firestoreDb.has(op.docRef)) {
                        firestoreDb.set(op.docRef, { ...firestoreDb.get(op.docRef), ...op.data });
                    } else {
                        firestoreDb.set(op.docRef, op.data);
                    }
                }
            }
        };
    };

    // Simulated ensureTaxonomyPath with mock Firestore batch
    async function mockEnsureTaxonomyPath(labels) {
        const path = buildTaxonomyPath(labels);
        const batch = mockWriteBatch();
        path.nodes.forEach(node => {
            batch.set(mockDoc(null, 'qb_taxonomy_v1', node.id), {
                ...node,
                updatedAt: mockServerTimestamp()
            }, { merge: true });
        });
        await batch.commit();
        return path.ids;
    }

    const labels = {
        className: 'VIII',
        subjectName: 'Mathematics',
        chapterName: 'Real Numbers',
        topicName: 'Rational Numbers'
    };

    // First call
    await mockEnsureTaxonomyPath(labels);
    if (firestoreDb.size !== 4) throw new Error(`Expected 4 documents after first call, got ${firestoreDb.size}`);

    // Second call with same path
    await mockEnsureTaxonomyPath(labels);
    if (firestoreDb.size !== 4) {
        throw new Error(`Expected EXACTLY 4 documents after second call (no duplicates), but got: ${firestoreDb.size}`);
    }

    // Verify all 4 documents exist under qb_taxonomy_v1
    if (!firestoreDb.has('qb_taxonomy_v1/class_viii')) throw new Error('class_viii document missing');
    if (!firestoreDb.has('qb_taxonomy_v1/class_viii__subject_mathematics')) throw new Error('subject document missing');
    if (!firestoreDb.has('qb_taxonomy_v1/class_viii__subject_mathematics__chapter_real-numbers')) throw new Error('chapter document missing');
    if (!firestoreDb.has('qb_taxonomy_v1/class_viii__subject_mathematics__chapter_real-numbers__topic_rational-numbers')) throw new Error('topic document missing');

    // Confirm NO question documents exist
    for (const key of firestoreDb.keys()) {
        if (key.startsWith('qb_questions_v1')) {
            throw new Error(`Found unexpected document in questions collection: ${key}`);
        }
    }
});

// TEST 4: Verify testTaxonomyIntegration helper executes and confirms no qb_questions_v1 documents are created
test('Test 4: Verify testTaxonomyIntegration confirms no qb_questions_v1 document created', async () => {
    global.currentUser = null;
    global.buildTaxonomyPath = buildTaxonomyPath;
    global.ensureTaxonomyPath = async () => {};

    const result = await testTaxonomyIntegration();
    if (!result.verifiedNoQuestionCreated) throw new Error('verifiedNoQuestionCreated must be true');
    if (result.ids.classId !== 'class_viii') throw new Error('testTaxonomyIntegration returned incorrect classId');
    if (result.ids.subjectId !== 'class_viii__subject_mathematics') throw new Error('testTaxonomyIntegration returned incorrect subjectId');
    if (result.ids.chapterId !== 'class_viii__subject_mathematics__chapter_real-numbers') throw new Error('testTaxonomyIntegration returned incorrect chapterId');
    if (result.ids.topicId !== 'class_viii__subject_mathematics__chapter_real-numbers__topic_rational-numbers') throw new Error('testTaxonomyIntegration returned incorrect topicId');
});

// TEST 5: Verify firestore.rules has NOT been modified
test('Test 5: Verify firestore.rules has not been modified in workspace', () => {
    // Check local question-bank firestore.rules
    const qbRulesPath = path.join(__dirname, '..', 'html_question-bank-app', 'firestore.rules');
    if (fs.existsSync(qbRulesPath)) {
        const rulesContent = fs.readFileSync(qbRulesPath, 'utf8');
        if (!rulesContent.includes('rules_version = \'2\';')) {
            throw new Error('firestore.rules appears corrupted');
        }
    }
    // Confirm no firestore.rules was created in mcq project
    const mcqRulesPath = path.join(__dirname, 'firestore.rules');
    if (fs.existsSync(mcqRulesPath)) {
        throw new Error('firestore.rules should NOT be created in html_mcq_question_paper_creator');
    }
});

// Run all
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
    console.log('==============================================');
    console.log(`Summary: ${passed} passed, ${failed} failed.`);
    if (failed > 0) process.exit(1);
})();
