import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class Database {
  constructor() {
    this.data = {
      users: [],
      courses: [],
      lessons: [],
      quizzes: [],
      quiz_results: [],
      ai_conversations: [],
      study_plans: [],
      flashcard_decks: [],
      flashcards: [],
      assignments: [],
      assignment_submissions: [],
      notifications: [],
      achievements: [],
      user_achievements: [],
      user_progress: [],
      documents: [],
      system_settings: {
        platformName: 'EduAI',
        allowRegistration: true,
        maintenanceMode: false,
        aiModel: 'gemini-1.5-flash',
        aiEnabled: true,
        defaultLanguage: 'en',
        updatedAt: new Date().toISOString()
      }
    };
    this.saveTimeout = null;
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        this.data = { ...this.data, ...parsed };
      } else {
        this.saveSync();
      }
    } catch (err) {
      console.error('Failed to load database file, initializing clean state:', err);
    }
  }

  saveSync() {
    try {
      const tempFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(this.data, null, 2), 'utf8');
      fs.renameSync(tempFile, DB_FILE);
    } catch (err) {
      console.error('Error saving database:', err);
    }
  }

  queueSave() {
    if (this.saveTimeout) clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => {
      this.saveSync();
    }, 150);
  }

  collection(name) {
    if (!this.data[name]) {
      this.data[name] = [];
    }

    const col = this.data[name];
    const self = this;

    return {
      find(predicate = () => true) {
        if (typeof predicate === 'object') {
          const matchObj = predicate;
          predicate = (item) => Object.entries(matchObj).every(([k, v]) => item[k] === v);
        }
        return [...col.filter(predicate)];
      },

      findOne(predicate) {
        if (typeof predicate === 'object') {
          const matchObj = predicate;
          predicate = (item) => Object.entries(matchObj).every(([k, v]) => item[k] === v);
        }
        const item = col.find(predicate);
        return item ? { ...item } : null;
      },

      findById(id) {
        const item = col.find((i) => i.id === id);
        return item ? { ...item } : null;
      },

      insert(doc) {
        const newDoc = {
          id: doc.id || `id_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...doc
        };
        col.push(newDoc);
        self.queueSave();
        return { ...newDoc };
      },

      update(id, updates) {
        const index = col.findIndex((i) => i.id === id);
        if (index === -1) return null;
        col[index] = {
          ...col[index],
          ...updates,
          updatedAt: new Date().toISOString()
        };
        self.queueSave();
        return { ...col[index] };
      },

      delete(id) {
        const index = col.findIndex((i) => i.id === id);
        if (index === -1) return false;
        col.splice(index, 1);
        self.queueSave();
        return true;
      },

      deleteMany(predicate) {
        if (typeof predicate === 'object') {
          const matchObj = predicate;
          predicate = (item) => Object.entries(matchObj).every(([k, v]) => item[k] === v);
        }
        const initialLen = col.length;
        const kept = col.filter((item) => !predicate(item));
        col.length = 0;
        col.push(...kept);
        self.queueSave();
        return initialLen - kept.length;
      },

      count(predicate = () => true) {
        if (typeof predicate === 'object') {
          const matchObj = predicate;
          predicate = (item) => Object.entries(matchObj).every(([k, v]) => item[k] === v);
        }
        return col.filter(predicate).length;
      }
    };
  }

  getSettings() {
    return { ...this.data.system_settings };
  }

  updateSettings(updates) {
    this.data.system_settings = {
      ...this.data.system_settings,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.queueSave();
    return { ...this.data.system_settings };
  }
}

export const db = new Database();
