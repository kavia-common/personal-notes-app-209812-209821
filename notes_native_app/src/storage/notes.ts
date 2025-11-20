import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note } from '../types';
import { v4 as uuidv4 } from 'uuid';

const STORE_KEY = '@notes_store_v1';

// PUBLIC_INTERFACE
export async function getAllNotes(): Promise<Note[]> {
  /** Returns all notes sorted by updatedAt desc. */
  const raw = await AsyncStorage.getItem(STORE_KEY);
  const list: Note[] = raw ? JSON.parse(raw) : [];
  return list.sort((a, b) => b.updatedAt - a.updatedAt);
}

// PUBLIC_INTERFACE
export async function getNoteById(id: string): Promise<Note | undefined> {
  /** Returns a note by id if exists. */
  const notes = await getAllNotes();
  return notes.find(n => n.id === id);
}

// PUBLIC_INTERFACE
export async function createNote(data: { title: string; content: string }): Promise<Note> {
  /** Creates a new note with generated id and timestamps. Title is required. */
  const title = data.title?.trim();
  if (!title) {
    throw new Error('Title is required');
  }
  const now = Date.now();
  const newNote: Note = {
    id: uuidv4(),
    title,
    content: data.content ?? '',
    createdAt: now,
    updatedAt: now
  };
  const notes = await getAllNotes();
  const updated = [newNote, ...notes];
  await AsyncStorage.setItem(STORE_KEY, JSON.stringify(updated));
  return newNote;
}

// PUBLIC_INTERFACE
export async function updateNote(id: string, data: { title: string; content: string }): Promise<Note> {
  /** Updates an existing note. Throws if not found or invalid title. */
  const title = data.title?.trim();
  if (!title) {
    throw new Error('Title is required');
  }
  const notes = await getAllNotes();
  const idx = notes.findIndex(n => n.id === id);
  if (idx === -1) throw new Error('Note not found');
  const updated: Note = {
    ...notes[idx],
    title,
    content: data.content ?? '',
    updatedAt: Date.now()
  };
  notes[idx] = updated;
  await AsyncStorage.setItem(STORE_KEY, JSON.stringify(notes));
  return updated;
}

// PUBLIC_INTERFACE
export async function deleteNote(id: string): Promise<void> {
  /** Deletes a note by id (no-op if not found). */
  const notes = await getAllNotes();
  const filtered = notes.filter(n => n.id !== id);
  await AsyncStorage.setItem(STORE_KEY, JSON.stringify(filtered));
}

// PUBLIC_INTERFACE
export async function searchNotes(query: string): Promise<Note[]> {
  /** Searches notes by title or content (case-insensitive). */
  const q = query.trim().toLowerCase();
  const notes = await getAllNotes();
  if (!q) return notes;
  return notes.filter(n => (n.title + ' ' + n.content).toLowerCase().includes(q));
}
