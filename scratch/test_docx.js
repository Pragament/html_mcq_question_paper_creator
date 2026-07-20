const fs = require('fs');

// Create robust global mocks
const elementMock = {
    addEventListener: () => {},
    querySelectorAll: () => [],
    querySelector: () => null,
    setAttribute: () => {},
    removeAttribute: () => {},
    classList: { add: () => {}, remove: () => {} },
    style: {}
};

global.document = {
    getElementById: () => elementMock,
    querySelector: () => elementMock,
    querySelectorAll: () => [],
    addEventListener: () => {},
    createElement: () => elementMock
};

global.window = {
    print: () => {},
    addEventListener: () => {},
    katex: {
        renderToString: (latex) => `[KATEX:${latex}]`
    }
};

global.DOMParser = class {
    parseFromString(str, mime) {
        return {
            querySelectorAll: () => [],
            querySelector: () => ({
                rows: [
                    {
                        cells: [
                            { colSpan: 1, rowSpan: 1, tagName: 'td', style: {}, textContent: 'Item' },
                            { colSpan: 1, rowSpan: 1, tagName: 'td', style: {}, textContent: 'Value' }
                        ],
                        querySelectorAll: () => [
                            { colSpan: 1, rowSpan: 1, tagName: 'td', style: {}, textContent: 'Item' },
                            { colSpan: 1, rowSpan: 1, tagName: 'td', style: {}, textContent: 'Value' }
                        ],
                        style: {}
                    }
                ],
                querySelectorAll: (sel) => {
                    if (sel === 'colgroup col') return [];
                    if (sel === 'tr') return [
                        {
                            cells: [
                                { colSpan: 1, rowSpan: 1, tagName: 'td', style: {}, textContent: 'Item' },
                                { colSpan: 1, rowSpan: 1, tagName: 'td', style: {}, textContent: 'Value' }
                            ],
                            querySelectorAll: () => [
                                { colSpan: 1, rowSpan: 1, tagName: 'td', style: {}, textContent: 'Item' },
                                { colSpan: 1, rowSpan: 1, tagName: 'td', style: {}, textContent: 'Value' }
                            ],
                            style: {}
                        }
                    ];
                    return [];
                },
                style: { width: '200px' }
            })
        };
    }
};

global.localStorage = {
    getItem: () => null,
    setItem: () => {}
};

global.navigator = {
    userAgent: ''
};

global.requestAnimationFrame = (cb) => cb();

// Import script.js
const scriptContent = fs.readFileSync('script.js', 'utf8');

// Evaluate script.js in this context
eval(scriptContent);

const paper = samplePaper();
paper.meta.instructions = 'Choose the correct answer.\n+4 and -1 For each question\n\nAdditional instruction here';

const media = [];
const docXml = buildDocumentXml(paper, media);

console.log("--- DOCUMENT XML GENERATED SUCCESSFULLY ---");
console.log("Checking instructions properties in XML:");

// Find instructions block
const instIdx = docXml.indexOf("Instructions:");
if (instIdx !== -1) {
    console.log("Found instructions text! Surrounding context:");
    console.log(docXml.slice(instIdx - 200, instIdx + 1200));
} else {
    console.log("Warning: 'Instructions:' text not found in XML!");
}

console.log("\nChecking hanging indent values:");
const matchInd = docXml.match(/<w:ind w:left="1400"[^>]*\/>/g);
console.log("Indents of 1400 twips found:", matchInd);

console.log("\nChecking tab stops at 1400:");
const matchTabs = docXml.match(/<w:tab w:val="left" w:pos="1400"\/>/g);
console.log("Tab stops at 1400 found:", matchTabs);

console.log("\n--- TEST COMPLETE ---");
