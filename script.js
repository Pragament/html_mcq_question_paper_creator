// ═══════════════════════════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════════════════════════

let state = {
    papers: [], // { id, name, sections: [{ id, name, questions: [{ id, text, options: [{ id, text, isCorrect }], images: { q: null, opts: [null,null,null,null] } }] }] }
    activePaperId: null,
    activeSectionId: null,
    optionLayout: 'row', // 'row' | 'column' | 'grid2'
    reuseTargetSectionId: null,
    reuseSelected: [],
};

const STORAGE_KEY = 'mcq_builder_data';
const LAYOUT_KEY = 'mcq_builder_layout';

// ─── Load from localStorage ───
function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            state.papers = JSON.parse(saved);
            // ensure each question has images object
            state.papers.forEach(p => {
                p.sections.forEach(s => {
                    s.questions.forEach(q => {
                        if (!q.images) q.images = { q: null, opts: [null, null, null,
                            null
                        ] };
                        if (!q.options) q.options = [];
                        q.options.forEach((o, i) => {
                            if (!o.id) o.id = 'opt_' + Date.now() + '_' + i;
                        });
                    });
                });
            });
        } catch (e) { state.papers = []; }
    }
    const layout = localStorage.getItem(LAYOUT_KEY);
    if (layout && ['row', 'column', 'grid2'].includes(layout)) {
        state.optionLayout = layout;
    }
    if (state.papers.length === 0) {
        // seed with a sample paper
        state.papers = [createSamplePaper()];
    }
    if (state.papers.length > 0 && !state.activePaperId) {
        state.activePaperId = state.papers[0].id;
    }
    // ensure active section
    const activePaper = state.papers.find(p => p.id === state.activePaperId);
    if (activePaper && activePaper.sections.length > 0 && !state.activeSectionId) {
        state.activeSectionId = activePaper.sections[0].id;
    }
}

function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.papers));
    localStorage.setItem(LAYOUT_KEY, state.optionLayout);
}

// ─── Sample Paper ───
function createSamplePaper() {
    return {
        id: 'paper_' + Date.now(),
        name: 'Sample Paper - IX IIT',
        sections: [{
            id: 'sec_' + Date.now() + '_1',
            name: 'Mathematics',
            questions: [{
                id: 'q_' + Date.now() + '_1',
                text: 'Two circles having same \\_\\_\\_\\_\\_ are called concentric circles',
                options: [
                    { id: 'o1', text: 'Center', isCorrect: true },
                    { id: 'o2', text: 'radius', isCorrect: false },
                    { id: 'o3', text: 'arc', isCorrect: false },
                    { id: 'o4', text: 'segment', isCorrect: false }
                ],
                images: { q: null, opts: [null, null, null, null] }
            }, {
                id: 'q_' + Date.now() + '_2',
                text: 'Degree measure of a circle is \\_\\_\\_\\_\\_ degrees',
                options: [
                    { id: 'o5', text: '90', isCorrect: false },
                    { id: 'o6', text: '180', isCorrect: false },
                    { id: 'o7', text: '270', isCorrect: false },
                    { id: 'o8', text: '360', isCorrect: true }
                ],
                images: { q: null, opts: [null, null, null, null] }
            }, {
                id: 'q_' + Date.now() + '_3',
                text: 'If a line intersect a circle in two distinct points, then it is called',
                options: [
                    { id: 'o9', text: 'Secant', isCorrect: true },
                    { id: 'o10', text: 'tangent', isCorrect: false },
                    { id: 'o11', text: 'median', isCorrect: false },
                    { id: 'o12', text: 'altitude', isCorrect: false }
                ],
                images: { q: null, opts: [null, null, null, null] }
            }]
        }, {
            id: 'sec_' + Date.now() + '_2',
            name: 'Physics',
            questions: [{
                id: 'q_' + Date.now() + '_4',
                text: 'If the length of the wire is increased its resistivity \\_\\_\\_\\_\\_\\_\\_\\_\\_',
                options: [
                    { id: 'o13', text: 'Increase', isCorrect: false },
                    { id: 'o14', text: 'decrease', isCorrect: false },
                    { id: 'o15', text: 'remains same', isCorrect: true },
                    { id: 'o16', text: 'may increase or decrease', isCorrect: false }
                ],
                images: { q: null, opts: [null, null, null, null] }
            }]
        }, {
            id: 'sec_' + Date.now() + '_3',
            name: 'Chemistry',
            questions: [{
                id: 'q_' + Date.now() + '_5',
                text: 'If eight electrons present in valence shell, it is called',
                options: [
                    { id: 'o17', text: 'Duplet configuration', isCorrect: false },
                    { id: 'o18', text: 'Octet configuration', isCorrect: true },
                    { id: 'o19', text: 'Inert gas configuration', isCorrect: false },
                    { id: 'o20', text: 'Pseudo inert gas configuration', isCorrect: false }
                ],
                images: { q: null, opts: [null, null, null, null] }
            }]
        }, {
            id: 'sec_' + Date.now() + '_4',
            name: 'MAT',
            questions: [{
                id: 'q_' + Date.now() + '_6',
                text: 'Choose the term which will continue the following series: P3C, R5F, T8I, V12L, ?',
                options: [
                    { id: 'o21', text: 'Y17O', isCorrect: false },
                    { id: 'o22', text: 'X17M', isCorrect: false },
                    { id: 'o23', text: 'X17O', isCorrect: true },
                    { id: 'o24', text: 'X16O', isCorrect: false }
                ],
                images: { q: null, opts: [null, null, null, null] }
            }]
        }]
    };
}

// ═══════════════════════════════════════════════════════════════
//  RENDER
// ═══════════════════════════════════════════════════════════════

function render() {
    renderPaperList();
    renderEditor();
    saveState();
}

function renderPaperList() {
    const container = document.getElementById('paperList');
    if (state.papers.length === 0) {
        container.innerHTML =
            `<div class="empty-papers">No papers yet.<br>Click "+ New" to create one.</div>`;
        return;
    }
    let html = '';
    state.papers.forEach(p => {
        const active = p.id === state.activePaperId ? 'active' : '';
        const qCount = p.sections.reduce((sum, s) => sum + s.questions.length, 0);
        html += `
            <div class="paper-item ${active}" onclick="selectPaper('${p.id}')">
                <span class="paper-name">${escHtml(p.name)}</span>
                <span class="paper-meta">${p.sections.length} sec · ${qCount} Q</span>
                <button class="del-paper" onclick="event.stopPropagation(); deletePaper('${p.id}')" title="Delete">✕</button>
            </div>
        `;
    });
    container.innerHTML = html;
}

function renderEditor() {
    const container = document.getElementById('mainEditor');
    const paper = state.papers.find(p => p.id === state.activePaperId);
    if (!paper) {
        container.innerHTML = `
            <div style="text-align:center;padding:80px 20px;color:#94a3b8;">
                <div style="font-size:48px;margin-bottom:16px;">📄</div>
                <h3 style="color:#1e293b;">No paper selected</h3>
                <p style="font-size:14px;">Create a new paper or select one from the left panel.</p>
                <button onclick="createNewPaper()" style="margin-top:16px;background:#2563eb;color:#fff;border:none;padding:8px 24px;border-radius:8px;cursor:pointer;">+ New Paper</button>
            </div>
        `;
        return;
    }

    let html = `
        <div class="editor-paper-title">
            <input type="text" value="${escHtml(paper.name)}" 
                   onchange="renamePaper('${paper.id}', this.value)" 
                   placeholder="Paper title..." />
            <div class="paper-actions">
                <button onclick="addSection('${paper.id}')">+ Section</button>
                <button onclick="openReuseModal('${paper.id}')">📥 Reuse Q</button>
                <button onclick="exportDOCX('${paper.id}')">📄 DOCX</button>
                <button onclick="exportPDF('${paper.id}')">📄 PDF</button>
                <button onclick="exportJSON('${paper.id}')">📋 JSON</button>
                <button onclick="exportCSV('${paper.id}')">📊 CSV</button>
            </div>
        </div>
    `;

    if (paper.sections.length === 0) {
        html += `<div style="text-align:center;padding:40px 0;color:#94a3b8;">
                    No sections yet. Click "+ Section" to add one.
                </div>`;
        container.innerHTML = html;
        return;
    }

    paper.sections.forEach((sec, si) => {
        const qCount = sec.questions.length;
        html += `
            <div class="section-block" data-sec-id="${sec.id}">
                <div class="section-header">
                    <div class="sec-name">
                        <span>📂</span>
                        <input type="text" value="${escHtml(sec.name)}" 
                               onchange="renameSection('${paper.id}','${sec.id}',this.value)" 
                               placeholder="Section name" />
                        <span class="text-muted">(${qCount} Q)</span>
                    </div>
                    <div class="sec-actions">
                        <button onclick="addQuestion('${paper.id}','${sec.id}')">+ Question</button>
                        <button class="del-sec" onclick="deleteSection('${paper.id}','${sec.id}')">✕</button>
                    </div>
                </div>
                <div class="section-body">
        `;

        if (sec.questions.length === 0) {
            html += `<div style="color:#94a3b8;padding:12px 0;text-align:center;font-size:13px;">No questions yet.</div>`;
        } else {
            sec.questions.forEach((q, qi) => {
                const qNum = qi + 1;
                const imgQ = q.images && q.images.q ? q.images.q : null;
                html += `
                    <div class="question-item" data-q-id="${q.id}">
                        <div class="q-header">
                            <span class="q-number">${qNum}.</span>
                            <div style="flex:1;min-width:0;">
                                <textarea class="q-text" rows="1" 
                                          oninput="autoResize(this); updateQuestionText('${paper.id}','${sec.id}','${q.id}',this.value)"
                                          placeholder="Enter question text... (use \\(...\\) for math)">${escHtml(q.text)}</textarea>
                                ${imgQ ? `<div><img src="${imgQ}" class="img-preview" /><button class="img-remove" onclick="removeQuestionImage('${paper.id}','${sec.id}','${q.id}')">✕</button></div>` : ''}
                                <div class="img-hint">📷 Paste image (Ctrl+V) into question</div>
                            </div>
                            <div class="q-actions">
                                <button onclick="duplicateQuestion('${paper.id}','${sec.id}','${q.id}')" title="Duplicate">📋</button>
                                <button class="del-q" onclick="deleteQuestion('${paper.id}','${sec.id}','${q.id}')" title="Delete">✕</button>
                            </div>
                        </div>
                        <div class="options-container ${state.optionLayout}" data-layout="${state.optionLayout}">
                `;
                // ensure 4 options
                while (q.options.length < 4) {
                    q.options.push({ id: 'opt_' + Date.now() + '_' + q.options.length, text: '',
                    isCorrect: false });
                }
                const labels = ['A', 'B', 'C', 'D'];
                q.options.forEach((opt, oi) => {
                    const imgOpt = q.images && q.images.opts && q.images.opts[oi] ? q.images
                        .opts[oi] : null;
                    html += `
                        <div class="option-item">
                            <span class="opt-label">${labels[oi]}.</span>
                            <input type="text" class="opt-text" 
                                   value="${escHtml(opt.text)}"
                                   placeholder="Option ${labels[oi]}"
                                   oninput="updateOptionText('${paper.id}','${sec.id}','${q.id}',${oi},this.value)" />
                            ${imgOpt ? `<img src="${imgOpt}" class="img-preview" /><button class="img-remove" onclick="removeOptionImage('${paper.id}','${sec.id}','${q.id}',${oi})">✕</button>` : ''}
                            <input type="radio" class="opt-correct" name="correct_${q.id}" 
                                   ${opt.isCorrect ? 'checked' : ''}
                                   onchange="setCorrectOption('${paper.id}','${sec.id}','${q.id}',${oi})" />
                            <button class="opt-del" onclick="deleteOption('${paper.id}','${sec.id}','${q.id}',${oi})" title="Remove option">✕</button>
                        </div>
                    `;
                });
                html += `
                        </div>
                        <div class="layout-selector">
                            <label><input type="radio" name="layout_${q.id}" value="row" ${state.optionLayout === 'row' ? 'checked' : ''} onchange="setLayout('row')" /> 1×4</label>
                            <label><input type="radio" name="layout_${q.id}" value="grid2" ${state.optionLayout === 'grid2' ? 'checked' : ''} onchange="setLayout('grid2')" /> 2×2</label>
                            <label><input type="radio" name="layout_${q.id}" value="column" ${state.optionLayout === 'column' ? 'checked' : ''} onchange="setLayout('column')" /> 4×1</label>
                        </div>
                    </div>
                `;
            });
        }

        html += `
                    <button class="btn-add-question" onclick="addQuestion('${paper.id}','${sec.id}')">+ Add Question</button>
                </div>
            </div>
        `;
    });

    html += `<button class="btn-add-section" onclick="addSection('${paper.id}')">+ Add Section</button>`;
    container.innerHTML = html;

    // render math
    if (window.renderMathInElement) {
        try {
            renderMathInElement(container, {
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '\\[', right: '\\]', display: true },
                    { left: '\\(', right: '\\)', display: false }
                ],
                throwOnError: false
            });
        } catch (e) {}
    }

    // auto-resize textareas
    document.querySelectorAll('.q-text').forEach(ta => autoResize(ta));
}

// ─── Helpers ───
function escHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function autoResize(el) {
    el.style.height = 'auto';
    el.style.height = (el.scrollHeight) + 'px';
}

// ─── Layout ───
function setLayout(layout) {
    state.optionLayout = layout;
    localStorage.setItem(LAYOUT_KEY, layout);
    render();
}

// ═══════════════════════════════════════════════════════════════
//  CRUD OPERATIONS
// ═══════════════════════════════════════════════════════════════

function createNewPaper() {
    const paper = {
        id: 'paper_' + Date.now(),
        name: 'New Paper ' + (state.papers.length + 1),
        sections: []
    };
    state.papers.push(paper);
    state.activePaperId = paper.id;
    // add a default section
    addSection(paper.id);
    render();
    toast('📄 New paper created');
}

function deletePaper(paperId) {
    if (!confirm('Delete this paper and all its questions?')) return;
    state.papers = state.papers.filter(p => p.id !== paperId);
    if (state.activePaperId === paperId) {
        state.activePaperId = state.papers.length > 0 ? state.papers[0].id : null;
        state.activeSectionId = null;
    }
    render();
    toast('🗑️ Paper deleted');
}

function selectPaper(paperId) {
    state.activePaperId = paperId;
    const paper = state.papers.find(p => p.id === paperId);
    if (paper && paper.sections.length > 0) {
        state.activeSectionId = paper.sections[0].id;
    }
    render();
}

function renamePaper(paperId, newName) {
    const paper = state.papers.find(p => p.id === paperId);
    if (paper) {
        paper.name = newName || 'Untitled';
        saveState();
        renderPaperList();
    }
}

// ─── Sections ───
function addSection(paperId) {
    const paper = state.papers.find(p => p.id === paperId);
    if (!paper) return;
    const sec = {
        id: 'sec_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        name: 'Section ' + (paper.sections.length + 1),
        questions: []
    };
    paper.sections.push(sec);
    state.activeSectionId = sec.id;
    render();
    toast('📂 Section added');
}

function deleteSection(paperId, secId) {
    if (!confirm('Delete this section and all its questions?')) return;
    const paper = state.papers.find(p => p.id === paperId);
    if (!paper) return;
    paper.sections = paper.sections.filter(s => s.id !== secId);
    if (state.activeSectionId === secId) {
        state.activeSectionId = paper.sections.length > 0 ? paper.sections[0].id : null;
    }
    render();
    toast('🗑️ Section deleted');
}

function renameSection(paperId, secId, newName) {
    const paper = state.papers.find(p => p.id === paperId);
    if (!paper) return;
    const sec = paper.sections.find(s => s.id === secId);
    if (sec) {
        sec.name = newName || 'Untitled';
        saveState();
        render();
    }
}

// ─── Questions ───
function addQuestion(paperId, secId) {
    const paper = state.papers.find(p => p.id === paperId);
    if (!paper) return;
    const sec = paper.sections.find(s => s.id === secId);
    if (!sec) return;
    const q = {
        id: 'q_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        text: '',
        options: [
            { id: 'opt_' + Date.now() + '_0', text: '', isCorrect: false },
            { id: 'opt_' + Date.now() + '_1', text: '', isCorrect: false },
            { id: 'opt_' + Date.now() + '_2', text: '', isCorrect: false },
            { id: 'opt_' + Date.now() + '_3', text: '', isCorrect: false }
        ],
        images: { q: null, opts: [null, null, null, null] }
    };
    sec.questions.push(q);
    render();
    // focus the new question's textarea
    setTimeout(() => {
        const ta = document.querySelector(`.question-item[data-q-id="${q.id}"] .q-text`);
        if (ta) ta.focus();
    }, 50);
    toast('✏️ Question added');
}

function deleteQuestion(paperId, secId, qId) {
    if (!confirm('Delete this question?')) return;
    const paper = state.papers.find(p => p.id === paperId);
    if (!paper) return;
    const sec = paper.sections.find(s => s.id === secId);
    if (!sec) return;
    sec.questions = sec.questions.filter(q => q.id !== qId);
    render();
    toast('🗑️ Question deleted');
}

function duplicateQuestion(paperId, secId, qId) {
    const paper = state.papers.find(p => p.id === paperId);
    if (!paper) return;
    const sec = paper.sections.find(s => s.id === secId);
    if (!sec) return;
    const orig = sec.questions.find(q => q.id === qId);
    if (!orig) return;
    const copy = JSON.parse(JSON.stringify(orig));
    copy.id = 'q_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
    copy.options.forEach(o => { o.id = 'opt_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6); });
    if (copy.images) {
        copy.images = { q: copy.images.q || null, opts: copy.images.opts ? [...copy.images.opts] : [null, null,
                null, null
            ] };
    }
    sec.questions.splice(sec.questions.indexOf(orig) + 1, 0, copy);
    render();
    toast('📋 Question duplicated');
}

function updateQuestionText(paperId, secId, qId, text) {
    const paper = state.papers.find(p => p.id === paperId);
    if (!paper) return;
    const sec = paper.sections.find(s => s.id === secId);
    if (!sec) return;
    const q = sec.questions.find(q => q.id === qId);
    if (q) {
        q.text = text;
        saveState();
    }
}

// ─── Options ───
function updateOptionText(paperId, secId, qId, idx, text) {
    const paper = state.papers.find(p => p.id === paperId);
    if (!paper) return;
    const sec = paper.sections.find(s => s.id === secId);
    if (!sec) return;
    const q = sec.questions.find(q => q.id === qId);
    if (q && q.options[idx]) {
        q.options[idx].text = text;
        saveState();
    }
}

function setCorrectOption(paperId, secId, qId, idx) {
    const paper = state.papers.find(p => p.id === paperId);
    if (!paper) return;
    const sec = paper.sections.find(s => s.id === secId);
    if (!sec) return;
    const q = sec.questions.find(q => q.id === qId);
    if (q) {
        q.options.forEach((o, i) => o.isCorrect = (i === idx));
        saveState();
        render();
    }
}

function deleteOption(paperId, secId, qId, idx) {
    const paper = state.papers.find(p => p.id === paperId);
    if (!paper) return;
    const sec = paper.sections.find(s => s.id === secId);
    if (!sec) return;
    const q = sec.questions.find(q => q.id === qId);
    if (!q || q.options.length <= 1) return;
    q.options.splice(idx, 1);
    if (q.images && q.images.opts) {
        q.images.opts.splice(idx, 1);
    }
    // ensure we have 4 options
    while (q.options.length < 4) {
        q.options.push({ id: 'opt_' + Date.now() + '_' + q.options.length, text: '', isCorrect: false });
        if (q.images && q.images.opts) q.images.opts.push(null);
    }
    render();
    toast('🗑️ Option removed');
}

// ─── Images ───
function handleImagePaste(e, paperId, secId, qId, optIdx = null) {
    const items = e.clipboardData && e.clipboardData.items;
    if (!items) return;
    let imageItem = null;
    for (let item of items) {
        if (item.type.startsWith('image/')) {
            imageItem = item;
            break;
        }
    }
    if (!imageItem) return;
    e.preventDefault();
    const file = imageItem.getAsFile();
    const reader = new FileReader();
    reader.onload = function(ev) {
        const dataUrl = ev.target.result;
        const paper = state.papers.find(p => p.id === paperId);
        if (!paper) return;
        const sec = paper.sections.find(s => s.id === secId);
        if (!sec) return;
        const q = sec.questions.find(q => q.id === qId);
        if (!q) return;
        if (!q.images) q.images = { q: null, opts: [null, null, null, null] };
        if (optIdx === null) {
            q.images.q = dataUrl;
        } else if (optIdx >= 0 && optIdx < 4) {
            if (!q.images.opts) q.images.opts = [null, null, null, null];
            q.images.opts[optIdx] = dataUrl;
        }
        saveState();
        render();
        toast('🖼️ Image pasted');
    };
    reader.readAsDataURL(file);
}

function removeQuestionImage(paperId, secId, qId) {
    const paper = state.papers.find(p => p.id === paperId);
    if (!paper) return;
    const sec = paper.sections.find(s => s.id === secId);
    if (!sec) return;
    const q = sec.questions.find(q => q.id === qId);
    if (q && q.images) {
        q.images.q = null;
        saveState();
        render();
        toast('🖼️ Image removed');
    }
}

function removeOptionImage(paperId, secId, qId, idx) {
    const paper = state.papers.find(p => p.id === paperId);
    if (!paper) return;
    const sec = paper.sections.find(s => s.id === secId);
    if (!sec) return;
    const q = sec.questions.find(q => q.id === qId);
    if (q && q.images && q.images.opts) {
        q.images.opts[idx] = null;
        saveState();
        render();
        toast('🖼️ Image removed');
    }
}

// ─── Paste event binding ───
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('paste', function(e) {
        const target = e.target;
        if (!target.closest) return;
        const qText = target.closest('.q-text');
        if (qText) {
            const qItem = qText.closest('.question-item');
            if (qItem) {
                const qId = qItem.dataset.qId;
                // find paper and sec
                for (let p of state.papers) {
                    for (let s of p.sections) {
                        const q = s.questions.find(q => q.id === qId);
                        if (q) {
                            handleImagePaste(e, p.id, s.id, qId, null);
                            return;
                        }
                    }
                }
            }
            return;
        }
        const optText = target.closest('.opt-text');
        if (optText) {
            const optItem = optText.closest('.option-item');
            if (optItem) {
                const qItem = optItem.closest('.question-item');
                if (qItem) {
                    const qId = qItem.dataset.qId;
                    const optIdx = Array.from(optItem.parentElement.children).indexOf(optItem);
                    for (let p of state.papers) {
                        for (let s of p.sections) {
                            const q = s.questions.find(q => q.id === qId);
                            if (q) {
                                handleImagePaste(e, p.id, s.id, qId, optIdx);
                                return;
                            }
                        }
                    }
                }
            }
        }
    });
});

// ═══════════════════════════════════════════════════════════════
//  REUSE QUESTIONS (Modal)
// ═══════════════════════════════════════════════════════════════

let reuseTargetPaperId = null;

function openReuseModal(paperId) {
    reuseTargetPaperId = paperId;
    state.reuseSelected = [];
    const modal = document.getElementById('reuseModal');
    modal.classList.remove('hidden');
    renderReuseModal();
}

function closeReuseModal() {
    document.getElementById('reuseModal').classList.add('hidden');
    state.reuseSelected = [];
}

function renderReuseModal() {
    const body = document.getElementById('reuseModalBody');
    let html = '';
    const allQuestions = [];
    state.papers.forEach(p => {
        p.sections.forEach(s => {
            s.questions.forEach(q => {
                allQuestions.push({
                    paperName: p.name,
                    sectionName: s.name,
                    question: q,
                    paperId: p.id,
                    sectionId: s.id
                });
            });
        });
    });
    if (allQuestions.length === 0) {
        html = `<div style="color:#94a3b8;padding:30px 0;text-align:center;">No questions available to reuse.</div>`;
    } else {
        allQuestions.forEach((item, idx) => {
            const checked = state.reuseSelected.includes(idx) ? 'checked' : '';
            const qText = item.question.text || '(empty question)';
            html += `
                <div class="reuse-item" onclick="toggleReuseItem(${idx})">
                    <span class="ri-text">${escHtml(qText.substring(0, 80))}${qText.length > 80 ? '…' : ''}</span>
                    <span class="ri-meta">${escHtml(item.paperName)} › ${escHtml(item.sectionName)}</span>
                    <input type="checkbox" ${checked} onclick="event.stopPropagation(); toggleReuseItem(${idx})" />
                </div>
            `;
        });
    }
    body.innerHTML = html;
    // store items for apply
    body.dataset.items = JSON.stringify(allQuestions);
}

function toggleReuseItem(idx) {
    const pos = state.reuseSelected.indexOf(idx);
    if (pos === -1) state.reuseSelected.push(idx);
    else state.reuseSelected.splice(pos, 1);
    renderReuseModal();
}

function applyReuseQuestions() {
    const body = document.getElementById('reuseModalBody');
    const items = JSON.parse(body.dataset.items || '[]');
    const selected = state.reuseSelected;
    if (selected.length === 0) {
        toast('⚠️ No questions selected');
        return;
    }
    const paper = state.papers.find(p => p.id === reuseTargetPaperId);
    if (!paper) {
        toast('⚠️ Paper not found');
        return;
    }
    // add to first section, or create one
    let targetSec = paper.sections.length > 0 ? paper.sections[0] : null;
    if (!targetSec) {
        targetSec = { id: 'sec_' + Date.now(), name: 'Section 1', questions: [] };
        paper.sections.push(targetSec);
    }
    selected.forEach(idx => {
        const item = items[idx];
        if (!item) return;
        const qCopy = JSON.parse(JSON.stringify(item.question));
        qCopy.id = 'q_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
        qCopy.options.forEach(o => { o.id = 'opt_' + Date.now() + '_' + Math.random().toString(36).slice(2,
            6); });
        if (qCopy.images) {
            qCopy.images = { q: qCopy.images.q || null, opts: qCopy.images.opts ? [...qCopy.images
                    .opts] : [null, null, null, null] };
        }
        targetSec.questions.push(qCopy);
    });
    closeReuseModal();
    render();
    toast('📥 ' + selected.length + ' question(s) reused');
}

// ═══════════════════════════════════════════════════════════════
//  EXPORT FUNCTIONS
// ═══════════════════════════════════════════════════════════════

function getPaper(paperId) {
    return state.papers.find(p => p.id === paperId);
}

function buildExportHTML(paper, layout) {
    const labels = ['A', 'B', 'C', 'D'];
    let html = `
        <html><head><meta charset="UTF-8">
        <style>
            body { font-family: 'Times New Roman', serif; padding: 30px; max-width: 900px; margin: auto; }
            .paper-title { font-size: 22px; font-weight: 700; text-align: center; margin-bottom: 8px; }
            .paper-meta { text-align: center; color: #555; margin-bottom: 24px; font-size: 14px; }
            .section-title { font-size: 18px; font-weight: 600; margin: 24px 0 12px; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
            .q-item { margin-bottom: 16px; page-break-inside: avoid; }
            .q-text { font-weight: 500; margin-bottom: 4px; }
            .opts { display: grid; grid-template-columns: ${layout === 'row' ? '1fr 1fr 1fr 1fr' : layout === 'grid2' ? '1fr 1fr' : '1fr'}; gap: 4px 16px; padding-left: 24px; }
            .opt { display: flex; align-items: baseline; gap: 4px; }
            .opt-label { font-weight: 500; min-width: 20px; }
            .opt-correct { color: #16a34a; font-weight: 600; }
            .opt-text { }
            .q-img { max-width: 200px; max-height: 120px; margin: 4px 0; border: 1px solid #ddd; border-radius: 4px; }
            .opt-img { max-width: 80px; max-height: 60px; margin: 2px 0; border: 1px solid #ddd; border-radius: 3px; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #ddd; padding-top: 12px; }
    </style>
</head><body>
    <div class="paper-title">${escHtml(paper.name)}</div>
    <div class="paper-meta">Total Questions: ${paper.sections.reduce((s,sec) => s + sec.questions.length, 0)}  •  Sections: ${paper.sections.length}</div>
    `;
    paper.sections.forEach(sec => {
if (sec.questions.length === 0) return;
html += `<div class="section-title">${escHtml(sec.name)}</div>`;
sec.questions.forEach((q, qi) => {
    const qText = q.text || '(empty question)';
    html += `<div class="q-item"><div class="q-text">${qi+1}. ${escHtml(qText)}</div>`;
    if (q.images && q.images.q) {
        html += `<div><img src="${q.images.q}" class="q-img" /></div>`;
    }
    html += `<div class="opts">`;
    q.options.forEach((o, oi) => {
        const isCorrect = o.isCorrect ? '★ ' : '';
        const imgOpt = q.images && q.images.opts && q.images.opts[oi] ? q.images.opts[oi] : null;
        html += `<div class="opt">
                    <span class="opt-label">${labels[oi]}.</span>
                    <span class="opt-text ${o.isCorrect ? 'opt-correct' : ''}">${isCorrect}${escHtml(o.text || '')}</span>
                    ${imgOpt ? `<img src="${imgOpt}" class="opt-img" />` : ''}
                </div>`;
    });
    html += `</div></div>`;
});
    });
    html += `<div class="footer">Generated by MCQ Builder • ${new Date().toLocaleString()}</div>`;
    html += `</body></html>`;
    return html;
}

function exportDOCX(paperId) {
    const paper = getPaper(paperId);
    if (!paper) { toast('⚠️ Paper not found'); return; }
    const html = buildExportHTML(paper, state.optionLayout);
    const blob = new Blob([html], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${paper.name.replace(/\s+/g,'_')}.doc`;
    link.click();
    URL.revokeObjectURL(link.href);
    toast('📄 DOCX exported');
}

function exportPDF(paperId) {
    const paper = getPaper(paperId);
    if (!paper) { toast('⚠️ Paper not found'); return; }
    // Use html2canvas + jsPDF
    const html = buildExportHTML(paper, state.optionLayout);
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    wrapper.style.position = 'fixed';
    wrapper.style.left = '-9999px';
    wrapper.style.top = '0';
    wrapper.style.width = '900px';
    wrapper.style.background = '#fff';
    wrapper.style.padding = '30px';
    wrapper.style.zIndex = '-1';
    document.body.appendChild(wrapper);
    html2canvas(wrapper, { scale: 2, useCORS: true, allowTaint: true }).then(canvas => {
const imgData = canvas.toDataURL('image/png');
const { jsPDF } = window.jspdf;
const pdf = new jsPDF('p', 'mm', 'a4');
const pdfWidth = pdf.internal.pageSize.getWidth();
const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
let heightLeft = pdfHeight;
let position = 0;
pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
heightLeft -= pdf.internal.pageSize.getHeight();
while (heightLeft > 0) {
    position = heightLeft - pdfHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
    heightLeft -= pdf.internal.pageSize.getHeight();
}
pdf.save(`${paper.name.replace(/\s+/g,'_')}.pdf`);
document.body.removeChild(wrapper);
toast('📄 PDF exported');
    }).catch(() => {
document.body.removeChild(wrapper);
toast('⚠️ PDF export failed. Try using "Print to PDF" from browser.');
    });
}

function exportJSON(paperId) {
    const paper = getPaper(paperId);
    if (!paper) { toast('⚠️ Paper not found'); return; }
    const data = JSON.stringify(paper, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${paper.name.replace(/\s+/g,'_')}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    toast('📋 JSON exported');
}

function exportAllJSON() {
    const data = JSON.stringify(state.papers, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `all_papers_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    toast('📋 All papers exported as JSON');
}

function exportCSV(paperId) {
    const paper = getPaper(paperId);
    if (!paper) { toast('⚠️ Paper not found'); return; }
    const labels = ['A','B','C','D'];
    let rows = [['Section','Question','Option','Correct','Answer']];
    paper.sections.forEach(sec => {
sec.questions.forEach(q => {
    const qText = q.text.replace(/,/g,';').replace(/\n/g,' ');
    q.options.forEach((o, oi) => {
        const optText = o.text.replace(/,/g,';').replace(/\n/g,' ');
        rows.push([
            sec.name.replace(/,/g,';'),
            qText,
            labels[oi] + '. ' + optText,
            o.isCorrect ? 'Yes' : 'No',
            o.isCorrect ? labels[oi] : ''
        ]);
    });
});
    });
    let csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${paper.name.replace(/\s+/g,'_')}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    toast('📊 CSV exported');
}

function importJSON() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
const file = e.target.files[0];
if (!file) return;
const reader = new FileReader();
reader.onload = function(ev) {
    try {
        const data = JSON.parse(ev.target.result);
        if (Array.isArray(data)) {
            state.papers = data;
        } else if (data.id && data.sections) {
            state.papers.push(data);
        } else {
            toast('⚠️ Invalid JSON format');
            return;
        }
        if (state.papers.length > 0) {
            state.activePaperId = state.papers[0].id;
        }
        saveState();
        render();
        toast('📂 Imported successfully');
    } catch(err) {
        toast('⚠️ Error parsing JSON: ' + err.message);
    }
};
reader.readAsText(file);
    };
    input.click();
}

function clearAllData() {
    if (!confirm('⚠️ Delete ALL papers and questions? This cannot be undone!')) return;
    state.papers = [];
    state.activePaperId = null;
    state.activeSectionId = null;
    saveState();
    render();
    toast('🗑️ All data cleared');
}

// ─── Toast ───
function toast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._timeout);
    el._timeout = setTimeout(() => el.classList.remove('show'), 2500);
}

// ═══════════════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════════════

loadState();
render();

// re-render math on any change
const origRender = render;
render = function() {
    origRender();
    if (window.renderMathInElement) {
try {
    renderMathInElement(document.getElementById('mainEditor'), {
        delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '\\[', right: '\\]', display: true },
            { left: '\\(', right: '\\)', display: false }
        ],
        throwOnError: false
    });
} catch(e) {}
    }
};
render();

console.log('📝 MCQ Builder loaded!');
