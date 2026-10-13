// Test suite for Firebase initialization and Google Authentication in MCQ Paper Creator
const fs = require('fs');
const path = require('path');

console.log('Running Firebase Auth Integration Tests...');
console.log('==========================================');

const scriptCode = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');

// Simple DOM Mock
const domElements = new Map();
function createMockElement(id, tagName = 'div') {
    const el = {
        id,
        tagName: tagName.toUpperCase(),
        hidden: false,
        disabled: false,
        textContent: '',
        title: '',
        dataset: {},
        classList: {
            classes: new Set(),
            add(c) { this.classes.add(c); },
            remove(c) { this.classes.delete(c); },
            contains(c) { return this.classes.has(c); },
            toggle(c) { if (this.classes.has(c)) this.classes.delete(c); else this.classes.add(c); }
        },
        listeners: {},
        addEventListener(event, fn) {
            if (!this.listeners[event]) this.listeners[event] = [];
            this.listeners[event].push(fn);
        },
        dispatchEvent(event) {
            const handlers = this.listeners[event.type] || [];
            handlers.forEach(h => h(event));
        },
        click() {
            const handlers = this.listeners['click'] || [];
            handlers.forEach(h => h({ target: this, preventDefault() {} }));
        }
    };
    domElements.set(id, el);
    return el;
}

global.document = {
    getElementById(id) {
        if (!domElements.has(id)) {
            createMockElement(id);
        }
        return domElements.get(id);
    },
    addEventListener(event, fn) {},
    activeElement: null
};

// Mock window and event dispatching
const windowListeners = {};
global.window = {
    addEventListener(event, fn) {
        if (!windowListeners[event]) windowListeners[event] = [];
        windowListeners[event].push(fn);
    },
    dispatchEvent(event) {
        const handlers = windowListeners[event.type] || [];
        handlers.forEach(h => h(event));
    },
    CustomEvent: class {
        constructor(type, init = {}) {
            this.type = type;
            this.detail = init.detail;
        }
    }
};

// Mock localStorage
const mockStorage = new Map();
global.localStorage = {
    getItem(key) { return mockStorage.get(key) || null; },
    setItem(key, val) { mockStorage.set(key, String(val)); },
    removeItem(key) { mockStorage.delete(key); },
    clear() { mockStorage.clear(); }
};

let lastToastMessage = '';
global.toast = (msg) => {
    lastToastMessage = msg;
};

// Helper to extract function body from script.js
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

// Global variables referenced in script.js
global.STORAGE_KEY = 'school_mcq_paper_studio_v1';
global.LABELS = ['A', 'B', 'C', 'D'];
global.uid = (prefix) => `${prefix}_test_${Math.random().toString(36).slice(2, 7)}`;
global.newOption = (index, text = '') => ({ id: `opt${index}`, text });

// Extract the required functions
const updateAuthUI = extractFunction('updateAuthUI');
const handleAuthUserChange = extractFunction('handleAuthUserChange');
const handleGoogleSignIn = extractFunction('handleGoogleSignIn');
const handleSignOut = extractFunction('handleSignOut');
const initAuthUI = extractFunction('initAuthUI');
const newQuestion = extractFunction('newQuestion');
const samplePaper = extractFunction('samplePaper');
const normalize = extractFunction('normalize');
const load = extractFunction('load');
const save = extractFunction('save');

// Assign to global
global.updateAuthUI = updateAuthUI;
global.handleAuthUserChange = handleAuthUserChange;
global.handleGoogleSignIn = handleGoogleSignIn;
global.handleSignOut = handleSignOut;
global.initAuthUI = initAuthUI;
global.newQuestion = newQuestion;
global.samplePaper = samplePaper;
global.normalize = normalize;
global.load = load;
global.save = save;
global.getActivePaper = () => global.state.papers.find(p => p.id === global.state.activePaperId) || null;

// Initialize state
global.state = {
    papers: [],
    activePaperId: null,
    activeSectionId: null,
    filterSearchQuery: '',
    filterSelectedTags: [],
    isHoveringLogoArea: false,
    currentUser: null,
};
global.currentUser = null;

// Mock DOM elements for auth
createMockElement('loginBtn', 'button');
createMockElement('logoutBtn', 'button');
createMockElement('userProfile', 'div');
createMockElement('userDisplayName', 'span');

// Run tests
const tests = [];
function test(name, fn) {
    tests.push({ name, fn });
}

// TEST A: Logged-out initial state
test('Test A: Open MCQ Paper Creator while logged out', () => {
    initAuthUI();
    const loginBtn = document.getElementById('loginBtn');
    const userProfile = document.getElementById('userProfile');
    const userDisplayName = document.getElementById('userDisplayName');

    if (loginBtn.hidden !== false) throw new Error('loginBtn should be visible when logged out');
    if (userProfile.hidden !== true) throw new Error('userProfile should be hidden when logged out');
    if (userDisplayName.textContent !== '') throw new Error('userDisplayName should be empty when logged out');
    if (global.currentUser !== null) throw new Error('currentUser should be null when logged out');
    if (global.state.currentUser !== null) throw new Error('state.currentUser should be null when logged out');
});

// TEST B: Confirm existing question creation still works while logged out
test('Test B: Confirm existing question creation still works', () => {
    const q = newQuestion('What is 2 + 2?', ['1', '2', '3', '4'], 3);
    if (!q.id.startsWith('q_')) throw new Error('Question ID missing');
    if (q.text !== 'What is 2 + 2?') throw new Error('Question text incorrect');
    if (q.options.length !== 4) throw new Error('Question should have exactly 4 options');
    if (q.options[3].text !== '4') throw new Error('Option 4 text incorrect');
    if (q.correctIndex !== 3) throw new Error('Question correctIndex incorrect');
    if (q.marks !== 1) throw new Error('Question marks incorrect');
});

// TEST C: Confirm localStorage still works
test('Test C: Confirm localStorage still works', () => {
    load();
    if (!global.state.papers.length) throw new Error('Expected sample paper to be loaded');
    const paperId = global.state.activePaperId;
    save();

    const stored = JSON.parse(mockStorage.get(STORAGE_KEY));
    if (!stored || !stored.papers || stored.papers.length === 0) throw new Error('Storage does not contain saved state');
    if (stored.papers[0].id !== paperId) throw new Error('Paper ID in storage does not match');
    if (stored.currentUser !== null) throw new Error('Stored currentUser should be null when logged out');
});

// TEST D & E: Click "Sign in with Google" & complete authentication
test('Test D & E: Click "Sign in with Google" and complete authentication', async () => {
    const mockUser = {
        uid: 'user_test_uid_12345',
        displayName: 'Dr. Jane Smith',
        email: 'jane.smith@school.edu'
    };

    // Mock bridge with Google Auth
    window.firebaseBridge = {
        app: {},
        auth: { currentUser: mockUser },
        loginWithGoogle: async () => ({ user: mockUser }),
        logoutUser: async () => { window.firebaseBridge.auth.currentUser = null; },
        getCurrentUser: () => window.firebaseBridge.auth.currentUser
    };

    const loginBtn = document.getElementById('loginBtn');
    await handleGoogleSignIn();

    if (!lastToastMessage.includes('Dr. Jane Smith')) {
        throw new Error(`Expected toast to mention user, got: "${lastToastMessage}"`);
    }
});

// TEST F: Confirm the signed-in user's name/email is displayed
test('Test F: Confirm the signed-in user\'s name/email is displayed', () => {
    const loginBtn = document.getElementById('loginBtn');
    const userProfile = document.getElementById('userProfile');
    const userDisplayName = document.getElementById('userDisplayName');

    if (loginBtn.hidden !== true) throw new Error('loginBtn should be hidden when logged in');
    if (userProfile.hidden !== false) throw new Error('userProfile should be visible when logged in');
    if (userDisplayName.textContent !== 'Dr. Jane Smith') {
        throw new Error(`Expected displayName "Dr. Jane Smith", got "${userDisplayName.textContent}"`);
    }
    if (!userDisplayName.title.includes('jane.smith@school.edu')) {
        throw new Error(`Expected title to include email, got "${userDisplayName.title}"`);
    }
});

// TEST G: Confirm currentUser.uid is available
test('Test G: Confirm currentUser.uid, displayName, and email are available in state', () => {
    if (!global.currentUser) throw new Error('global.currentUser is missing');
    if (global.currentUser.uid !== 'user_test_uid_12345') {
        throw new Error(`Expected uid "user_test_uid_12345", got "${global.currentUser.uid}"`);
    }
    if (global.currentUser.displayName !== 'Dr. Jane Smith') {
        throw new Error(`Expected displayName "Dr. Jane Smith", got "${global.currentUser.displayName}"`);
    }
    if (global.currentUser.email !== 'jane.smith@school.edu') {
        throw new Error(`Expected email "jane.smith@school.edu", got "${global.currentUser.email}"`);
    }

    // Accessible in state
    if (!global.state.currentUser) throw new Error('state.currentUser is missing');
    if (global.state.currentUser.uid !== 'user_test_uid_12345') {
        throw new Error(`Expected state.currentUser.uid "user_test_uid_12345", got "${global.state.currentUser.uid}"`);
    }
});

// TEST H: Sign out
test('Test H: Sign out', async () => {
    await handleSignOut();
    if (!lastToastMessage.includes('Signed out')) {
        throw new Error(`Expected toast to mention signed out, got: "${lastToastMessage}"`);
    }
});

// TEST I: Confirm the logged-out UI returns
test('Test I: Confirm the logged-out UI returns', () => {
    const loginBtn = document.getElementById('loginBtn');
    const userProfile = document.getElementById('userProfile');
    const userDisplayName = document.getElementById('userDisplayName');

    if (loginBtn.hidden !== false) throw new Error('loginBtn should be visible after logout');
    if (userProfile.hidden !== true) throw new Error('userProfile should be hidden after logout');
    if (userDisplayName.textContent !== '') throw new Error('userDisplayName should be cleared after logout');
    if (global.currentUser !== null) throw new Error('currentUser should be null after logout');
    if (global.state.currentUser !== null) throw new Error('state.currentUser should be null after logout');
});

// TEST J: Create/edit a question after signing in and confirm existing functionality still works
test('Test J: Create/edit question after signing in and confirm functionality', async () => {
    // Sign back in
    const authUser = { uid: 'teacher_99', displayName: 'Teacher Test', email: 'teacher@test.com' };
    handleAuthUserChange(authUser);

    if (global.state.currentUser.uid !== 'teacher_99') throw new Error('User not set in state');

    // Create a new question
    const activeSection = global.state.papers[0].sections[0];
    const initialCount = activeSection.questions.length;

    const newQ = newQuestion('Find value of x if 2x = 8', ['2', '3', '4', '5'], 2);
    newQ.chapter = 'Algebra';
    newQ.topic = 'Linear Equations';
    activeSection.questions.push(newQ);

    if (activeSection.questions.length !== initialCount + 1) throw new Error('Question not added to section');

    // Edit the question
    newQ.text = 'Find value of x if 3x = 9';
    newQ.options[2].text = '3';
    newQ.correctIndex = 2;

    // Save and verify state is intact
    save();
    const stored = JSON.parse(mockStorage.get(STORAGE_KEY));
    const savedQ = stored.papers[0].sections[0].questions.find(q => q.id === newQ.id);

    if (!savedQ) throw new Error('New question not found in saved state');
    if (savedQ.text !== 'Find value of x if 3x = 9') throw new Error('Edited question text not saved');
    if (savedQ.chapter !== 'Algebra') throw new Error('Question chapter not preserved');
    if (savedQ.topic !== 'Linear Equations') throw new Error('Question topic not preserved');
    if (stored.currentUser.uid !== 'teacher_99') throw new Error('Stored user uid does not match');
});

// TEST 11: Error handling cases (popup closed, popup blocked, cancelled, network)
test('Test 11: Error handling cases handled gracefully', async () => {
    // 1. Popup closed by user
    window.firebaseBridge.loginWithGoogle = async () => {
        const err = new Error('The popup has been closed by the user before finalizing the operation.');
        err.code = 'auth/popup-closed-by-user';
        throw err;
    };
    await handleGoogleSignIn();
    if (!lastToastMessage.includes('popup was closed')) {
        throw new Error(`Expected popup closed toast, got: "${lastToastMessage}"`);
    }

    // 2. Popup blocked by browser
    window.firebaseBridge.loginWithGoogle = async () => {
        const err = new Error('Unable to establish a connection with the popup.');
        err.code = 'auth/popup-blocked';
        throw err;
    };
    await handleGoogleSignIn();
    if (!lastToastMessage.includes('Popup blocked by browser')) {
        throw new Error(`Expected popup blocked toast, got: "${lastToastMessage}"`);
    }

    // 3. Cancelled popup request
    window.firebaseBridge.loginWithGoogle = async () => {
        const err = new Error('Another popup is open');
        err.code = 'auth/cancelled-popup-request';
        throw err;
    };
    await handleGoogleSignIn();
    if (!lastToastMessage.includes('Another sign-in window is already open')) {
        throw new Error(`Expected another sign-in toast, got: "${lastToastMessage}"`);
    }

    // 4. Network error
    window.firebaseBridge.loginWithGoogle = async () => {
        const err = new Error('A network error had occurred');
        err.code = 'auth/network-request-failed';
        throw err;
    };
    await handleGoogleSignIn();
    if (!lastToastMessage.includes('Network error')) {
        throw new Error(`Expected network error toast, got: "${lastToastMessage}"`);
    }
});

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
    console.log('==========================================');
    console.log(`Summary: ${passed} passed, ${failed} failed.`);
    if (failed > 0) process.exit(1);
})();
