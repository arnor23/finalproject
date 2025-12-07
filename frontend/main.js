const API_URL = "https://notearnor-backend-997782379919.us-central1.run.app";

async function fetchNotes() {
  const notesContainer = document.getElementById('notes');
  notesContainer.innerHTML = '';
  try {
    const res = await fetch(`${API_URL}/notes`);
    if (!res.ok) throw new Error('Network response not ok');
    const notes = await res.json();
    if (!notes || notes.length === 0) {
      notesContainer.innerHTML = '<p class="no-notes">No notes yet</p>';
      return;
    }
    notes.forEach(note => {
      const card = document.createElement('div');
      card.className = 'note-card';
      card.innerHTML = `
        <div>
          <h3>\${note.title}</h3>
          <p>\${note.description}</p>
        </div>
        <div class="buttons">
          <button class="edit" onclick="editNote(\${note.id})">Edit</button>
          <button class="delete" onclick="deleteNote(\${note.id})">Delete</button>
        </div>
      `;
      notesContainer.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    notesContainer.innerHTML = '<p class="error">Error loading notes — check API URL and CORS</p>';
  }
}

async function createNote() {
  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  if (!title || !description) return alert('Please enter title and description');
  await fetch(`${API_URL}/notes`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ title, description })
  });
  document.getElementById('title').value = '';
  document.getElementById('description').value = '';
  fetchNotes();
}

async function deleteNote(id) {
  if (!confirm('Delete this note?')) return;
  await fetch(`${API_URL}/notes/${id}`, { method: 'DELETE' });
  fetchNotes();
}

async function editNote(id) {
  const newTitle = prompt('New title:');
  if (newTitle === null) return;
  const newDesc = prompt('New description:');
  if (newDesc === null) return;
  await fetch(`${API_URL}/notes/${id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ title: newTitle, description: newDesc })
  });
  fetchNotes();
}

document.getElementById('addBtn').addEventListener('click', createNote);
fetchNotes();
