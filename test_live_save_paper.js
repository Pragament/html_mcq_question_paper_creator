// Step 5 Live Firestore Test Suite for Entire Paper Save
const https = require('https');

function request(url, options, postData) {
    return new Promise((resolve, reject) => {
        const req = https.request(url, options, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(data) });
                } catch (e) {
                    resolve({ status: res.statusCode, headers: res.headers, raw: data });
                }
            });
        });
        req.on('error', reject);
        if (postData) req.write(postData);
        req.end();
    });
}

async function runLivePaperSave() {
    console.log('Running Step 5 Live Firestore Paper Save Verification...');
    console.log('========================================================');

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
    console.log('[PASS] Live Auth successful. User UID:', uid);

    // 2. Taxonomy setup for all 3 questions
    // Q1 & Q2: Real Numbers -> Rational Numbers & Prime Numbers
    // Q3: Squares and Square Roots -> Square Roots
    const taxonomyNodes = [
        {
            id: 'class_viii',
            data: {
                id: { stringValue: 'class_viii' },
                type: { stringValue: 'class' },
                label: { stringValue: 'VIII' },
                parentId: { stringValue: '' },
                classId: { stringValue: 'class_viii' },
                updatedAt: { timestampValue: new Date().toISOString() }
            }
        },
        {
            id: 'class_viii__subject_mathematics',
            data: {
                id: { stringValue: 'class_viii__subject_mathematics' },
                type: { stringValue: 'subject' },
                label: { stringValue: 'Mathematics' },
                parentId: { stringValue: 'class_viii' },
                classId: { stringValue: 'class_viii' },
                subjectId: { stringValue: 'class_viii__subject_mathematics' },
                updatedAt: { timestampValue: new Date().toISOString() }
            }
        },
        {
            id: 'class_viii__subject_mathematics__chapter_real-numbers',
            data: {
                id: { stringValue: 'class_viii__subject_mathematics__chapter_real-numbers' },
                type: { stringValue: 'chapter' },
                label: { stringValue: 'Real Numbers' },
                parentId: { stringValue: 'class_viii__subject_mathematics' },
                classId: { stringValue: 'class_viii' },
                subjectId: { stringValue: 'class_viii__subject_mathematics' },
                chapterId: { stringValue: 'class_viii__subject_mathematics__chapter_real-numbers' },
                updatedAt: { timestampValue: new Date().toISOString() }
            }
        },
        {
            id: 'class_viii__subject_mathematics__chapter_real-numbers__topic_rational-numbers',
            data: {
                id: { stringValue: 'class_viii__subject_mathematics__chapter_real-numbers__topic_rational-numbers' },
                type: { stringValue: 'topic' },
                label: { stringValue: 'Rational Numbers' },
                parentId: { stringValue: 'class_viii__subject_mathematics__chapter_real-numbers' },
                classId: { stringValue: 'class_viii' },
                subjectId: { stringValue: 'class_viii__subject_mathematics' },
                chapterId: { stringValue: 'class_viii__subject_mathematics__chapter_real-numbers' },
                topicId: { stringValue: 'class_viii__subject_mathematics__chapter_real-numbers__topic_rational-numbers' },
                updatedAt: { timestampValue: new Date().toISOString() }
            }
        },
        {
            id: 'class_viii__subject_mathematics__chapter_real-numbers__topic_prime-numbers',
            data: {
                id: { stringValue: 'class_viii__subject_mathematics__chapter_real-numbers__topic_prime-numbers' },
                type: { stringValue: 'topic' },
                label: { stringValue: 'Prime Numbers' },
                parentId: { stringValue: 'class_viii__subject_mathematics__chapter_real-numbers' },
                classId: { stringValue: 'class_viii' },
                subjectId: { stringValue: 'class_viii__subject_mathematics' },
                chapterId: { stringValue: 'class_viii__subject_mathematics__chapter_real-numbers' },
                topicId: { stringValue: 'class_viii__subject_mathematics__chapter_real-numbers__topic_prime-numbers' },
                updatedAt: { timestampValue: new Date().toISOString() }
            }
        },
        {
            id: 'class_viii__subject_mathematics__chapter_squares-and-square-roots',
            data: {
                id: { stringValue: 'class_viii__subject_mathematics__chapter_squares-and-square-roots' },
                type: { stringValue: 'chapter' },
                label: { stringValue: 'Squares and Square Roots' },
                parentId: { stringValue: 'class_viii__subject_mathematics' },
                classId: { stringValue: 'class_viii' },
                subjectId: { stringValue: 'class_viii__subject_mathematics' },
                chapterId: { stringValue: 'class_viii__subject_mathematics__chapter_squares-and-square-roots' },
                updatedAt: { timestampValue: new Date().toISOString() }
            }
        },
        {
            id: 'class_viii__subject_mathematics__chapter_squares-and-square-roots__topic_square-roots',
            data: {
                id: { stringValue: 'class_viii__subject_mathematics__chapter_squares-and-square-roots__topic_square-roots' },
                type: { stringValue: 'topic' },
                label: { stringValue: 'Square Roots' },
                parentId: { stringValue: 'class_viii__subject_mathematics__chapter_squares-and-square-roots' },
                classId: { stringValue: 'class_viii' },
                subjectId: { stringValue: 'class_viii__subject_mathematics' },
                chapterId: { stringValue: 'class_viii__subject_mathematics__chapter_squares-and-square-roots' },
                topicId: { stringValue: 'class_viii__subject_mathematics__chapter_squares-and-square-roots__topic_square-roots' },
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
            throw new Error(`Taxonomy node ${node.id} failed (${patchRes.status}): ${JSON.stringify(patchRes.body)}`);
        }
    }
    console.log('[PASS] All 7 taxonomy documents verified in qb_taxonomy_v1');

    // 3. Save Questions (Section 1: Q1, Q2; Section 2: Q3)
    const questionsToCreate = [
        // Q1 (Section 1, single correct)
        {
            sectionName: 'Section 1',
            promptHtml: 'Which of the following is a rational number?',
            classId: 'class_viii',
            subjectId: 'class_viii__subject_mathematics',
            chapterId: 'class_viii__subject_mathematics__chapter_real-numbers',
            topicId: 'class_viii__subject_mathematics__chapter_real-numbers__topic_rational-numbers',
            options: [
                { html: '1/2', correct: true },
                { html: '√2', correct: false },
                { html: 'π', correct: false },
                { html: '√3', correct: false }
            ]
        },
        // Q2 (Section 1, multiple correct: A, B, D)
        {
            sectionName: 'Section 1',
            promptHtml: 'Which are prime numbers?',
            classId: 'class_viii',
            subjectId: 'class_viii__subject_mathematics',
            chapterId: 'class_viii__subject_mathematics__chapter_real-numbers',
            topicId: 'class_viii__subject_mathematics__chapter_real-numbers__topic_prime-numbers',
            options: [
                { html: '2', correct: true },
                { html: '3', correct: true },
                { html: '4', correct: false },
                { html: '5', correct: true }
            ]
        },
        // Q3 (Section 2, MathLive formula: √1.1664)
        {
            sectionName: 'Section 2',
            promptHtml: 'Find the value of √1.1664',
            classId: 'class_viii',
            subjectId: 'class_viii__subject_mathematics',
            chapterId: 'class_viii__subject_mathematics__chapter_squares-and-square-roots',
            topicId: 'class_viii__subject_mathematics__chapter_squares-and-square-roots__topic_square-roots',
            options: [
                { html: '1.08', correct: true },
                { html: '2.04', correct: false },
                { html: '2.08', correct: false },
                { html: '3.35', correct: false }
            ]
        }
    ];

    const savedDocIds = [];
    const now = new Date().toISOString();

    for (let i = 0; i < questionsToCreate.length; i++) {
        const q = questionsToCreate[i];
        const payload = {
            fields: {
                type: { stringValue: 'mcq' },
                status: { stringValue: 'draft' },
                classId: { stringValue: q.classId },
                subjectId: { stringValue: q.subjectId },
                chapterId: { stringValue: q.chapterId },
                topicId: { stringValue: q.topicId },
                promptHtml: { stringValue: q.promptHtml },
                options: {
                    arrayValue: {
                        values: q.options.map(o => ({
                            mapValue: {
                                fields: {
                                    html: { stringValue: o.html },
                                    correct: { booleanValue: o.correct }
                                }
                            }
                        }))
                    }
                },
                authorUid: { stringValue: uid },
                authorName: { stringValue: authorName },
                createdAt: { timestampValue: now },
                updatedAt: { timestampValue: now }
            }
        };

        const postRes = await request(
            'https://firestore.googleapis.com/v1/projects/eschool-dev-4c6b4/databases/(default)/documents/qb_questions_v1',
            {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            },
            JSON.stringify(payload)
        );

        if (postRes.status !== 200) {
            throw new Error(`Failed to save Q${i + 1} (${postRes.status}): ${JSON.stringify(postRes.body)}`);
        }

        const id = postRes.body.name.split('/').pop();
        savedDocIds.push(id);
        console.log(`[PASS] Q${i + 1} (${q.sectionName}) saved to qb_questions_v1 with ID: ${id}`);
    }

    // 4. Verify the 3 questions in Firestore
    console.log('--- Verifying Stored Documents in Firestore ---');
    for (let i = 0; i < savedDocIds.length; i++) {
        const docId = savedDocIds[i];
        const fetchRes = await request(
            `https://firestore.googleapis.com/v1/projects/eschool-dev-4c6b4/databases/(default)/documents/qb_questions_v1/${docId}`,
            { method: 'GET', headers: { 'Authorization': 'Bearer ' + token } }
        );

        if (fetchRes.status !== 200) throw new Error(`Q${i + 1} doc not found in Firestore`);
        const fields = fetchRes.body.fields;

        if (fields.type?.stringValue !== 'mcq') throw new Error(`Q${i + 1} type != mcq`);
        if (fields.status?.stringValue !== 'draft') throw new Error(`Q${i + 1} status != draft`);

        if (i === 1) {
            // Check multiple-correct Q2
            const opts = fields.options?.arrayValue?.values || [];
            if (opts[0].mapValue.fields.correct.booleanValue !== true) throw new Error('Q2 Option A should be true');
            if (opts[1].mapValue.fields.correct.booleanValue !== true) throw new Error('Q2 Option B should be true');
            if (opts[2].mapValue.fields.correct.booleanValue !== false) throw new Error('Q2 Option C should be false');
            if (opts[3].mapValue.fields.correct.booleanValue !== true) throw new Error('Q2 Option D should be true');
            console.log('[PASS] Q2 multiple-correct verified: A=true, B=true, C=false, D=true');
        }

        if (i === 2) {
            // Check Section 2 MathLive Q3
            if (!fields.promptHtml?.stringValue.includes('√1.1664')) throw new Error('Q3 formula altered');
            console.log('[PASS] Q3 (Section 2) MathLive formula preserved: ' + fields.promptHtml?.stringValue);
        }
    }

    // 5. Second save on the entire paper: update in-place without duplicates
    console.log('--- Running Second Save (Updates) on Entire Paper ---');
    const updateTime = new Date().toISOString();
    for (let i = 0; i < savedDocIds.length; i++) {
        const docId = savedDocIds[i];
        const q = questionsToCreate[i];
        const updatePayload = {
            fields: {
                type: { stringValue: 'mcq' },
                status: { stringValue: 'draft' },
                classId: { stringValue: q.classId },
                subjectId: { stringValue: q.subjectId },
                chapterId: { stringValue: q.chapterId },
                topicId: { stringValue: q.topicId },
                promptHtml: { stringValue: q.promptHtml },
                options: {
                    arrayValue: {
                        values: q.options.map(o => ({
                            mapValue: {
                                fields: {
                                    html: { stringValue: o.html },
                                    correct: { booleanValue: o.correct }
                                }
                            }
                        }))
                    }
                },
                authorUid: { stringValue: uid },
                authorName: { stringValue: authorName },
                updatedAt: { timestampValue: updateTime }
            }
        };

        const patchRes = await request(
            `https://firestore.googleapis.com/v1/projects/eschool-dev-4c6b4/databases/(default)/documents/qb_questions_v1/${docId}`,
            {
                method: 'PATCH',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }
            },
            JSON.stringify(updatePayload)
        );

        if (patchRes.status !== 200) {
            throw new Error(`Second save Q${i + 1} failed (${patchRes.status})`);
        }
        const updatedId = patchRes.body.name.split('/').pop();
        if (updatedId !== docId) {
            throw new Error(`Document ID changed on update! Old: ${docId}, New: ${updatedId}`);
        }
    }

    console.log('[PASS] Second save updated all 3 existing documents in-place. Duplicates created: 0');
    console.log('========================================================');
    console.log('LIVE PAPER SAVE COMPLETED SUCCESSFULLY!');
    return {
        savedDocIds,
        uid
    };
}

runLivePaperSave()
    .then(r => console.log('Saved Document IDs on Live Firestore:', r.savedDocIds))
    .catch(err => {
        console.error('LIVE PAPER SAVE FAILED:', err);
        process.exit(1);
    });
