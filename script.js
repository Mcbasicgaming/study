
// ============================================
// SUBJECT DATA
// ============================================

const defaultSubjects = [
    {
        id: 'maths-cbse',
        name: 'Mathematics',
        board: 'CBSE',
        classGrade: 'Class X',
        color: 'from-blue-500 to-cyan-500',
        bgBg: 'bg-blue-500',
        icon: 'fa-calculator',
        desc: 'Algebra, Geometry, Trigonometry & Statistics'
    },
    {
        id: 'physics-icse',
        name: 'Physics',
        board: 'ICSE',
        classGrade: 'Class IX',
        color: 'from-emerald-500 to-teal-600',
        bgBg: 'bg-emerald-500',
        icon: 'fa-atom',
        desc: 'Force, Energy, Light, Sound & Electricity'
    },
    {
        id: 'chemistry-cbse',
        name: 'Chemistry',
        board: 'CBSE',
        classGrade: 'Class X',
        color: 'from-purple-500 to-indigo-600',
        bgBg: 'bg-purple-500',
        icon: 'fa-flask',
        desc: 'Chemical Reactions, Acids, Metals & Carbon'
    },
    {
        id: 'english-icse',
        name: 'English Literature',
        board: 'ICSE',
        classGrade: 'Class IX',
        color: 'from-amber-500 to-orange-500',
        bgBg: 'bg-amber-500',
        icon: 'fa-book-bookmark',
        desc: 'Merchant of Venice, Poems & Prose'
    },
    {
        id: 'biology-cbse',
        name: 'Biology',
        board: 'CBSE',
        classGrade: 'Class X',
        color: 'from-green-500 to-emerald-600',
        bgBg: 'bg-green-500',
        icon: 'fa-dna',
        desc: 'Life Processes, Control & Genetics'
    },
    {
        id: 'history-icse',
        name: 'History & Civics',
        board: 'ICSE',
        classGrade: 'Class IX',
        color: 'from-rose-500 to-red-600',
        bgBg: 'bg-rose-500',
        icon: 'fa-landmark',
        desc: 'The Harappan Civilization, Constitution & Parliament'
    },
    {
        id: 'geography-cbse',
        name: 'Geography',
        board: 'CBSE',
        classGrade: 'Class X',
        color: 'from-sky-500 to-blue-600',
        bgBg: 'bg-sky-500',
        icon: 'fa-earth-americas',
        desc: 'Resources, Agriculture, Water & Minerals'
    },
    {
        id: 'computer-icse',
        name: 'Computer Applications',
        board: 'ICSE',
        classGrade: 'Class X',
        color: 'from-violet-500 to-purple-600',
        bgBg: 'bg-violet-500',
        icon: 'fa-code',
        desc: 'Java Programming, OOPs Concepts & Arrays'
    }
];


// ============================================
// INITIAL NOTES
// ============================================

const initialNotes = [
    {
        id: 'note-1',
        subjectId: 'maths-cbse',
        title: 'Quadratic Equations Formulas',
        content: '<h1>Quadratic Formula Summary</h1><p>The standard form is <b>ax² + bx + c = 0</b>.</p><p>Formula: <i>x = (-b ± √(b² - 4ac)) / 2a</i></p><p>Discriminant Δ = b² - 4ac:</p><ul><li>Δ > 0: Two distinct real roots</li><li>Δ = 0: Two equal real roots</li><li>Δ < 0: No real roots</li></ul>',
        date: 'Oct 26, 2026'
    },
    {
        id: 'note-2',
        subjectId: 'maths-cbse',
        title: 'Triangles Theorems - Class X',
        content: '<h2>Basic Proportionality Theorem</h2><p>If a line is drawn parallel to one side of a triangle, the other two sides are divided in the same ratio.</p>',
        date: 'Oct 20, 2026'
    },
    {
        id: 'note-3',
        subjectId: 'physics-icse',
        title: "Newton's Laws of Motion",
        content: "<h1>Newton's First & Second Laws</h1><p><b>First Law:</b> Every body continues in its state of rest unless acted upon by an external force.</p><p><b>Second Law:</b> Force is directly proportional to rate of change of momentum (F = ma).</p>",
        date: 'Oct 15, 2026'
    }
];


// ============================================
// APP STATE
// ============================================

let subjects = defaultSubjects;
let notes = [];

let currentSubjectId = null;
let editingNoteId = null;
let currentBoardFilter = 'ALL';

let activeEditorImage = null;
let savedEditorRange = null;

// Tracks the page currently being edited.
let activeEditorPage = null;


// ============================================
// INITIALIZATION
// ============================================

window.onload = function () {

    const storedNotes = localStorage.getItem('educentral_notes');

    if (storedNotes) {

        try {
            notes = JSON.parse(storedNotes);

        } catch (e) {

            notes = initialNotes;
        }

    } else {

        notes = initialNotes;
        saveNotesToLocalStorage();
    }

    renderSubjectCards();
    navigateTo('home');

    // Remember the cursor position inside the editor.

    document.addEventListener('selectionchange', saveEditorSelection);

    const editorPages = document.getElementById('editorPages');

    // Track the page currently being edited.

    editorPages.addEventListener('focusin', function (e) {

        const editor = e.target.closest('.editor-page-content');

        if (editor) {
            activeEditorPage = editor;
        }

    });

    // Track clicked pages and select images.

    editorPages.addEventListener('click', function (e) {

        const editor = e.target.closest('.editor-page-content');

        if (editor) {
            activeEditorPage = editor;
        }

        if (e.target.tagName === 'IMG') {

            selectEditorImage(e.target);

        } else if (!editor) {

            clearSelectedImage();
        }

    });

    // Allow deleting a selected image with Delete or Backspace.

    document.addEventListener('keydown', function (e) {

        if (!activeEditorImage) return;

        if (
            e.key === 'Delete' &&
            !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)
        ) {

            e.preventDefault();
            deleteSelectedImage();
        }

    });

};


function saveNotesToLocalStorage() {

    localStorage.setItem('educentral_notes', JSON.stringify(notes));

}


// ============================================
// NAVIGATION
// ============================================

function navigateTo(page, params = {}) {

    document.getElementById('pageHome').classList.add('hidden');
    document.getElementById('pageSubject').classList.add('hidden');
    document.getElementById('pageEditor').classList.add('hidden');

    if (page === 'home') {

        document.getElementById('pageHome').classList.remove('hidden');

        renderSubjectCards();

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

    }

    else if (page === 'subject') {

        currentSubjectId = params.subjectId;

        renderSubjectPage(currentSubjectId);

        document.getElementById('pageSubject').classList.remove('hidden');

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

    }

    else if (page === 'editor') {

        document.getElementById('pageEditor').classList.remove('hidden');

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

    }

}


// ============================================
// SUBJECT FILTERING
// ============================================

function filterBoard(board) {

    currentBoardFilter = board;

    ['All', 'CBSE', 'ICSE'].forEach(b => {

        const btn = document.getElementById(`tabBoard${b}`);

        if (!btn) return;

        if (b.toUpperCase() === board) {

            btn.className = "px-3 py-1.5 rounded-lg bg-white shadow-sm text-slate-800 font-bold";

        } else {

            btn.className = "px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900";
        }

    });

    renderSubjectCards();

}


// ============================================
// HOME SUBJECT CARDS
// ============================================

function renderSubjectCards() {

    const grid = document.getElementById('subjectGrid');

    grid.innerHTML = '';

    const filtered = currentBoardFilter === 'ALL'
        ? subjects
        : subjects.filter(s => s.board.toUpperCase() === currentBoardFilter);

    filtered.forEach(sub => {

        const count = notes.filter(n => n.subjectId === sub.id).length;

        const card = document.createElement('div');

        card.className = "group relative bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden";

        card.onclick = () => navigateTo('subject', {
            subjectId: sub.id
        });

        card.innerHTML = `

            <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${sub.color} opacity-10 rounded-bl-full"></div>

            <div>

                <div class="flex items-center justify-between mb-4">

                    <div class="w-12 h-12 rounded-xl bg-gradient-to-tr ${sub.color} text-white flex items-center justify-center text-xl shadow-md">

                        <i class="fa-solid ${sub.icon}"></i>

                    </div>

                </div>

                <h4 class="font-bold text-slate-900 text-lg group-hover:text-brand-600">

                    ${sub.name}

                </h4>

                <p class="text-xs text-slate-500 mt-1 line-clamp-2">

                    ${sub.desc}

                </p>

            </div>

            <div class="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">

                <span class="font-semibold text-slate-600">

                    <i class="fa-regular fa-file-lines text-slate-400"></i>

                    ${count} ${count === 1 ? 'Note' : 'Notes'}

                </span>

                <span class="text-brand-600 font-bold">

                    Open <i class="fa-solid fa-chevron-right text-xs"></i>

                </span>

            </div>

        `;

        grid.appendChild(card);

    });

}


// ============================================
// SUBJECT PAGE
// ============================================

function renderSubjectPage(subId) {

    const subject = subjects.find(s => s.id === subId);

    if (!subject) return;

    const banner = document.getElementById('subjectBanner');

    banner.className = `rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden bg-gradient-to-r ${subject.color}`;

    document.getElementById('subjectTitle').innerText = subject.name;

    document.getElementById('subjectSubtitle').innerText =
        `${subject.desc} • ${subject.board} Curriculum`;

    document.getElementById('subjectBoardBadge').innerText =
        subject.board + ' BOARD';

    document.getElementById('subjectClassBadge').innerText =
        subject.classGrade;

    document.getElementById('subjectIconLarge').innerHTML =
        `<i class="fa-solid ${subject.icon}"></i>`;

    renderSubjectNotesList();

}


// ============================================
// NOTES GRID
// ============================================

function renderSubjectNotesList() {

    const grid = document.getElementById('notesGrid');

    const emptyState = document.getElementById('emptyNotesState');

    grid.innerHTML = '';

    const searchVal = (
        document.getElementById('subjectNoteSearch')?.value || ''
    ).toLowerCase();

    const subNotes = notes.filter(n =>

        n.subjectId === currentSubjectId &&

        (
            n.title.toLowerCase().includes(searchVal) ||
            (n.content || '').toLowerCase().includes(searchVal)
        )

    );

    document.getElementById('subjectNoteCountTotal').innerText =
        subNotes.length;

    document.getElementById('mobileNoteCount').innerText =
        `${subNotes.length} Notes`;

    if (subNotes.length === 0) {

        emptyState.classList.remove('hidden');

        return;

    }

    emptyState.classList.add('hidden');

    subNotes.forEach(note => {

        const tempDiv = document.createElement('div');

        tempDiv.innerHTML = note.content || '';

        const textSnippet =
            tempDiv.textContent || tempDiv.innerText || '';

        const noteCard = document.createElement('div');

        noteCard.className =
            "bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative";

        noteCard.innerHTML = `

            <div>

                <div class="flex items-start justify-between gap-2 mb-2">

                    <h4 class="font-bold text-slate-800 text-base line-clamp-1">

                        ${escapeHtml(note.title)}

                    </h4>

                    <div class="flex items-center space-x-1">

                        <button onclick="editNote('${note.id}')"
                            title="Edit Note"
                            class="p-1.5 text-slate-400 hover:text-brand-600 rounded-lg">

                            <i class="fa-solid fa-pen-to-square"></i>

                        </button>

                        <button onclick="deleteNote('${note.id}')"
                            title="Delete Note"
                            class="p-1.5 text-slate-400 hover:text-red-600 rounded-lg">

                            <i class="fa-regular fa-trash-can"></i>

                        </button>

                    </div>

                </div>

                <p class="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">

                    ${escapeHtml(textSnippet) || 'No text content in this note.'}

                </p>

            </div>

            <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">

                <span>
                    <i class="fa-regular fa-calendar"></i>
                    ${note.date}
                </span>

                <button onclick="editNote('${note.id}')"
                    class="text-brand-600 font-semibold hover:underline">

                    Read / Edit

                </button>

            </div>

        `;

        grid.appendChild(noteCard);

    });

}


function filterSubjectNotes() {

    renderSubjectNotesList();

}


// ============================================
// CREATE NEW NOTE
// ============================================

function openEditorForNewNote() {

    editingNoteId = null;

    activeEditorImage = null;

    const sub = subjects.find(s => s.id === currentSubjectId);

    document.getElementById('documentTitleInput').value =
        "Untitled Study Note";

    document.getElementById('editorSubjectBadge').innerText =
        sub ? `${sub.name} (${sub.board})` : 'General';

    renderEditorPages([
        '<p>Start typing your lecture summary, formula list, or exam revision points here...</p>'
    ]);

    updateWordCount();

    navigateTo('editor');

}


function createNewNoteQuick() {

    currentSubjectId = subjects[0].id;

    openEditorForNewNote();

}


// ============================================
// EDIT EXISTING NOTE
// ============================================

function editNote(noteId) {

    const note = notes.find(n => n.id === noteId);

    if (!note) return;

    editingNoteId = note.id;

    currentSubjectId = note.subjectId;

    const sub = subjects.find(s => s.id === currentSubjectId);

    document.getElementById('documentTitleInput').value = note.title;

    document.getElementById('editorSubjectBadge').innerText =
        sub ? `${sub.name} (${sub.board})` : 'General';

    // Load multiple-page format.
    // Old notes are automatically converted to one page.

    let pages;

    if (Array.isArray(note.pages) && note.pages.length > 0) {

        pages = note.pages;

    } else {

        pages = [note.content || '<p></p>'];

    }

    renderEditorPages(pages);

    activeEditorImage = null;

    updateWordCount();

    navigateTo('editor');

}


// ============================================
// MULTIPLE PAGE SYSTEM
// ============================================

function updatePageNumbers() {

    const pages = document.querySelectorAll(
        '#editorPages .word-page'
    );

    pages.forEach((page, index) => {

        const editor = page.querySelector('.editor-page-content');

        const footer = page.querySelector('.document-footer');

        editor.dataset.pageIndex = index;

        if (index === 0) {

            editor.id = 'editorCanvas';

        } else {

            editor.removeAttribute('id');

        }

        footer.querySelector('span:first-child').innerText =
            `Page ${index + 1}`;

    });

}


function renderEditorPages(pages) {

    const container = document.getElementById('editorPages');

    container.innerHTML = '';

    // Always render at least one page.

    if (!Array.isArray(pages) || pages.length === 0) {
        pages = ['<p><br></p>'];
    }

    pages.forEach((content) => {

        const page = document.createElement('div');

        page.className = 'word-page bg-white border border-slate-200';

        page.innerHTML = `

            <div
                class="editor-page-content text-slate-800 text-base"
                contenteditable="true"
                oninput="updateWordCount()"
            ></div>

            <div class="document-footer">

                <span></span>

                <span>Format: Standard A4</span>

            </div>

        `;

        container.appendChild(page);

        const editor = page.querySelector('.editor-page-content');

        editor.innerHTML = content || '<p><br></p>';

    });

    updatePageNumbers();

    activeEditorPage = container.querySelector(
        '.editor-page-content'
    );

}


// ============================================
// ADD NEW PAGE
// ============================================

function addNewPage() {

    const container = document.getElementById('editorPages');

    const pages = Array.from(
        container.querySelectorAll('.word-page')
    );

    if (pages.length === 0) return;

    // Identify the page currently being edited.

    let currentPage = activeEditorPage
        ? activeEditorPage.closest('.word-page')
        : pages[pages.length - 1];

    if (!currentPage || !container.contains(currentPage)) {

        currentPage = pages[pages.length - 1];

    }

    const page = document.createElement('div');

    page.className = 'word-page bg-white border border-slate-200';

    page.innerHTML = `

        <div
            class="editor-page-content text-slate-800 text-base"
            contenteditable="true"
            oninput="updateWordCount()"
        >
            <p><br></p>
        </div>

        <div class="document-footer">

            <span></span>

            <span>Format: Standard A4</span>

        </div>

    `;

    // Insert immediately after the current page.

    currentPage.after(page);

    updatePageNumbers();

    const editor = page.querySelector('.editor-page-content');

    activeEditorPage = editor;

    // Clear any previously selected image or cursor range.

    clearSelectedImage();

    savedEditorRange = null;

    editor.focus();

    page.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });

    updateWordCount();

    const pageNumber = Number(editor.dataset.pageIndex) + 1;

    showToast(`Page ${pageNumber} added successfully!`);

}


// ============================================
// DELETE CURRENT PAGE
// ============================================

function deleteCurrentPage() {

    const container = document.getElementById('editorPages');

    const pages = Array.from(
        container.querySelectorAll('.word-page')
    );

    // Prevent deletion of the last remaining page.

    if (pages.length <= 1) {

        showToast("You cannot delete the last remaining page.");

        return;

    }

    let currentEditor = activeEditorPage;

    if (!currentEditor || !container.contains(currentEditor)) {

        currentEditor = pages[pages.length - 1]
            .querySelector('.editor-page-content');

    }

    const currentPage = currentEditor.closest('.word-page');

    const pageNumber =
        Number(currentEditor.dataset.pageIndex) + 1;

    const confirmed = confirm(
        `Are you sure you want to delete Page ${pageNumber}?`
    );

    if (!confirmed) return;

    // Select the next page, or previous page if this is the last one.

    let nextPage = currentPage.nextElementSibling;

    if (!nextPage) {

        nextPage = currentPage.previousElementSibling;

    }

    // Delete the selected page.

    currentPage.remove();

    // Update page numbers and indexes.

    updatePageNumbers();

    // Set the next active page.

    activeEditorPage = nextPage.querySelector(
        '.editor-page-content'
    );

    clearSelectedImage();

    savedEditorRange = null;

    activeEditorPage.focus();

    nextPage.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });

    updateWordCount();

    showToast(`Page ${pageNumber} deleted successfully!`);

}


// ============================================
// SAVE NOTE
// ============================================

function saveCurrentNote() {

    const title =
        document.getElementById('documentTitleInput').value.trim()
        || "Untitled Note";

    const editors = document.querySelectorAll('.editor-page-content');

    const pages = Array.from(editors).map(editor => editor.innerHTML);

    // Keep combined content for compatibility
    // with existing note previews and searches.

    const content = pages.join('<hr>');

    const today = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    if (editingNoteId) {

        const noteIndex = notes.findIndex(n => n.id === editingNoteId);

        if (noteIndex !== -1) {

            notes[noteIndex].title = title;

            notes[noteIndex].content = content;

            notes[noteIndex].pages = pages;

            notes[noteIndex].date = today;

        }

        showToast("Note updated successfully!");

    } else {

        const newNote = {

            id: 'note-' + Date.now(),

            subjectId: currentSubjectId,

            title: title,

            content: content,

            pages: pages,

            date: today

        };

        notes.unshift(newNote);

        showToast("New note saved successfully!");

    }

    saveNotesToLocalStorage();

    navigateTo('subject', {
        subjectId: currentSubjectId
    });

}


// ============================================
// DELETE NOTE
// ============================================

function deleteNote(noteId) {

    if (confirm("Are you sure you want to delete this document note?")) {

        notes = notes.filter(n => n.id !== noteId);

        saveNotesToLocalStorage();

        renderSubjectNotesList();

        showToast("Note deleted");

    }

}


// ============================================
// CANCEL EDITOR
// ============================================

function cancelEditor() {

    if (confirm("Return to subject without saving recent changes?")) {

        navigateTo('subject', {
            subjectId: currentSubjectId
        });

    }

}


// ============================================
// WORD COUNT
// ============================================

function updateWordCount() {

    const editors = document.querySelectorAll('.editor-page-content');

    let text = '';

    editors.forEach(editor => {

        text += ' ' + (editor.innerText || editor.textContent || '');

    });

    const words = text.trim()
        ? text.trim().split(/\s+/).length
        : 0;

    const chars = text.trim().length;

    const wordDisplay = document.getElementById('wordCountDisplay');

    const charDisplay = document.getElementById('charCountDisplay');

    if (wordDisplay) {

        wordDisplay.innerText =
            `${words} ${words === 1 ? 'Word' : 'Words'}`;

    }

    if (charDisplay) {

        charDisplay.innerText =
            `${chars} Characters`;

    }

}


// ============================================
// EDITOR CURSOR MANAGEMENT
// ============================================

function saveEditorSelection() {

    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);

    const editors = document.querySelectorAll('.editor-page-content');

    for (const editor of editors) {

        if (editor.contains(range.commonAncestorContainer)) {

            savedEditorRange = range.cloneRange();

            activeEditorPage = editor;

            return;

        }

    }

}


function restoreEditorSelection() {

    if (!savedEditorRange) return;

    try {

        const selection = window.getSelection();

        selection.removeAllRanges();

        selection.addRange(savedEditorRange);

    } catch (e) {

        console.log("Could not restore editor cursor.");

    }

}


// ============================================
// WORD PROCESSOR COMMANDS
// ============================================

function execCmd(command, value = null) {

    restoreEditorSelection();

    document.execCommand(command, false, value);

    const selection = window.getSelection();

    if (selection && selection.rangeCount > 0) {

        savedEditorRange = selection.getRangeAt(0).cloneRange();

    }

    const editors = document.querySelectorAll('.editor-page-content');

    editors.forEach(editor => {

        if (editor.contains(selection?.anchorNode)) {

            editor.focus();

            activeEditorPage = editor;

        }

    });

    updateWordCount();

}


// ============================================
// IMAGE SELECTION
// ============================================

function selectEditorImage(img) {

    clearSelectedImage();

    activeEditorImage = img;

    img.classList.add('selected-editor-image');

    const editor = img.closest('.editor-page-content');

    if (editor) {
        activeEditorPage = editor;
    }

}


function clearSelectedImage() {

    if (activeEditorImage) {

        activeEditorImage.classList.remove('selected-editor-image');

    }

    activeEditorImage = null;

}


// ============================================
// INSERT IMAGE
// ============================================

function insertImagePrompt() {

    const url = prompt(
        "Enter Image URL:",
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600"
    );

    if (!url) return;

    let imageURL;

    try {

        imageURL = new URL(url);

        if (!['http:', 'https:'].includes(imageURL.protocol)) {

            showToast("Please enter a valid HTTP or HTTPS image URL.");

            return;

        }

    } catch (e) {

        showToast("Invalid image URL.");

        return;

    }

    restoreEditorSelection();

    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) {

        showToast("Click inside a page before inserting an image.");

        return;

    }

    const range = selection.getRangeAt(0);

    const editor = range.commonAncestorContainer.nodeType === 1
        ? range.commonAncestorContainer.closest('.editor-page-content')
        : range.commonAncestorContainer.parentElement.closest('.editor-page-content');

    if (!editor) {

        showToast("Click inside a page before inserting an image.");

        return;

    }

    activeEditorPage = editor;

    const img = document.createElement('img');

    img.src = imageURL.href;

    img.alt = 'Inserted study image';

    img.style.width = '300px';

    img.style.height = 'auto';

    img.style.maxWidth = '100%';

    const paragraph = document.createElement('p');

    paragraph.innerHTML = '<br>';

    const fragment = document.createDocumentFragment();

    fragment.appendChild(img);

    fragment.appendChild(paragraph);

    range.deleteContents();

    range.insertNode(fragment);

    // Move cursor into the paragraph below the image.

    const newRange = document.createRange();

    newRange.setStart(paragraph, 0);

    newRange.collapse(true);

    selection.removeAllRanges();

    selection.addRange(newRange);

    savedEditorRange = newRange.cloneRange();

    selectEditorImage(img);

    updateWordCount();

    showToast("Image inserted! You can write below it.");

}


// ============================================
// RESIZE SELECTED IMAGE
// ============================================

function resizeSelectedImage() {

    if (!activeEditorImage) {

        showToast("First click an image to select it.");

        return;

    }

    const currentWidth = Math.round(
        activeEditorImage.getBoundingClientRect().width
    );

    const newWidth = prompt(
        "Enter image width in pixels:",
        currentWidth
    );

    if (newWidth === null) return;

    const width = Number(newWidth);

    if (!Number.isFinite(width) || width < 30 || width > 2000) {

        showToast("Enter a width between 30 and 2000 pixels.");

        return;

    }

    activeEditorImage.style.width = width + 'px';

    activeEditorImage.style.height = 'auto';

    showToast("Image resized successfully!");

}


// ============================================
// DELETE SELECTED IMAGE
// ============================================

function deleteSelectedImage() {

    if (!activeEditorImage) {

        showToast("First click an image to select it.");

        return;

    }

    const image = activeEditorImage;

    const parent = image.parentElement;

    image.remove();

    clearSelectedImage();

    // Keep an editable paragraph if the image was the only content.

    if (
        parent &&
        parent.classList.contains('editor-page-content') &&
        !parent.innerHTML.trim()
    ) {

        parent.innerHTML = '<p><br></p>';

    }

    updateWordCount();

    showToast("Image deleted successfully!");

}


// ============================================
// MATH SYMBOLS
// ============================================

function insertMathSymbol() {

    document.getElementById('mathModal').classList.remove('hidden');

}


function closeMathModal() {

    document.getElementById('mathModal').classList.add('hidden');

}


function insertChar(char) {

    execCmd('insertText', char);

    closeMathModal();

}


// ============================================
// INSERT TABLE
// ============================================

function insertTable() {

    const tableHTML = `

        <table>

            <thead>

                <tr>
                    <th>Topic / Concept</th>
                    <th>Key Formula / Definition</th>
                </tr>

            </thead>

            <tbody>

                <tr>
                    <td>Sample Row 1</td>
                    <td>Value 1</td>
                </tr>

                <tr>
                    <td>Sample Row 2</td>
                    <td>Value 2</td>
                </tr>

            </tbody>

        </table>

        <p><br></p>

    `;

    execCmd('insertHTML', tableHTML);

}


// ============================================
// PDF EXPORT
// ============================================

function exportToPdfSimulation() {

    showToast("Preparing document for PDF download...");

    setTimeout(() => {

        window.print();

    }, 600);

}


// ============================================
// GLOBAL SEARCH
// ============================================

function handleGlobalSearch() {

    const query = document.getElementById('globalSearchInput')
        .value.toLowerCase().trim();

    if (!query) return;

    console.log("Searching globally for:", query);

}


// ============================================
// TOAST NOTIFICATIONS
// ============================================

function showToast(message) {

    const toast = document.getElementById('toast');

    const toastMsg = document.getElementById('toastMessage');

    toastMsg.innerText = message;

    toast.classList.remove(
        'opacity-0',
        'pointer-events-none',
        'translate-y-3'
    );

    setTimeout(() => {

        toast.classList.add(
            'opacity-0',
            'pointer-events-none',
            'translate-y-3'
        );

    }, 3000);

}


// ============================================
// NOTIFICATION MODAL
// ============================================

function toggleNotificationModal() {

    const modal = document.getElementById('notificationModal');

    modal.classList.toggle('hidden');

}


// ============================================
// HTML ESCAPE
// ============================================

function escapeHtml(str) {

    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}





function changeFontSize(size) {
    if (!size) return;

    restoreEditorSelection();

    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) {
        return;
    }

    const range = selection.getRangeAt(0);

    if (range.collapsed) {
        showToast("Select some text first!");
        return;
    }

    const span = document.createElement("span");
    span.style.fontSize = size + "px";

    try {
        const contents = range.extractContents();
        span.appendChild(contents);
        range.insertNode(span);

        selection.removeAllRanges();

        const newRange = document.createRange();
        newRange.selectNodeContents(span);
        selection.addRange(newRange);

        saveEditorSelection();
        updateWordCount();
    } catch (error) {
        console.error("Font size error:", error);
    }
}