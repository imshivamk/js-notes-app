const notesContainer = document.getElementById("notesContainer");
const createNoteForm = document.getElementById("createNoteForm");
const addNoteBtn = document.getElementById("addNoteBtn");

// Function to check login status (example; replace as per backend)

// Create note card function
function createNoteCard(note) {
  const card = document.createElement("a");
  card.className = "note-card";
  card.href = `noteDetails.html?id=${note._id}`;
  card.title = `View Note: ${note.title || "Untitled"}`;

  const title = document.createElement("h3");
  title.className = "note-title";
  title.textContent = note.title || "Untitled";

  const content = document.createElement("p");
  content.className = "note-content";
  content.textContent = note.content || "";

  const date = document.createElement("div");
  date.className = "note-date";
  const createdDate = new Date(note.createdAt);
  date.textContent = `Created: ${createdDate.toLocaleDateString()} ${createdDate.toLocaleTimeString()}`;

  card.appendChild(title);
  card.appendChild(content);
  card.appendChild(date);

  return card;
}

// Render notes array
function renderNotes(notes) {
  notesContainer.innerHTML = "";
  if (notes.length === 0) {
    notesContainer.innerHTML = `<br><h1>No notes found. <img src="./public/none.png"></img>....</h1>`;
    return;
  }
  notes.forEach((note) => notesContainer.appendChild(createNoteCard(note)));
}

// Fetch notes from backend
async function fetchNotes() {
  try {
    const response = await fetch("http://localhost:3000/api/v1/notes/", {
      credentials: "include",
    });
    const data = await response.json();

    if (data.success && Array.isArray(data.notes)) {
      renderNotes(data.notes);
    } else {
      renderNotes([]);
    }
  } catch (error) {
    notesContainer.innerHTML =
      "<p style='text-align:center;color:#ef4444;'>Failed to load notes.</p>";
    console.error("Error fetching notes:", error);
  }
}

// Handle new note form submit
createNoteForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = e.target.title.value.trim();
  const content = e.target.content.value.trim();

  if (!title || !content) {
    alert("Please fill out both title and content.");
    return;
  }

  addNoteBtn.disabled = true;
  addNoteBtn.textContent = "Adding...";

  try {
    const response = await fetch("http://localhost:3000/api/v1/notes/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ title, content }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      notesContainer.prepend(
        createNoteCard(data.note || { title, content, createdAt: new Date() })
      );
      createNoteForm.reset();
    } else {
      alert(data.message || "Failed to add note.");
    }
  } catch (error) {
    alert("Error adding note: " + error.message);
  } finally {
    addNoteBtn.disabled = false;
    addNoteBtn.textContent = "Add Note";
    window.location.reload();
  }
});

// Initial setup
window.onload = async () => {
  await renderNavbar();
  await fetchNotes();
};


