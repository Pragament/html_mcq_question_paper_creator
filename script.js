const STORAGE_KEY = 'school_mcq_paper_studio_v1';
const UI_CONFIG = {
    showReuse: false,
    showCopy: false,
    showDuplicate: false
};
const LABELS = ['A', 'B', 'C', 'D'];
const LAYOUTS = [
    { id: 'row', label: '1x4' },
    { id: 'grid2', label: '2x2' },
    { id: 'column', label: '4x1' },
];
const DOCX_NS = {
    w: 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
    r: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
    wp: 'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing',
    a: 'http://schemas.openxmlformats.org/drawingml/2006/main',
    pic: 'http://schemas.openxmlformats.org/drawingml/2006/picture',
    m: 'http://schemas.openxmlformats.org/officeDocument/2006/math',
};

const TAG_TAXONOMY = {
    'Subject': ['Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology', 'English', 'Social Studies', 'Computer Science'],
    'Class': ['VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'],
    'Exam Type': ['Practice', 'Homework', 'Unit Test', 'Monthly Test', 'Mid Term', 'Quarterly', 'Half Yearly', 'Pre Final', 'Final Exam', 'Mock Test'],
    'Difficulty': ['Easy', 'Medium', 'Hard', 'Very Hard'],
    'Topic': ['Algebra', 'Geometry', 'Trigonometry', 'Mensuration', 'Probability', 'Statistics', 'Motion', 'Force', 'Electricity', 'Magnetism', 'Human Body']
};

const FORMULA_LIBRARY = [
    // Mathematics - Basic
    { id: 'math_x2', category: 'Mathematics', name: 'x Squared', latex: 'x^2', description: 'x raised to power 2' },
    { id: 'math_x3', category: 'Mathematics', name: 'x Cubed', latex: 'x^3', description: 'x raised to power 3' },
    { id: 'math_sqrt', category: 'Mathematics', name: 'Square Root', latex: '\\sqrt{x}', description: 'Square root function' },
    { id: 'math_nroot', category: 'Mathematics', name: 'n-th Root', latex: '\\sqrt[n]{x}', description: 'n-th root of variable' },
    { id: 'math_frac', category: 'Mathematics', name: 'Fraction', latex: '\\frac{a}{b}', description: 'Fraction layout' },
    { id: 'math_pi', category: 'Mathematics', name: 'Pi', latex: '\\pi', description: 'Pi symbol' },
    { id: 'math_theta', category: 'Mathematics', name: 'Theta', latex: '\\theta', description: 'Theta angle symbol' },
    { id: 'math_greek', category: 'Mathematics', name: 'Greek Letters (alpha, beta, gamma)', latex: '\\alpha \\beta \\gamma', description: 'Greek alpha, beta, gamma symbols' },
    // Mathematics - Algebra
    { id: 'math_quadratic', category: 'Mathematics', name: 'Quadratic Formula', latex: 'x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}', description: 'Find roots of quadratic equation' },
    { id: 'math_binomial', category: 'Mathematics', name: 'Binomial Theorem', latex: '(a+b)^2 = a^2 + 2ab + b^2', description: 'Squared binomial expansion expansion' },
    { id: 'math_distance', category: 'Mathematics', name: 'Distance Formula', latex: 'd = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}', description: 'Distance between coordinates' },
    { id: 'math_midpoint', category: 'Mathematics', name: 'Midpoint Formula', latex: 'M = \\left(\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2}\\right)', description: 'Midpoint coordinates of a line segment' },
    { id: 'math_slope', category: 'Mathematics', name: 'Slope Formula', latex: 'm = \\frac{y_2-y_1}{x_2-x_1}', description: 'Slope of a straight line' },
    // Mathematics - Statistics
    { id: 'math_mean', category: 'Mathematics', name: 'Mean (Average)', latex: '\\bar{x} = \\frac{1}{n}\\sum_{i=1}^{n} x_i', description: 'Arithmetic mean of a set' },
    { id: 'math_stddev', category: 'Mathematics', name: 'Standard Deviation', latex: '\\sigma = \\sqrt{\\frac{1}{N}\\sum_{i=1}^{N}(x_i-\\mu)^2}', description: 'Statistical standard deviation dispersion' },
    // Mathematics - Calculus
    { id: 'math_derivative', category: 'Mathematics', name: 'Derivative Definition', latex: 'f\'(x) = \\lim_{h \\to 0} \\frac{f(x+h)-f(x)}{h}', description: 'Limit definition of derivative' },
    { id: 'math_integral', category: 'Mathematics', name: 'Definite Integral', latex: '\\int_{a}^{b} f(x) \\, dx', description: 'Calculus definite integral integration' },
    { id: 'math_limit', category: 'Mathematics', name: 'Limit', latex: '\\lim_{x \\to a} f(x)', description: 'Limit function value limit' },
    { id: 'math_summation', category: 'Mathematics', name: 'Arithmetic Summation', latex: '\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}', description: 'Sum of first n natural integers' },
    // Mathematics - Matrices / Vectors / Probability / Trig
    { id: 'math_matrix', category: 'Mathematics', name: '2x2 Matrix', latex: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}', description: 'Matrix array rows and columns' },
    { id: 'math_vector', category: 'Mathematics', name: 'Vector Length', latex: '|\\vec{v}| = \\sqrt{v_x^2 + v_y^2 + v_z^2}', description: 'Magnitude of a 3D vector length' },
    { id: 'math_bayes', category: 'Mathematics', name: 'Bayes\' Theorem', latex: 'P(A|B) = \\frac{P(B|A)P(A)}{P(B)}', description: 'Conditional probability theorem' },
    { id: 'math_trig_identity', category: 'Mathematics', name: 'Pythagorean Trig Identity', latex: '\\sin^2\\theta + \\cos^2\\theta = 1', description: 'Fundamental trigonometric identity sine cosine' },
    // Physics
    { id: 'phys_newton2', category: 'Physics', name: 'Newton\'s Second Law', latex: 'F = ma', description: 'Force equals mass times acceleration' },
    { id: 'phys_gravity', category: 'Physics', name: 'Gravitational Force', latex: 'F = G\\frac{m_1m_2}{r^2}', description: 'Universal gravitation formula' },
    { id: 'phys_ke', category: 'Physics', name: 'Kinetic Energy', latex: 'KE = \\frac{1}{2}mv^2', description: 'Mechanical kinetic energy movement' },
    { id: 'phys_pe', category: 'Physics', name: 'Potential Energy', latex: 'PE = mgh', description: 'Gravitational potential energy height' },
    { id: 'phys_momentum', category: 'Physics', name: 'Linear Momentum', latex: 'p = mv', description: 'Linear momentum mass velocity' },
    { id: 'phys_power', category: 'Physics', name: 'Mechanical Power', latex: 'P = \\frac{W}{t}', description: 'Work done divided by time' },
    { id: 'phys_ohms', category: 'Physics', name: 'Ohm\'s Law', latex: 'V = IR', description: 'Voltage current resistance relationship' },
    { id: 'phys_electric_power', category: 'Physics', name: 'Electric Power', latex: 'P = VI', description: 'Electrical power voltage current' },
    { id: 'phys_lens', category: 'Physics', name: 'Thin Lens Formula', latex: '\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}', description: 'Lens focal distance formula' },
    { id: 'phys_wave', category: 'Physics', name: 'Wave Equation', latex: 'v = f\\lambda', description: 'Wave velocity frequency wavelength' },
    { id: 'phys_relativity', category: 'Physics', name: 'Einstein Relativity', latex: 'E = mc^2', description: 'Mass energy equivalence relativity' },
    // Chemistry
    { id: 'chem_gas_law', category: 'Chemistry', name: 'Ideal Gas Law', latex: 'PV = nRT', description: 'Thermodynamics ideal gas constant' },
    { id: 'chem_ph', category: 'Chemistry', name: 'pH Definition', latex: '\\text{pH} = -\\log_{10}[\\text{H}^+]', description: 'Logarithmic hydrogen ion concentration acidity' },
    { id: 'chem_molarity', category: 'Chemistry', name: 'Molarity', latex: 'M = \\frac{\\text{moles of solute}}{\\text{litres of solution}}', description: 'Molarity solute volume density concentration' },
    { id: 'chem_yield', category: 'Chemistry', name: 'Percentage Yield', latex: '\\%\\text{ Yield} = \\frac{\\text{Actual Yield}}{\\text{Theoretical Yield}} \\times 100', description: 'Yield ratio chemical reaction output' },
    { id: 'chem_avogadro', category: 'Chemistry', name: 'Avogadro\'s Law', latex: '\\frac{V_1}{n_1} = \\frac{V_2}{n_2}', description: 'Volume moles proportionality law' },
    { id: 'chem_reaction_arrow', category: 'Chemistry', name: 'Reaction Arrow', latex: '\\rightarrow', description: 'Forward reaction chemical equation arrow' },
    { id: 'chem_equilibrium_arrow', category: 'Chemistry', name: 'Equilibrium Arrow', latex: '\\rightleftharpoons', description: 'Reversible reaction equilibrium' },
    { id: 'chem_electron_conf', category: 'Chemistry', name: 'Electron Configuration (e.g. Neon)', latex: '1s^2 2s^2 2p^6', description: 'Electron shells orbitals configuration' }
];

let activeMathfield = null;

let state = {
    papers: [],
    activePaperId: null,
    activeSectionId: null,
    filterSearchQuery: '',
    filterSelectedTags: [],
    isHoveringLogoArea: false,
};

let cachedUniqueTagsStr = '';

const els = {
    paperList: document.getElementById('paperList'),
    paperSetup: document.getElementById('paperSetup'),
    sectionTabs: document.getElementById('sectionTabs'),
    workbench: document.getElementById('questionWorkbench'),
    teacherPanel: document.getElementById('teacherPanel'),
    toast: document.getElementById('toast'),
    fileInput: document.getElementById('fileInput'),
    paperSearchInput: document.getElementById('paperSearchInput'),
    sidebarFilterTagsList: document.getElementById('sidebarFilterTagsList'),
};

document.getElementById('newPaperBtn').addEventListener('click', createPaper);
document.getElementById('importBtn').addEventListener('click', () => els.fileInput.click());
document.getElementById('exportBtn').addEventListener('click', exportBackup);
document.getElementById('questionsCsvBtn').addEventListener('click', exportQuestionsCsv);
document.getElementById('answerCsvBtn').addEventListener('click', exportAnswerKeyCsv);
document.getElementById('printBtn').addEventListener('click', () => window.print());
document.getElementById('wordBtn').addEventListener('click', exportWord);
els.fileInput.addEventListener('change', importBackup);
els.paperSearchInput.addEventListener('input', e => {
    state.filterSearchQuery = e.target.value;
    renderPaperList();
});
document.getElementById('tagScrollUpBtn').addEventListener('click', () => {
    document.getElementById('tagFilterContainer')?.scrollBy({ top: -40, behavior: 'smooth' });
});
document.getElementById('tagScrollDownBtn').addEventListener('click', () => {
    document.getElementById('tagFilterContainer')?.scrollBy({ top: 40, behavior: 'smooth' });
});


// Mobile/tablet collapsible sidebar drawer event listeners
const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
if (sidebarToggleBtn) {
    sidebarToggleBtn.addEventListener('click', () => {
        const sidebar = document.getElementById('paperSidebar');
        const backdrop = document.getElementById('sidebarBackdrop');
        if (sidebar && backdrop) {
            sidebar.classList.toggle('open');
            backdrop.classList.toggle('active');
            sidebarToggleBtn.setAttribute('aria-expanded', sidebar.classList.contains('open') ? 'true' : 'false');
        }
    });
}

const closeSidebarBtn = document.getElementById('closeSidebarBtn');
if (closeSidebarBtn) {
    closeSidebarBtn.addEventListener('click', () => {
        const sidebar = document.getElementById('paperSidebar');
        const backdrop = document.getElementById('sidebarBackdrop');
        if (sidebar) sidebar.classList.remove('open');
        if (backdrop) backdrop.classList.remove('active');
        if (sidebarToggleBtn) sidebarToggleBtn.setAttribute('aria-expanded', 'false');
    });
}

const sidebarBackdrop = document.getElementById('sidebarBackdrop');
if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', () => {
        const sidebar = document.getElementById('paperSidebar');
        if (sidebar) sidebar.classList.remove('open');
        sidebarBackdrop.classList.remove('active');
        if (sidebarToggleBtn) sidebarToggleBtn.setAttribute('aria-expanded', 'false');
    });
}

document.addEventListener('paste', handlePaste);

load();
initEquationModal();
initGlobalToolbar();
initSectionModal();
initAddQuestionsModal();
initDeletePaperModal();
initWordExportModal();
initLogoContextMenu();
initAdvancedEditorModal();
initTableContextMenu();
initTableFloatingToolbar();
render();

function load() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
        try {
            state = JSON.parse(raw);
        } catch (err) {
            state = { papers: [], activePaperId: null, activeSectionId: null };
        }
    }
    if (!state.papers.length) {
        const paper = samplePaper();
        state.papers = [paper];
        state.activePaperId = paper.id;
        state.activeSectionId = paper.sections[0].id;
    }
    normalize();
}

function save() {
    normalize();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function normalize() {
    state.papers.forEach(paper => {
        paper.meta ||= {};
        paper.tags ||= [];
        paper.logo ||= '';
        paper.logoWidth ||= 120;
        paper.logoHeight ||= 120;
        paper.meta.institutionName ||= '';
        paper.meta.institutionSubtitle ||= '';
        paper.meta.date ||= '';
        paper.layout = ['row', 'grid2', 'column'].includes(paper.layout) ? paper.layout : 'row';
        paper.sections ||= [];
        paper.sections.forEach(section => {
            section.layout = ['row', 'grid2', 'column'].includes(section.layout) ? section.layout : (paper.layout || 'row');
            section.questions ||= [];
            section.questions.forEach(question => {
                question.options ||= [];
                question.layout = ['row', 'grid2', 'column'].includes(question.layout) ? question.layout : (section.layout || paper.layout || 'row');
                while (question.options.length < 4) {
                    question.options.push(newOption(question.options.length));
                }
                question.options = question.options.slice(0, 4);
                if (!Number.isInteger(question.correctIndex)) question.correctIndex = 0;
            });
        });
    });
    const activePaper = getActivePaper();
    if (!activePaper && state.papers[0]) state.activePaperId = state.papers[0].id;
    const paper = getActivePaper();
    if (paper && !paper.sections.find(s => s.id === state.activeSectionId)) {
        state.activeSectionId = paper.sections[0]?.id || null;
    }
}

function samplePaper() {
    const sampleTableHtml = '<table class="editor-table" style="width:200px; table-layout:fixed;"><colgroup><col style="width:100px;"/><col style="width:100px;"/></colgroup><tbody><tr><td>Item</td><td>Value</td></tr><tr><td>A</td><td>10</td></tr></tbody></table>';
    const sampleTableToken = `[table:${btoa(unescape(encodeURIComponent(sampleTableHtml)))}]`;

    const math = {
        id: uid('section'),
        name: 'Mathematics',
        layout: 'row',
        questions: [
            newQuestion('Two circles having same _____ are called concentric circles', ['Center', 'radius', 'arc', 'segment'], 0),
            newQuestion('Refer to the following table for items and their values:\n' + sampleTableToken, ['10', '20', '30', '40'], 0),
            newQuestion('Degree measure of a circle is _____ degrees', ['90', '180', '270', '360'], 3),
            newQuestion('If a line intersect a circle in two distinct points, then it is called', ['Secant', 'tangent', '', ''], 0),
            newQuestion('Assertion: Two circles having same center are called concentric circles.\nReasoning: Concentric circles have different radii but the same center.', ['Both A and R are true and R is the correct explanation of A', 'Both A and R are true but R is not the correct explanation of A', 'A is true but R is false', 'A is false but R is true'], 0),
            newQuestion('Long question text starts here and if it wraps onto another\nline, the continuation must align with the question text,\nnot with the far-left page margin.', ['Option A', 'Option B', 'Option C', 'Option D'], 0),
            newQuestion('', ['', '', '', ''], 0),
            newQuestion('', ['', '', '', ''], 0),
        ],
    };
    const paper = {
        id: uid('paper'),
        title: 'Sample Paper - IX IIT',
        layout: 'row',
        meta: {
            className: 'IX',
            subject: 'MPCM',
            testName: 'IIT Test 10',
            duration: '1:20 hr',
            marks: '180',
            instructions: 'Choose the correct answer. Use pasted images or \\(LaTeX\\) where needed.',
        },
        sections: [math],
    };
    return paper;
}

function uid(prefix) {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function newQuestion(text = '', options = ['', '', '', ''], correctIndex = 0) {
    return {
        id: uid('q'),
        text,
        layout: 'row',
        correctIndex,
        marks: 1,
        options: options.map((value, index) => newOption(index, value)),
    };
}

function newOption(index, text = '') {
    return { id: uid(`opt${index}`), text };
}

function getActivePaper() {
    return state.papers.find(p => p.id === state.activePaperId) || null;
}

function getActiveSection() {
    const paper = getActivePaper();
    return paper?.sections.find(s => s.id === state.activeSectionId) || null;
}

function render() {
    normalize();
    renderPaperList();
    renderPaperSetup();
    renderSectionTabs();
    renderWorkbench();
    renderTeacherPanel();
    renderPrintPaper();
    save();
    renderMathSoon();
    renderMermaidSoon();

    // Auto-close sidebar drawer on screens < 1024px after selection/action
    if (window.innerWidth < 1024) {
        const sidebar = document.querySelector('.paper-sidebar');
        const backdrop = document.getElementById('sidebarBackdrop');
        if (sidebar && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
            if (backdrop) backdrop.classList.remove('active');
            if (sidebarToggleBtn) sidebarToggleBtn.setAttribute('aria-expanded', 'false');
        }
    }
}

function renderPaperList() {
    const query = (state.filterSearchQuery || '').toLowerCase().trim();
    const selectedTags = state.filterSelectedTags || [];
    
    const filteredPapers = state.papers.filter(paper => {
        let matchQuery = true;
        if (query) {
            const titleMatch = (paper.title || '').toLowerCase().includes(query);
            const subjectMatch = (paper.meta.subject || '').toLowerCase().includes(query);
            const classMatch = (paper.meta.className || '').toLowerCase().includes(query);
            const tagsMatch = (paper.tags || []).some(t => t.toLowerCase().includes(query));
            matchQuery = titleMatch || subjectMatch || classMatch || tagsMatch;
        }
        
        let matchTags = true;
        if (selectedTags.length) {
            matchTags = selectedTags.every(t => (paper.tags || []).includes(t));
        }
        
        return matchQuery && matchTags;
    });

    els.paperList.innerHTML = filteredPapers.map(paper => {
        const count = countQuestions(paper);
        return `
            <div class="paper-row-container ${paper.id === state.activePaperId ? 'active' : ''}">
                <button class="paper-row" data-action="select-paper" data-id="${paper.id}">
                    <strong>${esc(paper.title)}</strong>
                    <span>${esc(paper.meta.className || 'Class')} · ${count} questions</span>
                    ${paper.tags && paper.tags.length ? `
                    <div class="sidebar-paper-tags">
                        ${paper.tags.map(tag => `<span class="sidebar-tag-chip">${esc(tag)}</span>`).join('')}
                    </div>
                    ` : ''}
                </button>
                <button type="button" class="paper-menu-btn" data-action="toggle-paper-menu" data-id="${paper.id}">⋮</button>
                <div class="paper-dropdown-menu" data-menu-id="${paper.id}" hidden>
                    <button type="button" class="menu-item" data-menu-action="open" data-id="${paper.id}">Open</button>
                    <button type="button" class="menu-item" data-menu-action="rename" data-id="${paper.id}">Rename</button>
                    <button type="button" class="menu-item danger" data-menu-action="delete" data-id="${paper.id}">Delete</button>
                </div>
            </div>
        `;
    }).join('');
    
    els.paperList.querySelectorAll('[data-action="select-paper"]').forEach(btn => {
        btn.addEventListener('click', () => {
            state.activePaperId = btn.dataset.id;
            state.activeSectionId = getActivePaper().sections[0]?.id || null;
            render();
        });
    });

    els.paperList.querySelectorAll('[data-action="toggle-paper-menu"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const paperId = btn.dataset.id;
            const dropdowns = els.paperList.querySelectorAll('.paper-dropdown-menu');
            dropdowns.forEach(menu => {
                if (menu.dataset.menuId === paperId) {
                    if (menu.hasAttribute('hidden')) {
                        menu.removeAttribute('hidden');
                    } else {
                        menu.setAttribute('hidden', 'true');
                    }
                } else {
                    menu.setAttribute('hidden', 'true');
                }
            });
        });
    });

    els.paperList.querySelectorAll('[data-menu-action="open"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const paperId = btn.dataset.id;
            state.activePaperId = paperId;
            state.activeSectionId = getActivePaper().sections[0]?.id || null;
            render();
        });
    });

    els.paperList.querySelectorAll('[data-menu-action="rename"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const paperId = btn.dataset.id;
            const paper = state.papers.find(p => p.id === paperId);
            if (paper) {
                const newTitle = prompt('Rename Question Paper', paper.title);
                if (newTitle && newTitle.trim()) {
                    paper.title = newTitle.trim();
                    render();
                }
            }
        });
    });

    els.paperList.querySelectorAll('[data-menu-action="delete"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const paperId = btn.dataset.id;
            const paper = state.papers.find(p => p.id === paperId);
            if (paper) {
                state.pendingDeletePaperId = paperId;
                const modal = document.getElementById('deletePaperModal');
                const label = document.getElementById('deletePaperNameLabel');
                if (modal && label) {
                    label.textContent = `"${paper.title}"`;
                    modal.removeAttribute('hidden');
                }
            }
        });
    });
    
    renderSidebarFilterTags();
}

function renderSidebarFilterTags() {
    const listEl = document.getElementById('sidebarFilterTagsList');
    if (!listEl) return;
    
    const allUniqueTags = Array.from(new Set(state.papers.flatMap(p => p.tags || []))).sort();
    const uniqueTagsStr = JSON.stringify(allUniqueTags);
    
    if (uniqueTagsStr !== cachedUniqueTagsStr) {
        cachedUniqueTagsStr = uniqueTagsStr;
        listEl.innerHTML = allUniqueTags.map(tag => {
            const isChecked = (state.filterSelectedTags || []).includes(tag);
            return `
                <label class="sidebar-filter-tag-item">
                    <input type="checkbox" data-tag="${esc(tag)}" ${isChecked ? 'checked' : ''} />
                    <span>${esc(tag)}</span>
                </label>
            `;
        }).join('');
        
        listEl.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.addEventListener('change', () => {
                const tag = cb.dataset.tag;
                state.filterSelectedTags ||= [];
                if (cb.checked) {
                    if (!state.filterSelectedTags.includes(tag)) state.filterSelectedTags.push(tag);
                } else {
                    state.filterSelectedTags = state.filterSelectedTags.filter(t => t !== tag);
                }
                renderPaperList();
            });
        });
    } else {
        listEl.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            const tag = cb.dataset.tag;
            cb.checked = (state.filterSelectedTags || []).includes(tag);
        });
    }
}

function renderPaperSetup() {
    const paper = getActivePaper();
    if (!paper) {
        els.paperSetup.innerHTML = '';
        return;
    }
    els.paperSetup.innerHTML = `
        <div class="logo-and-inst-card" style="display: flex; gap: 20px; align-items: center; background: #f8fafc; padding: 16px; border: 1px solid var(--line); border-radius: 8px; margin-bottom: 16px;">
            <div class="logo-setup-container" id="logoSetupContainer" style="position: relative; width: ${paper.logoWidth || 120}px; height: ${paper.logoHeight || 120}px; border: 2px dashed var(--line); border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; background: #ffffff; user-select: none;">
                <input type="file" id="logoFileInput" accept="image/*" style="display: none;" />
                ${paper.logo ? `
                    <img src="${paper.logo}" id="logoImg" alt="Logo" style="width: 100%; height: 100%; object-fit: contain; pointer-events: none;" />
                    <div class="logo-resize-handle top-left" style="position: absolute; width: 8px; height: 8px; background: var(--primary); border: 1px solid #fff; border-radius: 50%; top: -4px; left: -4px; cursor: nwse-resize;"></div>
                    <div class="logo-resize-handle top-right" style="position: absolute; width: 8px; height: 8px; background: var(--primary); border: 1px solid #fff; border-radius: 50%; top: -4px; right: -4px; cursor: nesw-resize;"></div>
                    <div class="logo-resize-handle bottom-left" style="position: absolute; width: 8px; height: 8px; background: var(--primary); border: 1px solid #fff; border-radius: 50%; bottom: -4px; left: -4px; cursor: nesw-resize;"></div>
                    <div class="logo-resize-handle bottom-right" style="position: absolute; width: 8px; height: 8px; background: var(--primary); border: 1px solid #fff; border-radius: 50%; bottom: -4px; right: -4px; cursor: nwse-resize;"></div>
                ` : `
                    <div style="font-size: 11px; text-align: center; color: var(--text-muted); padding: 8px; pointer-events: none;">Click to Upload Logo or Paste Image</div>
                `}
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
                <div class="field">
                    <label>Institution Name</label>
                    <input type="text" data-meta="institutionName" placeholder="e.g. Green Valley High School" value="${esc(paper.meta.institutionName || '')}" style="width: 100%;" />
                </div>
                <div class="field">
                    <label>Institution Subtitle / Address</label>
                    <input type="text" data-meta="institutionSubtitle" placeholder="e.g. New York, USA" value="${esc(paper.meta.institutionSubtitle || '')}" style="width: 100%;" />
                </div>
            </div>
        </div>

        <div class="setup-grid">
            ${field('Title', 'title', paper.title, 'Paper title')}
            ${field('Class', 'className', paper.meta.className, 'IX')}
            ${field('Subject', 'subject', paper.meta.subject, 'MPCM')}
            ${field('Test', 'testName', paper.meta.testName, 'Unit Test')}
            ${field('Time', 'duration', paper.meta.duration, '1 hr')}
            ${field('Marks', 'marks', paper.meta.marks, '60')}
            ${field('Date', 'date', paper.meta.date, 'DD/MM/YYYY')}
            
            <div class="field tags-field" style="grid-column: 2 / -1;">
                <label>Tags</label>
                <div class="tags-input-container" id="tagsInputContainer">
                    <div class="tags-chips" id="tagsChips"></div>
                    <input type="text" id="tagTextInput" placeholder="Add tag..." autocomplete="off" />
                    <div class="tags-dropdown" id="tagsDropdown" hidden></div>
                </div>
            </div>
            
            <div class="field default-layout-field" style="grid-column: 1 / -1;">
                <label>Default Option Layout</label>
                <div class="layout-radio-group">
                    <label class="radio-inline"><input type="radio" name="defaultOptionLayout" value="row" ${paper.layout === 'row' ? 'checked' : ''} /> 1&times;4</label>
                    <label class="radio-inline"><input type="radio" name="defaultOptionLayout" value="grid2" ${paper.layout === 'grid2' ? 'checked' : ''} /> 2&times;2</label>
                    <label class="radio-inline"><input type="radio" name="defaultOptionLayout" value="column" ${paper.layout === 'column' ? 'checked' : ''} /> 4&times;1</label>
                </div>
            </div>
            
            <div class="field instructions-field">
                <label>Instructions</label>
                <textarea data-meta="instructions" placeholder="Instructions shown on the paper">${esc(paper.meta.instructions)}</textarea>
            </div>
        </div>
    `;
    els.paperSetup.querySelectorAll('[data-meta]').forEach(input => {
        input.addEventListener('input', () => updateMeta(input.dataset.meta, input.value));
    });

    els.paperSetup.querySelectorAll('input[name="defaultOptionLayout"]').forEach(radio => {
        radio.addEventListener('change', () => {
            const newLayout = radio.value;
            paper.layout = newLayout;
            
            paper.sections.forEach(section => {
                section.layout = newLayout;
                section.questions.forEach(question => {
                    question.layout = newLayout;
                });
            });
            
            render();
        });
    });

    const logoContainer = document.getElementById('logoSetupContainer');
    if (logoContainer) {
        const fileInput = document.getElementById('logoFileInput');
        logoContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('logo-resize-handle')) return;
            if (paper.logo) {
                logoContainer.classList.add('selected');
            } else {
                fileInput.click();
            }
        });
        
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    paper.logo = reader.result;
                    save();
                    render();
                };
                reader.readAsDataURL(file);
            }
        });
        
        const handles = logoContainer.querySelectorAll('.logo-resize-handle');
        handles.forEach(handle => {
            handle.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const startWidth = paper.logoWidth || 120;
                const startHeight = paper.logoHeight || 120;
                const startX = e.clientX;
                const startY = e.clientY;
                const isRight = handle.classList.contains('top-right') || handle.classList.contains('bottom-right');
                const isBottom = handle.classList.contains('bottom-left') || handle.classList.contains('bottom-right');
                
                const onMouseMove = (moveEvent) => {
                    let deltaX = moveEvent.clientX - startX;
                    let deltaY = moveEvent.clientY - startY;
                    
                    let newWidth = startWidth + (isRight ? deltaX : -deltaX);
                    let newHeight = startHeight + (isBottom ? deltaY : -deltaY);
                    
                    if (!moveEvent.shiftKey) {
                        const ratio = startWidth / startHeight;
                        if (Math.abs(deltaX) > Math.abs(deltaY)) {
                            newHeight = newWidth / ratio;
                        } else {
                            newWidth = newHeight * ratio;
                        }
                    }
                    
                    newWidth = Math.max(40, Math.min(250, newWidth));
                    newHeight = Math.max(40, Math.min(250, newHeight));
                    
                    logoContainer.style.width = `${newWidth}px`;
                    logoContainer.style.height = `${newHeight}px`;
                    
                    paper.logoWidth = newWidth;
                    paper.logoHeight = newHeight;
                };
                
                const onMouseUp = () => {
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                    save();
                    render();
                };
                
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });
        });
        
        logoContainer.addEventListener('mouseenter', () => {
            state.isHoveringLogoArea = true;
        });
        logoContainer.addEventListener('mouseleave', () => {
            state.isHoveringLogoArea = false;
        });
    }

    const container = document.getElementById('tagsInputContainer');
    const input = document.getElementById('tagTextInput');
    const dropdown = document.getElementById('tagsDropdown');
    
    let visibleOptions = [];
    let activeOptionIndex = -1;

    function renderChips() {
        const chipsContainer = document.getElementById('tagsChips');
        if (!chipsContainer) return;
        chipsContainer.innerHTML = (paper.tags || []).map(tag => `
            <span class="tag-chip">
                ${esc(tag)}
                <span class="tag-remove" data-tag="${esc(tag)}">&times;</span>
            </span>
        `).join('');

        chipsContainer.querySelectorAll('.tag-remove').forEach(btn => {
            btn.addEventListener('click', e => {
                e.stopPropagation();
                const tagToRemove = btn.dataset.tag;
                paper.tags = (paper.tags || []).filter(t => t !== tagToRemove);
                renderChips();
                renderPaperList();
                save();
            });
        });
    }

    function renderDropdown(query = '') {
        query = query.trim().toLowerCase();
        const categories = Object.keys(TAG_TAXONOMY);
        let customOption = null;
        let groupedHtml = '';
        
        visibleOptions = [];

        if (query && !(paper.tags || []).some(t => t.toLowerCase() === query)) {
            customOption = { type: 'custom', value: query };
            visibleOptions.push(customOption);
        }

        categories.forEach(cat => {
            const available = TAG_TAXONOMY[cat].filter(tag => {
                const matchesQuery = tag.toLowerCase().includes(query);
                const notSelected = !(paper.tags || []).includes(tag);
                return matchesQuery && notSelected;
            });

            if (available.length) {
                groupedHtml += `
                    <div class="tags-dropdown-category">
                        <div class="tags-dropdown-category-title">${esc(cat)}</div>
                        <div class="tags-dropdown-options">
                            ${available.map(tag => {
                                const idx = visibleOptions.length;
                                visibleOptions.push({ type: 'taxonomy', value: tag });
                                return `<div class="tags-dropdown-option" data-index="${idx}">${esc(tag)}</div>`;
                            }).join('')}
                        </div>
                    </div>
                `;
            }
        });

        let html = '';
        if (customOption) {
            html += `<div class="tags-dropdown-custom-option" data-index="0">Create custom tag "${esc(query)}" (Press Enter)</div>`;
        }
        html += groupedHtml;

        if (!html) {
            dropdown.hidden = true;
            return;
        }

        dropdown.innerHTML = html;
        dropdown.hidden = false;

        dropdown.querySelectorAll('.tags-dropdown-option, .tags-dropdown-custom-option').forEach(el => {
            el.addEventListener('mousedown', e => {
                e.preventDefault();
            });
            el.addEventListener('click', () => {
                const optIndex = parseInt(el.dataset.index);
                const opt = visibleOptions[optIndex];
                if (opt) {
                    addTag(opt.value);
                }
            });
        });

        updateActiveHighlight();
    }

    function updateActiveHighlight() {
        const optionEls = dropdown.querySelectorAll('.tags-dropdown-option, .tags-dropdown-custom-option');
        optionEls.forEach(el => {
            const idx = parseInt(el.dataset.index);
            if (idx === activeOptionIndex) {
                el.classList.add('active');
                el.scrollIntoView({ block: 'nearest' });
            } else {
                el.classList.remove('active');
            }
        });
    }

    function addTag(tag) {
        tag = tag.trim();
        if (tag && !(paper.tags || []).includes(tag)) {
            paper.tags ||= [];
            paper.tags.push(tag);
            renderChips();
            renderPaperList();
            save();
        }
        input.value = '';
        activeOptionIndex = -1;
        dropdown.hidden = true;
    }

    container.addEventListener('click', () => input.focus());

    input.addEventListener('focus', () => {
        activeOptionIndex = -1;
        renderDropdown(input.value);
    });

    input.addEventListener('blur', () => {
        setTimeout(() => {
            dropdown.hidden = true;
        }, 150);
    });

    input.addEventListener('input', () => {
        activeOptionIndex = -1;
        renderDropdown(input.value);
    });

    input.addEventListener('keydown', e => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (visibleOptions.length) {
                activeOptionIndex = (activeOptionIndex + 1) % visibleOptions.length;
                updateActiveHighlight();
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (visibleOptions.length) {
                activeOptionIndex = (activeOptionIndex - 1 + visibleOptions.length) % visibleOptions.length;
                updateActiveHighlight();
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeOptionIndex >= 0 && activeOptionIndex < visibleOptions.length) {
                addTag(visibleOptions[activeOptionIndex].value);
            } else if (input.value.trim()) {
                addTag(input.value);
            }
        } else if (e.key === 'Backspace' && !input.value) {
            if (paper.tags && paper.tags.length) {
                paper.tags.pop();
                renderChips();
                renderPaperList();
                save();
            }
        } else if (e.key === 'Escape') {
            dropdown.hidden = true;
            input.blur();
        }
    });

    renderChips();
}

function field(label, key, value, placeholder) {
    return `
        <div class="field">
            <label>${label}</label>
            <input data-meta="${key}" value="${esc(value || '')}" placeholder="${esc(placeholder)}" />
        </div>
    `;
}

function renderSectionTabs() {
    const paper = getActivePaper();
    if (!paper) {
        els.sectionTabs.innerHTML = '';
        return;
    }
    els.sectionTabs.innerHTML = `
        ${paper.sections.map(section => `
            <button class="section-tab ${section.id === state.activeSectionId ? 'active' : ''}" data-section="${section.id}">
                ${esc(section.name)} · ${section.questions.length}
            </button>
        `).join('')}
        <button class="section-tab" id="addSectionBtn">+ Section</button>
    `;
    els.sectionTabs.querySelectorAll('[data-section]').forEach(btn => {
        btn.addEventListener('click', () => {
            state.activeSectionId = btn.dataset.section;
            render();
            openAddQuestionsModal();
        });
    });
    document.getElementById('addSectionBtn').addEventListener('click', addSection);
}

function getSelectionCharacterOffsetWithin(element) {
    let start = 0;
    let end = 0;
    const doc = element.ownerDocument || document;
    const win = doc.defaultView || window;
    const sel = win.getSelection();
    if (sel && sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        if (element.contains(range.startContainer) && element.contains(range.endContainer)) {
            const preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(element);
            preCaretRange.setEnd(range.startContainer, range.startOffset);
            start = preCaretRange.toString().length;
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            end = preCaretRange.toString().length;
        }
    }
    return { start, end };
}

function setSelectionCharacterOffsetWithin(element, offsetInfo) {
    if (!offsetInfo) return;
    const doc = element.ownerDocument || document;
    const win = doc.defaultView || window;
    const sel = win.getSelection();
    if (!sel) return;
    
    let charIndex = 0;
    const range = doc.createRange();
    range.setStart(element, 0);
    range.collapse(true);
    
    const nodeStack = [element];
    let node;
    let foundStart = false;
    let foundEnd = false;
    
    while (nodeStack.length > 0) {
        node = nodeStack.pop();
        if (node.nodeType === Node.TEXT_NODE) {
            const nextCharIndex = charIndex + node.length;
            if (!foundStart && offsetInfo.start >= charIndex && offsetInfo.start <= nextCharIndex) {
                range.setStart(node, offsetInfo.start - charIndex);
                foundStart = true;
            }
            if (!foundEnd && offsetInfo.end >= charIndex && offsetInfo.end <= nextCharIndex) {
                range.setEnd(node, offsetInfo.end - charIndex);
                foundEnd = true;
            }
            charIndex = nextCharIndex;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.nodeName === 'BR') {
                const nextCharIndex = charIndex + 1;
                if (!foundStart && offsetInfo.start >= charIndex && offsetInfo.start <= nextCharIndex) {
                    const parent = node.parentNode;
                    const index = Array.from(parent.childNodes).indexOf(node);
                    range.setStart(parent, index);
                    foundStart = true;
                }
                if (!foundEnd && offsetInfo.end >= charIndex && offsetInfo.end <= nextCharIndex) {
                    const parent = node.parentNode;
                    const index = Array.from(parent.childNodes).indexOf(node);
                    range.setEnd(parent, index);
                    foundEnd = true;
                }
                charIndex = nextCharIndex;
            } else {
                for (let i = node.childNodes.length - 1; i >= 0; i--) {
                    nodeStack.push(node.childNodes[i]);
                }
            }
        }
        if (foundStart && foundEnd) break;
    }
    
    if (!foundStart) {
        range.setStart(element, element.childNodes.length);
    }
    if (!foundEnd) {
        range.setEnd(element, element.childNodes.length);
    }
    
    try {
        sel.removeAllRanges();
        sel.addRange(range);
    } catch (e) {
        console.error("Error setting selection range:", e);
    }
}

function renderWorkbench() {
    const activeEl = document.activeElement;
    let focusedEditorId = null;
    let caretOffset = null;

    if (activeEl && activeEl.hasAttribute('data-visual-editor')) {
        focusedEditorId = activeEl.dataset.editorId;
        caretOffset = getSelectionCharacterOffsetWithin(activeEl);
    } else if (activeEl && activeEl.hasAttribute('data-code-editor')) {
        focusedEditorId = activeEl.dataset.editorId;
        caretOffset = { start: activeEl.selectionStart, end: activeEl.selectionEnd, isCode: true };
    }

    const paper = getActivePaper();
    const section = getActiveSection();
    const globalToolbar = document.getElementById('globalToolbar');
    
    if (!paper) {
        if (globalToolbar) globalToolbar.hidden = true;
        els.workbench.innerHTML = `<div class="empty-state"><strong>No papers yet</strong>Click the "+" button in the sidebar to create a new question paper.</div>`;
        return;
    }
    
    if (!section) {
        if (globalToolbar) globalToolbar.hidden = true;
        els.workbench.innerHTML = `<div class="empty-state"><strong>No section selected</strong>Add a section to start writing questions.</div>`;
        return;
    }
    if (globalToolbar) globalToolbar.hidden = false;

    els.workbench.innerHTML = `
        <div class="workbench-head">
            <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap; flex-grow: 1;">
                <div class="workbench-title" style="flex-shrink: 0;">
                    <input id="sectionNameInput" value="${esc(section.name)}" />
                </div>
                <div class="section-layout-control" style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 11px; text-transform: uppercase; font-weight: 800; color: var(--muted); margin-right: 4px;">Option Layout</span>
                    <label class="radio-inline"><input type="radio" name="sectionOptionLayout" value="row" ${section.layout === 'row' ? 'checked' : ''} /> 1&times;4</label>
                    <label class="radio-inline"><input type="radio" name="sectionOptionLayout" value="grid2" ${section.layout === 'grid2' ? 'checked' : ''} /> 2&times;2</label>
                    <label class="radio-inline"><input type="radio" name="sectionOptionLayout" value="column" ${section.layout === 'column' ? 'checked' : ''} /> 4&times;1</label>
                </div>
            </div>
            <div class="question-tools">
                <button class="small-btn success" id="addQuestionBtn" style="display: none;">+ Question</button>
                <button class="small-btn" id="reuseQuestionBtn"${UI_CONFIG.showReuse ? '' : ' style="display: none;"'}>Reuse</button>
                <button class="small-btn" id="duplicateSectionBtn"${UI_CONFIG.showDuplicate ? '' : ' style="display: none;"'}>Duplicate</button>
                <button class="small-btn danger" id="deleteSectionBtn">Delete</button>
            </div>
        </div>
        <div class="reuse-panel" id="reusePanel" hidden>
            <input id="reuseSearchInput" placeholder="Search saved questions from all papers..." />
            <div class="reuse-results" id="reuseResults"></div>
        </div>
        ${section.questions.length ? section.questions.map((question, index) => questionCard(question, index)).join('') : emptyQuestions()}
        ${section.questions.length ? `
        <div class="bottom-add-container" style="padding-bottom: 10px;">
            <button class="btn success" id="bottomAddQuestionBtn">+ Add Question</button>
        </div>
        ` : ''}
        <div class="bottom-add-container" style="margin-top: 15px; padding-bottom: 50px;">
            <button class="btn primary" id="bottomAddSectionBtn">+ Add Section</button>
        </div>
    `;

    document.getElementById('sectionNameInput').addEventListener('input', e => {
        section.name = e.target.value || 'Untitled Section';
        renderSectionTabs();
        renderTeacherPanel();
        renderPrintPaper();
        save();
    });
    const addQBtn = document.getElementById('addQuestionBtn');
    if (addQBtn) {
        addQBtn.addEventListener('click', () => addQuestion(section.id));
    }
    const bottomAddQBtn = document.getElementById('bottomAddQuestionBtn');
    if (bottomAddQBtn) {
        bottomAddQBtn.addEventListener('click', () => addQuestion(section.id));
    }
    const bottomAddSectBtn = document.getElementById('bottomAddSectionBtn');
    if (bottomAddSectBtn) {
        bottomAddSectBtn.addEventListener('click', addSection);
    }
    document.getElementById('reuseQuestionBtn').addEventListener('click', toggleReusePanel);
    document.getElementById('reuseSearchInput').addEventListener('input', renderReuseResults);
    document.getElementById('duplicateSectionBtn').addEventListener('click', duplicateSection);
    document.getElementById('deleteSectionBtn').addEventListener('click', deleteSection);

    bindRichEditors();

    els.workbench.querySelectorAll('[data-correct]').forEach(input => {
        input.addEventListener('change', () => {
            findQuestion(input.dataset.qid).correctIndex = Number(input.dataset.correct);
            render();
        });
    });

    els.workbench.querySelectorAll('[data-layout]').forEach(btn => {
        btn.addEventListener('click', () => {
            const question = findQuestion(btn.dataset.qid);
            question.layout = btn.dataset.layout;
            render();
        });
    });

    els.workbench.querySelectorAll('input[name="sectionOptionLayout"]').forEach(radio => {
        radio.addEventListener('change', () => {
            const newLayout = radio.value;
            section.layout = newLayout;
            
            section.questions.forEach(question => {
                question.layout = newLayout;
            });
            
            render();
        });
    });

    els.workbench.querySelectorAll('[data-question-action]').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.questionAction;
            const question = findQuestion(btn.dataset.qid);
            if (action === 'duplicate') duplicateQuestion(question.id);
            if (action === 'delete') deleteQuestion(question.id);
            if (action === 'move-up') moveQuestion(question.id, -1);
            if (action === 'move-down') moveQuestion(question.id, 1);
        });
    });

    els.workbench.querySelectorAll('[data-remove-image]').forEach(btn => {
        btn.addEventListener('click', () => {
            const question = findQuestion(btn.dataset.qid);
            const field = btn.dataset.field;
            const index = Number(btn.dataset.index);
            removeImageFromQuestionField(question, field, index);
            render();
        });
    });

    if (focusedEditorId) {
        const newEditor = els.workbench.querySelector(`[data-editor-id="${focusedEditorId}"][data-visual-editor]`);
        const newCodeEditor = els.workbench.querySelector(`[data-editor-id="${focusedEditorId}"][data-code-editor]`);
        if (caretOffset && caretOffset.isCode && newCodeEditor) {
            newCodeEditor.focus();
            newCodeEditor.setSelectionRange(caretOffset.start, caretOffset.end);
        } else if (newEditor) {
            newEditor.focus();
            if (caretOffset) {
                setSelectionCharacterOffsetWithin(newEditor, caretOffset);
            }
        }
    }
}

function questionCard(question, index) {
    return `
        <article class="question-card" data-card="${question.id}">
            <div class="question-head">
                <span class="q-number">${index + 1}</span>
                <div>
                    ${richEditor({
                        id: `${question.id}-text`,
                        qid: question.id,
                        field: 'text',
                        value: question.text,
                        placeholder: 'Type question. Paste images here. Use math like \\(x^2\\).'
                    })}
                    <div class="paste-hint">Paste images directly at the cursor. Use simple markdown for bold, italics, and math.</div>
                </div>
                <div class="question-tools-column">
                    <div class="question-tools">
                        <button class="small-btn" data-question-action="move-up" data-qid="${question.id}">↑</button>
                        <button class="small-btn" data-question-action="move-down" data-qid="${question.id}">↓</button>
                        <button class="small-btn" data-question-action="duplicate" data-qid="${question.id}"${UI_CONFIG.showCopy ? '' : ' style="display: none;"'}>Copy</button>
                        <button class="small-btn danger" data-question-action="delete" data-qid="${question.id}">Delete</button>
                    </div>
                    <div class="segmented">
                        ${LAYOUTS.map(layout => `
                            <button class="${question.layout === layout.id ? 'active' : ''}" data-layout="${layout.id}" data-qid="${question.id}">${layout.label}</button>
                        `).join('')}
                    </div>
                </div>
            </div>
            <div class="options-grid ${question.layout}">
                ${question.options.map((option, optionIndex) => optionCard(question, option, optionIndex)).join('')}
            </div>
            <div class="layout-row">
                <span class="paste-hint">Answer: ${LABELS[question.correctIndex] || 'A'}</span>
            </div>
        </article>
    `;
}

function optionCard(question, option, optionIndex) {
    return `
        <div class="option-card ${question.correctIndex === optionIndex ? 'correct' : ''}">
            <span class="option-label">${LABELS[optionIndex]}.</span>
            <div>
                ${richEditor({
                    id: `${question.id}-option-${optionIndex}`,
                    qid: question.id,
                    option: optionIndex,
                    field: `options.${optionIndex}.text`,
                    value: option.text,
                    placeholder: `Option ${LABELS[optionIndex]}`
                })}
            </div>
            <input class="correct-radio" type="radio" name="correct-${question.id}" ${question.correctIndex === optionIndex ? 'checked' : ''} data-correct="${optionIndex}" data-qid="${question.id}" title="Correct answer" />
            <span></span>
        </div>
    `;
}

function richEditor({ id, qid, option = '', field, value, placeholder }) {
    const imageMap = extractImages(value).map(img => img.src);
    const mapAttr = esc(JSON.stringify(imageMap));
    const codeValue = codeFromMarkdown(value);
    return `
        <div class="rich-editor" data-rich-editor data-editor-id="${esc(id)}" data-qid="${esc(qid)}" data-option="${esc(option)}" data-field="${esc(field)}">
            <div class="editor-toolbar">
                <button type="button" class="tool-btn" data-format="bold" data-editor-id="${esc(id)}" title="Bold"><b>B</b></button>
                <button type="button" class="tool-btn" data-format="italic" data-editor-id="${esc(id)}" title="Italic"><i>I</i></button>
                <button type="button" class="tool-btn" data-insert-equation data-editor-id="${esc(id)}" title="Insert equation">∑</button>
                <button type="button" class="tool-btn" data-toggle-code data-editor-id="${esc(id)}" title="Show code">Code</button>
                <button type="button" class="tool-btn" data-insert-diagram data-editor-id="${esc(id)}" title="Insert Mermaid diagram" style="display: none;">📊</button>
            </div>
            <div class="editor visual-editor"
                 contenteditable="true"
                 data-visual-editor
                 data-editor-id="${esc(id)}"
                 data-autocomplete-anchor
                 data-placeholder="${esc(placeholder)}">${markdownToVisualHtml(value)}</div>
            <div class="autocomplete-list" data-autocomplete-list data-editor-id="${esc(id)}" hidden></div>
            <textarea class="editor code-editor"
                      data-code-editor
                      data-editor-id="${esc(id)}"
                      data-autocomplete-anchor
                      data-image-map="${mapAttr}"
                      placeholder="Markdown code">${esc(codeValue)}</textarea>
        </div>
    `;
}

function bindRichEditors() {
    els.workbench.querySelectorAll('[data-visual-editor]').forEach(editor => {
        editor.addEventListener('input', () => {
            updateFieldFromEditor(editor.dataset.editorId, markdownFromVisual(editor));
            renderAutocomplete(editor.dataset.editorId);
        });
        editor.addEventListener('blur', () => {
            updateFieldFromEditor(editor.dataset.editorId, markdownFromVisual(editor));
            setTimeout(() => hideAutocomplete(editor.dataset.editorId), 120);
            if (!isEquationModalOpen) {
                render();
            }
        });
        editor.addEventListener('focus', () => renderAutocomplete(editor.dataset.editorId));
    });

    els.workbench.querySelectorAll('[data-code-editor]').forEach(editor => {
        editor.addEventListener('input', () => {
            autoResize(editor);
            updateFieldFromEditor(editor.dataset.editorId, markdownFromCode(editor.value, editor.dataset.imageMap));
            renderAutocomplete(editor.dataset.editorId);
        });
        editor.addEventListener('focus', () => renderAutocomplete(editor.dataset.editorId));
        editor.addEventListener('blur', () => setTimeout(() => hideAutocomplete(editor.dataset.editorId), 120));
        autoResize(editor);
    });

    els.workbench.querySelectorAll('[data-format], [data-toggle-code], [data-insert-equation]').forEach(btn => {
        btn.addEventListener('mousedown', e => {
            e.preventDefault();
        });
    });

    els.workbench.querySelectorAll('[data-format]').forEach(btn => {
        btn.addEventListener('click', () => applyFormat(btn.dataset.editorId, btn.dataset.format));
    });

    els.workbench.querySelectorAll('[data-toggle-code]').forEach(btn => {
        btn.addEventListener('click', () => toggleCodeMode(btn.dataset.editorId));
    });

    els.workbench.querySelectorAll('[data-insert-equation]').forEach(btn => {
        btn.addEventListener('click', () => insertEquation(btn.dataset.editorId));
    });
}

function updateFieldFromEditor(editorId, markdown) {
    const wrapper = document.querySelector(`[data-rich-editor][data-editor-id="${cssEscape(editorId)}"]`);
    if (!wrapper) return;
    const question = findQuestion(wrapper.dataset.qid);
    if (!question) return;
    setQuestionField(question, wrapper.dataset.field, markdown);
    renderTeacherPanel();
    save();
}

function setQuestionField(question, field, value) {
    if (field === 'text') {
        question.text = value;
        return;
    }
    const optionMatch = field.match(/^options\.(\d+)\.text$/);
    if (optionMatch) {
        const option = question.options[Number(optionMatch[1])];
        if (option) option.text = value;
    }
}

function getQuestionField(question, field) {
    if (field === 'text') return question.text;
    const optionMatch = field.match(/^options\.(\d+)\.text$/);
    if (optionMatch) return question.options[Number(optionMatch[1])]?.text || '';
    return '';
}

function toggleCodeMode(editorId) {
    const wrapper = document.querySelector(`[data-rich-editor][data-editor-id="${cssEscape(editorId)}"]`);
    if (!wrapper) return;
    const codeEditor = wrapper.querySelector('[data-code-editor]');
    const visualEditor = wrapper.querySelector('[data-visual-editor]');
    const showingCode = wrapper.classList.toggle('show-code');
    const question = findQuestion(wrapper.dataset.qid);
    const markdown = question ? getQuestionField(question, wrapper.dataset.field) : '';
    if (showingCode) {
        codeEditor.dataset.imageMap = JSON.stringify(extractImages(markdown).map(img => img.src));
        codeEditor.value = codeFromMarkdown(markdown);
        autoResize(codeEditor);
        codeEditor.focus();
    } else {
        const restored = markdownFromCode(codeEditor.value, codeEditor.dataset.imageMap);
        updateFieldFromEditor(editorId, restored);
        visualEditor.innerHTML = markdownToVisualHtml(restored);
        visualEditor.focus();
    }
}

function applyFormat(editorId, format) {
    const wrapper = document.querySelector(`[data-rich-editor][data-editor-id="${cssEscape(editorId)}"]`);
    if (!wrapper) return;
    
    const saved = editorSelections[editorId];
    
    if (wrapper.classList.contains('show-code')) {
        const code = wrapper.querySelector('[data-code-editor]');
        const start = (saved && !saved.isVisual) ? saved.selectionStart : code.selectionStart;
        const end = (saved && !saved.isVisual) ? saved.selectionEnd : code.selectionEnd;
        wrapCodeSelection(code, format, start, end);
        return;
    }
    
    const visual = wrapper.querySelector('[data-visual-editor]');
    const selection = window.getSelection();
    
    if (document.activeElement !== visual) {
        visual.focus();
        if (saved && saved.isVisual && saved.range && selection) {
            selection.removeAllRanges();
            selection.addRange(saved.range);
        }
    }
    
    document.execCommand(format === 'bold' ? 'bold' : 'italic', false, null);
    updateFieldFromEditor(editorId, markdownFromVisual(visual));
    updateActiveSelection();
}

let activeInsertEquationEditorId = null;
let savedRange = null;
let savedSelectionStart = null;
let savedSelectionEnd = null;
let isEquationModalOpen = false;
let equationActiveCategory = 'all';
let equationFavorites = [];
let equationRecent = [];

const editorSelections = {};
let lastActiveEditorKey = null;

const getEditorKey = (el) => {
    if (!el) return null;
    const richEditor = el.closest('[data-rich-editor]');
    if (richEditor) {
        return richEditor.dataset.editorId;
    }
    if (el.dataset.meta) {
        return `meta_${el.dataset.meta}`;
    }
    return el.id || el.name || null;
};

const updateActiveSelection = () => {
    const activeEl = document.activeElement;
    if (!activeEl) return;
    
    if (activeEl.id === 'equationSearchInput' || activeEl.id === 'equationLatexEditor') return;
    if (activeEl.id === 'tagsSearchInput' || activeEl.id === 'tagInputField') return;
    
    const key = getEditorKey(activeEl);
    if (!key) {
        updateGlobalToolbarState();
        return;
    }
    
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const visualEditor = activeEl.closest('[data-visual-editor]');
        if (visualEditor) {
            editorSelections[key] = {
                key: key,
                element: visualEditor,
                range: range.cloneRange(),
                isVisual: true
            };
            lastActiveEditorKey = key;
            updateGlobalToolbarState();
            return;
        }
    }
    
    if (activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'INPUT') {
        editorSelections[key] = {
            key: key,
            element: activeEl,
            selectionStart: activeEl.selectionStart,
            selectionEnd: activeEl.selectionEnd,
            isVisual: false
        };
        lastActiveEditorKey = key;
        updateGlobalToolbarState();
    }
};

document.addEventListener('selectionchange', updateActiveSelection);
document.addEventListener('keyup', updateActiveSelection);
document.addEventListener('mouseup', updateActiveSelection);
document.addEventListener('focus', updateActiveSelection, true);
try {
    equationFavorites = JSON.parse(localStorage.getItem('school_mcq_paper_studio_favorite_formulas') || '[]');
} catch (e) {
    equationFavorites = [];
}
try {
    const raw = localStorage.getItem('school_mcq_paper_studio_recent_formulas');
    if (raw) {
        const parsed = JSON.parse(raw);
        equationRecent = parsed.map(item => {
            if (typeof item === 'string') {
                return FORMULA_LIBRARY.find(f => f.id === item) || { id: item, category: 'Custom', name: item, latex: item };
            }
            return item;
        }).filter(f => f);
    }
} catch (e) {
    equationRecent = [];
}

function saveEquationFavorites() {
    localStorage.setItem('school_mcq_paper_studio_favorite_formulas', JSON.stringify(equationFavorites));
}

function saveEquationRecent() {
    localStorage.setItem('school_mcq_paper_studio_recent_formulas', JSON.stringify(equationRecent));
}

function updateGlobalToolbarState() {
    if (typeof document === 'undefined' || !document.getElementById) return;
    const boldBtn = document.getElementById('globalFormatBold');
    const italicBtn = document.getElementById('globalFormatItalic');
    const codeBtn = document.getElementById('globalFormatCode');
    
    const activeEl = document.activeElement;
    const key = activeEl ? getEditorKey(activeEl) : null;
    
    if (!key) {
        if (activeEl && activeEl.closest('#globalToolbar')) {
            return;
        }
        if (boldBtn) boldBtn.classList.remove('active');
        if (italicBtn) italicBtn.classList.remove('active');
        if (codeBtn) codeBtn.classList.remove('active');
        return;
    }
    
    const saved = editorSelections[key];
    if (saved && saved.isVisual) {
        if (boldBtn) {
            boldBtn.classList.toggle('active', document.queryCommandState('bold'));
        }
        if (italicBtn) {
            italicBtn.classList.toggle('active', document.queryCommandState('italic'));
        }
        
        const wrapper = document.querySelector(`[data-rich-editor][data-editor-id="${cssEscape(key)}"]`);
        const showingCode = wrapper ? wrapper.classList.contains('show-code') : false;
        if (codeBtn) {
            codeBtn.classList.toggle('active', showingCode);
        }
    } else if (saved) {
        if (boldBtn) boldBtn.classList.remove('active');
        if (italicBtn) italicBtn.classList.remove('active');
        if (codeBtn) codeBtn.classList.add('active');
    }
}

function initGlobalToolbar() {
    if (typeof document === 'undefined' || !document.querySelectorAll) return;
    const btns = document.querySelectorAll('#globalToolbar .tool-btn');
    btns.forEach(btn => {
        btn.addEventListener('mousedown', e => {
            e.preventDefault();
        });
    });
    
    const boldBtn = document.getElementById('globalFormatBold');
    if (boldBtn) {
        boldBtn.addEventListener('click', () => {
            if (lastActiveEditorKey) applyFormat(lastActiveEditorKey, 'bold');
        });
    }
    const italicBtn = document.getElementById('globalFormatItalic');
    if (italicBtn) {
        italicBtn.addEventListener('click', () => {
            if (lastActiveEditorKey) applyFormat(lastActiveEditorKey, 'italic');
        });
    }
    const equationBtn = document.getElementById('globalInsertEquation');
    if (equationBtn) {
        equationBtn.addEventListener('click', () => {
            if (lastActiveEditorKey) insertEquation(lastActiveEditorKey);
        });
    }
    const tableBtn = document.getElementById('globalInsertTable');
    if (tableBtn) {
        tableBtn.addEventListener('click', () => {
            if (lastActiveEditorKey) openAdvancedEditorModal(lastActiveEditorKey);
        });
    }
    const codeBtn = document.getElementById('globalFormatCode');
    if (codeBtn) {
        codeBtn.addEventListener('click', () => {
            if (lastActiveEditorKey) toggleCodeMode(lastActiveEditorKey);
        });
    }
}

function insertEquation(editorId, targetToken = null) {
    hideContextMenu();
    mermaidZoomScale = 1.0;
    activeInsertEquationEditorId = editorId || lastActiveEditorKey;
    isEquationModalOpen = true;
    activeMermaidTokenElement = targetToken;
    
    const targetKey = activeInsertEquationEditorId;
    const saved = editorSelections[targetKey];
    if (saved) {
        savedRange = saved.isVisual ? saved.range : null;
        savedSelectionStart = !saved.isVisual ? saved.selectionStart : null;
        savedSelectionEnd = !saved.isVisual ? saved.selectionEnd : null;
    } else {
        savedRange = null;
        savedSelectionStart = null;
        savedSelectionEnd = null;
    }
    
    const searchInput = document.getElementById('equationSearchInput');
    if (searchInput) searchInput.value = '';
    
    // Toggle sidebars & panels
    const modal = document.getElementById('equationModal');
    if (modal) {
        modal.hidden = false;
    }
    
    const latexEditor = document.getElementById('equationLatexEditor');
    if (latexEditor) {
        latexEditor.value = '';
    }
    
    const codeEditor = document.getElementById('mermaidCodeEditor');
    if (codeEditor) {
        codeEditor.value = '';
    }
    
    if (targetToken && targetToken.classList.contains('mermaid-token')) {
        equationActiveCategory = 'Mermaid';
        const base64Code = targetToken.dataset.mermaid;
        try {
            const code = decodeURIComponent(escape(atob(base64Code)));
            if (codeEditor) codeEditor.value = code;
        } catch (err) {
            if (codeEditor) codeEditor.value = '';
        }
    } else {
        equationActiveCategory = 'all';
    }
    
    const categoryBtns = document.querySelectorAll('#equationModal .category-btn');
    categoryBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === equationActiveCategory);
    });
    
    // Toggle Mermaid vs Math views
    toggleEditorViewForCategory(equationActiveCategory);
    
    renderEquationPreview('');
    renderEquationList();
    
    if (equationActiveCategory === 'Mermaid') {
        const preview = document.getElementById('mermaidLivePreview');
        if (codeEditor && preview) {
            validateAndRenderMermaid(codeEditor.value, preview);
            setTimeout(() => {
                codeEditor.focus();
                codeEditor.select();
            }, 60);
        }
    } else {
        const container = document.getElementById('mathfieldContainer');
        if (container) {
            container.innerHTML = '';
            const mathfield = document.createElement('math-field');
            mathfield.id = 'equationMathfield';
            mathfield.setAttribute('virtual-keyboard-mode', 'auto');
            mathfield.style.width = '100%';
            mathfield.style.minHeight = '70px';
            mathfield.style.fontSize = '16px';
            mathfield.style.padding = '8px';
            mathfield.style.border = '1px solid var(--line)';
            mathfield.style.borderRadius = '8px';
            mathfield.style.background = '#fff';
            mathfield.style.outline = 'none';
            mathfield.value = '';
            container.appendChild(mathfield);
            activeMathfield = mathfield;

            mathfield.addEventListener('input', () => {
                if (latexEditor) {
                    latexEditor.value = mathfield.value;
                    renderEquationPreview(mathfield.value);
                }
            });

            mathfield.addEventListener('click', e => {
                e.stopPropagation();
            });
            
            setTimeout(() => {
                mathfield.focus();
            }, 50);
        }
    }
}

function renderEquationPreview(latex) {
    const previewEl = document.getElementById('equationLivePreview');
    if (!previewEl) return;
    if (!latex.trim()) {
        previewEl.innerHTML = '<span style="color: var(--muted); font-size: 11px;">Equation preview will be shown here</span>';
        return;
    }
    if (window.katex) {
        try {
            window.katex.render(latex, previewEl, {
                throwOnError: false,
                displayMode: true
            });
        } catch (err) {
            previewEl.textContent = latex;
        }
    } else {
        previewEl.textContent = latex;
    }
}

const MERMAID_TEMPLATES = [
    {
        id: 'mermaid_pie',
        category: 'Mermaid',
        name: 'Pie Chart',
        code: `pie title Pets owned by staff
    "Dogs" : 386
    "Cats" : 85`
    },
    {
        id: 'mermaid_flowchart',
        category: 'Mermaid',
        name: 'Flowchart',
        code: `graph TD
    A[Christmas] -->|Get money| B(Go shopping)
    B --> C{Let me think}
    C -->|One| D[Laptop]
    C -->|Two| E[iPhone]`
    },
    {
        id: 'mermaid_sequence',
        category: 'Mermaid',
        name: 'Sequence Diagram',
        code: `sequenceDiagram
    Alice->>Bob: Hello Bob, how are you?
    Bob-->>Alice: Jolly good!`
    },
    {
        id: 'mermaid_class',
        category: 'Mermaid',
        name: 'Class Diagram',
        code: `classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal : +int age
    Animal : +isMammal()`
    },
    {
        id: 'mermaid_state',
        category: 'Mermaid',
        name: 'State Diagram',
        code: `stateDiagram-v2
    [*] --> Still
    Still --> [*]`
    },
    {
        id: 'mermaid_er',
        category: 'Mermaid',
        name: 'ER Diagram',
        code: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains`
    },
    {
        id: 'mermaid_journey',
        category: 'Mermaid',
        name: 'User Journey',
        code: `journey
    title My working day
    section Go to work
      Make tea: 5: Me
      Go to upstairs: 3: Me
    section Work
      Code: 5: Me`
    },
    {
        id: 'mermaid_mindmap',
        category: 'Mermaid',
        name: 'Mindmap',
        code: `mindmap
  root((mindmap))
    Origins
      Long history
    Research
      Decline`
    },
    {
        id: 'mermaid_timeline',
        category: 'Mermaid',
        name: 'Timeline',
        code: `timeline
    title History of Social Media Platform
    2004 : Facebook
    2006 : Twitter`
    },
    {
        id: 'mermaid_git',
        category: 'Mermaid',
        name: 'Git Graph',
        code: `gitGraph
    commit
    branch hotfix
    checkout hotfix
    commit
    checkout main
    merge hotfix`
    }
];

function renderEquationList() {
    const listContainer = document.getElementById('equationFormulaList');
    const searchInput = document.getElementById('equationSearchInput');
    if (!listContainer || !searchInput) return;

    const query = searchInput.value.toLowerCase().trim();
    
    if (equationActiveCategory === 'Mermaid') {
        let list = MERMAID_TEMPLATES;
        if (query) {
            list = list.filter(f => 
                f.name.toLowerCase().includes(query) || 
                f.category.toLowerCase().includes(query) ||
                f.code.toLowerCase().includes(query)
            );
        }
        
        listContainer.innerHTML = list.map(f => `
            <div class="equation-formula-card" data-template-id="${esc(f.id)}">
                <div class="equation-formula-name" style="font-weight: 600;">${esc(f.name)}</div>
                <div class="mermaid-template-render" id="tmpl_render_${esc(f.id)}">
                    <span class="mermaid-loading" style="font-size: 11px; color: #888;">Rendering preview...</span>
                </div>
            </div>
        `).join('');
        
        // Find matching card or default to first card
        let selectedCode = '';
        const editor = document.getElementById('mermaidCodeEditor');
        if (editor) {
            selectedCode = editor.value.trim();
        }
        
        let activeCardIndex = 0;
        if (selectedCode) {
            const index = list.findIndex(f => f.code.trim() === selectedCode);
            if (index !== -1) activeCardIndex = index;
        }
        
        listContainer.querySelectorAll('.equation-formula-card').forEach((card, index) => {
            const templateId = card.dataset.templateId;
            const templateObj = MERMAID_TEMPLATES.find(t => t.id === templateId);
            const templateCode = templateObj ? templateObj.code : '';
            
            if (index === activeCardIndex) {
                card.classList.add('selected');
                if (!selectedCode && editor) {
                    editor.value = templateCode;
                    const preview = document.getElementById('mermaidLivePreview');
                    if (preview) {
                        validateAndRenderMermaid(templateCode, preview);
                    }
                }
            }
            
            card.addEventListener('click', e => {
                e.stopPropagation();
                listContainer.querySelectorAll('.equation-formula-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                
                // Reset zoom factor when loading a new template diagram
                mermaidZoomScale = 1.0;
                
                const preview = document.getElementById('mermaidLivePreview');
                if (editor) {
                    editor.value = templateCode;
                    editor.focus();
                    editor.select();
                }
                if (preview) {
                    validateAndRenderMermaid(templateCode, preview);
                }
            });
        });
        
        // Asynchronously render the templates
        list.forEach(async f => {
            const targetId = `tmpl_render_${f.id}`;
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                try {
                    const id = `mermaid_tmpl_svg_${uid('svg')}`;
                    const tempDiv = document.createElement('div');
                    tempDiv.style.position = 'absolute';
                    tempDiv.style.left = '-9999px';
                    tempDiv.style.top = '-9999px';
                    document.body.appendChild(tempDiv);
                    
                    try {
                        const { svg } = await mermaid.render(id, f.code, tempDiv);
                        targetEl.innerHTML = svg;
                    } finally {
                        tempDiv.remove();
                    }
                } catch (err) {
                    targetEl.innerHTML = `<span style="color: #ef4444; font-size: 11px;">Failed to render</span>`;
                }
            }
        });
        
        return;
    }
    
    let list = [];
    if (equationActiveCategory === 'recent') {
        list = equationRecent;
    } else if (equationActiveCategory === 'favorites') {
        list = FORMULA_LIBRARY.filter(f => equationFavorites.includes(f.id));
    } else if (equationActiveCategory === 'all') {
        list = FORMULA_LIBRARY;
    } else {
        list = FORMULA_LIBRARY.filter(f => f.category === equationActiveCategory);
    }

    if (query) {
        list = list.filter(f => 
            f.name.toLowerCase().includes(query) || 
            (f.description && f.description.toLowerCase().includes(query)) ||
            f.category.toLowerCase().includes(query) ||
            f.latex.toLowerCase().includes(query)
        );
    }

    listContainer.innerHTML = list.map(f => {
        const isFav = equationFavorites.includes(f.id);
        return `
            <div class="equation-formula-card" data-id="${esc(f.id)}" data-latex="${esc(f.latex)}">
                <button class="favorite-star-btn ${isFav ? 'active' : ''}" data-id="${esc(f.id)}" title="Favorite">★</button>
                <div class="equation-formula-name">${esc(f.name)}</div>
                <div class="equation-formula-render" id="card-render-${esc(f.id)}">${esc(f.latex)}</div>
            </div>
        `;
    }).join('');

    list.forEach(f => {
        const el = document.getElementById(`card-render-${f.id}`);
        if (el && window.katex) {
            try {
                window.katex.render(f.latex, el, { throwOnError: false });
            } catch (err) {
                // fall back to raw text
            }
        }
    });

    listContainer.querySelectorAll('.equation-formula-card').forEach(card => {
        card.addEventListener('click', e => {
            if (e.target.classList.contains('favorite-star-btn')) return;
            e.stopPropagation();
            const latex = card.dataset.latex;
            const editor = document.getElementById('equationLatexEditor');
            if (editor) {
                editor.value = latex;
                renderEquationPreview(latex);
                if (activeMathfield) {
                    activeMathfield.value = latex;
                    setTimeout(() => {
                        activeMathfield.focus();
                    }, 50);
                }
            }
        });
    });

    listContainer.querySelectorAll('.favorite-star-btn').forEach(star => {
        star.addEventListener('click', e => {
            e.stopPropagation();
            const id = star.dataset.id;
            if (equationFavorites.includes(id)) {
                equationFavorites = equationFavorites.filter(fid => fid !== id);
                star.classList.remove('active');
            } else {
                equationFavorites.push(id);
                star.classList.add('active');
            }
            saveEquationFavorites();
            if (equationActiveCategory === 'favorites') {
                renderEquationList();
            }
        });
    });
}

let activeInsertDiagramEditorId = null;
let activeMermaidTokenElement = null;

if (window.mermaid) {
    mermaid.initialize({ startOnLoad: false, theme: 'default' });
}

function svgToPng(svgString) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                // Render at the natural size (which is already high-resolution)
                const width = img.naturalWidth || 800;
                const height = img.naturalHeight || 600;
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                
                // Enable high-quality image smoothing
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const png = canvas.toDataURL('image/png');
                
                console.log(`[Mermaid DPI Render] Canvas compiled at size: ${canvas.width}x${canvas.height}`);
                resolve(png);
            } catch (err) {
                reject(err);
            }
        };
        img.onerror = (e) => reject(new Error("Failed to load SVG into image: " + e));
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
    });
}

async function validateAndRenderMermaid(code, targetElement) {
    try {
        const errMsg = document.getElementById('mermaidErrorMessage');
        if (errMsg) errMsg.hidden = true;
        targetElement.hidden = false;
        
        let renderContainer = targetElement;
        if (targetElement.id === 'mermaidLivePreview') {
            renderContainer = document.getElementById('mermaidPreviewContent') || targetElement;
            const controls = document.getElementById('mermaidZoomControls');
            if (controls) controls.style.display = 'flex';
        }
        
        if (!code.trim()) {
            renderContainer.innerHTML = '<span class="mermaid-loading">Type code to preview</span>';
            return true;
        }
        
        // Parse the code
        await mermaid.parse(code);
        
        // Render it
        const id = `mermaid_preview_${uid('svg')}`;
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.top = '-9999px';
        document.body.appendChild(tempDiv);
        
        try {
            const { svg } = await mermaid.render(id, code, tempDiv);
            renderContainer.innerHTML = svg;
            
            // Constrain SVG sizing and apply scale transforms
            const svgEl = renderContainer.querySelector('svg');
            if (svgEl) {
                if (targetElement.id === 'mermaidLivePreview') {
                    updateMermaidZoom();
                } else {
                    svgEl.removeAttribute('style');
                    svgEl.style.maxWidth = '100%';
                    svgEl.style.maxHeight = '100%';
                    svgEl.style.width = '100%';
                    svgEl.style.height = '100%';
                }
            }
        } finally {
            tempDiv.remove();
        }
        return true;
    } catch (err) {
        console.error("Mermaid parsing/rendering error:", err);
        const errMsg = document.getElementById('mermaidErrorMessage');
        if (errMsg) errMsg.hidden = false;
        targetElement.hidden = true;
        return false;
    }
}

function toggleEditorViewForCategory(category) {
    const modalContent = document.querySelector('.equation-modal-content');
    if (modalContent) {
        modalContent.classList.toggle('mermaid-active', category === 'Mermaid');
    }
    const mathContainer = document.getElementById('visualFormulaEditorContainer');
    
    const latexEditor = document.getElementById('equationLatexEditor');
    const mermaidEditor = document.getElementById('mermaidCodeEditor');
    const editorLabel = document.getElementById('editorAreaLabel');
    
    const latexPreview = document.getElementById('equationLivePreview');
    const mermaidPreview = document.getElementById('mermaidLivePreview');
    const previewLabel = document.getElementById('previewAreaLabel');
    const mermaidErr = document.getElementById('mermaidErrorMessage');
    
    const title = document.getElementById('equationModalTitle');
    const insertBtn = document.getElementById('insertEquationBtn');
    
    if (category === 'Mermaid') {
        if (mathContainer) mathContainer.hidden = true;
        
        if (latexEditor) latexEditor.hidden = true;
        if (mermaidEditor) mermaidEditor.hidden = false;
        if (editorLabel) editorLabel.textContent = 'Mermaid Code Editor';
        
        if (latexPreview) latexPreview.hidden = true;
        if (mermaidPreview) mermaidPreview.hidden = false;
        if (previewLabel) previewLabel.textContent = 'Live Preview';
        
        if (title) title.textContent = activeMermaidTokenElement ? 'Edit Mermaid Diagram' : 'Insert Mermaid Diagram';
        if (insertBtn) insertBtn.textContent = activeMermaidTokenElement ? 'Update Diagram' : 'Insert Diagram';
    } else {
        if (mathContainer) mathContainer.hidden = false;
        
        if (latexEditor) latexEditor.hidden = false;
        if (mermaidEditor) mermaidEditor.hidden = true;
        if (editorLabel) editorLabel.textContent = 'LaTeX Editor';
        
        if (latexPreview) latexPreview.hidden = false;
        if (mermaidPreview) mermaidPreview.hidden = true;
        if (previewLabel) previewLabel.textContent = 'Live Preview';
        if (mermaidErr) mermaidErr.hidden = true;
        
        if (title) title.textContent = 'Insert Equation';
        if (insertBtn) insertBtn.textContent = 'Insert Equation';
    }
}

let contextMenuTargetToken = null;
let isContextMenuOpen = false;
let mermaidZoomScale = 1.0;

function updateMermaidZoom() {
    const svgEl = document.querySelector('#mermaidPreviewContent svg');
    const container = document.getElementById('mermaidPreviewContent');
    if (svgEl && container) {
        const containerWidth = container.clientWidth - 20; // 10px padding on each side
        const containerHeight = container.clientHeight - 20;
        
        let svgWidth = 800;
        let svgHeight = 600;
        
        const viewBoxStr = svgEl.getAttribute('viewBox');
        if (viewBoxStr) {
            const parts = viewBoxStr.trim().split(/\s+/);
            if (parts.length === 4) {
                const w = parseFloat(parts[2]);
                const h = parseFloat(parts[3]);
                if (!isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
                    svgWidth = w;
                    svgHeight = h;
                }
            }
        } else {
            const attrWidth = parseFloat(svgEl.getAttribute('width'));
            const attrHeight = parseFloat(svgEl.getAttribute('height'));
            if (!isNaN(attrWidth) && attrWidth > 0) svgWidth = attrWidth;
            if (!isNaN(attrHeight) && attrHeight > 0) svgHeight = attrHeight;
        }
        
        const fitScale = Math.min(containerWidth / svgWidth, containerHeight / svgHeight);
        
        // Smart scale selection:
        // Ensure small diagrams are displayed at least at natural size (1.0).
        // Larger diagrams are scaled to fit, but clamped to a minimum readability scale of 0.75.
        let baseScale = fitScale;
        if (fitScale >= 1.0) {
            baseScale = 1.0;
        } else {
            baseScale = Math.max(0.75, fitScale);
        }
        
        const finalScale = baseScale * mermaidZoomScale;
        
        // Apply scaled size directly to styling to avoid visual/layout bounds mismatch
        svgEl.removeAttribute('style');
        svgEl.style.width = `${svgWidth * finalScale}px`;
        svgEl.style.height = `${svgHeight * finalScale}px`;
        svgEl.style.display = 'block';
        svgEl.style.transition = 'width 0.15s ease-out, height 0.15s ease-out';
    }
}

function hideContextMenu() {
    isContextMenuOpen = false;
    contextMenuTargetToken = null;
    const contextMenu = document.getElementById('customContextMenu');
    if (contextMenu) {
        contextMenu.style.display = 'none';
        contextMenu.hidden = true;
    }
}

function deleteSelectedToken(token) {
    const visualEditor = token.closest('[data-visual-editor]');
    if (!visualEditor) return;
    
    const editorId = visualEditor.dataset.editorId;
    visualEditor.focus();
    
    const selection = window.getSelection();
    if (selection) {
        try {
            const range = document.createRange();
            range.selectNode(token);
            selection.removeAllRanges();
            selection.addRange(range);
            // Delete command preserving contenteditable undo stack
            const success = document.execCommand('delete', false, null);
            if (!success || token.parentNode) {
                token.remove();
            }
        } catch (err) {
            token.remove();
        }
    } else {
        token.remove();
    }
    
    updateFieldFromEditor(editorId, markdownFromVisual(visualEditor));
}

// Centralized document-level click delegation
document.addEventListener('click', e => {
    // Hide context menus on any click OUTSIDE the context menus
    if (!e.target.closest('#customContextMenu')) {
        hideContextMenu();
    }
    if (!e.target.closest('#logoContextMenu')) {
        hideLogoContextMenu();
    }
    if (!e.target.closest('#tableContextMenu')) {
        hideTableContextMenu();
    }
    
    // Logo container selection / deselection
    const logoContainer = e.target.closest('#logoSetupContainer');
    if (logoContainer && logoContainer.querySelector('img')) {
        logoContainer.classList.add('selected');
    } else {
        document.getElementById('logoSetupContainer')?.classList.remove('selected');
    }
    
    // Table selection / deselection
    const tableToken = e.target.closest('.table-token');
    if (tableToken) {
        document.querySelectorAll('.table-token.selected').forEach(t => t.classList.remove('selected'));
        tableToken.classList.add('selected');
    } else {
        document.querySelectorAll('.table-token.selected').forEach(t => t.classList.remove('selected'));
    }
    
    // 4. Check if clicked diagram corner delete button
    const diagramDeleteBtn = e.target.closest('.mermaid-token .delete-btn');
    if (diagramDeleteBtn) {
        e.stopPropagation();
        const token = diagramDeleteBtn.closest('.mermaid-token');
        if (token) {
            deleteSelectedToken(token);
        }
        return;
    }
    
    // 5. Handle diagram token selection
    const token = e.target.closest('.mermaid-token');
    if (token) {
        const visualEditor = token.closest('[data-visual-editor]');
        if (visualEditor) {
            e.stopPropagation();
            
            // Select this token
            document.querySelectorAll('.mermaid-token.selected').forEach(t => t.classList.remove('selected'));
            token.classList.add('selected');
            
            // Programmatically focus and select the token node
            visualEditor.focus();
            const selection = window.getSelection();
            if (selection) {
                const range = document.createRange();
                range.selectNode(token);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    } else {
        // Clicked outside, deselect all
        document.querySelectorAll('.mermaid-token.selected').forEach(t => t.classList.remove('selected'));
    }
});

// Context Menu Right-click delegation on .mermaid-token, logo container, or tables
document.addEventListener('contextmenu', e => {
    const tableCell = e.target.closest('td, th');
    if (tableCell) {
        // Native editor-table cells are handled by the capture-phase listener
        // lower in this file. Skip them here to avoid double-firing.
        if (tableCell.closest('table.editor-table')) return;

        e.preventDefault();
        e.stopPropagation();
        activeTableCell = tableCell;
        const token = tableCell.closest('.table-token');
        if (token) {
            document.querySelectorAll('.table-token.selected').forEach(t => t.classList.remove('selected'));
            token.classList.add('selected');
        }
        showTableContextMenu(e.clientX, e.clientY);
        return;
    }

    const logoContainer = e.target.closest('#logoSetupContainer');
    if (logoContainer) {
        e.preventDefault();
        e.stopPropagation();
        
        if (logoContainer.querySelector('img')) {
            logoContainer.classList.add('selected');
        }
        
        showLogoContextMenu(e.clientX, e.clientY);
        return;
    }

    const token = e.target.closest('.mermaid-token');
    if (token) {
        const visualEditor = token.closest('[data-visual-editor]');
        if (visualEditor) {
            e.preventDefault();
            e.stopPropagation();
            
            // Select this token
            document.querySelectorAll('.mermaid-token.selected').forEach(t => t.classList.remove('selected'));
            token.classList.add('selected');
            
            // Programmatically focus and select the token node
            visualEditor.focus();
            const selection = window.getSelection();
            if (selection) {
                const range = document.createRange();
                range.selectNode(token);
                selection.removeAllRanges();
                selection.addRange(range);
            }
            
            contextMenuTargetToken = token;
            
            isContextMenuOpen = true;
            const contextMenu = document.getElementById('customContextMenu');
            if (contextMenu) {
                contextMenu.style.left = `${e.clientX}px`;
                contextMenu.style.top = `${e.clientY}px`;
                contextMenu.style.display = 'flex';
                contextMenu.hidden = false;
            }
        }
    } else {
        hideContextMenu();
    }
});

// Delegate double-clicks on .mermaid-token to trigger editing inside the Equation Modal
document.addEventListener('dblclick', e => {
    const token = e.target.closest('.mermaid-token');
    if (token) {
        const visualEditor = token.closest('[data-visual-editor]');
        if (visualEditor) {
            e.preventDefault();
            e.stopPropagation();
            
            // Select this token
            document.querySelectorAll('.mermaid-token.selected').forEach(t => t.classList.remove('selected'));
            token.classList.add('selected');
            
            // Programmatically focus and select the token node
            visualEditor.focus();
            const selection = window.getSelection();
            if (selection) {
                const range = document.createRange();
                range.selectNode(token);
                selection.removeAllRanges();
                selection.addRange(range);
            }
            
            const editorId = visualEditor.dataset.editorId;
            insertEquation(editorId, token);
        }
    }
});

// Key listener to delete selected Mermaid diagrams or tables, and handle cell Tab navigation
document.addEventListener('keydown', e => {
    if (state.isHoveringLogoArea) {
        const paper = getActivePaper();
        if (paper && (e.key === 'Backspace' || e.key === 'Delete')) {
            if (paper.logo) {
                e.preventDefault();
                paper.logo = '';
                save();
                render();
                toast('Logo deleted');
                return;
            }
        }
    }
    
    // Tab / Shift+Tab navigation between table cells
    if (e.key === 'Tab') {
        const activeCell = e.target.closest('td, th');
        if (activeCell) {
            e.preventDefault();
            const table = activeCell.closest('table');
            if (table) {
                const cells = Array.from(table.querySelectorAll('td, th'));
                const idx = cells.indexOf(activeCell);
                let nextIdx = e.shiftKey ? idx - 1 : idx + 1;
                
                if (nextIdx >= 0 && nextIdx < cells.length) {
                    cells[nextIdx].focus();
                    
                    const range = document.createRange();
                    const sel = window.getSelection();
                    range.selectNodeContents(cells[nextIdx]);
                    range.collapse(false);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
            return;
        }
    }

    if (e.key === 'Backspace' || e.key === 'Delete') {
        const selectedTable = document.querySelector('.table-token.selected');
        if (selectedTable) {
            e.preventDefault();
            const visualEditor = selectedTable.closest('[data-visual-editor]');
            const editorId = visualEditor?.closest('[data-rich-editor]')?.dataset.editorId;
            selectedTable.remove();
            if (visualEditor && editorId) {
                updateFieldFromEditor(editorId, markdownFromVisual(visualEditor));
                save();
            }
            return;
        }

        const selectedToken = document.querySelector('.mermaid-token.selected');
        if (selectedToken) {
            e.preventDefault();
            deleteSelectedToken(selectedToken);
        }
    }
});

// Note: editor-table column/row resize mousedown is handled by the
// complete resize engine further below (_colResizeCell / _rowResizeRow).

// This mousedown handler handles mermaid diagram resize handles and context menu buttons.
document.addEventListener('mousedown', e => {
    // 1. Handle Context Menu "Edit Diagram" Button Click
    const editBtn = e.target.closest('#contextEditDiagram');
    if (editBtn) {
        e.preventDefault();
        e.stopPropagation();
        const token = contextMenuTargetToken;
        
        // Close context menu first and clear active context variables
        hideContextMenu();
        
        // Open Mermaid editor modal
        if (token) {
            const visualEditor = token.closest('[data-visual-editor]');
            if (visualEditor) {
                const editorId = visualEditor.dataset.editorId;
                insertEquation(editorId, token);
            }
        }
        return;
    }
    
    // 2. Handle Context Menu "Delete Diagram" Button Click
    const deleteBtn = e.target.closest('#contextDeleteDiagram');
    if (deleteBtn) {
        e.preventDefault();
        e.stopPropagation();
        const token = contextMenuTargetToken;
        
        // Close context menu first and clear active context variables
        hideContextMenu();
        
        if (token) {
            deleteSelectedToken(token);
        }
        return;
    }

    // 3. Handle Drag to resize Mermaid diagrams
    const handle = e.target.closest('.resize-handle');
    if (!handle) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const token = handle.closest('.mermaid-token');
    if (!token) return;
    
    const startWidth = token.offsetWidth;
    const startX = e.clientX;
    const isLeft = handle.classList.contains('tl') || handle.classList.contains('bl');
    
    const onMouseMove = (moveEvent) => {
        const deltaX = moveEvent.clientX - startX;
        let newWidth = startWidth;
        if (isLeft) {
            newWidth = startWidth - deltaX;
        } else {
            newWidth = startWidth + deltaX;
        }
        // Limit minimum and maximum width
        newWidth = Math.max(80, Math.min(800, newWidth));
        token.style.width = newWidth + 'px';
    };
    
    const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        
        // Trigger save
        const visualEditor = token.closest('[data-visual-editor]');
        if (visualEditor) {
            const editorId = visualEditor.dataset.editorId;
            updateFieldFromEditor(editorId, markdownFromVisual(visualEditor));
        }
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
});

function renderMermaidSoon() {
    requestAnimationFrame(async () => {
        if (!window.mermaid) return;
        const tokens = document.querySelectorAll('.mermaid-token:not([data-rendered])');
        for (const token of tokens) {
            token.setAttribute('data-rendered', 'loading');
            const base64Code = token.dataset.mermaid;
            if (!base64Code) continue;
            try {
                const code = decodeURIComponent(escape(atob(base64Code)));
                const id = `mermaid_${uid('svg')}`;
                const tempDiv = document.createElement('div');
                tempDiv.style.position = 'absolute';
                tempDiv.style.left = '-9999px';
                tempDiv.style.top = '-9999px';
                document.body.appendChild(tempDiv);
                
                try {
                    const { svg } = await mermaid.render(id, code, tempDiv);
                    token.innerHTML = svg + `<div class="resize-handle tl"></div><div class="resize-handle tr"></div><div class="resize-handle bl"></div><div class="resize-handle br"></div>`;
                } finally {
                    tempDiv.remove();
                }
                token.setAttribute('data-rendered', 'true');
            } catch (err) {
                console.error("Error rendering mermaid token:", err);
                token.innerHTML = `<span class="mermaid-error">Unable to render diagram</span><div class="resize-handle tl"></div><div class="resize-handle tr"></div><div class="resize-handle bl"></div><div class="resize-handle br"></div>`;
                token.setAttribute('data-rendered', 'true');
            }
        }
    });
}

function initEquationModal() {
    const modal = document.getElementById('equationModal');
    if (!modal) return;

    if (window.mathVirtualKeyboard) {
        const updateKeyboardVisible = () => {
            modal.classList.toggle('keyboard-visible', !!window.mathVirtualKeyboard.visible);
        };
        window.mathVirtualKeyboard.addEventListener('visible-change', updateKeyboardVisible);
        window.mathVirtualKeyboard.addEventListener('geometrychange', updateKeyboardVisible);
    }
    const closeBtn = document.getElementById('closeEquationModalBtn');
    const cancelBtn = document.getElementById('cancelEquationBtn');
    const insertBtn = document.getElementById('insertEquationBtn');
    const searchInput = document.getElementById('equationSearchInput');
    const latexEditor = document.getElementById('equationLatexEditor');
    const categoryBtns = modal.querySelectorAll('.category-btn');
    const mermaidCodeEditor = document.getElementById('mermaidCodeEditor');
    const mermaidLivePreview = document.getElementById('mermaidLivePreview');

    const closeModal = () => {
        const container = document.getElementById('mathfieldContainer');
        if (container) {
            container.innerHTML = '';
        }
        activeMathfield = null;

        const editorId = activeInsertEquationEditorId;
        modal.hidden = true;
        activeInsertEquationEditorId = null;
        activeMermaidTokenElement = null;
        savedRange = null;
        savedSelectionStart = null;
        savedSelectionEnd = null;
        isEquationModalOpen = false;
        
        modal.classList.remove('keyboard-visible');
        if (window.mathVirtualKeyboard) {
            if (typeof window.mathVirtualKeyboard.hide === 'function') {
                window.mathVirtualKeyboard.hide();
            } else {
                window.mathVirtualKeyboard.visible = false;
            }
        }

        if (editorId) {
            const saved = editorSelections[editorId];
            if (saved && saved.element) {
                saved.element.focus();
            } else {
                const wrapper = document.querySelector(`[data-rich-editor][data-editor-id="${cssEscape(editorId)}"]`);
                if (wrapper) {
                    const visual = wrapper.querySelector('[data-visual-editor]');
                    if (visual && !wrapper.classList.contains('show-code')) {
                        visual.focus();
                    } else {
                        const code = wrapper.querySelector('[data-code-editor]');
                        code?.focus();
                    }
                }
            }
        }
    };
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    let mousedownTarget = null;
    modal.addEventListener('mousedown', e => {
        mousedownTarget = e.target;
    });

    modal.addEventListener('click', e => {
        const isContent = e.target.closest('.equation-modal-content');
        const isKeyboard = e.target.closest('.ML__keyboard') || e.target.closest('.ml-keyboard');
        if (e.target === modal && mousedownTarget === modal && !isContent && !isKeyboard) {
            closeModal();
        }
        mousedownTarget = null;
    });

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            equationActiveCategory = btn.dataset.category;
            toggleEditorViewForCategory(equationActiveCategory);
            renderEquationList();
            
            if (equationActiveCategory === 'Mermaid') {
                if (mermaidCodeEditor && mermaidLivePreview) {
                    if (!mermaidCodeEditor.value) {
                        mermaidCodeEditor.value = `pie title Pets owned by staff
    "Dogs" : 386
    "Cats" : 85`;
                    }
                    validateAndRenderMermaid(mermaidCodeEditor.value, mermaidLivePreview);
                }
            }
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            renderEquationList();
        });
    }

    if (latexEditor) {
        latexEditor.addEventListener('input', () => {
            renderEquationPreview(latexEditor.value);
            if (activeMathfield && activeMathfield.value !== latexEditor.value) {
                activeMathfield.value = latexEditor.value;
            }
        });
    }

    if (mermaidCodeEditor && mermaidLivePreview) {
        let renderTimeout;
        mermaidCodeEditor.addEventListener('input', () => {
            clearTimeout(renderTimeout);
            renderTimeout = setTimeout(() => {
                validateAndRenderMermaid(mermaidCodeEditor.value, mermaidLivePreview);
            }, 300);
        });
        
        const zoomIn = document.getElementById('mermaidZoomIn');
        if (zoomIn) {
            zoomIn.addEventListener('click', e => {
                e.stopPropagation();
                mermaidZoomScale = Math.min(3.0, mermaidZoomScale + 0.15);
                updateMermaidZoom();
            });
        }
        const zoomOut = document.getElementById('mermaidZoomOut');
        if (zoomOut) {
            zoomOut.addEventListener('click', e => {
                e.stopPropagation();
                mermaidZoomScale = Math.max(0.2, mermaidZoomScale - 0.15);
                updateMermaidZoom();
            });
        }
        const zoomReset = document.getElementById('mermaidZoomReset');
        if (zoomReset) {
            zoomReset.addEventListener('click', e => {
                e.stopPropagation();
                mermaidZoomScale = 1.0;
                updateMermaidZoom();
            });
        }
    }

    if (insertBtn) {
        insertBtn.addEventListener('click', async () => {
            if (equationActiveCategory === 'Mermaid') {
                if (!mermaidCodeEditor || !mermaidLivePreview) return;
                const code = mermaidCodeEditor.value.trim();
                if (!code) return;
                
                const isValid = await validateAndRenderMermaid(code, mermaidLivePreview);
                if (!isValid) return; // Block modal closing or insert if syntax is invalid
                
                const svgElement = mermaidLivePreview.querySelector('svg');
                if (!svgElement) return;
                
                let pngDataUrl = '';
                try {
                    const clonedSvg = svgElement.cloneNode(true);
                    clonedSvg.removeAttribute('style');
                    
                    let svgWidth = 800;
                    let svgHeight = 600;
                    const viewBoxStr = clonedSvg.getAttribute('viewBox');
                    if (viewBoxStr) {
                        const parts = viewBoxStr.trim().split(/\s+/);
                        if (parts.length === 4) {
                            const w = parseFloat(parts[2]);
                            const h = parseFloat(parts[3]);
                            if (!isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
                                svgWidth = w;
                                svgHeight = h;
                            }
                        }
                    }
                    
                    // Render at 4x resolution for super-crisp high-DPI print output
                    clonedSvg.setAttribute('width', svgWidth * 4);
                    clonedSvg.setAttribute('height', svgHeight * 4);
                    
                    const svgString = new XMLSerializer().serializeToString(clonedSvg);
                    pngDataUrl = await svgToPng(svgString);
                } catch (err) {
                    console.error("Error converting SVG to PNG:", err);
                    const base64Svg = btoa(unescape(encodeURIComponent(new XMLSerializer().serializeToString(svgElement))));
                    pngDataUrl = 'data:image/svg+xml;base64,' + base64Svg;
                }
                
                const base64Code = btoa(unescape(encodeURIComponent(code)));
                const editorId = activeInsertEquationEditorId;
                const saved = editorSelections[editorId];
                
                if (activeMermaidTokenElement) {
                    activeMermaidTokenElement.dataset.mermaid = base64Code;
                    activeMermaidTokenElement.dataset.png = pngDataUrl;
                    const img = activeMermaidTokenElement.querySelector('img');
                    if (img) img.src = pngDataUrl;
                    
                    const visualEditor = activeMermaidTokenElement.closest('[data-visual-editor]');
                    if (visualEditor) {
                        updateFieldFromEditor(editorId, markdownFromVisual(visualEditor));
                    }
                } else {
                    if (saved && saved.element) {
                        if (saved.isVisual) {
                            const html = mermaidHtml(base64Code, '', pngDataUrl);
                            insertHtmlIntoVisualEditor(saved.element, html, saved.range);
                            updateFieldFromEditor(editorId, markdownFromVisual(saved.element));
                        } else {
                            const tag = `[mermaid:${base64Code}:${pngDataUrl}]`;
                            insertAtCursor(saved.element, tag, true, saved.selectionStart, saved.selectionEnd);
                            saved.element.dispatchEvent(new Event('input', { bubbles: true }));
                        }
                    } else if (editorId) {
                        const wrapper = document.querySelector(`[data-rich-editor][data-editor-id="${cssEscape(editorId)}"]`);
                        if (wrapper) {
                            if (wrapper.classList.contains('show-code')) {
                                const codeTextArea = wrapper.querySelector('[data-code-editor]');
                                insertAtCursor(codeTextArea, `[mermaid:${base64Code}:${pngDataUrl}]`, true);
                                codeTextArea.dispatchEvent(new Event('input', { bubbles: true }));
                            } else {
                                const visual = wrapper.querySelector('[data-visual-editor]');
                                const html = mermaidHtml(base64Code, '', pngDataUrl);
                                insertHtmlIntoVisualEditor(visual, html);
                                updateFieldFromEditor(editorId, markdownFromVisual(visual));
                            }
                        }
                    }
                }
                closeModal();
                return;
            }

            const latex = latexEditor.value.trim();
            if (!latex) return;
            
            let formulaObj;
            const matched = FORMULA_LIBRARY.find(f => f.latex === latex);
            if (matched) {
                formulaObj = { id: matched.id, category: matched.category, name: matched.name, latex: matched.latex };
            } else {
                const shortName = latex.length > 25 ? latex.substring(0, 22) + '...' : latex;
                formulaObj = { id: 'custom_' + Date.now(), category: 'Custom', name: 'Custom: ' + shortName, latex: latex, isCustom: true };
            }
            
            equationRecent = equationRecent.filter(f => f.latex !== latex);
            equationRecent.unshift(formulaObj);
            if (equationRecent.length > 20) equationRecent.pop();
            saveEquationRecent();

            const editorId = activeInsertEquationEditorId;
            const saved = editorSelections[editorId];
            closeModal();

            if (saved && saved.element) {
                const latexText = latex;
                if (saved.isVisual) {
                    insertHtmlIntoVisualEditor(saved.element, mathHtml(latexText), saved.range);
                    updateFieldFromEditor(editorId, markdownFromVisual(saved.element));
                } else {
                    const markdownText = `\\(${latexText}\\)`;
                    insertAtCursor(saved.element, markdownText, true, saved.selectionStart, saved.selectionEnd);
                    saved.element.dispatchEvent(new Event('input', { bubbles: true }));
                }
            } else if (editorId) {
                const wrapper = document.querySelector(`[data-rich-editor][data-editor-id="${cssEscape(editorId)}"]`);
                if (wrapper) {
                    const markdown = `\\(${latex}\\)`;
                    if (wrapper.classList.contains('show-code')) {
                        const code = wrapper.querySelector('[data-code-editor]');
                        insertAtCursor(code, markdown, true);
                        code.dispatchEvent(new Event('input', { bubbles: true }));
                    } else {
                        const visual = wrapper.querySelector('[data-visual-editor]');
                        insertHtmlIntoVisualEditor(visual, mathHtml(latex));
                        updateFieldFromEditor(editorId, markdownFromVisual(visual));
                    }
                }
            }
        });
    }

    // Window resize event handler to make Mermaid Live Preview responsive
    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
        window.addEventListener('resize', () => {
            if (isEquationModalOpen && equationActiveCategory === 'Mermaid') {
                updateMermaidZoom();
            }
        });
    }
}

function insertHtmlIntoVisualEditor(editor, html, targetRange = null) {
    const template = document.createElement('template');
    template.innerHTML = html;
    const fragment = template.content;
    const selection = window.getSelection();
    
    let range = null;
    if (targetRange) {
        range = targetRange;
        if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
        }
    } else if (selection && selection.rangeCount > 0) {
        range = selection.getRangeAt(0);
    }
    
    if (range) {
        range.deleteContents();
        range.insertNode(fragment);
        const spacer = document.createTextNode(' ');
        range.insertNode(spacer);
        range.setStartAfter(spacer);
        range.setEndAfter(spacer);
        if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
        }
    } else {
        editor.append(fragment);
    }
    
    editor.focus();
}

function wrapCodeSelection(textarea, format, selStart = null, selEnd = null) {
    let marker = '*';
    if (format === 'bold') marker = '**';
    else if (format === 'italic') marker = '*';
    else if (format === 'code') marker = '`';
    
    const start = (selStart !== null && selStart !== undefined) ? selStart : (textarea.selectionStart || 0);
    const end = (selEnd !== null && selEnd !== undefined) ? selEnd : (textarea.selectionEnd || start);
    const selected = textarea.value.slice(start, end) || 'text';
    textarea.value = textarea.value.slice(0, start) + marker + selected + marker + textarea.value.slice(end);
    textarea.setSelectionRange(start + marker.length, start + marker.length + selected.length);
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.focus();
}

function toggleReusePanel() {
    const panel = document.getElementById('reusePanel');
    panel.hidden = !panel.hidden;
    if (!panel.hidden) {
        document.getElementById('reuseSearchInput').focus();
        renderReuseResults();
    }
}

function renderReuseResults() {
    const input = document.getElementById('reuseSearchInput');
    const results = document.getElementById('reuseResults');
    if (!input || !results) return;
    const query = input.value.trim().toLowerCase();
    const activePaper = getActivePaper();
    const matches = questionLibrary()
        .filter(item => item.paperId !== activePaper.id || item.sectionId !== state.activeSectionId)
        .filter(item => !query || plainText(item.question.text).toLowerCase().includes(query) || item.sectionName.toLowerCase().includes(query))
        .slice(0, 20);
    results.innerHTML = matches.length ? matches.map((item, index) => `
        <button class="reuse-item" data-reuse-index="${index}">
            <strong>${esc(plainText(item.question.text).slice(0, 90) || 'Untitled question')}</strong>
            <span>${esc(item.paperTitle)} / ${esc(item.sectionName)} · Answer ${LABELS[item.question.correctIndex] || 'A'}</span>
        </button>
    `).join('') : '<div class="reuse-empty">No matching saved questions.</div>';
    results.querySelectorAll('[data-reuse-index]').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = matches[Number(btn.dataset.reuseIndex)];
            reuseQuestion(item.question);
        });
    });
}

function reuseQuestion(question) {
    const section = getActiveSection();
    const copy = deepCopy(question);
    copy.id = uid('q');
    copy.options.forEach((option, index) => option.id = uid(`opt${index}`));
    section.questions.push(copy);
    render();
    toast('Question reused');
}

function questionLibrary() {
    return state.papers.flatMap(paper => paper.sections.flatMap(section =>
        section.questions.map(question => ({
            paperId: paper.id,
            paperTitle: paper.title,
            sectionId: section.id,
            sectionName: section.name,
            question,
        }))
    ));
}

function renderAutocomplete(editorId) {
    const wrapper = document.querySelector(`[data-rich-editor][data-editor-id="${cssEscape(editorId)}"]`);
    if (!wrapper || wrapper.dataset.field !== 'text') return;
    const list = wrapper.querySelector('[data-autocomplete-list]');
    const question = findQuestion(wrapper.dataset.qid);
    const value = question ? plainText(getQuestionField(question, wrapper.dataset.field)).trim().toLowerCase() : '';
    if (!value || value.length < 3) {
        hideAutocomplete(editorId);
        return;
    }
    const matches = questionLibrary()
        .filter(item => item.question.id !== wrapper.dataset.qid)
        .filter(item => plainText(item.question.text).toLowerCase().includes(value))
        .slice(0, 5);
    if (!matches.length) {
        hideAutocomplete(editorId);
        return;
    }
    list.hidden = false;
    list.innerHTML = matches.map((item, index) => `
        <button type="button" data-autocomplete-index="${index}">
            <strong>${esc(plainText(item.question.text).slice(0, 80))}</strong>
            <span>${esc(item.paperTitle)} / ${esc(item.sectionName)}</span>
        </button>
    `).join('');
    list.querySelectorAll('[data-autocomplete-index]').forEach(btn => {
        btn.addEventListener('mousedown', event => {
            event.preventDefault();
            const item = matches[Number(btn.dataset.autocompleteIndex)];
            applyQuestionSuggestion(wrapper.dataset.qid, item.question);
        });
    });
}

function hideAutocomplete(editorId) {
    const list = document.querySelector(`[data-autocomplete-list][data-editor-id="${cssEscape(editorId)}"]`);
    if (list) list.hidden = true;
}

function applyQuestionSuggestion(qid, suggestion) {
    const question = findQuestion(qid);
    if (!question) return;
    const copy = deepCopy(suggestion);
    question.text = copy.text;
    question.options = copy.options;
    question.correctIndex = copy.correctIndex;
    question.layout = copy.layout;
    render();
    toast('Question filled from saved paper');
}

function emptyQuestions() {
    return `
        <div class="empty-state">
            <strong>No questions yet</strong>
            <button class="btn success" id="bottomAddQuestionBtn" style="margin-top: 15px;">+ Add Question</button>
        </div>
    `;
}

function imageStrip(markdown, qid, field) {
    const images = extractImages(markdown);
    if (!images.length) return '';
    return `
        <div class="image-strip">
            ${images.map((img, index) => `
                <span class="image-chip">
                    <img src="${img.src}" alt="${esc(img.alt)}" />
                    <button data-remove-image data-qid="${qid}" data-field="${field}" data-index="${index}" title="Remove image">x</button>
                </span>
            `).join('')}
        </div>
    `;
}

function markdownToVisualHtml(markdown) {
    const source = String(markdown || '');
    if (!source) return '';
    
    let html = '';
    let currentLine = '';
    
    const tokenRe = /!\[([^\]]*)\]\((data:image\/[^)]+)\)|\\\(([\s\S]+?)\\\)|\[mermaid:([^:]+?)(?::([^:]+?))?(?::([\s\S]+?))?\]|\*\*([^*]+)\*\*|\*([^*]+)\*|\[table:([A-Za-z0-9+/=]+)\]|\n/g;
    let last = 0;
    let match;
    
    while ((match = tokenRe.exec(source))) {
        currentLine += esc(source.slice(last, match.index));
        
        if (match[2]) {
            currentLine += `<img class="editor-image" src="${match[2]}" alt="${esc(match[1] || 'image')}" data-src="${match[2]}" data-alt="${esc(match[1] || 'image')}" contenteditable="false">`;
        } else if (match[3]) {
            currentLine += mathHtml(match[3]);
        } else if (match[4]) {
            let code = match[4];
            let width = '';
            let height = '';
            let png = '';
            if (match[5]) {
                if (match[5].startsWith('data:')) {
                    png = match[5];
                } else {
                    const dims = match[5].split('_');
                    width = dims[0];
                    height = dims[1] || '';
                    png = match[6] || '';
                }
            }
            currentLine += mermaidHtml(code, width, png, height);
        } else if (match[7]) {
            currentLine += `<strong>${esc(match[7])}</strong>`;
        } else if (match[8]) {
            currentLine += `<em>${esc(match[8])}</em>`;
        } else if (match[9]) {
            try {
                const tableHtml = decodeURIComponent(escape(atob(match[9])));
                const parser = new DOMParser();
                const doc = parser.parseFromString(tableHtml, 'text/html');
                const tableEl = doc.querySelector('table');
                if (tableEl) {
                    tableEl.classList.add('editor-table');
                    if (!tableEl.style.tableLayout) tableEl.style.tableLayout = 'fixed';
                    currentLine += tableEl.outerHTML;
                } else {
                    currentLine += `[table:${esc(match[9])}]`;
                }
            } catch (err) {
                currentLine += `[table:${esc(match[9])}]`;
            }
        } else {
            // Newline matched
            if (currentLine === '') {
                html += '<div><br></div>';
            } else {
                html += `<div>${currentLine}</div>`;
            }
            currentLine = '';
        }
        last = tokenRe.lastIndex;
    }
    
    currentLine += esc(source.slice(last));
    if (currentLine !== '') {
        html += `<div>${currentLine}</div>`;
    } else if (last > 0) {
        html += '<div><br></div>';
    }
    
    return html;
}

function mathHtml(latex) {
    const safeLatex = esc(latex);
    let rendered = safeLatex;
    if (window.katex) {
        try {
            rendered = katex.renderToString(latex, { throwOnError: false });
        } catch (err) {
            rendered = safeLatex;
        }
    }
    return `<span class="math-token" data-latex="${safeLatex}" contenteditable="false">${rendered}</span>`;
}

function mermaidHtml(base64Code, width = '', pngDataUrl = '', height = '') {
    let style = '';
    if (width && height) {
        style = `style="width: ${width}px; height: ${height}px;"`;
    } else if (width) {
        style = `style="width: ${width}px;"`;
    }
    if (pngDataUrl) {
        return `<span class="mermaid-token" data-mermaid="${base64Code}" data-png="${pngDataUrl}" ${style} data-rendered="true" contenteditable="false"><img src="${pngDataUrl}" style="width: 100%; height: auto;" /><div class="delete-btn" title="Delete Diagram">🗑</div><div class="resize-handle tl"></div><div class="resize-handle tr"></div><div class="resize-handle bl"></div><div class="resize-handle br"></div></span>`;
    } else {
        return `<span class="mermaid-token" data-mermaid="${base64Code}" ${style} contenteditable="false"><span class="mermaid-loading">Rendering diagram...</span><div class="delete-btn" title="Delete Diagram">🗑</div><div class="resize-handle tl"></div><div class="resize-handle tr"></div><div class="resize-handle bl"></div><div class="resize-handle br"></div></span>`;
    }
}

function markdownFromVisual(root) {
    const children = Array.from(root.childNodes);
    const parts = [];
    for (let i = 0; i < children.length; i++) {
        const node = children[i];
        const md = nodeToMarkdown(node);
        const isBlock = node.nodeType === Node.ELEMENT_NODE && 
                        (node.matches('div, p, table') || node.classList.contains('table-token'));
        
        if (isBlock) {
            parts.push(md);
        } else {
            const prev = children[i - 1];
            const prevIsBlock = prev && prev.nodeType === Node.ELEMENT_NODE && 
                                (prev.matches('div, p, table') || prev.classList.contains('table-token'));
            if (parts.length > 0 && !prevIsBlock) {
                parts[parts.length - 1] += md;
            } else {
                parts.push(md);
            }
        }
    }
    return parts.join('\n').replace(/\u00a0/g, ' ');
}

function nodeToMarkdown(node) {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent || '';
    if (node.nodeType !== Node.ELEMENT_NODE) return '';
    const el = node;
    if (el.matches('br')) {
        const parent = el.parentNode;
        if (parent && parent.childNodes.length === 1 && parent.matches('div, p')) {
            return '';
        }
        return '\n';
    }
    if (el.matches('img.editor-image')) {
        return `![${el.dataset.alt || 'image'}](${el.dataset.src || el.src})`;
    }
    if (el.matches('.math-token')) {
        return `\\(${el.dataset.latex || el.textContent || ''}\\)`;
    }
    if (el.matches('.table-token')) {
        const tableEl = el.querySelector('table');
        if (tableEl) {
            const clone = tableEl.cloneNode(true);
            clone.classList.add('editor-table');
            clone.querySelectorAll('td, th').forEach(cell => {
                cell.removeAttribute('contenteditable');
                cell.style.cursor = '';
            });
            const liveHtml = clone.outerHTML;
            const base64Html = btoa(unescape(encodeURIComponent(liveHtml)));
            return `[table:${base64Html}]`;
        }
        return `[table:${el.dataset.table || ''}]`;
    }
    if (el.matches('table.editor-table')) {
        const clone = el.cloneNode(true);
        clone.classList.remove('tbl-focused');
        clone.querySelectorAll('td, th').forEach(cell => {
            cell.classList.remove('cell-selected', 'col-resizing');
            cell.removeAttribute('contenteditable');
            cell.style.cursor = '';
        });
        clone.querySelectorAll('tr').forEach(tr => {
            tr.classList.remove('row-resizing');
            tr.style.cursor = '';
        });
        const liveHtml = clone.outerHTML;
        const base64Html = btoa(unescape(encodeURIComponent(liveHtml)));
        return `[table:${base64Html}]`;
    }
    if (el.matches('.mermaid-token')) {
        const png = el.dataset.png || '';
        const code = el.dataset.mermaid || '';
        let widthVal = '';
        let heightVal = '';
        if (el.style.width) {
            widthVal = el.style.width.replace('px', '');
        }
        if (el.style.height) {
            heightVal = el.style.height.replace('px', '');
        }
        const dims = widthVal && heightVal ? `${widthVal}_${heightVal}` : widthVal;
        if (dims) {
            return png ? `[mermaid:${code}:${dims}:${png}]` : `[mermaid:${code}:${dims}]`;
        } else {
            return png ? `[mermaid:${code}:${png}]` : `[mermaid:${code}]`;
        }
    }
    const content = Array.from(el.childNodes).map(nodeToMarkdown).join('');
    if (el.matches('strong,b')) return `**${content}**`;
    if (el.matches('em,i')) return `*${content}*`;
    if (el.matches('div,p')) return content;
    return content;
}

function codeFromMarkdown(markdown) {
    let index = 0;
    return String(markdown || '').replace(/!\[([^\]]*)\]\((data:image\/[^)]+)\)/g, (_, alt) => {
        index += 1;
        return `![${alt || `image ${index}`}](image:${index})`;
    });
}

function markdownFromCode(code, imageMapJson) {
    let imageMap = [];
    try {
        imageMap = JSON.parse(imageMapJson || '[]');
    } catch (err) {
        imageMap = [];
    }
    return String(code || '').replace(/!\[([^\]]*)\]\(image:(\d+)\)/g, (full, alt, ref) => {
        const src = imageMap[Number(ref) - 1];
        return src ? `![${alt || 'image'}](${src})` : full;
    });
}

function renderTeacherPanel() {
    const paper = getActivePaper();
    if (!paper) {
        els.teacherPanel.innerHTML = '';
        return;
    }
    const questions = allQuestions(paper);
    const unanswered = questions.filter(q => !q.options.some(o => o.text.trim())).length;
    els.teacherPanel.innerHTML = `
        <div class="teacher-card">
            <h3>Paper Check</h3>
            <div class="stat-grid">
                <div class="stat"><b>${questions.length}</b><span>Questions</span></div>
                <div class="stat"><b>${paper.sections.length}</b><span>Sections</span></div>
                <div class="stat"><b>${totalMarks(paper)}</b><span>Marks</span></div>
                <div class="stat"><b>${unanswered}</b><span>Need options</span></div>
            </div>
        </div>
        <div class="teacher-card">
            <h3>Answer Key</h3>
            <div class="answer-key">
                ${questions.length ? questions.map((q, i) => `
                    <div class="answer-key-row"><span>${i + 1}</span><b>${LABELS[q.correctIndex] || 'A'}</b></div>
                `).join('') : '<span class="paste-hint">No questions yet.</span>'}
            </div>
        </div>
        <div class="teacher-card">
            <h3>Quick Flow</h3>
            <div class="answer-key">
                <span>1. Fill paper details.</span>
                <span>2. Add sections and questions.</span>
                <span>3. Select the correct answer.</span>
                <span>4. Choose option layout per question.</span>
                <span>5. Export Word or print.</span>
            </div>
        </div>
    `;
}

function renderPrintPaper() {
    const paper = getActivePaper();
    const container = document.getElementById('printPaperContainer');
    if (!container) return;
    if (!paper) {
        container.innerHTML = '';
        return;
    }

    const sectionsHtml = paper.sections.map(section => {
        if (!section.questions.length) return '';
        const questionsHtml = section.questions.map((question, index) => {
            const optionsHtml = question.options.map((option, optionIndex) => {
                return `
                    <div class="print-option">
                        <span class="print-option-label">${LABELS[optionIndex]}.</span>
                        <div class="print-option-text">${markdownToVisualHtml(option.text)}</div>
                    </div>
                `;
            }).join('');

            return `
                <div class="print-question-card">
                    <div class="print-question-header">
                        <span class="print-q-number">${index + 1}.</span>
                        <div class="print-q-text">${markdownToVisualHtml(question.text)}</div>
                    </div>
                    <div class="print-options-grid print-${question.layout || 'row'}">
                        ${optionsHtml}
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="print-section">
                <h3 class="print-section-title">${esc(section.name)}</h3>
                <div class="print-section-questions">
                    ${questionsHtml}
                </div>
            </div>
        `;
    }).join('');

    const hasLogo = !!paper.logo;
    const hasInst = !!(paper.meta.institutionName || paper.meta.institutionSubtitle);
    let printHeaderHtml = '';

    if (hasLogo || hasInst) {
        printHeaderHtml += `
            <div class="print-institution-row" style="display: flex; align-items: center; justify-content: center; gap: 20px; border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 16px;">
                ${hasLogo ? `<img src="${paper.logo}" style="width: ${paper.logoWidth || 120}px; height: ${paper.logoHeight || 120}px; object-fit: contain;" />` : ''}
                <div style="text-align: center;">
                    ${paper.meta.institutionName ? `<h1 style="font-size: 16pt; font-weight: 700; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">${esc(paper.meta.institutionName)}</h1>` : ''}
                    ${paper.meta.institutionSubtitle ? `<h2 style="font-size: 11pt; font-weight: 500; margin: 4px 0 0 0; color: #333;">${esc(paper.meta.institutionSubtitle)}</h2>` : ''}
                </div>
            </div>
        `;
    }

    container.innerHTML = `
        <div class="print-paper">
            ${printHeaderHtml}
            <div class="print-header" style="${(hasLogo || hasInst) ? 'border-top: none; padding-top: 0;' : ''}">
                <h1 class="print-paper-title">${esc(paper.title || 'Question Paper')}</h1>
                <div class="print-meta-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; border-bottom: 1px solid #000; border-top: 1px solid #000; padding: 8px 0; margin-bottom: 16px; font-size: 10pt; text-align: left;">
                    <div><strong>Class:</strong> ${esc(paper.meta.className || '')}</div>
                    <div><strong>Subject:</strong> ${esc(paper.meta.subject || '')}</div>
                    <div><strong>Test:</strong> ${esc(paper.meta.testName || '')}</div>
                    <div><strong>Time:</strong> ${esc(paper.meta.duration || '')}</div>
                    <div><strong>Max Marks:</strong> ${esc(paper.meta.marks || '')}</div>
                    <div><strong>Date:</strong> ${esc(paper.meta.date || '')}</div>
                </div>
                ${paper.meta.instructions ? `
                    <div class="print-instructions" style="text-align: left; margin-bottom: 16px;">
                        <strong>Instructions:</strong>
                        <div class="print-instructions-text">${esc(paper.meta.instructions)}</div>
                    </div>
                ` : ''}
            </div>
            <div class="print-body">
                ${sectionsHtml}
            </div>
        </div>
    `;
}

function updateMeta(key, value) {
    const paper = getActivePaper();
    if (!paper) return;
    if (key === 'title') paper.title = value || 'Untitled Paper';
    else paper.meta[key] = value;
    renderPaperList();
    renderTeacherPanel();
    renderPrintPaper();
    save();
}

function createPaper() {
    const paper = {
        id: uid('paper'),
        title: `Question Paper ${state.papers.length + 1}`,
        layout: 'row',
        logo: '',
        logoWidth: 120,
        logoHeight: 120,
        meta: {
            className: '',
            subject: '',
            testName: '',
            duration: '',
            marks: '',
            instructions: '',
            institutionName: '',
            institutionSubtitle: '',
            date: '',
        },
        sections: [{ id: uid('section'), name: 'Section 1', layout: 'row', questions: [] }],
        tags: [],
    };
    state.papers.push(paper);
    state.activePaperId = paper.id;
    state.activeSectionId = paper.sections[0].id;
    render();
    toast('New paper created');
}

function addSection() {
    if (typeof document === 'undefined' || !document.getElementById) return;
    const paper = getActivePaper();
    const modal = document.getElementById('sectionModal');
    const nameInput = document.getElementById('newSectionName');
    const countInput = document.getElementById('newSectionQuestionsCount');
    const validation = document.getElementById('sectionValidationMessage');
    
    if (!modal || !nameInput || !countInput) return;
    
    nameInput.value = `Section ${paper.sections.length + 1}`;
    countInput.value = '5';
    if (validation) {
        validation.textContent = '';
        validation.hidden = true;
    }
    
    modal.removeAttribute('hidden');
    nameInput.focus();
    nameInput.select();
}

function initSectionModal() {
    if (typeof document === 'undefined' || !document.getElementById) return;
    const modal = document.getElementById('sectionModal');
    const closeBtn = document.getElementById('closeSectionModalBtn');
    const cancelBtn = document.getElementById('cancelSectionModalBtn');
    const confirmBtn = document.getElementById('confirmSectionModalBtn');
    const nameInput = document.getElementById('newSectionName');
    const countInput = document.getElementById('newSectionQuestionsCount');
    const validation = document.getElementById('sectionValidationMessage');
    
    if (!modal || !closeBtn || !cancelBtn || !confirmBtn) return;
    
    const hideModal = () => {
        modal.setAttribute('hidden', 'true');
    };
    
    closeBtn.addEventListener('click', hideModal);
    cancelBtn.addEventListener('click', hideModal);
    
    confirmBtn.addEventListener('click', () => {
        const name = nameInput.value.trim();
        const countVal = countInput.value.trim();
        const count = parseInt(countVal, 10);
        
        if (!name) {
            if (validation) {
                validation.textContent = 'Please enter a section name.';
                validation.hidden = false;
            }
            nameInput.focus();
            return;
        }
        
        if (isNaN(count) || count <= 0 || !/^\d+$/.test(countVal)) {
            if (validation) {
                validation.textContent = 'Please enter a valid number of questions.';
                validation.hidden = false;
            }
            countInput.focus();
            return;
        }
        
        if (validation) {
            validation.hidden = true;
        }
        
        const paper = getActivePaper();
        const section = { 
            id: uid('section'), 
            name: name, 
            layout: paper.layout || 'row',
            questions: [] 
        };
        
        for (let i = 0; i < count; i++) {
            const q = newQuestion('', ['', '', '', ''], 0);
            q.layout = section.layout;
            section.questions.push(q);
        }
        
        paper.sections.push(section);
        state.activeSectionId = section.id;
        hideModal();
        render();
        save();
        
        setTimeout(() => {
            const cards = document.querySelectorAll('.question-card');
            if (cards.length > 0) {
                const first = cards[0];
                first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                first?.querySelector('[data-visual-editor]')?.focus();
            }
        }, 80);
    });
    
    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            confirmBtn.click();
        }
    };
    nameInput.addEventListener('keydown', handleEnter);
    countInput.addEventListener('keydown', handleEnter);
}

function openAddQuestionsModal() {
    if (typeof document === 'undefined' || !document.getElementById) return;
    const section = getActiveSection();
    if (!section) return;
    
    const modal = document.getElementById('addQuestionsModal');
    const titleEl = document.getElementById('addQuestionsModalTitle');
    const nameInput = document.getElementById('editSectionNameInput');
    const labelEl = document.getElementById('currentQuestionsCountLabel');
    const countInput = document.getElementById('additionalQuestionsCount');
    const validation = document.getElementById('addQuestionsValidationMessage');
    
    if (!modal || !titleEl || !labelEl || !countInput) return;
    
    titleEl.textContent = `Edit Section & Add Questions`;
    if (nameInput) {
        nameInput.value = section.name;
    }
    labelEl.textContent = `Current Questions: ${section.questions.length}`;
    countInput.value = '5';
    if (validation) {
        validation.textContent = '';
        validation.hidden = true;
    }
    
    modal.removeAttribute('hidden');
    if (nameInput) {
        nameInput.focus();
        nameInput.select();
    }
}

function initAddQuestionsModal() {
    if (typeof document === 'undefined' || !document.getElementById) return;
    const modal = document.getElementById('addQuestionsModal');
    const closeBtn = document.getElementById('closeAddQuestionsModalBtn');
    const cancelBtn = document.getElementById('cancelAddQuestionsModalBtn');
    const confirmBtn = document.getElementById('confirmAddQuestionsModalBtn');
    const nameInput = document.getElementById('editSectionNameInput');
    const countInput = document.getElementById('additionalQuestionsCount');
    const validation = document.getElementById('addQuestionsValidationMessage');
    
    if (!modal || !closeBtn || !cancelBtn || !confirmBtn) return;
    
    const hideModal = () => {
        modal.setAttribute('hidden', 'true');
    };
    
    closeBtn.addEventListener('click', hideModal);
    cancelBtn.addEventListener('click', hideModal);
    
    confirmBtn.addEventListener('click', () => {
        const nameVal = nameInput ? nameInput.value.trim() : '';
        if (!nameVal) {
            if (validation) {
                validation.textContent = 'Section name cannot be empty.';
                validation.hidden = false;
            }
            nameInput.focus();
            return;
        }
        if (nameVal.length > 50) {
            if (validation) {
                validation.textContent = 'Section name cannot exceed 50 characters.';
                validation.hidden = false;
            }
            nameInput.focus();
            return;
        }
        if (!/^[a-zA-Z0-9\s.,!?'"()#&@\/\\:-]+$/.test(nameVal)) {
            if (validation) {
                validation.textContent = 'Section name contains invalid characters.';
                validation.hidden = false;
            }
            nameInput.focus();
            return;
        }

        const countVal = countInput.value.trim();
        const count = countVal === '' ? 0 : parseInt(countVal, 10);
        
        if (isNaN(count) || count < 0 || (countVal !== '' && !/^\d+$/.test(countVal))) {
            if (validation) {
                validation.textContent = 'Please enter a valid number of questions (0 or more).';
                validation.hidden = false;
            }
            countInput.focus();
            return;
        }
        
        if (validation) {
            validation.hidden = true;
        }
        
        const section = getActiveSection();
        if (section) {
            section.name = nameVal;
            const startQuestionsIndex = section.questions.length;
            if (count > 0) {
                for (let i = 0; i < count; i++) {
                    const q = newQuestion('', ['', '', '', ''], 0);
                    q.layout = section.layout;
                    section.questions.push(q);
                }
            }
            hideModal();
            render();
            save();
            
            if (count > 0) {
                setTimeout(() => {
                    const cards = document.querySelectorAll('.question-card');
                    if (cards.length > startQuestionsIndex) {
                        const firstNew = cards[startQuestionsIndex];
                        firstNew?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        firstNew?.querySelector('[data-visual-editor]')?.focus();
                    }
                }, 80);
            }
        }
    });
    
    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            confirmBtn.click();
        }
    };
    if (nameInput) nameInput.addEventListener('keydown', handleEnter);
    if (countInput) countInput.addEventListener('keydown', handleEnter);
}

function initDeletePaperModal() {
    if (typeof document === 'undefined' || !document.getElementById) return;
    const modal = document.getElementById('deletePaperModal');
    const closeBtn = document.getElementById('closeDeletePaperModalBtn');
    const cancelBtn = document.getElementById('cancelDeletePaperModalBtn');
    const confirmBtn = document.getElementById('confirmDeletePaperModalBtn');
    
    if (!modal || !closeBtn || !cancelBtn || !confirmBtn) return;
    
    const hideModal = () => {
        modal.setAttribute('hidden', 'true');
        state.pendingDeletePaperId = null;
    };
    
    closeBtn.addEventListener('click', hideModal);
    cancelBtn.addEventListener('click', hideModal);
    
    confirmBtn.addEventListener('click', () => {
        const paperId = state.pendingDeletePaperId;
        if (paperId) {
            const wasActive = state.activePaperId === paperId;
            state.papers = state.papers.filter(p => p.id !== paperId);
            
            if (wasActive) {
                state.activePaperId = state.papers[0]?.id || null;
                const activePaper = getActivePaper();
                state.activeSectionId = activePaper?.sections[0]?.id || null;
            }
            
            hideModal();
            render();
            toast('Question paper deleted');
        }
    });

    document.addEventListener('click', () => {
        const dropdowns = document.querySelectorAll('.paper-dropdown-menu');
        dropdowns.forEach(menu => menu.setAttribute('hidden', 'true'));
    });
}

function initWordExportModal() {
    if (typeof document === 'undefined' || !document.getElementById) return;
    const modal = document.getElementById('wordExportModal');
    const closeBtn = document.getElementById('closeWordExportModalBtn');
    const cancelBtn = document.getElementById('cancelWordExportModalBtn');
    const confirmBtn = document.getElementById('confirmWordExportModalBtn');
    
    if (!modal || !closeBtn || !cancelBtn || !confirmBtn) return;
    
    const hideModal = () => {
        modal.setAttribute('hidden', 'true');
    };
    
    closeBtn.addEventListener('click', hideModal);
    cancelBtn.addEventListener('click', hideModal);
    
    confirmBtn.addEventListener('click', async () => {
        const activePaper = getActivePaper();
        if (!activePaper) {
            hideModal();
            return;
        }
        
        const selectedOption = document.querySelector('input[name="wordExportOption"]:checked')?.value || 'paperOnly';
        state.lastWordExportOption = selectedOption;
        save();
        
        toast('Generating Word document...');
        hideModal();
        
        const paper = deepCopy(activePaper);
        await compileAllMermaidDiagramsInPaper(paper);
        
        if (selectedOption === 'paperAndAnswers') {
            paper.includeAnswerKey = true;
        }
        
        const blob = buildDocxBlob(paper);
        downloadBlob(blob, `${fileName(paper.title)}.docx`);
        toast('DOCX exported');
    });
}

function initLogoContextMenu() {
    if (typeof document === 'undefined' || !document.getElementById) return;
    
    const menu = document.getElementById('logoContextMenu');
    if (!menu) return;
    
    document.getElementById('logoContextReplace')?.addEventListener('click', (e) => {
        e.stopPropagation();
        hideLogoContextMenu();
        document.getElementById('logoFileInput')?.click();
    });
    
    document.getElementById('logoContextResize')?.addEventListener('click', (e) => {
        e.stopPropagation();
        hideLogoContextMenu();
        const logoContainer = document.getElementById('logoSetupContainer');
        if (logoContainer && logoContainer.querySelector('img')) {
            logoContainer.classList.add('selected');
            toast('Drag handles to resize logo');
        }
    });
    
    document.getElementById('logoContextDelete')?.addEventListener('click', (e) => {
        e.stopPropagation();
        hideLogoContextMenu();
        const paper = getActivePaper();
        if (paper) {
            paper.logo = '';
            save();
            render();
            toast('Logo deleted');
        }
    });
}

function showLogoContextMenu(x, y) {
    const menu = document.getElementById('logoContextMenu');
    if (!menu) return;
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
    menu.style.display = 'flex';
    menu.removeAttribute('hidden');
}

function hideLogoContextMenu() {
    const menu = document.getElementById('logoContextMenu');
    if (!menu) return;
    menu.setAttribute('hidden', 'true');
    menu.style.display = 'none';
}

async function pasteLogoFromClipboard() {
    try {
        const items = await navigator.clipboard.read();
        for (const item of items) {
            const imageType = item.types.find(type => type.startsWith('image/'));
            if (imageType) {
                const blob = await item.getType(imageType);
                const reader = new FileReader();
                reader.onload = () => {
                    const paper = getActivePaper();
                    if (paper) {
                        paper.logo = reader.result;
                        save();
                        render();
                        toast('Logo pasted from clipboard');
                    }
                };
                reader.readAsDataURL(blob);
                return;
            }
        }
        toast('Clipboard does not contain an image');
    } catch (err) {
        console.error("Failed to read clipboard:", err);
        toast('Clipboard does not contain an image');
    }
}

let activeAdvancedEditorId = null;
// Single persistent editor instance – created once, never destroyed between open/close cycles.
let activeTuiEditorInstance = null;
let tuiEditorReady = false; // true once the instance has been successfully created

function loadToastUI() {
    return new Promise((resolve, reject) => {
        if (window.toastui) {
            // Scripts already loaded – resolve immediately
            resolve();
            return;
        }

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://uicdn.toast.com/editor/latest/toastui-editor.min.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js';
        script.onload = () => {
            if (window.toastui) {
                console.log('[AdvancedEditor] Toast UI scripts loaded successfully.');
                resolve();
            } else {
                reject(new Error('Toast UI loaded but window.toastui is undefined'));
            }
        };
        script.onerror = () => reject(new Error('Toast UI script failed to fetch from CDN'));
        document.body.appendChild(script);
    });
}

/**
 * Creates the single persistent Toast UI Editor instance inside #tuiEditorContainer.
 * Must be called ONCE after loadToastUI() resolves.
 * Subsequent open/close cycles reuse this instance.
 */
function createTuiEditorInstance() {
    const container = document.getElementById('tuiEditorContainer');
    if (!container) {
        console.error('[AdvancedEditor] #tuiEditorContainer not found in DOM.');
        return;
    }
    if (activeTuiEditorInstance) {
        console.log('[AdvancedEditor] Editor instance already exists – skipping creation.');
        return;
    }

    try {
        console.log('[AdvancedEditor] Creating persistent editor instance…');
        activeTuiEditorInstance = new window.toastui.Editor({
            el: container,
            height: '100%',
            initialEditType: 'wysiwyg',
            previewStyle: 'vertical',
            toolbarItems: [
                ['heading', 'bold', 'italic'],
                ['ul', 'ol'],
                ['table'],
                ['code', 'codeblock']
            ]
        });
        tuiEditorReady = true;
        console.log('[AdvancedEditor] Editor instance created successfully.');
    } catch (err) {
        console.error('[AdvancedEditor] Initialization error:', err);
        activeTuiEditorInstance = null;
        tuiEditorReady = false;
    }
}

function openAdvancedEditorModal(editorId) {
    console.log('[AdvancedEditor] Modal opened. editorId =', editorId);
    hideContextMenu();
    activeAdvancedEditorId = editorId || lastActiveEditorKey;

    // ✅ Suppress blur → render() cycle while the modal is open.
    // The visual editor's blur handler checks this flag; without it, opening
    // the modal shifts focus away → blur fires → render() runs → the entire
    // workbench DOM is rebuilt → savedRange points to destroyed nodes →
    // table is inserted at the wrong position or not at all.
    isEquationModalOpen = true;

    const targetKey = activeAdvancedEditorId;
    const saved = editorSelections[targetKey];
    if (saved) {
        savedRange = saved.isVisual ? saved.range : null;
        savedSelectionStart = !saved.isVisual ? saved.selectionStart : null;
        savedSelectionEnd = !saved.isVisual ? saved.selectionEnd : null;
    } else {
        savedRange = null;
        savedSelectionStart = null;
        savedSelectionEnd = null;
    }

    const modal = document.getElementById('advancedEditorModal');
    if (!modal) return;

    const validation = document.getElementById('advancedEditorValidationMessage');
    if (validation) {
        validation.textContent = '';
        validation.hidden = true;
    }

    if (tuiEditorReady && activeTuiEditorInstance) {
        // ✅ Fast path: editor already alive – just reset content and show modal
        console.log('[AdvancedEditor] Reusing existing editor instance.');
        try {
            activeTuiEditorInstance.setMarkdown('', false);
        } catch (e) {
            console.warn('[AdvancedEditor] setMarkdown failed on reuse:', e);
        }
        // Dismiss any stale toast
        if (els.toast && els.toast.classList.contains('show')) {
            els.toast.classList.remove('show');
            els.toast.style.pointerEvents = 'none';
        }
        modal.removeAttribute('hidden');
        return;
    }

    // First-time path: scripts not yet loaded, or instance creation failed previously
    toast('Loading Advanced Editor…');

    loadToastUI().then(() => {
        createTuiEditorInstance();

        if (!tuiEditorReady) {
            toast('Failed to load Advanced Editor. Please check your internet connection.');
            return;
        }

        // Dismiss loading toast
        if (els.toast && els.toast.textContent.includes('Loading')) {
            els.toast.classList.remove('show');
            els.toast.style.pointerEvents = 'none';
        }

        modal.removeAttribute('hidden');
        console.log('[AdvancedEditor] Modal visible.');
    }).catch(err => {
        console.error('[AdvancedEditor] Initialization error:', err);
        toast('Failed to load Advanced Editor. Please check your internet connection.');
    });
}

function closeAdvancedEditorModal() {
    console.log('[AdvancedEditor] Modal closed.');
    const modal = document.getElementById('advancedEditorModal');
    if (modal) {
        modal.setAttribute('hidden', 'true');
    }
    // NOTE: Do NOT destroy the editor instance here.
    // The persistent instance is kept alive so reopening is instantaneous and reliable.

    // Re-enable the blur → render() cycle now that the modal is gone.
    isEquationModalOpen = false;

    const editorId = activeAdvancedEditorId;
    if (editorId) {
        const saved = editorSelections[editorId];
        if (saved && saved.element) {
            saved.element.focus();
        } else {
            const wrapper = document.querySelector(`[data-rich-editor][data-editor-id="${cssEscape(editorId)}"]`);
            if (wrapper) {
                const visual = wrapper.querySelector('[data-visual-editor]');
                if (visual && !wrapper.classList.contains('show-code')) {
                    visual.focus();
                } else {
                    const code = wrapper.querySelector('[data-code-editor]');
                    code?.focus();
                }
            }
        }
    }

    activeAdvancedEditorId = null;
    savedRange = null;
    savedSelectionStart = null;
    savedSelectionEnd = null;
}

// Destroy the persistent editor only when the whole page is unloaded
window.addEventListener('beforeunload', () => {
    if (activeTuiEditorInstance) {
        console.log('[AdvancedEditor] Page unloading – destroying editor instance.');
        try { activeTuiEditorInstance.destroy(); } catch (e) { /* ignore */ }
        activeTuiEditorInstance = null;
        tuiEditorReady = false;
    }
});

function initAdvancedEditorModal() {
    if (typeof document === 'undefined' || !document.getElementById) return;
    const modal = document.getElementById('advancedEditorModal');
    const closeBtn = document.getElementById('closeAdvancedEditorModalBtn');
    const cancelBtn = document.getElementById('cancelAdvancedEditorModalBtn');
    const confirmBtn = document.getElementById('confirmAdvancedEditorModalBtn');

    if (!modal || !closeBtn || !cancelBtn || !confirmBtn) return;

    // Eagerly load Toast UI scripts in the background so the first open is instant.
    // The editor instance itself is created inside openAdvancedEditorModal on first call.
    loadToastUI()
        .then(() => {
            console.log('[AdvancedEditor] Toast UI pre-loaded in background.');
            // Create the persistent instance now so the first open is instant.
            createTuiEditorInstance();
        })
        .catch(err => {
            // Non-fatal: the editor will retry when the user actually clicks Table.
            console.warn('[AdvancedEditor] Background pre-load failed (likely offline):', err.message);
        });
    
    closeBtn.addEventListener('click', closeAdvancedEditorModal);
    cancelBtn.addEventListener('click', closeAdvancedEditorModal);
    
    let mousedownTarget = null;
    modal.addEventListener('mousedown', e => {
        mousedownTarget = e.target;
    });
    modal.addEventListener('click', e => {
        const isContent = e.target.closest('.equation-modal-content');
        if (e.target === modal && mousedownTarget === modal && !isContent) {
            closeAdvancedEditorModal();
        }
        mousedownTarget = null;
    });
    
    confirmBtn.addEventListener('click', () => {
        if (!activeTuiEditorInstance) {
            closeAdvancedEditorModal();
            return;
        }

        const markdown = activeTuiEditorInstance.getMarkdown().trim();
        const html = activeTuiEditorInstance.getHTML().trim();

        if (!markdown) {
            closeAdvancedEditorModal();
            return;
        }

        const editorId = activeAdvancedEditorId;

        // Build the table HTML with cells explicitly editable
        const parser = new DOMParser();
        const parsedDoc = parser.parseFromString(html, 'text/html');
        const tableEl = parsedDoc.querySelector('table');
        if (tableEl) {
            tableEl.querySelectorAll('td, th').forEach(cell => {
                cell.setAttribute('contenteditable', 'true');
            });
        }
        const editableHtml = parsedDoc.body.innerHTML;
        const base64Html = btoa(unescape(encodeURIComponent(editableHtml)));
        const token = `[table:${base64Html}]`;

        // ✅ Use savedRange / savedElement captured at modal-open time
        // so cursor position is preserved even after focus moves to Toast UI.
        const visualEditorEl = editorSelections[editorId]?.element ||
            document.querySelector(`[data-rich-editor][data-editor-id="${cssEscape(editorId)}"] [data-visual-editor]`);
        const isVisualMode = !document.querySelector(
            `[data-rich-editor][data-editor-id="${cssEscape(editorId)}"].show-code`
        );

        if (savedRange && visualEditorEl && isVisualMode) {
            // ✅ Preferred path: insert native editor-table at the exact saved cursor position.
            // No contenteditable="false" wrapper — the table lives directly in the editor.
            const parser = new DOMParser();
            const parsedDoc = parser.parseFromString(html, 'text/html');
            const tableEl = parsedDoc.querySelector('table');
            if (tableEl) {
                tableEl.classList.add('editor-table');
                tableEl.style.tableLayout = 'fixed';
                tableEl.querySelectorAll('td, th').forEach(cell => {
                    cell.removeAttribute('contenteditable');
                });
                insertHtmlIntoVisualEditor(visualEditorEl, tableEl.outerHTML, savedRange);
                updateFieldFromEditor(editorId, markdownFromVisual(visualEditorEl));
                // Focus first cell and show resize overlay immediately
                setTimeout(() => {
                    const inserted = visualEditorEl.querySelector('table.editor-table');
                    if (inserted) {
                        ensureColgroup(inserted);
                        showTableOverlay(inserted);
                        inserted.querySelector('td, th')?.focus();
                    }
                }, 20);
            }
        } else if (savedSelectionStart !== null) {
            // Code-editor / textarea path
            const wrapper = document.querySelector(`[data-rich-editor][data-editor-id="${cssEscape(editorId)}"]`);
            const code = wrapper?.querySelector('[data-code-editor]');
            if (code) {
                insertAtCursor(code, token, true, savedSelectionStart, savedSelectionEnd);
                code.dispatchEvent(new Event('input', { bubbles: true }));
            }
        } else if (visualEditorEl && isVisualMode) {
            // Fallback: append at end
            const parser = new DOMParser();
            const parsedDoc = parser.parseFromString(html, 'text/html');
            const tableEl = parsedDoc.querySelector('table');
            if (tableEl) {
                tableEl.classList.add('editor-table');
                tableEl.style.tableLayout = 'fixed';
                tableEl.querySelectorAll('td, th').forEach(cell => cell.removeAttribute('contenteditable'));
                insertHtmlIntoVisualEditor(visualEditorEl, tableEl.outerHTML, null);
                updateFieldFromEditor(editorId, markdownFromVisual(visualEditorEl));
            }
        } else {
            // Last resort: token in code editor
            const wrapper = document.querySelector(`[data-rich-editor][data-editor-id="${cssEscape(editorId)}"]`);
            const code = wrapper?.querySelector('[data-code-editor]');
            if (code) {
                insertAtCursor(code, token, true, code.selectionStart, code.selectionEnd);
                code.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }

        closeAdvancedEditorModal();
        // Re-render the workbench so the inserted table is visible and
        // the card reflects the updated question data.
        render();
    });
}

let activeTableCell = null;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NATIVE TABLE RESIZE ENGINE
// Column resize: drag the right edge pseudo-element (::aft// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INTERACTIVE TABLE RESIZE ENGINE
// Handles: column drag, row drag, whole-table corner/edge drag
// All widths/heights are stored directly on col[style] and tr[style] so they
// survive serialization to [table:base64] and restore perfectly on reload.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const TBL_COL_MIN = 40;   // px minimum column width
const TBL_ROW_MIN = 30;   // px minimum row height
const TBL_COL_ZONE = 8;   // px hit-zone at right edge of cell for col-resize
const TBL_ROW_ZONE = 8;   // px hit-zone at bottom edge of row for row-resize

// Active drag state
let _drag = null;
/*
  _drag = {
    type: 'col' | 'row' | 'table',
    // col:
    cell, colIndex, startX, startW, tableEl, colEls,
    // row:
    rowEl, startY, startH,
    // table:
    tableEl, handle, startX, startY, startW, startH, origColWidths
  }
*/

// UI elements (resolved once)
let _colGuide   = null;
let _rowGuide   = null;
let _tblOverlay = null;
let _overlayTarget = null; // the table currently tracked by overlay

function _getResizeEls() {
    _colGuide   = _colGuide   || document.getElementById('tblColGuide');
    _rowGuide   = _rowGuide   || document.getElementById('tblRowGuide');
    _tblOverlay = _tblOverlay || document.getElementById('tblResizeOverlay');
}

// ── COLGROUP management ───────────────────────────────────────────────────────
// Ensures every editor-table has a <colgroup> with one <col> per column.
// Called after insert, after add/delete column, and on first focus.
function ensureColgroup(table) {
    if (!table) return;
    const cols = table.rows[0] ? table.rows[0].cells.length : 0;
    if (!cols) return;

    let cg = table.querySelector(':scope > colgroup');
    if (!cg) {
        cg = document.createElement('colgroup');
        table.insertBefore(cg, table.firstChild);
    }

    // Sync count
    while (cg.children.length < cols) {
        const col = document.createElement('col');
        cg.appendChild(col);
    }
    while (cg.children.length > cols) {
        cg.removeChild(cg.lastChild);
    }

    // If col elements have no width set, distribute evenly from actual cell widths
    const colEls = Array.from(cg.children);
    const hasWidths = colEls.some(c => c.style.width);
    if (!hasWidths) {
        // Read current widths from the first row's cells
        const firstRow = table.rows[0];
        colEls.forEach((col, i) => {
            const cell = firstRow?.cells[i];
            if (cell) {
                col.style.width = cell.offsetWidth + 'px';
            }
        });
    }
}

// Read column widths from colgroup
function getColWidths(table) {
    const cg = table.querySelector(':scope > colgroup');
    if (!cg) return [];
    return Array.from(cg.children).map(c => parseFloat(c.style.width) || 0);
}

// Write column widths to colgroup
function setColWidths(table, widths) {
    const cg = table.querySelector(':scope > colgroup');
    if (!cg) return;
    Array.from(cg.children).forEach((col, i) => {
        if (widths[i] != null) col.style.width = widths[i] + 'px';
    });
}

// ── Overlay management ────────────────────────────────────────────────────────
function showTableOverlay(table) {
    _getResizeEls();
    if (!_tblOverlay || !table) return;
    _overlayTarget = table;
    _updateTableOverlay();
    _tblOverlay.style.display = 'block';
}

function hideTableOverlay() {
    _getResizeEls();
    if (_tblOverlay) _tblOverlay.style.display = 'none';
    _overlayTarget = null;
}

function _updateTableOverlay() {
    if (!_tblOverlay || !_overlayTarget || !document.contains(_overlayTarget)) {
        hideTableOverlay();
        return;
    }
    const r = _overlayTarget.getBoundingClientRect();
    _tblOverlay.style.left   = r.left   + 'px';
    _tblOverlay.style.top    = r.top    + 'px';
    _tblOverlay.style.width  = r.width  + 'px';
    _tblOverlay.style.height = r.height + 'px';
}

// Keep overlay in sync when page scrolls/resizes
(function() {
    function track() {
        if (_overlayTarget) requestAnimationFrame(_updateTableOverlay);
    }
    window.addEventListener('scroll', track, { passive: true, capture: true });
    window.addEventListener('resize', track, { passive: true });
})();

// ── Guide line helpers ────────────────────────────────────────────────────────
function _showColGuide(x) {
    _getResizeEls();
    if (!_colGuide) return;
    _colGuide.style.left   = x + 'px';
    _colGuide.style.top    = '0';
    _colGuide.style.height = '100vh';
    _colGuide.style.display = 'block';
}
function _hideColGuide() {
    _getResizeEls();
    if (_colGuide) _colGuide.style.display = 'none';
}
function _showRowGuide(y) {
    _getResizeEls();
    if (!_rowGuide) return;
    _rowGuide.style.top   = y + 'px';
    _rowGuide.style.left  = '0';
    _rowGuide.style.width = '100vw';
    _rowGuide.style.display = 'block';
}
function _hideRowGuide() {
    _getResizeEls();
    if (_rowGuide) _rowGuide.style.display = 'none';
}

// ── Hit-zone detection ────────────────────────────────────────────────────────
function _isColResizeZone(cell, clientX) {
    const r = cell.getBoundingClientRect();
    return clientX >= r.right - TBL_COL_ZONE && clientX <= r.right + 4;
}
function _isRowResizeZone(tr, clientY) {
    const r = tr.getBoundingClientRect();
    return clientY >= r.bottom - TBL_ROW_ZONE && clientY <= r.bottom + 4;
}

// ── mousemove: cursor hints + live resize ─────────────────────────────────────
document.addEventListener('mousemove', e => {
    if (_drag) {
        e.preventDefault();
        _onDragMove(e);
        return;
    }
    // Cursor hints (no button pressed)
    if (e.buttons) return;
    const cell = e.target.closest && e.target.closest('td, th');
    if (cell && cell.closest('table.editor-table')) {
        if (_isColResizeZone(cell, e.clientX)) {
            cell.style.cursor = 'col-resize';
        } else {
            cell.style.cursor = '';
        }
    }
    const tr = e.target.closest && e.target.closest('tr');
    if (tr && tr.closest('table.editor-table')) {
        if (_isRowResizeZone(tr, e.clientY)) {
            tr.style.cursor = 'row-resize';
        } else {
            tr.style.cursor = '';
        }
    }
});

function _onDragMove(e) {
    if (_drag.type === 'col') {
        const dx   = e.clientX - _drag.startX;
        const newW = Math.max(TBL_COL_MIN, _drag.startW + dx);
        // Apply to colgroup col element for reliable fixed layout
        if (_drag.colEls[_drag.colIndex]) {
            _drag.colEls[_drag.colIndex].style.width = newW + 'px';
        }
        // Also apply to the dragged cell directly for instant visual feedback
        _drag.cell.style.width = newW + 'px';
        // Move guide line
        const r = _drag.cell.getBoundingClientRect();
        _showColGuide(r.right);
        // Highlight
        _drag.cell.classList.add('col-resizing');
        // Update overlay
        if (_overlayTarget) _updateTableOverlay();
    } else if (_drag.type === 'row') {
        const dy   = e.clientY - _drag.startY;
        const newH = Math.max(TBL_ROW_MIN, _drag.startH + dy);
        _drag.rowEl.style.height = newH + 'px';
        // Fix each cell height so content doesn't collapse the row
        Array.from(_drag.rowEl.cells).forEach(c => { c.style.height = newH + 'px'; });
        const r = _drag.rowEl.getBoundingClientRect();
        _showRowGuide(r.bottom);
        _drag.rowEl.classList.add('row-resizing');
        if (_overlayTarget) _updateTableOverlay();
    } else if (_drag.type === 'table') {
        _onTableDragMove(e);
    }
}

function _onTableDragMove(e) {
    const handle = _drag.handle;
    const table  = _drag.tableEl;
    const editorDiv = table.closest('[data-visual-editor]');
    const editorRect = editorDiv ? editorDiv.getBoundingClientRect() : null;
    const maxW = editorRect ? editorRect.width - 4 : 2000;

    let newW = _drag.startW;
    let newH = _drag.startH;

    if (handle === 'right') {
        newW = Math.max(TBL_COL_MIN * 2, Math.min(maxW, _drag.startW + (e.clientX - _drag.startX)));
    } else if (handle === 'bottom') {
        newH = Math.max(TBL_ROW_MIN * (_drag.tableEl.rows.length || 1),
                        _drag.startH + (e.clientY - _drag.startY));
    } else if (handle === 'br') {
        newW = Math.max(TBL_COL_MIN * 2, Math.min(maxW, _drag.startW + (e.clientX - _drag.startX)));
        newH = Math.max(TBL_ROW_MIN,     _drag.startH + (e.clientY - _drag.startY));
    } else if (handle === 'bl') {
        newW = Math.max(TBL_COL_MIN * 2, Math.min(maxW, _drag.startW - (e.clientX - _drag.startX)));
        newH = Math.max(TBL_ROW_MIN,     _drag.startH + (e.clientY - _drag.startY));
    } else if (handle === 'tr') {
        newW = Math.max(TBL_COL_MIN * 2, Math.min(maxW, _drag.startW + (e.clientX - _drag.startX)));
    } else if (handle === 'tl') {
        newW = Math.max(TBL_COL_MIN * 2, Math.min(maxW, _drag.startW - (e.clientX - _drag.startX)));
    }

    // Set table width
    table.style.width = newW + 'px';

    // Scale all columns proportionally
    if (_drag.origColWidths.length > 0) {
        const ratio = newW / _drag.startW;
        const newWidths = _drag.origColWidths.map(w => Math.max(TBL_COL_MIN, Math.round(w * ratio)));
        setColWidths(table, newWidths);
    }

    // If height changed, distribute equally across rows
    if (newH !== _drag.startH && table.rows.length > 0) {
        const rowH = Math.floor(newH / table.rows.length);
        Array.from(table.rows).forEach(tr => {
            tr.style.height = rowH + 'px';
            Array.from(tr.cells).forEach(c => { c.style.height = rowH + 'px'; });
        });
    }

    _updateTableOverlay();
}

// ── mousedown: start drag ─────────────────────────────────────────────────────
document.addEventListener('mousedown', e => {
    // Handle drag: corner or edge of table overlay
    const handle = e.target.dataset && e.target.dataset.handle;
    if (handle && _overlayTarget) {
        e.preventDefault();
        e.stopPropagation();
        ensureColgroup(_overlayTarget);
        _drag = {
            type: 'table',
            tableEl: _overlayTarget,
            handle,
            startX: e.clientX,
            startY: e.clientY,
            startW: _overlayTarget.offsetWidth,
            startH: _overlayTarget.offsetHeight,
            origColWidths: getColWidths(_overlayTarget),
        };
        return;
    }

    // Column resize: right-edge zone of a cell
    const cell = e.target.closest && e.target.closest('td, th');
    if (cell && cell.closest('table.editor-table')) {
        if (_isColResizeZone(cell, e.clientX)) {
            e.preventDefault();
            e.stopPropagation();
            const table = cell.closest('table');
            ensureColgroup(table);
            const colEls    = Array.from(table.querySelector('colgroup')?.children || []);
            const colIndex  = cell.cellIndex;
            _drag = {
                type: 'col',
                cell,
                colIndex,
                startX: e.clientX,
                startW: cell.offsetWidth,
                tableEl: table,
                colEls,
            };
            return;
        }
    }

    // Row resize: bottom-edge zone of a row
    const tr = e.target.closest && e.target.closest('tr');
    if (tr && tr.closest('table.editor-table')) {
        if (_isRowResizeZone(tr, e.clientY)) {
            e.preventDefault();
            e.stopPropagation();
            _drag = {
                type: 'row',
                rowEl: tr,
                startY: e.clientY,
                startH: tr.offsetHeight,
            };
            return;
        }
    }
}, true);

// ── mouseup: commit and save ──────────────────────────────────────────────────
document.addEventListener('mouseup', () => {
    if (!_drag) return;
    _hideColGuide();
    _hideRowGuide();

    if (_drag.type === 'col') {
        _drag.cell.classList.remove('col-resizing');
        syncTableToState(_drag.tableEl);
    } else if (_drag.type === 'row') {
        _drag.rowEl.classList.remove('row-resizing');
        const tbl = _drag.rowEl.closest('table.editor-table');
        if (tbl) syncTableToState(tbl);
    } else if (_drag.type === 'table') {
        syncTableToState(_drag.tableEl);
    }

    _drag = null;
    _updateTableOverlay();
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RIGHT-CLICK context menu on editor-table cells
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

document.addEventListener('contextmenu', e => {
    const cell = e.target.closest && e.target.closest('td, th');
    if (!cell || !cell.closest('table.editor-table')) return;
    e.preventDefault();
    activeTableCell = cell;
    showTableContextMenu(e.clientX, e.clientY);
}, true);

document.addEventListener('click', e => {
    if (!e.target.closest('#tableContextMenu')) hideTableContextMenu();
    if (!e.target.closest('#tableFloatingToolbar') && !e.target.closest('table.editor-table')
        && !e.target.closest('#tblResizeOverlay')) {
        hideTableFloatingToolbar();
    }
    // Focused table styling + overlay
    const tbl = e.target.closest && e.target.closest('table.editor-table');
    document.querySelectorAll('table.editor-table').forEach(t => t.classList.remove('tbl-focused'));
    if (tbl) {
        tbl.classList.add('tbl-focused');
        ensureColgroup(tbl);
        showTableOverlay(tbl);
    } else if (!e.target.closest('#tblResizeOverlay')) {
        hideTableOverlay();
    }
});

document.addEventListener('keydown', e => {
    const cell = e.target.closest && e.target.closest('td, th');
    if (!cell || !cell.closest('table.editor-table')) return;
    activeTableCell = cell;
    // Tab / Shift+Tab navigation between cells
    if (e.key === 'Tab') {
        e.preventDefault();
        const tbl = cell.closest('table');
        const cells = Array.from(tbl.querySelectorAll('td, th'));
        const idx = cells.indexOf(cell);
        const next = e.shiftKey ? cells[idx - 1] : cells[idx + 1];
        if (next) {
            next.focus();
        } else if (!e.shiftKey) {
            // Tab on last cell → add a new row
            tableInsertRowBelow();
            const newCells = Array.from(tbl.querySelectorAll('td, th'));
            newCells[idx + 1]?.focus();
        }
    }
}, true);

function showTableContextMenu(x, y) {
    const menu = document.getElementById('tableContextMenu');
    if (!menu) return;
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
    menu.style.display = 'flex';
    menu.removeAttribute('hidden');
}

function hideTableContextMenu() {
    const menu = document.getElementById('tableContextMenu');
    if (!menu) return;
    menu.setAttribute('hidden', 'true');
    menu.style.display = 'none';
}

// syncTableToState: serializes a live native editor-table back to state.
// Called after any structural change (resize, add/delete row/col, merge, split).
function syncTableToState(table) {
    if (!table || !document.contains(table)) return;
    const visualEditor = table.closest('[data-visual-editor]');
    const editorId = visualEditor?.closest('[data-rich-editor]')?.dataset.editorId;
    if (visualEditor && editorId) {
        updateFieldFromEditor(editorId, markdownFromVisual(visualEditor));
    }
}

// Legacy alias kept for any remaining callers
function saveAndSyncTable(table) { syncTableToState(table); }

function tableInsertRowAbove() {
    if (!activeTableCell) return;
    const tr = activeTableCell.closest('tr');
    const table = tr?.closest('table');
    if (!tr || !table) return;
    const newTr = document.createElement('tr');
    const cellCount = tr.cells.length;
    for (let i = 0; i < cellCount; i++) {
        const newCell = document.createElement(tr.cells[i].tagName.toLowerCase());
        newCell.innerHTML = '\u00a0'; // non-breaking space placeholder
        newTr.appendChild(newCell);
    }
    tr.parentNode.insertBefore(newTr, tr);
    syncTableToState(table);
}

function tableInsertRowBelow() {
    if (!activeTableCell) return;
    const tr = activeTableCell.closest('tr');
    const table = tr?.closest('table');
    if (!tr || !table) return;
    const newTr = document.createElement('tr');
    const cellCount = tr.cells.length;
    for (let i = 0; i < cellCount; i++) {
        const newCell = document.createElement('td');
        newCell.innerHTML = '\u00a0';
        newTr.appendChild(newCell);
    }
    tr.parentNode.insertBefore(newTr, tr.nextSibling);
    newTr.cells[0]?.focus();
    syncTableToState(table);
}

function tableInsertColLeft() {
    if (!activeTableCell) return;
    const cellIndex = activeTableCell.cellIndex;
    const table = activeTableCell.closest('table');
    if (!table) return;
    Array.from(table.rows).forEach(row => {
        const newCell = document.createElement(row.cells[cellIndex]?.tagName.toLowerCase() || 'td');
        newCell.innerHTML = '\u00a0';
        row.insertBefore(newCell, row.cells[cellIndex]);
    });
    syncTableToState(table);
}

function tableInsertColRight() {
    if (!activeTableCell) return;
    const cellIndex = activeTableCell.cellIndex;
    const table = activeTableCell.closest('table');
    if (!table) return;
    Array.from(table.rows).forEach(row => {
        const newCell = document.createElement('td');
        newCell.innerHTML = '\u00a0';
        row.insertBefore(newCell, row.cells[cellIndex] ? row.cells[cellIndex].nextSibling : null);
    });
    syncTableToState(table);
}

function tableDeleteRow() {
    if (!activeTableCell) return;
    const tr = activeTableCell.closest('tr');
    const table = tr?.closest('table');
    if (!tr || !table) return;
    const sibling = tr.nextElementSibling || tr.previousElementSibling;
    tr.remove();
    if (sibling) sibling.cells[0]?.focus();
    syncTableToState(table);
}

function tableDeleteCol() {
    if (!activeTableCell) return;
    const cellIndex = activeTableCell.cellIndex;
    const table = activeTableCell.closest('table');
    if (!table) return;
    Array.from(table.rows).forEach(row => {
        if (row.cells[cellIndex]) row.cells[cellIndex].remove();
    });
    syncTableToState(table);
}

function tableDeleteTable() {
    if (!activeTableCell) return;
    // Support both native editor-table and legacy .table-token wrappers
    const table = activeTableCell.closest('table.editor-table');
    const token = activeTableCell.closest('.table-token');
    const visualEditor = activeTableCell.closest('[data-visual-editor]');
    const editorId = visualEditor?.closest('[data-rich-editor]')?.dataset.editorId;
    if (table) {
        table.remove();
    } else if (token) {
        token.remove();
    }
    if (visualEditor && editorId) {
        updateFieldFromEditor(editorId, markdownFromVisual(visualEditor));
    }
    hideTableFloatingToolbar();
    activeTableCell = null;
}

function tableMergeCells() {
    if (!activeTableCell) return;
    const cols = parseInt(prompt('Merge how many columns? (colspan)', activeTableCell.colSpan || 1), 10);
    const rows = parseInt(prompt('Merge how many rows? (rowspan)', activeTableCell.rowSpan || 1), 10);
    if (!isNaN(cols) && cols > 0) activeTableCell.colSpan = cols;
    if (!isNaN(rows) && rows > 0) activeTableCell.rowSpan = rows;
    syncTableToState(activeTableCell.closest('table'));
}

function tableSplitCells() {
    if (!activeTableCell) return;
    activeTableCell.colSpan = 1;
    activeTableCell.rowSpan = 1;
    syncTableToState(activeTableCell.closest('table'));
}

function tableEqualCols() {
    if (!activeTableCell) return;
    const table = activeTableCell.closest('table.editor-table');
    if (!table) return;
    const cols = table.rows[0]?.cells.length || 0;
    if (!cols) return;
    ensureColgroup(table);
    const totalW = table.offsetWidth || 600;
    const colW   = Math.floor(totalW / cols);
    const colEls = Array.from(table.querySelector('colgroup')?.children || []);
    colEls.forEach(col => { col.style.width = colW + 'px'; });
    table.style.tableLayout = 'fixed';
    _updateTableOverlay();
    syncTableToState(table);
}

// tableAutoFit: three layout modes
function tableAutoFit(mode) {
    if (!activeTableCell) return;
    const table = activeTableCell.closest('table.editor-table');
    if (!table) return;
    ensureColgroup(table);
    const colEls = Array.from(table.querySelector('colgroup')?.children || []);

    if (mode === 'window') {
        // Full editor width, equal columns
        const editorW = table.closest('[data-visual-editor]')?.offsetWidth || 600;
        table.style.width = '100%';
        const colW = Math.floor(editorW / (colEls.length || 1));
        colEls.forEach(col => { col.style.width = colW + 'px'; });
        table.style.tableLayout = 'fixed';

    } else if (mode === 'content') {
        // Let browser size to content
        table.style.width = '';
        table.style.tableLayout = 'auto';
        colEls.forEach(col => { col.style.width = ''; });
        // Reread widths after auto layout
        requestAnimationFrame(() => {
            const firstRow = table.rows[0];
            if (firstRow) {
                colEls.forEach((col, i) => {
                    col.style.width = (firstRow.cells[i]?.offsetWidth || 80) + 'px';
                });
                table.style.tableLayout = 'fixed';
            }
            _updateTableOverlay();
            syncTableToState(table);
        });
        return;

    } else if (mode === 'equal') {
        tableEqualCols();
        return;

    } else if (mode === 'fixed') {
        // Keep current widths but lock to fixed layout
        if (!colEls.some(c => c.style.width)) {
            const firstRow = table.rows[0];
            if (firstRow) {
                colEls.forEach((col, i) => {
                    col.style.width = (firstRow.cells[i]?.offsetWidth || 80) + 'px';
                });
            }
        }
        table.style.tableLayout = 'fixed';

    } else if (mode === 'equalRowHeight') {
        if (!table.rows.length) return;
        const totalH = table.offsetHeight;
        const rowH   = Math.floor(totalH / table.rows.length);
        Array.from(table.rows).forEach(tr => {
            tr.style.height = rowH + 'px';
            Array.from(tr.cells).forEach(c => { c.style.height = rowH + 'px'; });
        });
    }

    _updateTableOverlay();
    syncTableToState(table);
}

function initTableContextMenu() {
    if (typeof document === 'undefined' || !document.getElementById) return;

    document.getElementById('tableContextInsertRowAbove')?.addEventListener('click', (e) => {
        e.stopPropagation();
        hideTableContextMenu();
        tableInsertRowAbove();
    });
    document.getElementById('tableContextInsertRowBelow')?.addEventListener('click', (e) => {
        e.stopPropagation();
        hideTableContextMenu();
        tableInsertRowBelow();
    });
    document.getElementById('tableContextInsertColLeft')?.addEventListener('click', (e) => {
        e.stopPropagation();
        hideTableContextMenu();
        tableInsertColLeft();
    });
    document.getElementById('tableContextInsertColRight')?.addEventListener('click', (e) => {
        e.stopPropagation();
        hideTableContextMenu();
        tableInsertColRight();
    });
    document.getElementById('tableContextDeleteRow')?.addEventListener('click', (e) => {
        e.stopPropagation();
        hideTableContextMenu();
        tableDeleteRow();
    });
    document.getElementById('tableContextDeleteCol')?.addEventListener('click', (e) => {
        e.stopPropagation();
        hideTableContextMenu();
        tableDeleteCol();
    });
    document.getElementById('tableContextDeleteTable')?.addEventListener('click', (e) => {
        e.stopPropagation();
        hideTableContextMenu();
        tableDeleteTable();
    });
    document.getElementById('tableContextMerge')?.addEventListener('click', (e) => {
        e.stopPropagation();
        hideTableContextMenu();
        tableMergeCells();
    });
    document.getElementById('tableContextSplit')?.addEventListener('click', (e) => {
        e.stopPropagation();
        hideTableContextMenu();
        tableSplitCells();
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FLOATING TABLE TOOLBAR
// Appears above the active editor-table whenever the cursor is inside a cell.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

let _toolbarTargetTable = null;

function showTableFloatingToolbar(table) {
    const toolbar = document.getElementById('tableFloatingToolbar');
    if (!toolbar || !table) return;
    _toolbarTargetTable = table;
    toolbar.removeAttribute('hidden');
    positionTableFloatingToolbar(table, toolbar);
}

function hideTableFloatingToolbar() {
    const toolbar = document.getElementById('tableFloatingToolbar');
    if (toolbar) toolbar.setAttribute('hidden', 'true');
    _toolbarTargetTable = null;
}

function positionTableFloatingToolbar(table, toolbar) {
    if (!table || !toolbar) return;
    const rect = table.getBoundingClientRect();
    const tbH = toolbar.offsetHeight || 40;
    const GAP = 6;
    let top = rect.top - tbH - GAP;
    // If not enough room above, show below instead
    if (top < 8) top = rect.bottom + GAP;
    // Center horizontally over table, clamped to viewport
    let left = rect.left + (rect.width / 2) - (toolbar.offsetWidth / 2);
    left = Math.max(8, Math.min(left, window.innerWidth - toolbar.offsetWidth - 8));
    toolbar.style.top  = top  + 'px';
    toolbar.style.left = left + 'px';
}

function initTableFloatingToolbar() {
    if (typeof document === 'undefined' || !document.getElementById) return;
    const toolbar = document.getElementById('tableFloatingToolbar');
    if (!toolbar) return;

    // Wire all toolbar buttons
    const wire = (id, fn) => {
        document.getElementById(id)?.addEventListener('mousedown', e => {
            e.preventDefault(); // prevent losing focus / selection
            e.stopPropagation();
        });
        document.getElementById(id)?.addEventListener('click', e => {
            e.stopPropagation();
            fn();
            // Re-position after DOM change
            if (_toolbarTargetTable && document.contains(_toolbarTargetTable)) {
                positionTableFloatingToolbar(_toolbarTargetTable, toolbar);
            } else {
                hideTableFloatingToolbar();
            }
        });
    };

    wire('tblToolRowAbove',    tableInsertRowAbove);
    wire('tblToolRowBelow',    tableInsertRowBelow);
    wire('tblToolDelRow',      tableDeleteRow);
    wire('tblToolColLeft',     tableInsertColLeft);
    wire('tblToolColRight',    tableInsertColRight);
    wire('tblToolDelCol',      tableDeleteCol);
    wire('tblToolMerge',       tableMergeCells);
    wire('tblToolSplit',       tableSplitCells);
    wire('tblToolDeleteTable', tableDeleteTable);

    // Layout dropdown toggle
    const propsBtn  = document.getElementById('tblToolProps');
    const propsMenu = document.getElementById('tblToolPropsMenu');
    if (propsBtn && propsMenu) {
        propsBtn.addEventListener('mousedown', e => { e.preventDefault(); e.stopPropagation(); });
        propsBtn.addEventListener('click', e => {
            e.stopPropagation();
            const hidden = propsMenu.hasAttribute('hidden');
            if (hidden) propsMenu.removeAttribute('hidden');
            else        propsMenu.setAttribute('hidden', 'true');
        });
        propsMenu.querySelectorAll('[data-autofit]').forEach(item => {
            item.addEventListener('mousedown', e => { e.preventDefault(); e.stopPropagation(); });
            item.addEventListener('click', e => {
                e.stopPropagation();
                propsMenu.setAttribute('hidden', 'true');
                tableAutoFit(item.dataset.autofit);
                if (_toolbarTargetTable && document.contains(_toolbarTargetTable)) {
                    positionTableFloatingToolbar(_toolbarTargetTable, toolbar);
                }
            });
        });
        // Close dropdown when clicking outside
        document.addEventListener('click', e => {
            if (!e.target.closest('#tblToolPropsWrap')) {
                propsMenu.setAttribute('hidden', 'true');
            }
        });
    }

    // Show toolbar when cursor enters any editor-table cell
    document.addEventListener('focusin', e => {
        const cell = e.target.closest && e.target.closest('td, th');
        const table = cell?.closest('table.editor-table');
        if (table) {
            activeTableCell = cell;
            showTableFloatingToolbar(table);
            ensureColgroup(table);
            showTableOverlay(table);
        } else if (!e.target.closest('#tableFloatingToolbar') && !e.target.closest('#tblResizeOverlay')) {
            hideTableFloatingToolbar();
        }
    });

    // Re-position when scrolling or resizing so toolbar tracks the table
    window.addEventListener('scroll', () => {
        if (_toolbarTargetTable && document.contains(_toolbarTargetTable)) {
            positionTableFloatingToolbar(_toolbarTargetTable, toolbar);
        }
    }, { passive: true });
    window.addEventListener('resize', () => {
        if (_toolbarTargetTable && document.contains(_toolbarTargetTable)) {
            positionTableFloatingToolbar(_toolbarTargetTable, toolbar);
        }
    }, { passive: true });
}

function duplicateSection() {
    const paper = getActivePaper();
    const section = getActiveSection();
    const copy = deepCopy(section);
    copy.id = uid('section');
    copy.name = `${section.name} Copy`;
    copy.questions.forEach(q => {
        q.id = uid('q');
        q.options.forEach((o, i) => o.id = uid(`opt${i}`));
    });
    paper.sections.push(copy);
    state.activeSectionId = copy.id;
    render();
}

function deleteSection() {
    const paper = getActivePaper();
    if (paper.sections.length === 1) {
        toast('Keep at least one section');
        return;
    }
    if (!confirm('Delete this section and all questions?')) return;
    paper.sections = paper.sections.filter(s => s.id !== state.activeSectionId);
    state.activeSectionId = paper.sections[0].id;
    render();
}

function addQuestion(sectionId) {
    const section = getActivePaper().sections.find(s => s.id === sectionId);
    const q = newQuestion('', ['', '', '', ''], 0);
    q.layout = section.layout || 'row';
    section.questions.push(q);
    render();
    setTimeout(() => {
        const cards = document.querySelectorAll('.question-card');
        const last = cards[cards.length - 1];
        last?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        last?.querySelector('[data-visual-editor]')?.focus();
    }, 40);
}

function duplicateQuestion(qid) {
    const section = getActiveSection();
    const index = section.questions.findIndex(q => q.id === qid);
    const copy = deepCopy(section.questions[index]);
    copy.id = uid('q');
    copy.options.forEach((o, i) => o.id = uid(`opt${i}`));
    section.questions.splice(index + 1, 0, copy);
    render();
}

function deleteQuestion(qid) {
    if (!confirm('Delete this question?')) return;
    const section = getActiveSection();
    section.questions = section.questions.filter(q => q.id !== qid);
    render();
}

function moveQuestion(qid, delta) {
    const section = getActiveSection();
    const index = section.questions.findIndex(q => q.id === qid);
    const next = index + delta;
    if (next < 0 || next >= section.questions.length) return;
    const [question] = section.questions.splice(index, 1);
    section.questions.splice(next, 0, question);
    render();
}

function findQuestion(qid) {
    for (const section of getActivePaper().sections) {
        const question = section.questions.find(q => q.id === qid);
        if (question) return question;
    }
    return null;
}

function handlePaste(event) {
    if (state.isHoveringLogoArea) {
        const item = [...(event.clipboardData?.items || [])].find(entry => entry.type.startsWith('image/'));
        if (item) {
            event.preventDefault();
            const file = item.getAsFile();
            const reader = new FileReader();
            reader.onload = () => {
                const paper = getActivePaper();
                if (paper) {
                    paper.logo = reader.result;
                    save();
                    render();
                    toast('Logo pasted');
                }
            };
            reader.readAsDataURL(file);
        } else {
            toast('Clipboard does not contain an image');
        }
        return;
    }
    const target = event.target;
    const codeEditor = target instanceof HTMLTextAreaElement ? target.closest('[data-code-editor]') : null;
    const visualEditor = target instanceof HTMLElement ? target.closest('[data-visual-editor]') : null;
    if (!codeEditor && !visualEditor) return;
    const item = [...(event.clipboardData?.items || [])].find(entry => entry.type.startsWith('image/'));
    if (!item) return;
    event.preventDefault();
    const reader = new FileReader();
    reader.onload = () => {
        if (codeEditor) {
            const imageMap = JSON.parse(codeEditor.dataset.imageMap || '[]');
            imageMap.push(reader.result);
            codeEditor.dataset.imageMap = JSON.stringify(imageMap);
            insertAtCursor(codeEditor, `![pasted image](image:${imageMap.length})`);
            codeEditor.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
            insertImageIntoVisualEditor(visualEditor, reader.result);
            updateFieldFromEditor(visualEditor.dataset.editorId, markdownFromVisual(visualEditor));
        }
        toast('Image inserted');
    };
    reader.readAsDataURL(item.getAsFile());
}

function insertImageIntoVisualEditor(editor, src) {
    editor.focus();
    const img = document.createElement('img');
    img.className = 'editor-image';
    img.src = src;
    img.alt = 'pasted image';
    img.dataset.src = src;
    img.dataset.alt = 'pasted image';
    img.contentEditable = 'false';
    const selection = window.getSelection();
    if (selection && selection.rangeCount) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(img);
        const spacer = document.createTextNode(' ');
        img.after(spacer);
        range.setStartAfter(spacer);
        range.setEndAfter(spacer);
        selection.removeAllRanges();
        selection.addRange(range);
    } else {
        editor.append(img);
    }
}

function insertAtCursor(textarea, text, noNewlines = false, selStart = null, selEnd = null) {
    const start = (selStart !== null && selStart !== undefined) ? selStart : (textarea.selectionStart ?? textarea.value.length);
    const end = (selEnd !== null && selEnd !== undefined) ? selEnd : (textarea.selectionEnd ?? start);
    const before = textarea.value.slice(0, start);
    const after = textarea.value.slice(end);
    const lead = noNewlines ? '' : (before && !before.endsWith('\n') ? '\n' : '');
    const trail = noNewlines ? '' : (after && !after.startsWith('\n') ? '\n' : '');
    const insert = `${lead}${text}${trail}`;
    textarea.value = before + insert + after;
    const pos = before.length + insert.length;
    textarea.setSelectionRange(pos, pos);
    autoResize(textarea);
}

function extractImages(markdown) {
    const images = [];
    const re = /!\[([^\]]*)\]\((data:image\/[^)]+)\)/g;
    let match;
    while ((match = re.exec(markdown || ''))) {
        images.push({ alt: match[1] || 'image', src: match[2] });
    }
    return images;
}

function removeMarkdownImage(value, imageIndex) {
    let index = -1;
    return String(value || '').replace(/!\[[^\]]*\]\(data:image\/[^)]+\)/g, match => {
        index += 1;
        return index === imageIndex ? '' : match;
    }).replace(/\n{3,}/g, '\n\n').trim();
}

function removeImageFromQuestionField(question, field, imageIndex) {
    if (field === 'text') {
        question.text = removeMarkdownImage(question.text, imageIndex);
        return;
    }
    const optionMatch = field.match(/^options\.(\d+)\.text$/);
    if (optionMatch) {
        const option = question.options[Number(optionMatch[1])];
        if (option) option.text = removeMarkdownImage(option.text, imageIndex);
    }
}

function allQuestions(paper) {
    return paper.sections.flatMap(section => section.questions);
}

function countQuestions(paper) {
    return allQuestions(paper).length;
}

function totalMarks(paper) {
    return allQuestions(paper).reduce((sum, q) => sum + (Number(q.marks) || 1), 0);
}

function plainText(markdown) {
    return String(markdown || '')
        .replace(/!\[[^\]]*\]\(data:image\/[^)]+\)/g, '[image]')
        .replace(/\\\((.*?)\\\)/g, '$1')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/\s+/g, ' ')
        .trim();
}

function exportBackup() {
    downloadBlob(
        new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' }),
        `mcq-paper-backup-${Date.now()}.json`
    );
}

function exportQuestionsCsv() {
    const paper = getActivePaper();
    if (!paper) return;
    const rows = [['section', 'question', 'option1', 'option2', 'option3', 'option4', 'correct_option']];
    paper.sections.forEach(section => {
        section.questions.forEach(question => {
            rows.push([
                section.name,
                plainText(question.text),
                plainText(question.options[0]?.text || ''),
                plainText(question.options[1]?.text || ''),
                plainText(question.options[2]?.text || ''),
                plainText(question.options[3]?.text || ''),
                LABELS[question.correctIndex] || 'A',
            ]);
        });
    });
    downloadBlob(new Blob([toCsv(rows)], { type: 'text/csv;charset=utf-8' }), `${fileName(paper.title)}_questions.csv`);
    toast('Questions CSV exported');
}

function exportAnswerKeyCsv() {
    const paper = getActivePaper();
    if (!paper) return;
    const rows = [['section', 'question_number', 'correct_option']];
    let number = 0;
    paper.sections.forEach(section => {
        section.questions.forEach(question => {
            number += 1;
            rows.push([section.name, number, LABELS[question.correctIndex] || 'A']);
        });
    });
    downloadBlob(new Blob([toCsv(rows)], { type: 'text/csv;charset=utf-8' }), `${fileName(paper.title)}_answer_key.csv`);
    toast('Answer key CSV exported');
}

function toCsv(rows) {
    return rows.map(row => row.map(value => `"${String(value ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
}

function importBackup(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        try {
            const imported = JSON.parse(reader.result);
            state = Array.isArray(imported) ? { papers: imported, activePaperId: imported[0]?.id, activeSectionId: imported[0]?.sections?.[0]?.id } : imported;
            normalize();
            render();
            toast('Imported');
        } catch (err) {
            toast('Import failed');
        } finally {
            els.fileInput.value = '';
        }
    };
    reader.readAsText(file);
}

async function compileAllMermaidDiagramsInPaper(paper) {
    const compileTag = async (match, code, p5, p6) => {
        let png = '';
        let width = '';
        let height = '';
        if (p5) {
            if (p5.startsWith('data:')) {
                png = p5;
            } else {
                const dims = p5.split('_');
                width = dims[0];
                height = dims[1] || '';
                png = p6 || '';
            }
        }
        
        if (!png) {
            try {
                const decodedCode = decodeURIComponent(escape(atob(code)));
                
                // Render to SVG
                const id = `mermaid_docx_${uid('svg')}`;
                const tempDiv = document.createElement('div');
                tempDiv.style.position = 'absolute';
                tempDiv.style.left = '-9999px';
                tempDiv.style.top = '-9999px';
                tempDiv.style.width = '1200px'; // Prevent layout and font size collapse during offscreen rendering
                document.body.appendChild(tempDiv);
                
                try {
                    const { svg } = await mermaid.render(id, decodedCode, tempDiv);
                    
                    // Convert SVG to PNG
                    const tempContainer = document.createElement('div');
                    tempContainer.innerHTML = svg;
                    const svgEl = tempContainer.querySelector('svg');
                    let pngDataUrl = '';
                    if (svgEl) {
                        svgEl.removeAttribute('style');
                        let svgWidth = 800;
                        let svgHeight = 600;
                        const viewBoxStr = svgEl.getAttribute('viewBox');
                        if (viewBoxStr) {
                            const parts = viewBoxStr.trim().split(/\s+/);
                            if (parts.length === 4) {
                                const w = parseFloat(parts[2]);
                                const h = parseFloat(parts[3]);
                                if (!isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
                                    svgWidth = w;
                                    svgHeight = h;
                                }
                            }
                        }
                        
                        // Scale layout proportionally for printing default dimensions
                        const MAX_DEFAULT_WIDTH = 450;
                        if (svgWidth > MAX_DEFAULT_WIDTH) {
                            const scale = MAX_DEFAULT_WIDTH / svgWidth;
                            width = Math.round(MAX_DEFAULT_WIDTH);
                            height = Math.round(svgHeight * scale);
                        } else {
                            width = Math.round(svgWidth);
                            height = Math.round(svgHeight);
                        }
                        
                        // Render at 4x resolution for high-DPI crisp print output
                        svgEl.setAttribute('width', svgWidth * 4);
                        svgEl.setAttribute('height', svgHeight * 4);
                        const svgString = new XMLSerializer().serializeToString(svgEl);
                        pngDataUrl = await svgToPng(svgString);
                        
                        console.log(`[Mermaid Export Log]`, {
                            originalSvg: { width: svgWidth, height: svgHeight },
                            compiledPng: { width: svgWidth * 4, height: svgHeight * 4 },
                            docxWordInsertion: { width: width, height: height }
                        });
                    }
                    if (pngDataUrl) {
                        png = pngDataUrl;
                    }
                } finally {
                    tempDiv.remove();
                }
            } catch (err) {
                console.error("Error compiling Mermaid during DOCX export:", err);
            }
        }
        
        if (png) {
            const dims = width && height ? `${width}_${height}` : width;
            return dims ? `[mermaid:${code}:${dims}:${png}]` : `[mermaid:${code}:${png}]`;
        }
        return match;
    };

    const processField = async (text) => {
        if (!text) return text;
        const regex = /\[mermaid:([^:]+?)(?::([^:]+?))?(?::([\s\S]+?))?\]/g;
        const matches = [];
        let m;
        while ((m = regex.exec(text))) {
            matches.push(m);
        }
        
        let newText = text;
        for (const matchInfo of matches) {
            const fullMatch = matchInfo[0];
            const code = matchInfo[1];
            const p5 = matchInfo[2];
            const p6 = matchInfo[3];
            const compiled = await compileTag(fullMatch, code, p5, p6);
            newText = newText.replace(fullMatch, compiled);
        }
        return newText;
    };

    if (paper.meta && paper.meta.instructions) {
        paper.meta.instructions = await processField(paper.meta.instructions);
    }
    
    if (paper.sections) {
        for (const section of paper.sections) {
            if (section.questions) {
                for (const question of section.questions) {
                    if (question.text) {
                        question.text = await processField(question.text);
                    }
                    if (question.options) {
                        for (const option of question.options) {
                            if (option.text) {
                                option.text = await processField(option.text);
                            }
                        }
                    }
                }
            }
        }
    }
}

function exportWord() {
    const activePaper = getActivePaper();
    if (!activePaper) return;
    
    const modal = document.getElementById('wordExportModal');
    if (modal) {
        const lastOption = state.lastWordExportOption || 'paperOnly';
        const radio = modal.querySelector(`input[name="wordExportOption"][value="${lastOption}"]`);
        if (radio) {
            radio.checked = true;
        }
        modal.removeAttribute('hidden');
    }
}

function buildDocxBlob(paper) {
    const media = [];
    const documentXml = buildDocumentXml(paper, media);
    const files = {
        '[Content_Types].xml': buildContentTypes(media),
        '_rels/.rels': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`,
        'docProps/core.xml': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
<dc:title>${xmlEscape(paper.title)}</dc:title><dc:creator>MCQ Paper Studio</dc:creator><cp:lastModifiedBy>MCQ Paper Studio</cp:lastModifiedBy><dcterms:created xsi:type="dcterms:W3CDTF">${new Date().toISOString()}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">${new Date().toISOString()}</dcterms:modified>
</cp:coreProperties>`,
        'docProps/app.xml': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>MCQ Paper Studio</Application></Properties>`,
        'word/document.xml': documentXml,
        'word/_rels/document.xml.rels': buildDocumentRels(media),
    };
    media.forEach(item => {
        files[`word/media/${item.fileName}`] = item.bytes;
    });
    return new Blob([createZip(files)], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
}

function buildContentTypes(media) {
    const defaults = new Map([
        ['rels', 'application/vnd.openxmlformats-package.relationships+xml'],
        ['xml', 'application/xml'],
    ]);
    media.forEach(item => defaults.set(item.ext, item.mime));
    const defaultXml = [...defaults.entries()]
        .map(([ext, type]) => `<Default Extension="${ext}" ContentType="${type}"/>`)
        .join('');
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
${defaultXml}
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>`;
}

function buildDocumentRels(media) {
    const imageRels = media.map(item =>
        `<Relationship Id="${item.rId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/${item.fileName}"/>`
    ).join('');
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${imageRels}</Relationships>`;
}

function docxTableFromBase64Html(base64Html, leftIndent = 400) {
    try {
        const html = decodeURIComponent(escape(atob(base64Html)));
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const tableEl = doc.querySelector('table');
        if (!tableEl) return '';

        // DOCX uses twips (15 twips per CSS pixel). Keep the editor's current dimensions instead of normalizing every table to a default width.
        const pxToDxa = value => Math.max(1, Math.round((parseFloat(value) || 0) * 15));
        const DOCX_TOTAL_W = 10800 - leftIndent;
        const colEls = Array.from(doc.querySelectorAll('colgroup col'));
        let colWidthsDxa = [];  // widths in dxa (twips)

        if (colEls.length > 0) {
            // The colgroup is the resize engine's persisted source of truth.
            const pxWidths = colEls.map(c => parseFloat(c.style.width) || 0);
            const totalPx  = pxWidths.reduce((s, w) => s + w, 0);
            if (totalPx > 0) {
                colWidthsDxa = pxWidths.map(pxToDxa);
            }
        }

        const physicalColumnCount = Math.max(colWidthsDxa.length, ...Array.from(tableEl.rows).map(row => Array.from(row.cells).reduce((count, cell) => count + (cell.colSpan || 1), 0)), 1);
        while (colWidthsDxa.length < physicalColumnCount) colWidthsDxa.push(Math.floor(DOCX_TOTAL_W / physicalColumnCount));
        const gridXml = `<w:tblGrid>${colWidthsDxa.map(width => `<w:gridCol w:w="${width}"/>`).join('')}</w:tblGrid>`;
        const rows = tableEl.querySelectorAll('tr');
        let rowsXml = '';

        rows.forEach(row => {
            const cells = row.querySelectorAll('th, td');
            let cellsXml = '';
            let gridColumn = 0;

            cells.forEach((cell, ci) => {
                const cellText = cell.textContent || '';
                const textRuns = docxTextRunsFromMarkdownText(cellText);

                // Use saved col width if available, else distribute equally
                const colspanCount = cell.colSpan || 1;
                const cellWidth = colWidthsDxa.slice(gridColumn, gridColumn + colspanCount).reduce((total, width) => total + width, 0) ||
                    Math.floor(DOCX_TOTAL_W / (cells.length || 1));

                const isHeader = cell.tagName.toLowerCase() === 'th';
                const cellBg   = isHeader ? '<w:shd w:val="clear" w:color="auto" w:fill="F1F5F9"/>' : '';

                // Preserve colspan/rowspan
                const colspan = cell.colSpan > 1 ? `<w:gridSpan w:val="${cell.colSpan}"/>` : '';
                const rowspan = cell.rowSpan > 1 ? `<w:vMerge w:val="restart"/>` : '';

                // Read cell alignment
                const align = cell.style.textAlign === 'justify' ? 'both' : (cell.style.textAlign || 'left');
                const verticalAlign = cell.style.verticalAlign === 'middle' ? 'center' : (cell.style.verticalAlign === 'bottom' ? 'bottom' : 'top');
                const paddingTop = pxToDxa(cell.style.paddingTop || 7);
                const paddingRight = pxToDxa(cell.style.paddingRight || 11);
                const paddingBottom = pxToDxa(cell.style.paddingBottom || 7);
                const paddingLeft = pxToDxa(cell.style.paddingLeft || 11);

                cellsXml += `
                    <w:tc>
                        <w:tcPr>
                            <w:tcW w:w="${cellWidth}" w:type="dxa"/>
                            ${colspan}${rowspan}${cellBg}
                            <w:tcMar><w:top w:w="${paddingTop}" w:type="dxa"/><w:right w:w="${paddingRight}" w:type="dxa"/><w:bottom w:w="${paddingBottom}" w:type="dxa"/><w:left w:w="${paddingLeft}" w:type="dxa"/></w:tcMar>
                            <w:tcBorders>
                                <w:top    w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>
                                <w:bottom w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>
                                <w:left   w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>
                                <w:right  w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>
                            </w:tcBorders>
                            <w:vAlign w:val="${verticalAlign}"/>
                        </w:tcPr>
                        ${docxParagraph(textRuns, { align, before: 80, after: 80 })}
                    </w:tc>
                `;
                gridColumn += colspanCount;
            });

            // Preserve row height if set
            const rowHeightPx = parseFloat(row.style.height);
            const rowHeightDxa = rowHeightPx > 0
                ? `<w:trHeight w:val="${pxToDxa(rowHeightPx)}" w:hRule="exact"/>` : '';

            rowsXml += `<w:tr>${rowHeightDxa ? `<w:trPr>${rowHeightDxa}</w:trPr>` : ''}${cellsXml}</w:tr>`;
        });

        // Preserve table width if set
        const tblWidthPx = parseFloat(tableEl.style.width);
        const tblWidthDxa = tblWidthPx > 0
            ? `<w:tblW w:w="${pxToDxa(tblWidthPx)}" w:type="dxa"/>`
            : `<w:tblW w:w="${DOCX_TOTAL_W}" w:type="dxa"/>`;

        return `
            <w:tbl>
                <w:tblPr>
                    ${tblWidthDxa}
                    <w:tblInd w:w="${leftIndent}" w:type="dxa"/>
                    <w:tblBorders>
                        <w:top    w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>
                        <w:bottom w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>
                        <w:left   w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>
                        <w:right  w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>
                        <w:insideH w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>
                        <w:insideV w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>
                    </w:tblBorders>
                    <w:tblLayout w:type="fixed"/>
                </w:tblPr>
                ${gridXml}
                ${rowsXml}
            </w:tbl>
        `;
    } catch (err) {
        console.error('Error generating docx table:', err);
        return '';
    }
}

function docxQuestionParagraphs(questionNumber, markdown, media) {
    const cleanMarkdown = String(markdown || '').trim();
    const assertionRegex = /^\s*(Assertion(?:\s*\(A\))?|A)\s*:\s*([\s\S]+?)\s*(?:\r?\n\s*)+(?:(?:<br\s*\/?>|&nbsp;|\s)*\r?\n)?\s*(Reasoning(?:\s*\(R\))?|Reason(?:\s*\(R\))?|R)\s*:\s*([\s\S]+)$/i;
    const match = cleanMarkdown.match(assertionRegex);
    
    if (match) {
        const labelAssert = match[1];
        const assertText = match[2].trim();
        const labelReason = match[3];
        const reasonText = match[4].trim();
        
        const assertRuns = [
            docxTextRun(`${questionNumber})`, { bold: true }),
            '<w:r><w:tab/></w:r>',
            docxTextRun(`${labelAssert}: `, { bold: true }),
            '<w:r><w:tab/></w:r>',
            ...docxInlineFromMarkdown(assertText, media)
        ];
        const reasonRuns = [
            '<w:r><w:tab/></w:r>',
            docxTextRun(`${labelReason}: `, { bold: true }),
            '<w:r><w:tab/></w:r>',
            ...docxInlineFromMarkdown(reasonText, media)
        ];
        
        const assertXml = docxParagraph(assertRuns, { 
            before: 100, 
            after: 40,
            leftIndent: 1400,
            hanging: 1400,
            tabPositions: [400, 1400]
        });
        const reasonXml = docxParagraph(reasonRuns, { 
            before: 40, 
            after: 40,
            leftIndent: 1400,
            hanging: 1400,
            tabPositions: [400, 1400]
        });
        return assertXml + reasonXml;
    }
    
    // Normal question parsing
    const segments = parseDocxMarkdown(cleanMarkdown);
    let xml = '';
    let currentRuns = [];
    let isFirstParagraph = true;
    
    const commitParagraph = () => {
        if (currentRuns.length === 0 && !isFirstParagraph) return;
        
        const prefixRuns = [];
        let beforeSpace = 0;
        let leftIndent = 400;
        let hanging = 0;
        let tabPositions = null;
        
        if (isFirstParagraph) {
            prefixRuns.push(docxTextRun(`${questionNumber})`, { bold: true }));
            prefixRuns.push('<w:r><w:tab/></w:r>');
            beforeSpace = 100;
            hanging = 400;
            tabPositions = [400];
        }
        
        xml += docxParagraph([...prefixRuns, ...currentRuns], { 
            before: beforeSpace, 
            after: 60,
            leftIndent,
            hanging,
            tabPositions
        });
        currentRuns = [];
        isFirstParagraph = false;
    };
    
    segments.forEach((segment) => {
        if (segment.type === 'text') {
            const parts = segment.text.split('\n');
            parts.forEach((part, index) => {
                if (index > 0) {
                    commitParagraph();
                }
                if (part) {
                    currentRuns.push(...docxTextRunsFromMarkdownText(part));
                }
            });
        } else if (segment.type === 'math') {
            currentRuns.push(docxMath(segment.latex));
        } else if (segment.type === 'image') {
            commitParagraph();
            
            let w = 450;
            let h = 300;
            if (segment.width && segment.height) {
                w = Number(segment.width) || 450;
                h = Number(segment.height) || 300;
            } else if (segment.width) {
                w = Number(segment.width) || 450;
                h = Math.round(w * 0.66);
            }
            const imgRun = docxImageRun(segment.src, media, w, h);
            if (imgRun) {
                xml += docxParagraph([imgRun], { align: 'center', before: 60, after: 60 });
            }
        } else if (segment.type === 'mermaid') {
            commitParagraph();
            xml += docxParagraph([docxTextRun('[Mermaid Diagram]', { italic: true })], { align: 'center', before: 60, after: 60 });
        } else if (segment.type === 'table') {
            commitParagraph();
            xml += `<w:p><w:pPr><w:spacing w:before="0" w:after="80"/><w:ind w:left="400"/></w:pPr></w:p>`;
            xml += docxTableFromBase64Html(segment.base64Html, 400);
            xml += `<w:p><w:pPr><w:spacing w:before="80" w:after="0"/><w:ind w:left="400"/></w:pPr></w:p>`;
            isFirstParagraph = false;
        }
    });
    
    commitParagraph();
    return xml;
}

function buildDocumentXml(paper, media) {
    let body = '';
    
    const hasLogo = !!paper.logo;
    const hasInst = !!(paper.meta.institutionName || paper.meta.institutionSubtitle);
    
    if (hasLogo || hasInst) {
        if (hasLogo) {
            const w = paper.logoWidth || 120;
            const h = paper.logoHeight || 120;
            const imgRun = docxImageRun(paper.logo, media, w, h);
            
            const instRuns = [];
            if (paper.meta.institutionName) {
                instRuns.push(docxParagraph([docxTextRun(paper.meta.institutionName, { bold: true, size: 28 })], { align: 'center', after: 40 }));
            }
            if (paper.meta.institutionSubtitle) {
                instRuns.push(docxParagraph([docxTextRun(paper.meta.institutionSubtitle, { size: 20, italic: true })], { align: 'center', after: 40 }));
            }
            
            body += `<w:tbl>
                <w:tblPr>
                    <w:tblW w:w="0" w:type="auto"/>
                    <w:tblBorders>
                        <w:top w:val="none"/><w:left w:val="none"/><w:bottom w:val="none"/><w:right w:val="none"/>
                        <w:insideH w:val="none"/><w:insideV w:val="none"/>
                    </w:tblBorders>
                </w:tblPr>
                <w:tblGrid>
                    <w:gridCol w:w="2160"/>
                    <w:gridCol w:w="7200"/>
                </w:tblGrid>
                <w:tr>
                    <w:tc>
                        <w:tcPr><w:tcW w:w="2160" w:type="dxa"/><w:vAlign w:val="center"/></w:tcPr>
                        ${docxParagraph([imgRun], { align: 'left' })}
                    </w:tc>
                    <w:tc>
                        <w:tcPr><w:tcW w:w="7200" w:type="dxa"/><w:vAlign w:val="center"/></w:tcPr>
                        ${instRuns.join('')}
                    </w:tc>
                </w:tr>
            </w:tbl>`;
        } else {
            const instRuns = [];
            if (paper.meta.institutionName) {
                instRuns.push(docxParagraph([docxTextRun(paper.meta.institutionName, { bold: true, size: 28 })], { align: 'center', after: 40 }));
            }
            if (paper.meta.institutionSubtitle) {
                instRuns.push(docxParagraph([docxTextRun(paper.meta.institutionSubtitle, { size: 20, italic: true })], { align: 'center', after: 40 }));
            }
            body += instRuns.join('');
        }
    }
    
    body += docxParagraph([docxTextRun(paper.title || 'Question Paper', { bold: true, size: 30 })], { align: 'center', before: 80, after: 80 });

    const metaRows = [
        [
            { label: 'Class', value: paper.meta.className },
            { label: 'Subject', value: paper.meta.subject },
            { label: 'Test', value: paper.meta.testName }
        ],
        [
            { label: 'Time', value: paper.meta.duration },
            { label: 'Marks', value: paper.meta.marks },
            { label: 'Date', value: paper.meta.date }
        ]
    ];
    
    body += `<w:tbl>
        <w:tblPr>
            <w:tblW w:w="0" w:type="auto"/>
            <w:tblBorders>
                <w:top w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>
                <w:bottom w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>
                <w:left w:val="none"/><w:right w:val="none"/>
                <w:insideH w:val="none"/><w:insideV w:val="none"/>
            </w:tblBorders>
        </w:tblPr>
        <w:tblGrid>
            <w:gridCol w:w="3120"/>
            <w:gridCol w:w="3120"/>
            <w:gridCol w:w="3120"/>
        </w:tblGrid>`;
        
    metaRows.forEach(row => {
        let rowXml = '';
        row.forEach(cell => {
            const cellRuns = [
                docxTextRun(`${cell.label}: `, { bold: true, size: 20 }),
                docxTextRun(cell.value || '', { size: 20 })
            ];
            rowXml += `<w:tc>
                <w:tcPr><w:tcW w:w="3120" w:type="dxa"/><w:vAlign w:val="center"/></w:tcPr>
                ${docxParagraph(cellRuns, { before: 40, after: 40 })}
            </w:tc>`;
        });
        body += `<w:tr>${rowXml}</w:tr>`;
    });
    body += `</w:tbl>`;

    body += docxParagraph([docxTextRun('Name: ________________________________', { size: 22 })], { before: 80, after: 120 });
    
    if (paper.meta.instructions) {
        const cleanInst = String(paper.meta.instructions).trim();
        if (cleanInst) {
            const lines = cleanInst.split('\n');
            lines.forEach((line, index) => {
                const isLast = (index === lines.length - 1);
                const afterSpace = isLast ? 100 : 40;
                const trimmedLine = line.trim();
                
                if (index === 0) {
                    // First line: includes "Instructions: " label
                    const runs = [
                        docxTextRun('Instructions: ', { bold: true }),
                        '<w:r><w:tab/></w:r>',
                        ...(trimmedLine ? docxInlineFromMarkdown(trimmedLine, media) : [docxTextRun('', {})])
                    ];
                    body += docxParagraph(runs, {
                        leftIndent: 1400,
                        hanging: 1400,
                        tabPositions: [1400],
                        after: afterSpace
                    });
                } else {
                    // Subsequent lines: indented to align with first line text
                    const runs = trimmedLine ? docxInlineFromMarkdown(trimmedLine, media) : [docxTextRun('', {})];
                    body += docxParagraph(runs, {
                        leftIndent: 1400,
                        after: afterSpace
                    });
                }
            });
        }
    }
    
    let questionNumber = 0;
    paper.sections.forEach(section => {
        if (!section.questions.length) return;
        body += docxParagraph([docxTextRun(section.name, { bold: true, size: 24 })], { before: 120, after: 70 });
        section.questions.forEach(question => {
            questionNumber += 1;
            body += docxQuestionParagraphs(questionNumber, question.text || '', media);
            body += docxOptionsParagraphs(question, media);
        });
    });
    
    if (paper.includeAnswerKey) {
        body += `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`;
        body += docxParagraph([docxTextRun('ANSWER KEY', { bold: true, size: 28 })], { align: 'center', after: 120 });
        
        // Reuse the existing correctIndex values and keep question numbers
        // sequential across the section groups, matching the question paper.
        const ANSWERS_PER_ROW = 5;
        let answerQuestionNumber = 0;
        paper.sections.forEach(section => {
            if (!section.questions.length) return;
            body += docxParagraph([docxTextRun(section.name, { bold: true, size: 22 })], { before: 80, after: 30 });

            const answerEntries = section.questions.map(question => {
                answerQuestionNumber += 1;
                const answerLabel = LABELS[question.correctIndex] || 'A';
                return `${answerQuestionNumber} - ${answerLabel}`;
            });

            // Keep each compact line as one DOCX paragraph. Tabs provide even,
            // exam-style columns and rows wrap predictably after five answers.
            for (let index = 0; index < answerEntries.length; index += ANSWERS_PER_ROW) {
                const row = answerEntries.slice(index, index + ANSWERS_PER_ROW);
                const runs = [];
                row.forEach((entry, entryIndex) => {
                    if (entryIndex) runs.push('<w:r><w:tab/></w:r>');
                    runs.push(docxTextRun(entry, { size: 20 }));
                });
                body += docxParagraph(runs, { align: 'left', before: 0, after: 20 });
            }
        });
    }

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="${DOCX_NS.w}" xmlns:r="${DOCX_NS.r}" xmlns:wp="${DOCX_NS.wp}" xmlns:a="${DOCX_NS.a}" xmlns:pic="${DOCX_NS.pic}" xmlns:m="${DOCX_NS.m}">
<w:body>${body}<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="720" w:right="720" w:bottom="720" w:left="720" w:header="360" w:footer="360" w:gutter="0"/></w:sectPr></w:body>
</w:document>`;
}

function docxOptionsParagraphs(question, media) {
    const tableBorders = `
        <w:tblBorders>
            <w:top w:val="none"/><w:left w:val="none"/><w:bottom w:val="none"/><w:right w:val="none"/>
            <w:insideH w:val="none"/><w:insideV w:val="none"/>
        </w:tblBorders>
    `;
    
    const cellBorders = `
        <w:tcBorders>
            <w:top w:val="none"/><w:left w:val="none"/><w:bottom w:val="none"/><w:right w:val="none"/>
        </w:tcBorders>
    `;

    if (question.layout === 'column') {
        // 4x1: 4 rows, 1 cell of width 10800 each
        let rowsXml = '';
        for (let i = 0; i < 4; i++) {
            const runs = [
                docxTextRun(`${LABELS[i]}) `, { bold: true }), 
                ...docxInlineFromMarkdown(question.options[i]?.text || '', media)
            ];
            const afterSpace = (i === 3) ? 100 : 20;
            const cellXml = `
                <w:tc>
                    <w:tcPr>
                        <w:tcW w:w="10800" w:type="dxa"/>
                        ${cellBorders}
                        <w:vAlign w:val="top"/>
                    </w:tcPr>
                    ${docxParagraph(runs, { before: 0, after: afterSpace, leftIndent: 400 })}
                </w:tc>
            `;
            rowsXml += `<w:tr>${cellXml}</w:tr>`;
        }
        
        return `
            <w:tbl>
                <w:tblPr>
                    <w:tblW w:w="10800" w:type="dxa"/>
                    ${tableBorders}
                    <w:tblLayout w:type="fixed"/>
                </w:tblPr>
                <w:tblGrid>
                    <w:gridCol w:w="10800"/>
                </w:tblGrid>
                ${rowsXml}
            </w:tbl>
        `;
    }

    if (question.layout === 'grid2') {
        // 2x2: 2 rows, 2 cells of width 5400 each
        let rowsXml = '';
        
        // Row 1 (A & B)
        const runsA = [
            docxTextRun(`${LABELS[0]}) `, { bold: true }),
            ...docxInlineFromMarkdown(question.options[0]?.text || '', media)
        ];
        const runsB = [
            docxTextRun(`${LABELS[1]}) `, { bold: true }),
            ...docxInlineFromMarkdown(question.options[1]?.text || '', media)
        ];
        
        // Row 2 (C & D)
        const runsC = [
            docxTextRun(`${LABELS[2]}) `, { bold: true }),
            ...docxInlineFromMarkdown(question.options[2]?.text || '', media)
        ];
        const runsD = [
            docxTextRun(`${LABELS[3]}) `, { bold: true }),
            ...docxInlineFromMarkdown(question.options[3]?.text || '', media)
        ];

        rowsXml += `
            <w:tr>
                <w:tc>
                    <w:tcPr><w:tcW w:w="5400" w:type="dxa"/>${cellBorders}<w:vAlign w:val="top"/></w:tcPr>
                    ${docxParagraph(runsA, { before: 0, after: 20, leftIndent: 400 })}
                </w:tc>
                <w:tc>
                    <w:tcPr><w:tcW w:w="5400" w:type="dxa"/>${cellBorders}<w:vAlign w:val="top"/></w:tcPr>
                    ${docxParagraph(runsB, { before: 0, after: 20, leftIndent: 400 })}
                </w:tc>
            </w:tr>
            <w:tr>
                <w:tc>
                    <w:tcPr><w:tcW w:w="5400" w:type="dxa"/>${cellBorders}<w:vAlign w:val="top"/></w:tcPr>
                    ${docxParagraph(runsC, { before: 0, after: 100, leftIndent: 400 })}
                </w:tc>
                <w:tc>
                    <w:tcPr><w:tcW w:w="5400" w:type="dxa"/>${cellBorders}<w:vAlign w:val="top"/></w:tcPr>
                    ${docxParagraph(runsD, { before: 0, after: 100, leftIndent: 400 })}
                </w:tc>
            </w:tr>
        `;

        return `
            <w:tbl>
                <w:tblPr>
                    <w:tblW w:w="10800" w:type="dxa"/>
                    ${tableBorders}
                    <w:tblLayout w:type="fixed"/>
                </w:tblPr>
                <w:tblGrid>
                    <w:gridCol w:w="5400"/>
                    <w:gridCol w:w="5400"/>
                </w:tblGrid>
                ${rowsXml}
            </w:tbl>
        `;
    }

    // Default to 'row' (1x4)
    // 1 row, 4 cells of width 2700 each
    const runsA = [
        docxTextRun(`${LABELS[0]}) `, { bold: true }),
        ...docxInlineFromMarkdown(question.options[0]?.text || '', media)
    ];
    const runsB = [
        docxTextRun(`${LABELS[1]}) `, { bold: true }),
        ...docxInlineFromMarkdown(question.options[1]?.text || '', media)
    ];
    const runsC = [
        docxTextRun(`${LABELS[2]}) `, { bold: true }),
        ...docxInlineFromMarkdown(question.options[2]?.text || '', media)
    ];
    const runsD = [
        docxTextRun(`${LABELS[3]}) `, { bold: true }),
        ...docxInlineFromMarkdown(question.options[3]?.text || '', media)
    ];

    const rowXml = `
        <w:tr>
            <w:tc>
                <w:tcPr><w:tcW w:w="2700" w:type="dxa"/>${cellBorders}<w:vAlign w:val="top"/></w:tcPr>
                ${docxParagraph(runsA, { before: 0, after: 100, leftIndent: 400 })}
            </w:tc>
            <w:tc>
                <w:tcPr><w:tcW w:w="2700" w:type="dxa"/>${cellBorders}<w:vAlign w:val="top"/></w:tcPr>
                ${docxParagraph(runsB, { before: 0, after: 100, leftIndent: 400 })}
            </w:tc>
            <w:tc>
                <w:tcPr><w:tcW w:w="2700" w:type="dxa"/>${cellBorders}<w:vAlign w:val="top"/></w:tcPr>
                ${docxParagraph(runsC, { before: 0, after: 100, leftIndent: 400 })}
            </w:tc>
            <w:tc>
                <w:tcPr><w:tcW w:w="2700" w:type="dxa"/>${cellBorders}<w:vAlign w:val="top"/></w:tcPr>
                ${docxParagraph(runsD, { before: 0, after: 100, leftIndent: 400 })}
            </w:tc>
        </w:tr>
    `;

    return `
        <w:tbl>
            <w:tblPr>
                <w:tblW w:w="10800" w:type="dxa"/>
                ${tableBorders}
                <w:tblLayout w:type="fixed"/>
            </w:tblPr>
            <w:tblGrid>
                <w:gridCol w:w="2700"/>
                <w:gridCol w:w="2700"/>
                <w:gridCol w:w="2700"/>
                <w:gridCol w:w="2700"/>
            </w:tblGrid>
            ${rowXml}
        </w:tbl>
    `;
}

function docxInlineFromMarkdown(markdown, media) {
    const pieces = [];
    parseDocxMarkdown(markdown).forEach(segment => {
        if (segment.type === 'text') pieces.push(...docxTextRunsFromMarkdownText(segment.text));
        if (segment.type === 'math') pieces.push(docxMath(segment.latex));
        if (segment.type === 'image') {
            let w = 160;
            let h = 100;
            if (segment.alt === 'Mermaid Diagram') {
                w = 400;
                h = 300;
                if (segment.width && segment.height) {
                    const customW = parseFloat(segment.width);
                    const customH = parseFloat(segment.height);
                    if (!isNaN(customW) && !isNaN(customH) && customW > 0 && customH > 0) {
                        w = customW;
                        h = customH;
                    }
                }
                
                // Constrain maximum printable width to fit standard margins nicely
                const MAX_PRINT_WIDTH = 450;
                if (w > MAX_PRINT_WIDTH) {
                    const scale = MAX_PRINT_WIDTH / w;
                    w = MAX_PRINT_WIDTH;
                    h = h * scale;
                }
            } else {
                if (segment.width) w = parseFloat(segment.width) || w;
                if (segment.height) h = parseFloat(segment.height) || h;
            }
            pieces.push(docxImageRun(segment.src, media, w, h));
        }
        if (segment.type === 'mermaid') pieces.push(docxTextRun('[Mermaid Diagram]', { italic: true }));
    });
    return pieces;
}

function parseDocxMarkdown(markdown) {
    const source = String(markdown || '');
    const segments = [];
    const tokenRe = /!\[([^\]]*)\]\((data:image\/[^)]+)\)|\\\(([\s\S]+?)\\\)|\[mermaid:([^:]+?)(?::([^:]+?))?(?::([\s\S]+?))?\]|\[table:([A-Za-z0-9+/=]+)\]/g;
    let last = 0;
    let match;
    while ((match = tokenRe.exec(source))) {
        if (match.index > last) segments.push({ type: 'text', text: source.slice(last, match.index) });
        if (match[2]) {
            segments.push({ type: 'image', alt: match[1], src: match[2] });
        } else if (match[3]) {
            segments.push({ type: 'math', latex: match[3] });
        } else if (match[4]) {
            let code = match[4];
            let width = '';
            let height = '';
            let png = '';
            if (match[5]) {
                if (match[5].startsWith('data:')) {
                    png = match[5];
                } else {
                    const dims = match[5].split('_');
                    width = dims[0];
                    height = dims[1] || '';
                    png = match[6] || '';
                }
            }
            if (png) {
                segments.push({ type: 'image', alt: 'Mermaid Diagram', src: png, width: width, height: height });
            } else {
                segments.push({ type: 'mermaid', base64: code });
            }
        } else if (match[7]) {
            segments.push({ type: 'table', base64Html: match[7] });
        }
        last = tokenRe.lastIndex;
    }
    if (last < source.length) segments.push({ type: 'text', text: source.slice(last) });
    return segments;
}

function docxTextRunsFromMarkdownText(text) {
    const runs = [];
    const re = /(\*\*([^*]+)\*\*|\*([^*]+)\*)/g;
    let last = 0;
    let match;
    while ((match = re.exec(text))) {
        runs.push(...docxTextRuns(text.slice(last, match.index)));
        runs.push(...docxTextRuns(match[2] || match[3] || '', { bold: !!match[2], italic: !!match[3] }));
        last = re.lastIndex;
    }
    runs.push(...docxTextRuns(text.slice(last)));
    return runs;
}

function docxTextRuns(text, opts = {}) {
    return String(text || '').split('\n').flatMap((part, index, arr) => {
        const out = [];
        if (part) out.push(docxTextRun(part, opts));
        if (index < arr.length - 1) out.push('<w:r><w:br/></w:r>');
        return out;
    });
}

function docxTextRun(text, opts = {}) {
    const props = [];
    if (opts.bold) props.push('<w:b/>');
    if (opts.italic) props.push('<w:i/>');
    if (opts.size) props.push(`<w:sz w:val="${opts.size}"/>`);
    const rPr = props.length ? `<w:rPr>${props.join('')}</w:rPr>` : '';
    return `<w:r>${rPr}<w:t xml:space="preserve">${xmlEscape(text)}</w:t></w:r>`;
}

function docxParagraph(runs, opts = {}) {
    const pPr = [];
    
    // 1. tabs (complying with standard OpenXML schema order)
    if (opts.tabPositions) {
        pPr.push(`<w:tabs>${opts.tabPositions.map(pos => `<w:tab w:val="left" w:pos="${pos}"/>`).join('')}</w:tabs>`);
    }
    
    // 2. spacing
    if (opts.before || opts.after !== undefined) {
        pPr.push(`<w:spacing w:before="${opts.before || 0}" w:after="${opts.after || 0}"/>`);
    }
    
    // 3. ind
    if (opts.leftIndent || opts.hanging) {
        pPr.push(`<w:ind w:left="${opts.leftIndent || 0}" w:hanging="${opts.hanging || 0}"/>`);
    }
    
    // 4. jc (alignment)
    if (opts.align) {
        pPr.push(`<w:jc w:val="${opts.align}"/>`);
    }
    
    return `<w:p>${pPr.length ? `<w:pPr>${pPr.join('')}</w:pPr>` : ''}${runs.join('')}</w:p>`;
}

function tokenizeLatex(str) {
    const tokens = [];
    let i = 0;
    while (i < str.length) {
        const char = str[i];
        if (/\s/.test(char)) {
            i++;
            continue;
        }
        if (char === '\\') {
            let cmd = '\\';
            i++;
            while (i < str.length && /[a-zA-Z]/.test(str[i])) {
                cmd += str[i];
                i++;
            }
            tokens.push({ type: 'CMD', value: cmd });
            continue;
        }
        if (char === '{' || char === '}' || char === '^' || char === '_' || char === '(' || char === ')' || char === '=' || char === '+' || char === '-' || char === '*' || char === '/' || char === ',') {
            tokens.push({ type: 'CHAR', value: char });
            i++;
            continue;
        }
        let val = '';
        while (i < str.length && !/[\s\\{}^_()=+\-*\/,]/.test(str[i])) {
            val += str[i];
            i++;
        }
        if (val) {
            tokens.push({ type: 'TEXT', value: val });
        }
    }
    return tokens;
}

function parseLatex(tokens) {
    let index = 0;
    function peek() { return tokens[index]; }
    function next() { return tokens[index++]; }

    function parseGroup() {
        const token = peek();
        if (token && token.type === 'CHAR' && token.value === '{') {
            next();
            const nodes = parseExpression('}');
            if (peek() && peek().value === '}') next();
            return nodes;
        }
        const single = parseItem();
        return single ? [single] : [];
    }

    function parseItem() {
        const token = next();
        if (!token) return null;
        if (token.type === 'CMD') {
            if (token.value === '\\frac') {
                const num = parseGroup();
                const den = parseGroup();
                return { type: 'frac', num, den };
            }
            if (token.value === '\\sqrt') {
                const expr = parseGroup();
                return { type: 'sqrt', expr };
            }
            if (token.value === '\\sum') {
                return { type: 'sum', sub: [], sup: [] };
            }
            if (token.value === '\\int') {
                return { type: 'int', sub: [], sup: [] };
            }
            return { type: 'cmd', value: token.value };
        }
        return { type: 'text', value: token.value };
    }

    function parseExpression(endChar) {
        const nodes = [];
        while (index < tokens.length) {
            const token = peek();
            if (token && token.type === 'CHAR' && token.value === endChar) break;
            if (token && token.type === 'CHAR' && (token.value === '^' || token.value === '_')) {
                const lastNode = nodes.pop();
                const isSup = token.value === '^';
                next();
                const subexpr = parseGroup();
                if (lastNode && (lastNode.type === 'sum' || lastNode.type === 'int')) {
                    if (isSup) lastNode.sup = subexpr;
                    else lastNode.sub = subexpr;
                    nodes.push(lastNode);
                } else if (lastNode && lastNode.type === 'sup' && !isSup) {
                    nodes.push({ type: 'subsup', base: lastNode.base, sub: subexpr, sup: lastNode.sup });
                } else if (lastNode && lastNode.type === 'sub' && isSup) {
                    nodes.push({ type: 'subsup', base: lastNode.base, sub: lastNode.sub, sup: subexpr });
                } else {
                    const base = lastNode ? [lastNode] : [];
                    nodes.push({ type: isSup ? 'sup' : 'sub', base, [isSup ? 'sup' : 'sub']: subexpr });
                }
                continue;
            }
            const node = parseItem();
            if (node) nodes.push(node);
        }
        return nodes;
    }
    return parseExpression();
}

function generateOMML(nodes) {
    function mapNode(node) {
        if (!node) return '';
        if (node.type === 'text') {
            return `<m:r><m:t>${xmlEscape(node.value)}</m:t></m:r>`;
        }
        if (node.type === 'cmd') {
            const cmdMap = {
                '\\pm': '±', '\\times': '×', '\\div': '÷', '\\alpha': 'α',
                '\\beta': 'β', '\\gamma': 'γ', '\\delta': 'δ', '\\theta': 'θ',
                '\\lambda': 'λ', '\\pi': 'π', '\\sigma': 'σ', '\\phi': 'φ',
                '\\omega': 'ω', '\\Delta': 'Δ', '\\infty': '∞', '\\le': '≤',
                '\\ge': '≥', '\\neq': '≠', '\\approx': '≈'
            };
            const val = cmdMap[node.value] || node.value;
            return `<m:r><m:t>${xmlEscape(val)}</m:t></m:r>`;
        }
        if (node.type === 'frac') {
            return `<m:f><m:num>${mapNodes(node.num)}</m:num><m:den>${mapNodes(node.den)}</m:den></m:f>`;
        }
        if (node.type === 'sqrt') {
            return `<m:rad><m:radPr><m:degHide w:val="1"/></m:radPr><m:deg/><m:e>${mapNodes(node.expr)}</m:e></m:rad>`;
        }
        if (node.type === 'sup') {
            return `<m:sSup><m:e>${mapNodes(node.base)}</m:e><m:sup>${mapNodes(node.sup)}</m:sup></m:sSup>`;
        }
        if (node.type === 'sub') {
            return `<m:sSub><m:e>${mapNodes(node.base)}</m:e><m:sub>${mapNodes(node.sub)}</m:sub></m:sSub>`;
        }
        if (node.type === 'subsup') {
            return `<m:sSubSup><m:e>${mapNodes(node.base)}</m:e><m:sub>${mapNodes(node.sub)}</m:sub><m:sup>${mapNodes(node.sup)}</m:sup></m:sSubSup>`;
        }
        if (node.type === 'sum') {
            return `<m:nary><m:naryPr><m:chr w:val="∑"/><m:limLoc w:val="undOvr"/></m:naryPr><m:sub>${mapNodes(node.sub)}</m:sub><m:sup>${mapNodes(node.sup)}</m:sup><m:e/></m:nary>`;
        }
        if (node.type === 'int') {
            return `<m:nary><m:naryPr><m:chr w:val="∫"/><m:limLoc w:val="subSup"/></m:naryPr><m:sub>${mapNodes(node.sub)}</m:sub><m:sup>${mapNodes(node.sup)}</m:sup><m:e/></m:nary>`;
        }
        return '';
    }
    function mapNodes(nodeList) {
        if (!nodeList || !nodeList.length) return '';
        return nodeList.map(mapNode).join('');
    }
    return mapNodes(nodes);
}

function docxMath(latex) {
    const trimmed = String(latex || '').trim();
    try {
        const tokens = tokenizeLatex(trimmed);
        const ast = parseLatex(tokens);
        const omml = generateOMML(ast);
        if (omml) {
            return `<m:oMath>${omml}</m:oMath>`;
        }
    } catch (err) {
        // Fallback on error
    }
    return `<m:oMath><m:r><m:t>${xmlEscape(cleanLatex(trimmed))}</m:t></m:r></m:oMath>`;
}

function cleanLatex(latex) {
    return latex.replace(/\\_/g, '_').replace(/\\times/g, '×').replace(/\\div/g, '÷').replace(/\\pm/g, '±').replace(/\\cdot/g, '·').replace(/\\degree/g, '°').replace(/\\/g, '');
}

function docxImageRun(dataUrl, media, widthPx, heightPx) {
    const item = addMedia(dataUrl, media);
    if (!item) return '';
    const cx = Math.round(widthPx * 9525);
    const cy = Math.round(heightPx * 9525);
    return `<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${cx}" cy="${cy}"/><wp:docPr id="${item.docPrId}" name="${xmlEscape(item.fileName)}"/><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:nvPicPr><pic:cNvPr id="0" name="${xmlEscape(item.fileName)}"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="${item.rId}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>`;
}

function addMedia(dataUrl, media) {
    const match = String(dataUrl || '').match(/^data:(image\/(png|jpe?g|gif));base64,(.+)$/i);
    if (!match) return null;
    const existing = media.find(item => item.dataUrl === dataUrl);
    if (existing) return existing;
    const ext = match[2].toLowerCase() === 'jpeg' ? 'jpg' : match[2].toLowerCase();
    const id = media.length + 1;
    const item = {
        dataUrl,
        mime: match[1].toLowerCase(),
        ext,
        bytes: base64ToUint8(match[3]),
        fileName: `image${id}.${ext}`,
        rId: `rId${id}`,
        docPrId: id,
    };
    media.push(item);
    return item;
}

function base64ToUint8(base64) {
    const bin = atob(base64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
}

function xmlEscape(str) {
    return String(str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function createZip(files) {
    const encoder = new TextEncoder();
    const localParts = [];
    const centralParts = [];
    let offset = 0;
    Object.entries(files).forEach(([name, content]) => {
        const nameBytes = encoder.encode(name);
        const data = typeof content === 'string' ? encoder.encode(content) : content;
        const crc = crc32(data);
        const local = new Uint8Array(30 + nameBytes.length);
        const lv = new DataView(local.buffer);
        lv.setUint32(0, 0x04034b50, true);
        lv.setUint16(4, 20, true);
        lv.setUint16(8, 0, true);
        lv.setUint32(14, crc, true);
        lv.setUint32(18, data.length, true);
        lv.setUint32(22, data.length, true);
        lv.setUint16(26, nameBytes.length, true);
        local.set(nameBytes, 30);
        localParts.push(local, data);
        const central = new Uint8Array(46 + nameBytes.length);
        const cv = new DataView(central.buffer);
        cv.setUint32(0, 0x02014b50, true);
        cv.setUint16(4, 20, true);
        cv.setUint16(6, 20, true);
        cv.setUint32(16, crc, true);
        cv.setUint32(20, data.length, true);
        cv.setUint32(24, data.length, true);
        cv.setUint16(28, nameBytes.length, true);
        cv.setUint32(42, offset, true);
        central.set(nameBytes, 46);
        centralParts.push(central);
        offset += local.length + data.length;
    });
    const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
    const end = new Uint8Array(22);
    const ev = new DataView(end.buffer);
    ev.setUint32(0, 0x06054b50, true);
    ev.setUint16(8, centralParts.length, true);
    ev.setUint16(10, centralParts.length, true);
    ev.setUint32(12, centralSize, true);
    ev.setUint32(16, offset, true);
    return new Blob([...localParts, ...centralParts, end], { type: 'application/zip' });
}

function crc32(data) {
    let crc = -1;
    for (let i = 0; i < data.length; i++) crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ data[i]) & 0xff];
    return (crc ^ -1) >>> 0;
}

const CRC_TABLE = (() => {
    const table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
        let c = i;
        for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        table[i] = c >>> 0;
    }
    return table;
})();

function buildWordHtml(paper) {
    const questionBlocks = [];
    let globalIndex = 0;
    paper.sections.forEach(section => {
        if (!section.questions.length) return;
        questionBlocks.push(`<h2>${esc(section.name)}</h2>`);
        section.questions.forEach(question => {
            globalIndex += 1;
            questionBlocks.push(`
                <div class="question">
                    <p><b>${globalIndex})</b> ${formatForWord(question.text)}</p>
                    ${optionsForWord(question)}
                </div>
            `);
        });
    });
    const key = allQuestions(paper).map((q, i) => `${i + 1}. ${LABELS[q.correctIndex] || 'A'}`).join('&nbsp;&nbsp;&nbsp;');
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                @page { margin: 0.65in; }
                body { font-family: "Times New Roman", serif; font-size: 12pt; color: #111; }
                h1 { text-align: center; font-size: 18pt; margin: 0 0 6pt; }
                .meta { text-align: center; margin-bottom: 10pt; }
                .name { margin: 10pt 0; }
                h2 { font-size: 13pt; margin: 12pt 0 6pt; border-bottom: 1px solid #888; }
                .question { page-break-inside: avoid; margin: 0 0 8pt; }
                .options { width: 100%; border-collapse: collapse; margin-left: 18pt; }
                .options td { vertical-align: top; padding: 2pt 8pt 2pt 0; }
                img { max-width: 180px; max-height: 120px; vertical-align: middle; }
                .answer-key { margin-top: 18pt; border-top: 1px solid #888; padding-top: 8pt; }
            </style>
        </head>
        <body>
            <h1>${esc(paper.title)}</h1>
            <div class="meta">
                Class: ${esc(paper.meta.className || '')} &nbsp;&nbsp;
                Subject: ${esc(paper.meta.subject || '')} &nbsp;&nbsp;
                ${esc(paper.meta.testName || '')} &nbsp;&nbsp;
                Time: ${esc(paper.meta.duration || '')} &nbsp;&nbsp;
                Marks: ${esc(paper.meta.marks || totalMarks(paper))}
            </div>
            <div class="name">Name: ________________________________</div>
            ${paper.meta.instructions ? `<p><b>Instructions:</b> ${formatForWord(paper.meta.instructions)}</p>` : ''}
            ${questionBlocks.join('')}
            <div class="answer-key"><b>Answer Key:</b><br>${key}</div>
        </body>
        </html>
    `;
}

function optionsForWord(question) {
    const rows = question.layout === 'row'
        ? [[0, 1, 2, 3]]
        : question.layout === 'grid2'
            ? [[0, 1], [2, 3]]
            : [[0], [1], [2], [3]];
    return `
        <table class="options">
            ${rows.map(row => `
                <tr>
                    ${row.map(index => `<td><b>${LABELS[index]}.</b> ${formatForWord(question.options[index]?.text || '')}</td>`).join('')}
                </tr>
            `).join('')}
        </table>
    `;
}

function formatForWord(value) {
    return esc(value || '')
        .replace(/!\[([^\]]*)\]\((data:image\/[^)]+)\)/g, '<img alt="$1" src="$2">')
        .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
        .replace(/\*([^*]+)\*/g, '<i>$1</i>')
        .replace(/\\\((.*?)\\\)/g, '<span>$1</span>')
        .replace(/\n/g, '<br>');
}

function downloadBlob(blob, name) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = name;
    link.click();
    URL.revokeObjectURL(link.href);
}

function fileName(value) {
    return (value || 'question-paper').replace(/[\\/:*?"<>|]+/g, '').replace(/\s+/g, '_');
}

function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
}

function renderMathSoon() {
    requestAnimationFrame(() => {
        if (!window.renderMathInElement) return;
        try {
            renderMathInElement(document.body, {
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '\\[', right: '\\]', display: true },
                    { left: '\\(', right: '\\)', display: false },
                ],
                ignoredTags: ['textarea', 'script', 'style'],
                throwOnError: false,
            });
        } catch (err) {}
    });
}

function toast(message) {
    if (!els.toast) return;
    // Clear duplicates or consecutive repeats
    if (els.toast.classList.contains('show') && els.toast.textContent.includes(message)) {
        return;
    }
    
    els.toast.innerHTML = `${message} <span class="toast-close" style="margin-left: 10px; cursor: pointer; font-weight: bold; opacity: 0.8; padding: 2px 6px;">&times;</span>`;
    els.toast.classList.add('show');
    els.toast.style.pointerEvents = 'auto';
    
    const closeBtn = els.toast.querySelector('.toast-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            els.toast.classList.remove('show');
            els.toast.style.pointerEvents = 'none';
        });
    }
    
    clearTimeout(els.toast._timer);
    els.toast._timer = setTimeout(() => {
        els.toast.classList.remove('show');
        els.toast.style.pointerEvents = 'none';
    }, 4000);
}

function deepCopy(value) {
    return JSON.parse(JSON.stringify(value));
}

function esc(value) {
    const div = document.createElement('div');
    div.textContent = value == null ? '' : String(value);
    return div.innerHTML;
}

function cssEscape(value) {
    if (window.CSS && typeof CSS.escape === 'function') return CSS.escape(value);
    return String(value).replace(/["\\]/g, '\\$&');
}
