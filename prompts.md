Modify the existing MCQ Question Paper Creator application to support BOTH Single Correct Answer and Multiple Correct Answers.

IMPORTANT:
- Do NOT remove or break any existing features.
- Do NOT redesign the existing UI unnecessarily.
- Existing Single Correct questions must continue working exactly as they do now.
- Make the changes throughout the application wherever questions, answers, CSV import/export, preview, student selection, answer keys, and Word/PDF printing are handled.

FEATURE:

1. ADD QUESTION TYPE

Add a Question Type option for every question:

- Single Correct
- Multiple Correct

Default should remain:
Single Correct

For Single Correct:
- Teacher can select only ONE correct answer.
- Use radio-button behavior for selecting the correct answer.

For Multiple Correct:
- Teacher can select TWO OR MORE correct answers.
- Use checkbox behavior for selecting correct answers.
- Teacher must be able to select multiple options such as A, B, D.
- Do not allow duplicate selections.

2. QUESTION DATA MODEL

Update the question data model so that it supports:

Single Correct:
correct_option: "A"

Multiple Correct:
correct_option: ["A", "C", "D"]

OR an equivalent internal structure that safely supports multiple correct answers.

Do not break existing questions that currently store:
"A", "B", "C", or "D".

Existing questions must automatically continue to work as Single Correct questions.

3. QUESTION EDITOR UI

When the question type is Single Correct:
- Show radio buttons for A, B, C, D.
- Only one answer can be selected.

When the question type is Multiple Correct:
- Show checkboxes for A, B, C, D.
- Multiple answers can be selected.

Clearly indicate to the teacher:
"Select all correct answers"

For Single Correct:
"Select one correct answer"

If the teacher changes:
Multiple Correct → Single Correct

make sure only one correct answer remains selected.

If the teacher changes:
Single Correct → Multiple Correct

keep the existing selected answer and allow additional answers to be selected.

4. CSV IMPORT

Keep the existing CSV structure:

"section","question","option1","option2","option3","option4","correct_option"

Support both formats.

Single correct:

"Mathematics","Degree measure of a circle is ___ degrees","90","180","270","360","D"

Multiple correct:

"Mathematics","Which of the following are prime numbers?","2","3","4","5","A,B,D"

The CSV importer must recognize:
A
B
C
D

as Single Correct.

It must recognize:
A,B
A,C
A,B,D
B,C,D

as Multiple Correct.

Do not create a new CSV column unless absolutely necessary.

5. CSV EXPORT

When exporting questions:

Single Correct:
"correct_option" should contain:
"A"

Multiple Correct:
"correct_option" should contain:
"A,B,D"

Use alphabetical option order consistently.

For example:
A,B,D

NOT:
D,A,B

Make sure commas inside the correct_option field are handled correctly because the CSV fields are quoted.

6. AI / CSV IMPORT PROMPT

Update the AI/CSV import instructions so the AI understands that questions may have either:

- one correct answer
OR
- multiple correct answers.

The AI should return multiple correct answers as comma-separated option letters.

Example:

"section","question","option1","option2","option3","option4","correct_option"
"Mathematics","Which of the following are prime numbers?","2","3","4","5","A,B,D"

Do not change the existing CSV column order.

7. QUESTION PREVIEW

Update the question preview so Multiple Correct questions are clearly identified.

Example:

Question Type: Multiple Correct

Which of the following are prime numbers?

☐ A. 2
☐ B. 3
☐ C. 4
☐ D. 5

For Single Correct, continue using the existing appearance and behavior.

8. STUDENT ANSWER SELECTION

When students take/view a question:

Single Correct:
- Use radio buttons.
- Student can select exactly one option.

Multiple Correct:
- Use checkboxes.
- Student can select multiple options.

Do not allow the UI to accidentally behave like a single-select question when the question is Multiple Correct.

9. ANSWER VALIDATION

Update answer checking.

Single Correct:
Student answer must exactly match the single correct answer.

Multiple Correct:
Student must select ALL correct answers and NO incorrect answers.

Example:

Correct:
A,B,D

Student selects:
A,B,D → Correct

Student selects:
A,B → Incorrect

Student selects:
A,B,C,D → Incorrect

Student selects:
A,D → Incorrect

Do not mark a Multiple Correct question correct just because one selected answer is correct.

10. ANSWER KEY

Update the answer key to support multiple correct answers.

Single Correct:

1. A
2. C
3. D

Multiple Correct:

1. A, B, D
2. B, C
3. A, C, D

Make the formatting clean and consistent with the existing answer-key design.

11. WORD / PDF EXPORT

Make sure Multiple Correct answers are preserved when exporting/printing.

Question paper should show the appropriate selection style.

For Multiple Correct questions, students should understand that more than one answer can be selected.

Do NOT expose the answer key in the question paper when the existing "Only Question Paper" option is selected.

If "Download with Answer Key" is selected, show all correct options.

12. QUESTION DUPLICATION / COPY / EDIT

Existing features such as:
- Copy Question
- Duplicate Question
- Edit Question
- Delete Question
- Move Question
- Section management

must preserve the question type and all correct answers.

For example:

Original:
Multiple Correct
Correct: A,B,D

After Copy/Duplicate:
Multiple Correct
Correct: A,B,D

Do not reset it to Single Correct.

13. SECTION SUPPORT

Multiple Correct questions must work normally inside every section.

Do not change existing section behavior.

14. BACKWARD COMPATIBILITY

This is extremely important.

Existing data such as:

correct_option: "A"

must continue working.

Do NOT migrate or rewrite all existing questions unnecessarily.

The application must support old Single Correct questions and new Multiple Correct questions together in the same question paper.

Example:

Section: Mathematics

Q1 - Single Correct
Correct: A

Q2 - Multiple Correct
Correct: A,B,D

Q3 - Single Correct
Correct: C

Q4 - Multiple Correct
Correct: B,C

All four must work correctly in the same paper.

15. VALIDATION

For Multiple Correct questions:
- At least TWO correct options should be selected.
- Do not allow zero correct answers.
- Do not allow only one correct answer if the question type is Multiple Correct.
- Show a clear validation message to the teacher.

For Single Correct:
- Exactly ONE correct option must be selected.

16. DO NOT BREAK EXISTING FEATURES

Before modifying anything, inspect the existing code and identify:

- Question data structure
- Question creation logic
- Question editing logic
- Correct-answer selection logic
- CSV importer
- CSV exporter
- AI import
- Question preview
- Answer key generation
- Student answer selection
- Answer validation
- Word export
- PDF/print functionality
- Copy/duplicate question logic

Modify the existing implementation instead of creating duplicate systems.

Do not remove existing functionality.

17. TESTING

After implementing:

Test these cases:

TEST 1:
Single Correct
Correct = A
Student selects A
Result = Correct

TEST 2:
Single Correct
Correct = A
Student selects B
Result = Incorrect

TEST 3:
Multiple Correct
Correct = A,B,D
Student selects A,B,D
Result = Correct

TEST 4:
Multiple Correct
Correct = A,B,D
Student selects A,B
Result = Incorrect

TEST 5:
Multiple Correct
Correct = A,B,D
Student selects A,B,C,D
Result = Incorrect

TEST 6:
CSV import with:
correct_option = "A"
Must create Single Correct.

TEST 7:
CSV import with:
correct_option = "A,B,D"
Must create Multiple Correct.

TEST 8:
Export a Multiple Correct question and verify it exports:
"A,B,D"

TEST 9:
Copy/duplicate a Multiple Correct question and verify all correct answers remain.

TEST 10:
Create a paper containing both Single Correct and Multiple Correct questions and verify everything works together.

18. UI REQUIREMENT

Keep the existing application's current styling, layout, colors, buttons, sections, modals, toolbar, and overall design.

Only add the controls and visual indicators necessary for Multiple Correct functionality.

Do not introduce unnecessary UI changes.

19. IMPORTANT IMPLEMENTATION RULE

Do not simply modify the UI.

Trace the complete data flow from:

Question Creation
→ Question Model
→ Save
→ Edit
→ CSV Import
→ CSV Export
→ Preview
→ Student Selection
→ Answer Validation
→ Answer Key
→ Word/PDF/Print

Multiple Correct must work end-to-end.

Finally:
- Run the application.
- Check browser console for errors.
- Check all existing functionality.
- Verify there are no JavaScript errors.
- Verify CSS is not broken.
- Verify existing Single Correct questions still work.
- Verify Multiple Correct questions work.
- Do not make unrelated changes.
