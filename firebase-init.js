// Firebase SDK integration for MCQ Paper Creator
// Uses Firebase Web SDK v10.12.2 and connects to the Question Bank Firebase project

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    signInWithEmailAndPassword,
    signOut
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getFirestore,
    serverTimestamp,
    updateDoc,
    writeBatch
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const firebaseConfig = {
    apiKey: 'AIzaSyAYlezFn0tSSQHA-vRnJeBfJ-Om1YlDghk',
    authDomain: 'eschool-dev-4c6b4.firebaseapp.com',
    projectId: 'eschool-dev-4c6b4',
    storageBucket: 'eschool-dev-4c6b4.firebasestorage.app',
    messagingSenderId: '875648503944',
    appId: '1:875648503944:web:ea0d256e7aa977496f0f3d',
    measurementId: 'G-CF82P2M36M'
};

const COLLECTIONS = {
    taxonomy: 'qb_taxonomy_v1',
    questions: 'qb_questions_v1',
    reactions: 'qb_reactions_v1',
    lists: 'qb_lists_v1'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export async function loginWithGoogle() {
    if (typeof window !== 'undefined' && typeof window.save === 'function') {
        try { window.save(); } catch (e) { console.warn('Could not save paper before redirect:', e); }
    }
    return await signInWithRedirect(auth, googleProvider);
}

export async function loginWithGoogleRedirect() {
    if (typeof window !== 'undefined' && typeof window.save === 'function') {
        try { window.save(); } catch (e) { console.warn('Could not save paper before redirect:', e); }
    }
    return await signInWithRedirect(auth, googleProvider);
}

export async function loginWithGooglePopup() {
    return await signInWithPopup(auth, googleProvider);
}

export async function loginWithEmail(email, password) {
    return await signInWithEmailAndPassword(auth, email, password);
}

export async function loginAsTestTeacher() {
    return await signInWithEmailAndPassword(auth, 'testteacher@eschool.edu', 'Teacher123!');
}

export async function logoutUser() {
    return await signOut(auth);
}

export function observeAuthState(callback) {
    return onAuthStateChanged(auth, callback);
}

export function normalizeTaxonomyLabel(value) {
    return String(value || '').trim().replace(/\s+/g, ' ');
}

export function slugify(value) {
    const slug = normalizeTaxonomyLabel(value)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    return slug || 'untitled';
}

export function taxonomyId(type, label, parentId = '') {
    const prefix = { class: 'class', subject: 'subject', chapter: 'chapter', topic: 'topic' }[type] || type;
    return `${parentId ? `${parentId}__` : ''}${prefix}_${slugify(label)}`;
}

export function buildTaxonomyPath(labels) {
    const classLabel = normalizeTaxonomyLabel(labels.className || labels.class);
    const subjectLabel = normalizeTaxonomyLabel(labels.subjectName || labels.subject);
    const chapterLabel = normalizeTaxonomyLabel(labels.chapterName || labels.chapter);
    const topicLabel = normalizeTaxonomyLabel(labels.topicName || labels.topic);

    const classId = taxonomyId('class', classLabel);
    const subjectId = taxonomyId('subject', subjectLabel, classId);
    const chapterId = taxonomyId('chapter', chapterLabel, subjectId);
    const topicId = taxonomyId('topic', topicLabel, chapterId);

    return {
        ids: { classId, subjectId, chapterId, topicId },
        nodes: [
            { id: classId, type: 'class', label: classLabel, parentId: '', classId },
            { id: subjectId, type: 'subject', label: subjectLabel, parentId: classId, classId, subjectId },
            { id: chapterId, type: 'chapter', label: chapterLabel, parentId: subjectId, classId, subjectId, chapterId },
            { id: topicId, type: 'topic', label: topicLabel, parentId: chapterId, classId, subjectId, chapterId, topicId }
        ]
    };
}

export async function ensureTaxonomyPath(labels) {
    if (!auth.currentUser) {
        throw new Error('User must be signed in to create or update taxonomy in Firestore.');
    }
    const path = buildTaxonomyPath(labels);
    const batch = writeBatch(db);
    path.nodes.forEach(node => {
        batch.set(doc(db, COLLECTIONS.taxonomy, node.id), {
            ...node,
            updatedAt: serverTimestamp()
        }, { merge: true });
    });
    await batch.commit();
    return path.ids;
}

export async function saveQuestionToQuestionBank(question, context = {}) {
    const user = auth.currentUser || (typeof window !== 'undefined' && window.currentUser);
    if (!user || !user.uid) {
        const msg = 'Please sign in with Google before saving to the Question Bank.';
        if (typeof window !== 'undefined' && typeof window.toast === 'function') {
            window.toast(msg);
        }
        return { success: false, error: msg };
    }

    if (!question || typeof question !== 'object') {
        const msg = 'Unable to save question to Question Bank: Question data is missing.';
        if (typeof window !== 'undefined' && typeof window.toast === 'function') {
            window.toast(msg);
        }
        return { success: false, error: msg };
    }

    if (question.type && question.type !== 'mcq') {
        const msg = 'Unable to save question to Question Bank: Question must be an MCQ.';
        if (typeof window !== 'undefined' && typeof window.toast === 'function') {
            window.toast(msg);
        }
        return { success: false, error: msg };
    }

    if (!Array.isArray(question.options) || question.options.length !== 4) {
        const msg = 'Unable to save question to Question Bank: Question must have exactly four options.';
        if (typeof window !== 'undefined' && typeof window.toast === 'function') {
            window.toast(msg);
        }
        return { success: false, error: msg };
    }

    const correctIndexes = Array.isArray(question.correctIndexes) && question.correctIndexes.length > 0
        ? question.correctIndexes
        : (Number.isInteger(question.correctIndex) && question.correctIndex >= 0 ? [question.correctIndex] : []);
    const hasCorrectOption = correctIndexes.length > 0 || question.options.some(opt => opt && opt.correct === true);
    if (!hasCorrectOption) {
        const msg = 'Unable to save question to Question Bank: Question must have at least one correct answer.';
        if (typeof window !== 'undefined' && typeof window.toast === 'function') {
            window.toast(msg);
        }
        return { success: false, error: msg };
    }

    const className = String(question.className || context.className || (typeof window !== 'undefined' && window.getActivePaper?.()?.meta?.className) || '').trim();
    if (!className) {
        const msg = 'Unable to save question to Question Bank: Class is required.';
        if (typeof window !== 'undefined' && typeof window.toast === 'function') {
            window.toast(msg);
        }
        return { success: false, error: msg };
    }

    const subjectName = String(question.subject || question.subjectName || context.subjectName || context.subject || (typeof window !== 'undefined' && window.getActivePaper?.()?.meta?.subject) || '').trim();
    if (!subjectName) {
        const msg = 'Unable to save question to Question Bank: Subject is required.';
        if (typeof window !== 'undefined' && typeof window.toast === 'function') {
            window.toast(msg);
        }
        return { success: false, error: msg };
    }

    const chapterName = String(question.chapter || question.chapterName || context.chapterName || context.chapter || '').trim();
    const topicName = String(question.topic || question.topicName || context.topicName || context.topic || '').trim();
    if (!chapterName || !topicName) {
        const msg = 'Unable to save question to Question Bank: Chapter and topic are required.';
        if (typeof window !== 'undefined' && typeof window.toast === 'function') {
            window.toast(msg);
        }
        return { success: false, error: msg };
    }

    try {
        const taxonomyIds = await ensureTaxonomyPath({
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
            updatedAt: serverTimestamp()
        };

        let docId = question.firestoreQuestionId;
        let isUpdate = false;

        if (docId) {
            isUpdate = true;
            await updateDoc(doc(db, COLLECTIONS.questions, docId), payload);
            if (!context.silent && typeof window !== 'undefined' && typeof window.toast === 'function') {
                window.toast('Question updated in Question Bank.');
            }
        } else {
            payload.createdAt = serverTimestamp();
            const docRef = await addDoc(collection(db, COLLECTIONS.questions), payload);
            docId = docRef.id;
            question.firestoreQuestionId = docId;
            if (typeof window !== 'undefined' && typeof window.save === 'function') {
                window.save();
            }
            if (!context.silent && typeof window !== 'undefined' && typeof window.toast === 'function') {
                window.toast('Question saved to Question Bank.');
            }
        }

        return {
            success: true,
            id: docId,
            isUpdate,
            payload,
            taxonomyIds
        };
    } catch (err) {
        console.error('Firestore question save error:', err);
        const msg = `Unable to save question to Question Bank: ${err.message || 'Unknown error'}`;
        if (typeof window !== 'undefined' && typeof window.toast === 'function') {
            window.toast(msg);
        }
        return { success: false, error: msg };
    }
}

// Expose bridge on window for classic script.js
window.firebaseApp = app;
window.firebaseAuth = auth;
window.firebaseDb = db;
window.firebaseBridge = {
    app,
    auth,
    db,
    COLLECTIONS,
    loginWithGoogle,
    loginWithGoogleRedirect,
    loginWithGooglePopup,
    loginWithEmail,
    loginAsTestTeacher,
    logoutUser,
    observeAuthState,
    getRedirectResult: () => getRedirectResult(auth),
    getCurrentUser: () => auth.currentUser,
    normalizeTaxonomyLabel,
    slugify,
    taxonomyId,
    buildTaxonomyPath,
    ensureTaxonomyPath,
    saveQuestionToQuestionBank
};

window.loginWithGoogle = loginWithGoogle;
window.loginWithGoogleRedirect = loginWithGoogleRedirect;
window.loginWithGooglePopup = loginWithGooglePopup;
window.loginWithEmail = loginWithEmail;
window.loginAsTestTeacher = loginAsTestTeacher;
window.normalizeTaxonomyLabel = normalizeTaxonomyLabel;
window.slugify = slugify;
window.taxonomyId = taxonomyId;
window.buildTaxonomyPath = buildTaxonomyPath;
window.ensureTaxonomyPath = ensureTaxonomyPath;
window.saveQuestionToQuestionBank = saveQuestionToQuestionBank;

// Check for redirect sign-in result on page load
getRedirectResult(auth).then((result) => {
    if (result && result.user) {
        const user = result.user;
        if (typeof window.onFirebaseAuthChange === 'function') {
            window.onFirebaseAuthChange(user);
        }
        window.dispatchEvent(new CustomEvent('firebase-auth-change', { detail: { user } }));
        if (typeof window.toast === 'function') {
            window.toast(`Signed in as ${user.displayName || user.email}`);
        }
    }
}).catch((err) => {
    console.error('Redirect sign-in error:', err);
    if (typeof window.toast === 'function') {
        if (err.code === 'auth/unauthorized-domain') {
            window.toast('This domain is not authorized in Firebase Auth settings.');
        } else {
            window.toast(`Sign-in failed: ${err.message || 'Unknown error'}`);
        }
    }
});

onAuthStateChanged(auth, (user) => {
    if (typeof window.onFirebaseAuthChange === 'function') {
        window.onFirebaseAuthChange(user);
    }
    window.dispatchEvent(new CustomEvent('firebase-auth-change', { detail: { user } }));
});

window.dispatchEvent(new CustomEvent('firebase-bridge-ready', { detail: window.firebaseBridge }));
