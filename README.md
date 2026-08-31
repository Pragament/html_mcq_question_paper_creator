# MCQ Paper Studio

MCQ Paper Studio is a browser-based tool for creating printable school multiple-choice question papers. It runs as a static HTML/CSS/JavaScript app, stores papers in the browser with `localStorage`, and supports export workflows for backups, CSV files, print/PDF, and Word documents.

## Features

- Create and manage multiple question papers from a sidebar.
- Add paper metadata such as title, subject, class, exam name, duration, marks, date, instructions, institution name, subtitle, and logo.
- Organize each paper into sections and add questions per section.
- Edit questions and four answer options with a rich editor that supports bold, italic, code mode, inline images, equations, tables, and diagrams.
- Mark single-correct or multiple-correct answers.
- Choose option layouts at paper, section, or question level: `1x4`, `2x2`, or `4x1`.
- Add question metadata such as chapter, topic, and subtopic.
- Tag papers with built-in or custom tags, then search and filter papers by title, subject, class, or tag.
- Import questions from CSV upload, pasted CSV, or AI-generated MCQ text.
- Generate a copy-ready prompt for ChatGPT, Gemini, Claude, Copilot, or another AI tool to produce importable questions.
- Preview and validate imported questions before adding them to a section.
- Insert formulas from a built-in Mathematics, Physics, and Chemistry formula library.
- Save custom equations, reuse recently used formulas, and favorite formulas.
- Insert Mermaid diagrams and preview them before adding them to questions.
- Insert and edit tables with row, column, merge, split, resize, and auto-fit controls.
- Upload, replace, resize, or remove an institution logo.
- Export a JSON backup of all papers and import it later.
- Export a questions CSV and a separate answer-key CSV.
- Print a clean A4 question paper layout.
- Export a Word `.docx` question paper, with an option to include the answer key.
- Works on desktop and includes a collapsible sidebar for smaller screens.

## For Users

### Start the App

Open `index.html` in a modern browser. For the best experience, use Chrome, Edge, Firefox, or Safari with an internet connection so the CDN libraries can load.

The app loads with a sample paper the first time it is opened. Your work is saved automatically in the same browser through `localStorage`.

### Create a Paper

1. Click `+` in the Question Papers sidebar.
2. Fill in the paper details at the top of the workspace.
3. Add optional institution details and a logo.
4. Add sections for subjects, chapters, or exam parts.
5. Add questions and answer options.
6. Select the correct answer option, or enable multiple-correct answers where needed.

### Import Questions

Use `Import Questions` inside a section to add questions in bulk.

Supported CSV headers:

```csv
section,question,option1,option2,option3,option4,correct_option
```

Optional headers:

```csv
chapter,topic,subtopic
```

`correct_option` accepts values such as `A`, `B`, `C`, `D`, or multiple answers such as `B, C`.

You can also paste AI-generated MCQ text. The app recognizes common formats from ChatGPT, Gemini, Claude, and similar tools, then lets you preview the parsed questions before importing them.

### Export and Print

- `Backup` downloads a JSON file containing your saved papers.
- `Import` restores a previously exported JSON backup.
- `Questions CSV` exports the current paper's questions.
- `Answer CSV` exports the current paper's answer key.
- `Print` opens the browser print flow with a clean A4 paper layout.
- `Word` downloads a `.docx` file. You can export only the question paper or include the answer key.

### Data Storage

Papers are stored locally in your browser, not on a server. Use `Backup` regularly if the papers are important, especially before clearing browser data or switching devices.

## For Developers

### Project Structure

```text
.
├── index.html          # App markup, modals, print styles, and CDN script/style links
├── styles.css          # Application layout and responsive UI styles
├── script.js           # App state, rendering, editors, import/export, DOCX generation
├── test_importer.js    # Node-based tests for question import parsing and answer validation
├── scratch/            # Scratch/test scripts
└── archive/            # Archived copy of an earlier app state
```

### Runtime Model

This is a no-build static app. There is no package manifest and no local bundling step. The browser loads these external libraries from CDNs:

- KaTeX for equation rendering.
- Mermaid for diagram rendering.
- MathLive for the visual math editor.

Core app state is stored under the `school_mcq_paper_studio_v1` `localStorage` key. Custom equations, favorite formulas, and recent formulas use separate `localStorage` keys.

### Run Locally

You can open `index.html` directly in a browser. If you prefer serving it over HTTP, run:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

### Run Tests

The current automated test coverage focuses on import parsing and answer validation:

```bash
node test_importer.js
```

The test file dynamically extracts selected functions from `script.js`, so keep function names stable when changing parser-related code or update the tests with the change.

### Development Notes

- Keep the app usable without a build system unless you intentionally introduce one.
- Preserve the JSON backup format when possible so existing users can import older backups.
- When changing question data shape, update `normalize()` in `script.js` so older saved papers are migrated safely at load time.
- Print behavior is mostly controlled by the inline `@media print` styles in `index.html`.
- Word export is generated client-side in `script.js`; changes to rich content tokens may also need updates in the DOCX parsing/export functions.
- CSV import depends on `IMPORT_QUESTIONS_REQUIRED_HEADERS`, `parseImportQuestionsCsv()`, and related parser helpers in `script.js`.
- The app expects exactly four options per MCQ, labelled `A` through `D`.

## License

See `LICENSE`.
