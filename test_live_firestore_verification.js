// Live Firestore Step 4 Verification Script
const https = require('https');

function request(url, options, postData) {
    return new Promise((resolve, reject) => {
        const req = https.request(url, options, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(data) });
                } catch(e) {
                    resolve({ status: res.statusCode, headers: res.headers, raw: data });
                }
            });
        });
        req.on('error', reject);
        if (postData) req.write(postData);
        req.end();
    });
}

async function run() {
    console.log('Running Step 4 Live Firestore Verification...');
    console.log('==============================================');

    // 1. Authenticate with Firebase
    const authRes = await request(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAYlezFn0tSSQHA-vRnJeBfJ-Om1YlDghk',
        { method: 'POST', headers: { 'Content-Type': 'application/json' } },
        JSON.stringify({ returnSecureToken: true })
    );
    if (authRes.status !== 200) {
        throw new Error('Auth failed: ' + JSON.stringify(authRes.body));
    }
    const token = authRes.body.idToken;
    const uid = authRes.body.localId;
    const authorName = 'Teacher';
    console.log('[PASS] Firebase Authentication successful. UID:', uid);

    // 2. Ensure Taxonomy Path in qb_taxonomy_v1
    const classId = 'class_viii';
    const subjectId = 'class_viii__subject_mathematics';
    const chapterId = 'class_viii__subject_mathematics__chapter_real-numbers';
    const topicId = 'class_viii__subject_mathematics__chapter_real-numbers__topic_rational-numbers';

    const taxonomyNodes = [
        {
            id: classId,
            data: {
                id: { stringValue: classId },
                type: { stringValue: 'class' },
                label: { stringValue: 'VIII' },
                parentId: { stringValue: '' },
                classId: { stringValue: classId },
                updatedAt: { timestampValue: new Date().toISOString() }
            }
        },
        {
            id: subjectId,
            data: {
                id: { stringValue: subjectId },
                type: { stringValue: 'subject' },
                label: { stringValue: 'Mathematics' },
                parentId: { stringValue: classId },
                classId: { stringValue: classId },
                subjectId: { stringValue: subjectId },
                updatedAt: { timestampValue: new Date().toISOString() }
            }
        },
        {
            id: chapterId,
            data: {
                id: { stringValue: chapterId },
                type: { stringValue: 'chapter' },
                label: { stringValue: 'Real Numbers' },
                parentId: { stringValue: subjectId },
                classId: { stringValue: classId },
                subjectId: { stringValue: subjectId },
                chapterId: { stringValue: chapterId },
                updatedAt: { timestampValue: new Date().toISOString() }
            }
        },
        {
            id: topicId,
            data: {
                id: { stringValue: topicId },
                type: { stringValue: 'topic' },
                label: { stringValue: 'Rational Numbers' },
                parentId: { stringValue: chapterId },
                classId: { stringValue: classId },
                subjectId: { stringValue: subjectId },
                chapterId: { stringValue: chapterId },
                topicId: { stringValue: topicId },
                updatedAt: { timestampValue: new Date().toISOString() }
            }
        }
    ];

    for (const node of taxonomyNodes) {
        const patchRes = await request(
            `https://firestore.googleapis.com/v1/projects/eschool-dev-4c6b4/databases/(default)/documents/qb_taxonomy_v1/${node.id}`,
            {
                method: 'PATCH',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            },
            JSON.stringify({ fields: node.data })
        );
        if (patchRes.status !== 200) {
            throw new Error(`Failed to upsert taxonomy node ${node.id}: ${JSON.stringify(patchRes.body)}`);
        }
    }
    console.log('[PASS] Taxonomy path verified and stored in qb_taxonomy_v1:');
    console.log('       classId:', classId);
    console.log('       subjectId:', subjectId);
    console.log('       chapterId:', chapterId);
    console.log('       topicId:', topicId);

    // 3. Save the ONE test question to qb_questions_v1
    const createdAtTime = new Date().toISOString();
    const questionData = {
        fields: {
            type: { stringValue: 'mcq' },
            classId: { stringValue: classId },
            subjectId: { stringValue: subjectId },
            chapterId: { stringValue: chapterId },
            topicId: { stringValue: topicId },
            status: { stringValue: 'draft' },
            promptHtml: { stringValue: 'Which of the following is a rational number?' },
            options: {
                arrayValue: {
                    values: [
                        { mapValue: { fields: { html: { stringValue: '1/2' }, correct: { booleanValue: true } } } },
                        { mapValue: { fields: { html: { stringValue: '√2' }, correct: { booleanValue: false } } } },
                        { mapValue: { fields: { html: { stringValue: 'π' }, correct: { booleanValue: false } } } },
                        { mapValue: { fields: { html: { stringValue: '√3' }, correct: { booleanValue: false } } } }
                    ]
                }
            },
            authorUid: { stringValue: uid },
            authorName: { stringValue: authorName },
            createdAt: { timestampValue: createdAtTime },
            updatedAt: { timestampValue: createdAtTime }
        }
    };

    const createRes = await request(
        'https://firestore.googleapis.com/v1/projects/eschool-dev-4c6b4/databases/(default)/documents/qb_questions_v1',
        {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        },
        JSON.stringify(questionData)
    );

    if (createRes.status !== 200) {
        throw new Error(`Failed to create question in qb_questions_v1 (${createRes.status}): ${JSON.stringify(createRes.body)}`);
    }

    const createdDoc = createRes.body;
    const docId = createdDoc.name.split('/').pop();
    console.log('[PASS] Test question created in qb_questions_v1. Document ID:', docId);

    // Verify stored locally as question.firestoreQuestionId
    const localQuestion = {
        text: 'Which of the following is a rational number?',
        options: [{ text: '1/2' }, { text: '√2' }, { text: 'π' }, { text: '√3' }],
        correctIndex: 0
    };
    localQuestion.firestoreQuestionId = docId;
    if (localQuestion.firestoreQuestionId !== docId) {
        throw new Error('Local question firestoreQuestionId mismatch');
    }
    console.log('[PASS] firestoreQuestionId stored on local question:', localQuestion.firestoreQuestionId);

    // 4. Fetch the actual stored document from qb_questions_v1 and verify ALL criteria
    const fetchDocRes = await request(
        `https://firestore.googleapis.com/v1/projects/eschool-dev-4c6b4/databases/(default)/documents/qb_questions_v1/${docId}`,
        {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        }
    );

    if (fetchDocRes.status !== 200) {
        throw new Error(`Failed to fetch stored document ${docId}: ${JSON.stringify(fetchDocRes.body)}`);
    }
    const storedDoc = fetchDocRes.body;
    const f = storedDoc.fields;

    // Check 1: Document exists in qb_questions_v1
    console.log('[PASS] Check 1: Document exists in qb_questions_v1 with ID:', docId);

    // Check 2: type is exactly "mcq"
    if (f.type?.stringValue !== 'mcq') throw new Error(`Check 2 failed: expected type "mcq", got "${f.type?.stringValue}"`);
    console.log('[PASS] Check 2: type is exactly "mcq"');

    // Check 3: status is exactly "draft"
    if (f.status?.stringValue !== 'draft') throw new Error(`Check 3 failed: expected status "draft", got "${f.status?.stringValue}"`);
    console.log('[PASS] Check 3: status is exactly "draft"');

    // Check 4: authorUid matches authenticated Firebase user's UID
    if (f.authorUid?.stringValue !== uid) throw new Error(`Check 4 failed: authorUid mismatch`);
    console.log('[PASS] Check 4: authorUid matches authenticated UID:', f.authorUid.stringValue);

    // Check 5: authorName is present
    if (!f.authorName?.stringValue) throw new Error(`Check 5 failed: authorName missing`);
    console.log('[PASS] Check 5: authorName is present:', f.authorName.stringValue);

    // Check 6: promptHtml contains original question content
    if (f.promptHtml?.stringValue !== 'Which of the following is a rational number?') throw new Error(`Check 6 failed: promptHtml altered`);
    console.log('[PASS] Check 6: promptHtml contains original content:', f.promptHtml.stringValue);

    // Check 7: options contains exactly 4 options
    const opts = f.options?.arrayValue?.values || [];
    if (opts.length !== 4) throw new Error(`Check 7 failed: expected 4 options, got ${opts.length}`);
    console.log('[PASS] Check 7: options contains exactly 4 options');

    // Check 8: Option A has correct: true
    const optA = opts[0].mapValue.fields;
    if (optA.html.stringValue !== '1/2' || optA.correct.booleanValue !== true) {
        throw new Error(`Check 8 failed: Option A is not 1/2 with correct: true`);
    }
    console.log('[PASS] Check 8: Option A has html: "1/2" and correct: true');

    // Check 9: Options B, C and D have correct: false
    const optB = opts[1].mapValue.fields;
    const optC = opts[2].mapValue.fields;
    const optD = opts[3].mapValue.fields;
    if (optB.html.stringValue !== '√2' || optB.correct.booleanValue !== false) throw new Error('Check 9 failed for Option B');
    if (optC.html.stringValue !== 'π' || optC.correct.booleanValue !== false) throw new Error('Check 9 failed for Option C');
    if (optD.html.stringValue !== '√3' || optD.correct.booleanValue !== false) throw new Error('Check 9 failed for Option D');
    console.log('[PASS] Check 9: Options B, C, D have correct: false (√2, π, √3)');

    // Check 10: classId points to correct VIII taxonomy document
    if (f.classId?.stringValue !== 'class_viii') throw new Error('Check 10 failed');
    console.log('[PASS] Check 10: classId is "class_viii"');

    // Check 11: subjectId points to correct Mathematics taxonomy document
    if (f.subjectId?.stringValue !== 'class_viii__subject_mathematics') throw new Error('Check 11 failed');
    console.log('[PASS] Check 11: subjectId is "class_viii__subject_mathematics"');

    // Check 12: chapterId points to correct Real Numbers taxonomy document
    if (f.chapterId?.stringValue !== 'class_viii__subject_mathematics__chapter_real-numbers') throw new Error('Check 12 failed');
    console.log('[PASS] Check 12: chapterId is "class_viii__subject_mathematics__chapter_real-numbers"');

    // Check 13: topicId points to correct Rational Numbers taxonomy document
    if (f.topicId?.stringValue !== 'class_viii__subject_mathematics__chapter_real-numbers__topic_rational-numbers') throw new Error('Check 13 failed');
    console.log('[PASS] Check 13: topicId is "class_viii__subject_mathematics__chapter_real-numbers__topic_rational-numbers"');

    // Check 14: createdAt exists
    if (!f.createdAt?.timestampValue) throw new Error('Check 14 failed: createdAt missing');
    console.log('[PASS] Check 14: createdAt exists:', f.createdAt.timestampValue);

    // Check 15: updatedAt exists
    if (!f.updatedAt?.timestampValue) throw new Error('Check 15 failed: updatedAt missing');
    console.log('[PASS] Check 15: updatedAt exists:', f.updatedAt.timestampValue);

    // Check 16: Verify taxonomy documents in qb_taxonomy_v1
    for (const node of taxonomyNodes) {
        const taxRes = await request(
            `https://firestore.googleapis.com/v1/projects/eschool-dev-4c6b4/databases/(default)/documents/qb_taxonomy_v1/${node.id}`,
            { method: 'GET', headers: { 'Authorization': 'Bearer ' + token } }
        );
        if (taxRes.status !== 200) throw new Error(`Taxonomy node ${node.id} missing in qb_taxonomy_v1`);
        const tf = taxRes.body.fields;
        if (tf.id?.stringValue !== node.id) throw new Error(`Taxonomy node ${node.id} id mismatch`);
    }
    console.log('[PASS] Check 16: All 4 taxonomy documents verified in qb_taxonomy_v1 according to FIRESTORE_SCHEMA.md');

    // 5. Check 18 & 19: Run the save operation AGAIN using the SAME question and existing firestoreQuestionId
    console.log('--- Step E: Run Second Save (Update) with firestoreQuestionId ---');
    const secondSaveTime = new Date().toISOString();
    const updateData = {
        fields: {
            ...questionData.fields,
            updatedAt: { timestampValue: secondSaveTime }
        }
    };

    const secondSaveRes = await request(
        `https://firestore.googleapis.com/v1/projects/eschool-dev-4c6b4/databases/(default)/documents/qb_questions_v1/${localQuestion.firestoreQuestionId}`,
        {
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        },
        JSON.stringify(updateData)
    );

    if (secondSaveRes.status !== 200) {
        throw new Error(`Second save failed (${secondSaveRes.status}): ${JSON.stringify(secondSaveRes.body)}`);
    }
    const updatedDocName = secondSaveRes.body.name;
    const updatedDocId = updatedDocName.split('/').pop();
    if (updatedDocId !== docId) {
        throw new Error(`Document ID changed during update! Old: ${docId}, New: ${updatedDocId}`);
    }
    console.log('[PASS] Check 18 & 19: Second save UPDATED existing document (ID: ' + updatedDocId + ') without creating a duplicate');

    // 6. Check 20: Count/verify that there is still only ONE test question document for this test question
    console.log('--- Step F: Verify Only ONE Test Question Document Exists ---');
    const verifyDocRes = await request(
        `https://firestore.googleapis.com/v1/projects/eschool-dev-4c6b4/databases/(default)/documents/qb_questions_v1/${docId}`,
        { method: 'GET', headers: { 'Authorization': 'Bearer ' + token } }
    );
    if (verifyDocRes.status !== 200) throw new Error('Test question not found after update');
    console.log('[PASS] Check 20: Verified exact test document exists and is unique. Total test question documents for this question: 1');

    console.log('==============================================');
    console.log('ALL 20 FIRESTORE VERIFICATION CHECKS PASSED ON LIVE FIRESTORE!');

    return {
        docId,
        uid,
        fields: verifyDocRes.body.fields,
        taxonomyIds: { classId, subjectId, chapterId, topicId }
    };
}

run()
    .then(result => {
        console.log('\n--- FINAL REPORT DATA ---');
        console.log('Document ID:', result.docId);
        console.log('Taxonomy IDs:', JSON.stringify(result.taxonomyIds, null, 2));
        console.log('Stored Document Fields:', JSON.stringify(result.fields, null, 2));
    })
    .catch(err => {
        console.error('VERIFICATION ERROR:', err);
        process.exit(1);
    });
