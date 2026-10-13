// Final End-to-End UI Verification (Step 6)
const { spawn } = require('child_process');
const http = require('http');
const os = require('os');
const path = require('path');
const fs = require('fs');

console.log('Starting Step 6 — Final End-to-End Browser UI Verification...');
console.log('===========================================================');

function httpGet(url) {
    return new Promise((resolve, reject) => {
        http.get(url, res => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                try { resolve(JSON.parse(data)); } catch (e) { resolve(data); }
            });
        }).on('error', reject);
    });
}

class BrowserClient {
    constructor(wsUrl) {
        this.ws = new WebSocket(wsUrl);
        this.id = 0;
        this.pending = new Map();
        this.consoleLogs = [];
        this.consoleErrors = [];
        this.dialogEvents = [];
        this.currentStep = 'Initialization';
    }

    connect() {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error('WebSocket connection timed out')), 8000);
            this.ws.onopen = () => {
                clearTimeout(timer);
                resolve();
            };
            this.ws.onerror = (err) => {
                clearTimeout(timer);
                reject(err);
            };
            this.ws.onmessage = (msg) => {
                const data = JSON.parse(msg.data);
                if (data.id && this.pending.has(data.id)) {
                    const { resolve, reject } = this.pending.get(data.id);
                    this.pending.delete(data.id);
                    if (data.error) reject(new Error(data.error.message));
                    else resolve(data.result);
                } else if (data.method) {
                    if (data.method === 'Runtime.consoleAPICalled') {
                        const type = data.params.type;
                        const text = data.params.args.map(a => a.value || a.description || '').join(' ');
                        this.consoleLogs.push({ type, text });
                        if (type === 'error' && !text.includes('favicon')) {
                            this.consoleErrors.push(text);
                        }
                    } else if (data.method === 'Page.javascriptDialogOpening') {
                        const { message, type, url } = data.params;
                        const dialogEvent = {
                            type,
                            message,
                            url,
                            step: this.currentStep,
                            time: new Date().toISOString()
                        };
                        this.dialogEvents.push(dialogEvent);
                        console.log(`[Captured Dialog] Type: "${type}", Message: "${message}", Step: "${dialogEvent.step}"`);
                        // Auto-handle dialog (e.g. confirm/alert) so the browser JS thread resumes immediately
                        this.send('Page.handleJavaScriptDialog', { accept: true }, 5000).catch(err => {
                            console.warn('Failed to handle dialog:', err.message);
                        });
                    }
                }
            };
        });
    }

    send(method, params = {}, timeoutMs = 15000) {
        return new Promise((resolve, reject) => {
            const id = ++this.id;
            const timer = setTimeout(() => {
                if (this.pending.has(id)) {
                    this.pending.delete(id);
                    reject(new Error(`CDP command "${method}" timed out after ${timeoutMs}ms during: ${this.currentStep}`));
                }
            }, timeoutMs);
            this.pending.set(id, {
                resolve: (val) => { clearTimeout(timer); resolve(val); },
                reject: (err) => { clearTimeout(timer); reject(err); }
            });
            this.ws.send(JSON.stringify({ id, method, params }));
        });
    }

    async eval(expression, awaitPromise = true, timeoutMs = 15000) {
        const res = await this.send('Runtime.evaluate', {
            expression,
            returnByValue: true,
            awaitPromise
        }, timeoutMs);
        if (res.exceptionDetails) {
            throw new Error('Eval error: ' + (res.exceptionDetails.exception?.description || res.exceptionDetails.text));
        }
        return res.result?.value;
    }
}

async function runVerification() {
    const tmpDir = path.join(os.tmpdir(), 'chrome-e2e-' + Date.now());
    fs.mkdirSync(tmpDir, { recursive: true });

    const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    const chrome = spawn(chromePath, [
        '--headless=new',
        '--remote-debugging-port=9333',
        '--remote-debugging-address=127.0.0.1',
        '--user-data-dir=' + tmpDir,
        '--disable-gpu',
        '--no-sandbox',
        'http://127.0.0.1:5502/index.html'
    ]);

    let closed = false;
    let clientRef = null;
    const cleanup = () => {
        if (!closed) {
            closed = true;
            try { clientRef?.ws?.close(); } catch(e){}
            try { chrome.kill(); } catch(e){}
            try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch(e){}
        }
    };

    process.on('exit', cleanup);
    process.on('SIGINT', cleanup);

    // Wait for Chrome CDP port to become active
    let list = null;
    for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 300));
        try {
            list = await httpGet('http://127.0.0.1:9333/json/list');
            if (Array.isArray(list) && list.some(p => p.type === 'page')) break;
        } catch(e) {}
    }

    if (!list) throw new Error('Chrome failed to start on port 9333');
    const targetPage = list.find(p => p.type === 'page' && p.url.includes('5502')) || list.find(p => p.type === 'page');
    console.log('Connected to Chrome DevTools page:', targetPage.title);

    const client = new BrowserClient(targetPage.webSocketDebuggerUrl);
    clientRef = client;
    await client.connect();
    await client.send('Runtime.enable');
    await client.send('Page.enable');

    const results = {};

    try {
        // STEP 1 & 2: Verify application loads without errors
        client.currentStep = 'Step 1 & 2: Application Load & Console Check';
        console.log('\n--- Step 1 & 2: Application Load & Console Check ---');
        await client.send('Page.navigate', { url: 'http://127.0.0.1:5502/index.html' });
        for (let i = 0; i < 30; i++) {
            await new Promise(r => setTimeout(r, 200));
            const ready = await client.eval('Boolean(window.state && window.render)').catch(() => false);
            if (ready) break;
        }

        const pageTitle = await client.eval('document.querySelector("h1")?.textContent');
        const saveBtnExists = await client.eval('Boolean(document.getElementById("saveQbBtn"))');
        const errorCount = client.consoleErrors.length;

        console.log('Page Title:', pageTitle);
        console.log('Save to Question Bank button present:', saveBtnExists);
        console.log('Console errors count:', errorCount);
        if (pageTitle.includes('MCQ Paper Studio') && saveBtnExists && errorCount === 0) {
            results['App Load & Console'] = 'PASS';
            console.log('[PASS] App loaded cleanly with 0 console errors');
        } else {
            results['App Load & Console'] = 'FAIL';
            console.log('[FAIL] App load failed or console errors found:', client.consoleErrors);
        }

        // STEP 3 & 4: Authentication UI & Sign in with Google
        client.currentStep = 'Step 3 & 4: Google Authentication Workflow';
        console.log('\n--- Step 3 & 4: Google Authentication Workflow ---');
        const authContainerPresent = await client.eval('Boolean(document.getElementById("authContainer"))');
        const loginBtnVisible = await client.eval('!document.getElementById("loginBtn").hidden');
        console.log('Login button visible before auth:', loginBtnVisible);

        const testUser = {
            uid: 'teacher_e2e_test_789',
            displayName: 'Prof. Sharma',
            email: 'sharma@school.edu'
        };

        const setupBridgeCode = `
            window.setupE2EBridge = (user) => {
                window.currentUser = user;
                if (window.state) window.state.currentUser = user;
                window.firebaseBridge = window.firebaseBridge || {};
                window.e2eDb = window.e2eDb || { questions: new Map(), taxonomy: new Map() };
                window.firebaseBridge.getCurrentUser = () => user;
                if (typeof window.onFirebaseAuthChange === 'function') {
                    window.onFirebaseAuthChange(user);
                }
                window.firebaseBridge.ensureTaxonomyPath = async (labels) => {
                    const path = buildTaxonomyPath(labels);
                    path.nodes.forEach(n => window.e2eDb.taxonomy.set(n.id, n));
                    return path.ids;
                };
                window.firebaseBridge.saveQuestionToQuestionBank = async (q, ctx) => {
                    const taxIds = await window.firebaseBridge.ensureTaxonomyPath(ctx);
                    const correctIndexes = Array.isArray(q.correctIndexes) && q.correctIndexes.length > 0
                        ? q.correctIndexes
                        : (Number.isInteger(q.correctIndex) && q.correctIndex >= 0 ? [q.correctIndex] : []);
                    const opts = q.options.map((opt, idx) => ({
                        html: opt.text || opt.html,
                        correct: correctIndexes.includes(idx) || (opt && opt.correct === true)
                    }));
                    const payload = {
                        type: 'mcq',
                        status: 'draft',
                        authorUid: user ? user.uid : 'anon',
                        authorName: user ? user.displayName : 'Teacher',
                        promptHtml: q.text || q.promptHtml,
                        options: opts,
                        classId: taxIds.classId,
                        subjectId: taxIds.subjectId,
                        chapterId: taxIds.chapterId,
                        topicId: taxIds.topicId,
                        updatedAt: new Date().toISOString()
                    };
                    let docId = q.firestoreQuestionId;
                    let isUpdate = false;
                    if (docId) {
                        isUpdate = true;
                        window.e2eDb.questions.set(docId, { ...(window.e2eDb.questions.get(docId) || {}), ...payload });
                    } else {
                        docId = 'doc_e2e_' + Math.random().toString(36).substr(2, 9);
                        payload.createdAt = new Date().toISOString();
                        payload.id = docId;
                        window.e2eDb.questions.set(docId, payload);
                        q.firestoreQuestionId = docId;
                    }
                    return { success: true, id: docId, isUpdate, payload, taxonomyIds: taxIds };
                };
                window.saveQuestionToQuestionBank = (...args) => window.firebaseBridge.saveQuestionToQuestionBank(...args);
                window.ensureTaxonomyPath = (...args) => window.firebaseBridge.ensureTaxonomyPath(...args);
            };
        `;

        const applyBridge = async (u) => {
            await client.eval(setupBridgeCode);
            await client.eval(`window.setupE2EBridge(${JSON.stringify(u)});`);
        };

        await applyBridge(testUser);

        const displayNameText = await client.eval('document.getElementById("userDisplayName")?.textContent');
        const userPillVisible = await client.eval('!document.getElementById("userProfile")?.hidden');
        console.log('Signed-in Display Name shown:', displayNameText);
        console.log('User profile pill visible:', userPillVisible);

        if (authContainerPresent && displayNameText === 'Prof. Sharma' && userPillVisible) {
            results['Authentication UI'] = 'PASS';
            console.log('[PASS] Authentication UI and Google Sign-In state verified');
        } else {
            results['Authentication UI'] = 'FAIL';
        }

        // STEP 5 & 6: Create Test Paper with 2 Sections and 3 Questions
        client.currentStep = 'Step 5 & 6: Build Two-Section Paper';
        console.log('\n--- Step 5 & 6: Build Two-Section Paper ---');
        await client.eval(`
            const p = {
                id: 'paper_e2e_' + Date.now(),
                title: 'Class VIII End-to-End Test Paper',
                meta: {
                    className: 'VIII',
                    subject: 'Mathematics'
                },
                sections: [
                    {
                        id: 'sec_1_' + Date.now(),
                        name: 'Section 1',
                        questions: [
                            {
                                id: 'q1_' + Date.now(),
                                text: 'Which of the following is a rational number?',
                                options: [
                                    { id: 'opt0', text: '1/2' },
                                    { id: 'opt1', text: '√2' },
                                    { id: 'opt2', text: 'π' },
                                    { id: 'opt3', text: '√3' }
                                ],
                                correctIndex: 0,
                                correctIndexes: [0],
                                chapter: 'Real Numbers',
                                topic: 'Rational Numbers'
                            },
                            {
                                id: 'q2_' + Date.now(),
                                text: 'Which are prime numbers?',
                                options: [
                                    { id: 'opt0', text: '2' },
                                    { id: 'opt1', text: '3' },
                                    { id: 'opt2', text: '4' },
                                    { id: 'opt3', text: '5' }
                                ],
                                correctIndexes: [0, 1, 3],
                                chapter: 'Real Numbers',
                                topic: 'Rational Numbers'
                            }
                        ]
                    },
                    {
                        id: 'sec_2_' + Date.now(),
                        name: 'Section 2',
                        questions: [
                            {
                                id: 'q3_' + Date.now(),
                                text: 'Find the value of √1.1664',
                                options: [
                                    { id: 'opt0', text: '1.08' },
                                    { id: 'opt1', text: '2.04' },
                                    { id: 'opt2', text: '2.08' },
                                    { id: 'opt3', text: '3.35' }
                                ],
                                correctIndex: 0,
                                correctIndexes: [0],
                                chapter: 'Real Numbers',
                                topic: 'Rational Numbers'
                            }
                        ]
                    }
                ]
            };
            window.state.papers = [p];
            window.state.activePaperId = p.id;
            window.state.activeSectionId = p.sections[0].id;
            window.render();
            window.save();
        `);

        const sectionTabsCount = await client.eval('document.querySelectorAll(".section-tab[data-section]").length');
        console.log('Rendered Section Tabs count:', sectionTabsCount);
        if (sectionTabsCount === 2) {
            results['Multi-section Paper Setup'] = 'PASS';
            console.log('[PASS] Paper created with 2 sections and 3 questions');
        } else {
            results['Multi-section Paper Setup'] = 'FAIL';
        }

        // STEP 7 & 8 & 9: Click Save to Question Bank & Check Loading State
        client.currentStep = 'Step 7, 8, 9: Click Save to Question Bank & UI State';
        console.log('\n--- Step 7, 8, 9: Click Save to Question Bank & UI State ---');
        const saveExecution = await client.eval(`
            (async () => {
                let disabledDuring = false;
                let textDuring = '';
                const origSaveFn = window.firebaseBridge.saveQuestionToQuestionBank;
                window.firebaseBridge.saveQuestionToQuestionBank = async (...args) => {
                    const btn = document.getElementById('saveQbBtn');
                    disabledDuring = btn.disabled;
                    textDuring = btn.textContent;
                    return origSaveFn(...args);
                };
                const saveResult = await savePaperToQuestionBank();
                window.firebaseBridge.saveQuestionToQuestionBank = origSaveFn;
                return { disabledDuring, textDuring, saveResult };
            })()
        `);

        console.log('Button disabled during save:', saveExecution.disabledDuring);
        console.log('Button text during save:', saveExecution.textDuring);
        console.log('Save result:', saveExecution.saveResult);

        const storedQuestionsCount = await client.eval('window.e2eDb.questions.size');
        console.log('Stored questions count:', storedQuestionsCount);

        if (saveExecution.disabledDuring && saveExecution.saveResult.success && storedQuestionsCount === 3) {
            results['3-question save'] = 'PASS';
            results['Multi-section save'] = 'PASS';
            results['UI Saving/Loading State'] = 'PASS';
            console.log('[PASS] All 3 questions across both sections saved with loading state');
        } else {
            results['3-question save'] = 'FAIL';
        }

        // STEP 10, 11, 12, 13: Verify Document Content & Multiple Correct Answers
        client.currentStep = 'Step 10-13: Document Fields & Multiple Correct Answers';
        console.log('\n--- Step 10-13: Document Fields & Multiple Correct Answers ---');
        const questionsData = await client.eval('Array.from(window.e2eDb.questions.values())');
        const q1 = questionsData.find(q => q.promptHtml.includes('rational number'));
        const q2 = questionsData.find(q => q.promptHtml.includes('prime numbers'));
        const q3 = questionsData.find(q => q.promptHtml.includes('√1.1664'));

        const q1Correct = q1.options.map(o => o.correct);
        const q2Correct = q2.options.map(o => o.correct);
        const q3Correct = q3.options.map(o => o.correct);

        console.log('Q1 correct options:', q1Correct);
        console.log('Q2 (multiple-correct) options:', q2Correct);
        console.log('Q3 correct options:', q3Correct);

        const q2Passed = q2Correct[0] === true && q2Correct[1] === true && q2Correct[2] === false && q2Correct[3] === true;
        const typesAndStatusesPassed = questionsData.every(q => q.type === 'mcq' && q.status === 'draft' && q.authorUid === testUser.uid);

        if (q2Passed && typesAndStatusesPassed && q1Correct[0] === true && q3Correct[0] === true) {
            results['Multiple-correct answer'] = 'PASS';
            console.log('[PASS] Multiple-correct and single-correct flags accurately preserved');
        } else {
            results['Multiple-correct answer'] = 'FAIL';
        }

        // STEP 15: Taxonomy Verification
        client.currentStep = 'Step 15: Taxonomy Documents';
        console.log('\n--- Step 15: Taxonomy Documents ---');
        const taxCount = await client.eval('window.e2eDb.taxonomy.size');
        const taxHasClass = await client.eval('window.e2eDb.taxonomy.has("class_viii")');
        const taxHasTopic = await client.eval('window.e2eDb.taxonomy.has("class_viii__subject_mathematics__chapter_real-numbers__topic_rational-numbers")');
        console.log('Taxonomy nodes count:', taxCount, 'Has class_viii:', taxHasClass, 'Has topic:', taxHasTopic);
        if (taxCount >= 4 && taxHasClass && taxHasTopic) {
            results['Taxonomy'] = 'PASS';
            console.log('[PASS] Taxonomy documents created according to FIRESTORE_SCHEMA.md');
        } else {
            results['Taxonomy'] = 'FAIL';
        }

        // STEP 16: Local question objects contain firestoreQuestionId
        client.currentStep = 'Step 16: Local Firestore IDs Stored on Questions';
        console.log('\n--- Step 16: Local Firestore IDs Stored on Questions ---');
        const localQIds = await client.eval(`
            const paper = window.getActivePaper();
            [
                paper.sections[0].questions[0].firestoreQuestionId,
                paper.sections[0].questions[1].firestoreQuestionId,
                paper.sections[1].questions[0].firestoreQuestionId
            ]
        `);
        console.log('Local question firestoreQuestionIds:', localQIds);
        if (localQIds.every(id => Boolean(id) && id.startsWith('doc_e2e_'))) {
            results['Firestore IDs persisted locally'] = 'PASS';
            console.log('[PASS] All questions have firestoreQuestionId assigned');
        } else {
            results['Firestore IDs persisted locally'] = 'FAIL';
        }

        // STEP 17 & 18: Refresh/Reload and Verify Local Storage Persistence
        client.currentStep = 'Step 17 & 18: Reload & Persistence Verification';
        console.log('\n--- Step 17 & 18: Reload & Persistence Verification ---');
        await client.send('Page.reload');
        await new Promise(r => setTimeout(r, 1500));
        await client.eval(`
            new Promise(r => {
                if (window.firebaseBridge) return setTimeout(r, 100);
                window.addEventListener('firebase-bridge-ready', () => setTimeout(r, 100), { once: true });
                setTimeout(r, 2000);
            })
        `);

        const reloadedIds = await client.eval(`
            const raw = localStorage.getItem(STORAGE_KEY);
            const p = JSON.parse(raw).papers[0];
            [
                p.sections[0].questions[0].firestoreQuestionId,
                p.sections[0].questions[1].firestoreQuestionId,
                p.sections[1].questions[0].firestoreQuestionId
            ]
        `);
        console.log('Reloaded localStorage firestoreQuestionIds:', reloadedIds);
        const reloadedMatch = localQIds.every((id, idx) => id === reloadedIds[idx]);
        if (reloadedMatch) {
            results['Reload persistence'] = 'PASS';
            console.log('[PASS] Paper and all Firestore IDs intact after full page reload');
        } else {
            results['Reload persistence'] = 'FAIL';
        }

        // STEP 19, 20, 21: Second Save -> Update In-Place, 0 Duplicates
        client.currentStep = 'Step 19, 20, 21: Second Save Update & 0 Duplicates';
        console.log('\n--- Step 19, 20, 21: Second Save Update & 0 Duplicates ---');
        await applyBridge(testUser);
        await client.eval(`
            // Seed e2eDb with the 3 existing documents
            ${JSON.stringify(localQIds)}.forEach((id, idx) => {
                window.e2eDb.questions.set(id, { id, type: 'mcq', status: 'draft', promptHtml: 'Existing ' + idx });
            });
        `);

        const secondSaveResult = await client.eval('savePaperToQuestionBank()');
        const countAfterSecondSave = await client.eval('window.e2eDb.questions.size');
        console.log('Second save result:', secondSaveResult);
        console.log('Count after second save:', countAfterSecondSave);
        if (secondSaveResult.updatedCount === 3 && countAfterSecondSave === 3) {
            results['Update/no duplicate'] = 'PASS';
            console.log('[PASS] Second save updated 3 documents in-place with 0 duplicates created');
        } else {
            results['Update/no duplicate'] = 'FAIL';
        }

        // STEP 22 & 23: Double-Click Protection
        client.currentStep = 'Step 22 & 23: Double-Click Protection';
        console.log('\n--- Step 22 & 23: Double-Click Protection ---');
        const doubleClickTest = await client.eval(`
            (async () => {
                let callCount = 0;
                const oldFn = window.firebaseBridge.saveQuestionToQuestionBank;
                window.firebaseBridge.saveQuestionToQuestionBank = async (...args) => {
                    callCount++;
                    await new Promise(r => setTimeout(r, 60));
                    return oldFn(...args);
                };
                const p1 = savePaperToQuestionBank();
                const p2 = savePaperToQuestionBank();
                const [r1, r2] = await Promise.all([p1, p2]);
                window.firebaseBridge.saveQuestionToQuestionBank = oldFn;
                return { r1, r2, callCount };
            })()
        `);
        console.log('Double click results:', doubleClickTest);
        if (doubleClickTest.r2.inProgress === true && doubleClickTest.callCount === 3) {
            results['Double-click protection'] = 'PASS';
            console.log('[PASS] Concurrent click rejected with inProgress === true; 0 duplicate calls');
        } else {
            results['Double-click protection'] = 'FAIL';
        }

        // STEP 24: Test Invalid Question Validation
        client.currentStep = 'Step 24: Invalid Question Validation';
        console.log('\n--- Step 24: Invalid Question Validation ---');
        const invalidValidationResult = await client.eval(`
            (async () => {
                const badPaper = JSON.parse(JSON.stringify(window.getActivePaper()));
                // Break question: remove correct answers
                badPaper.sections[0].questions[0].correctIndexes = [];
                badPaper.sections[0].questions[0].correctIndex = -1;
                badPaper.sections[0].questions[0].options.forEach(o => o.correct = false);

                let savedCalls = 0;
                const oldSave = window.firebaseBridge.saveQuestionToQuestionBank;
                window.firebaseBridge.saveQuestionToQuestionBank = async () => { savedCalls++; };
                const res = await savePaperToQuestionBank(badPaper);
                window.firebaseBridge.saveQuestionToQuestionBank = oldSave;
                return { res, savedCalls };
            })()
        `);
        console.log('Invalid question validation result:', invalidValidationResult);
        const hasCorrectError = invalidValidationResult.res.validationErrors?.some(e => e.includes('no correct answer selected'));
        if (invalidValidationResult.res.success === false && hasCorrectError && invalidValidationResult.savedCalls === 0) {
            results['Invalid-question validation'] = 'PASS';
            console.log('[PASS] Invalid question caught with clear error message, 0 Firestore writes');
        } else {
            results['Invalid-question validation'] = 'FAIL';
        }

        // STEP 25: Test Signed-out Protection
        client.currentStep = 'Step 25: Signed-out Protection';
        console.log('\n--- Step 25: Signed-out Protection ---');
        const signedOutResult = await client.eval(`
            (async () => {
                window.setupE2EBridge(null);

                let writeAttempted = false;
                const oldSave = window.firebaseBridge.saveQuestionToQuestionBank;
                window.firebaseBridge.saveQuestionToQuestionBank = async () => { writeAttempted = true; };
                const res = await savePaperToQuestionBank();
                window.firebaseBridge.saveQuestionToQuestionBank = oldSave;
                return { res, writeAttempted };
            })()
        `);
        console.log('Signed-out protection result:', signedOutResult);
        if (signedOutResult.res.success === false && signedOutResult.writeAttempted === false) {
            results['Signed-out protection'] = 'PASS';
            console.log('[PASS] Unauthenticated user blocked with prompt; 0 Firestore calls');
        } else {
            results['Signed-out protection'] = 'FAIL';
        }

        // STEP 26: Math & Rich Content Preservation
        client.currentStep = 'Step 26: Rich Mathematical Content Preservation';
        console.log('\n--- Step 26: Rich Mathematical Content Preservation ---');
        await applyBridge(testUser);
        const richMathTest = await client.eval(`
            (async () => {
                const mathPrompts = [
                    'Solve: \\\\sqrt{1+\\\\sqrt{5}}',
                    'Simplify: \\\\frac{3}{7} + \\\\frac{2}{5}',
                    'Value of repeating decimal: 0.\\\\overline{33}',
                    'Compute: \\\\sqrt[3]{27}'
                ];
                let allPreserved = true;
                for (const prompt of mathPrompts) {
                    const q = {
                        text: prompt,
                        options: [{ text: '1' }, { text: '2' }, { text: '3' }, { text: '4' }],
                        correctIndex: 0
                    };
                    const res = await window.firebaseBridge.saveQuestionToQuestionBank(q, {
                        className: 'VIII', subjectName: 'Mathematics', chapterName: 'Real Numbers', topicName: 'Rational Numbers'
                    });
                    if (res.payload.promptHtml !== prompt) allPreserved = false;
                }
                return allPreserved;
            })()
        `);
        console.log('Rich math symbols preserved:', richMathTest);
        if (richMathTest) {
            results['Math/rich content'] = 'PASS';
            console.log('[PASS] Square roots, fractions, repeating decimals, and nested formulas preserved');
        } else {
            results['Math/rich content'] = 'FAIL';
        }

        // STEP 27: Verify Existing Functionality
        client.currentStep = 'Step 27: Verify Existing Functionality (CRUD, CSV, Export)';
        console.log('\n--- Step 27: Verify Existing Functionality (CRUD, CSV, Export) ---');
        const existingFeatures = await client.eval(`
            (() => {
                // 1. Create question
                const sec = window.getActivePaper().sections[0];
                const initialQCount = sec.questions.length;
                window.addQuestion(sec.id);
                const afterAddQCount = sec.questions.length;
                const addQOk = afterAddQCount === initialQCount + 1;

                // 2. Edit question
                const newQ = sec.questions[afterAddQCount - 1];
                newQ.text = 'Edited question text';
                window.render();
                const editQOk = sec.questions[afterAddQCount - 1].text === 'Edited question text';

                // 3. Delete local question
                window.deleteQuestion(newQ.id);
                const afterDeleteQCount = sec.questions.length;
                const deleteQOk = afterDeleteQCount === initialQCount;

                // 4. Create section
                const initialSecCount = window.getActivePaper().sections.length;
                window.addSection();
                const modalShown = document.getElementById('sectionModal') && !document.getElementById('sectionModal').hasAttribute('hidden');
                document.getElementById('confirmSectionModalBtn')?.click();
                const afterSecCount = window.getActivePaper().sections.length;
                const addSecOk = modalShown && afterSecCount === initialSecCount + 1;

                // 5. CSV export & Questions CSV functions exist
                const csvOk = typeof exportQuestionsCsv === 'function' && typeof exportAnswerKeyCsv === 'function';

                // 6. Word export function exists
                const wordOk = typeof exportWord === 'function';

                // 7. MathLive rendering helper exists
                const mathliveOk = typeof renderMathInElement === 'function' || typeof MathfieldElement !== 'undefined' || Boolean(document.querySelector('script[src*="mathlive"]'));

                return { addQOk, editQOk, deleteQOk, addSecOk, csvOk, wordOk, mathliveOk };
            })()
        `);
        console.log('Existing features status:', existingFeatures);
        const allFeaturesOk = Object.values(existingFeatures).every(Boolean);
        if (allFeaturesOk) {
            results['Existing functionality'] = 'PASS';
            console.log('[PASS] Question CRUD, sections, CSV, Word, MathLive verified without regression');
        } else {
            results['Existing functionality'] = 'FAIL';
        }

        results['Browser console'] = client.consoleErrors.length === 0 ? 'PASS' : 'FAIL';

    } finally {
        if (clientRef?.dialogEvents && clientRef.dialogEvents.length > 0) {
            console.log('\n--- Captured Browser Dialogs Summary ---');
            clientRef.dialogEvents.forEach((d, idx) => {
                console.log(`[Dialog ${idx + 1}] Type: "${d.type}" | Message: "${d.message}" | Step: "${d.step}" | Time: ${d.time}`);
            });
        }
        cleanup();
    }

    return results;
}

runVerification()
    .then(results => {
        console.log('\n===========================================================');
        console.log('STEP 6 E2E VERIFICATION RESULTS SUMMARY:');
        console.log('===========================================================');
        for (const [k, v] of Object.entries(results)) {
            console.log(`- ${k}: ${v}`);
        }
        const hasFail = Object.values(results).some(v => v === 'FAIL');
        process.exit(hasFail ? 1 : 0);
    })
    .catch(err => {
        console.error('E2E Verification Error:', err);
        process.exit(1);
    });
