// Custom image persistence using IndexedDB and in-memory cache
// Allows the user to drop or upload their custom neon car images (auto20s.png, sedan50s.png, muscle70s.png, superdeportivo.png)

const DB_NAME = 'Car2048Assets';
const STORE_NAME = 'custom_images';
const DB_VERSION = 1;

let memoryCache: Record<string, string> = {};
const listeners = new Set<() => void>();

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function initCustomImages(): Promise<Record<string, string>> {
  try {
    const db = await openDb();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);

    const keysReq = store.getAllKeys();
    const valsReq = store.getAll();

    return new Promise((resolve) => {
      tx.oncomplete = () => {
        const keys = keysReq.result as string[];
        const vals = valsReq.result as string[];
        const loaded: Record<string, string> = {};
        keys.forEach((k, idx) => {
          loaded[k] = vals[idx];
        });
        memoryCache = loaded;
        notifyListeners();
        resolve(loaded);
      };
      tx.onerror = () => {
        resolve(memoryCache);
      };
    });
  } catch {
    return memoryCache;
  }
}

export function getCustomImageSync(filename: string): string | null {
  const cleanName = filename.replace(/^(\.\/|\/)/, '').replace(/^assets\//, '');
  if (memoryCache[cleanName]) return memoryCache[cleanName];
  if (typeof window !== 'undefined' && (window as unknown as { __EMBEDDED_ASSETS__?: Record<string, string> }).__EMBEDDED_ASSETS__?.[cleanName]) {
    return (window as unknown as { __EMBEDDED_ASSETS__?: Record<string, string> }).__EMBEDDED_ASSETS__![cleanName];
  }
  return null;
}

export async function saveCustomImage(filename: string, dataUrl: string): Promise<void> {
  const cleanName = filename.replace(/^(\.\/|\/)/, '').replace(/^assets\//, '');
  memoryCache[cleanName] = dataUrl;
  notifyListeners();

  try {
    const db = await openDb();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(dataUrl, cleanName);
  } catch (e) {
    console.warn('Failed to persist custom image in IndexedDB:', e);
  }
}

export async function saveMultipleCustomImages(files: FileList | File[]): Promise<string[]> {
  const updated: string[] = [];
  const fileArray = Array.from(files);

  for (const file of fileArray) {
    const rawName = file.name.toLowerCase();
    const nameWithoutExt = rawName.replace(/\.[^/.]+$/, '');
    const targets: string[] = [];

    // Check for direct number 1 to 18 in filename (e.g., "1.png", "level 4", "nivel_5", "18")
    const matchNum = rawName.match(/(?:nivel|level|fase|img|car|auto|foto|pza)?\s*([0-9]{1,2})/);
    if (matchNum) {
      const num = parseInt(matchNum[1], 10);
      if (num >= 1 && num <= 18) {
        targets.push(`${num}.png`);
      }
    }

    if (rawName.includes('auto') || rawName.includes('20') || rawName.includes('clasico') || rawName.includes('vintage')) {
      targets.push('5.png');
      targets.push('auto20s.png');
    } else if (rawName.includes('sedan') || rawName.includes('50') || rawName.includes('cian') || rawName.includes('cyan')) {
      targets.push('7.png');
      targets.push('sedan50s.png');
    } else if (rawName.includes('muscle') || rawName.includes('70') || rawName.includes('naranja') || rawName.includes('orange')) {
      targets.push('9.png');
      targets.push('muscle70s.png');
    } else if (rawName.includes('super') || rawName.includes('moderno') || rawName.includes('magenta') || rawName.includes('pink') || rawName.includes('2048') || rawName.includes('svj')) {
      targets.push('11.png');
      targets.push('superdeportivo.png');
    } else if (rawName.includes('tuerca')) {
      targets.push('1.png');
    } else if (rawName.includes('engranaje')) {
      targets.push('2.png');
    } else if (rawName.includes('volante')) {
      targets.push('3.png');
    } else if (rawName.includes('chasis')) {
      targets.push('4.png');
    } else if (rawName.includes('taller')) {
      targets.push('6.png');
    } else if (rawName.includes('motor') || rawName.includes('v8')) {
      targets.push('8.png');
    } else if (rawName.includes('aleron')) {
      targets.push('10.png');
    } else if (rawName.includes('neumatico') || rawName.includes('rueda')) {
      targets.push('12.png');
    } else if (rawName.includes('hipercoche') || rawName.includes('4096')) {
      targets.push('13.png');
    } else if (rawName.includes('nave') || rawName.includes('interdimensional') || rawName.includes('8192')) {
      targets.push('14.png');
    }

    // Direct filename fallback
    if (rawName.endsWith('.png') || rawName.endsWith('.jpg') || rawName.endsWith('.jpeg') || rawName.endsWith('.webp')) {
      targets.push(file.name);
      if (rawName.endsWith('.png')) {
        targets.push(rawName);
      }
    }

    const uniqueTargets = Array.from(new Set(targets));
    if (uniqueTargets.length > 0) {
      const dataUrl = await readFileAsDataUrl(file);
      for (const t of uniqueTargets) {
        await saveCustomImage(t, dataUrl);
        updated.push(t);
      }
    }
  }

  return updated;
}

export async function clearCustomImages(): Promise<void> {
  memoryCache = {};
  notifyListeners();
  try {
    const db = await openDb();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).clear();
  } catch (e) {
    console.warn('Failed to clear IndexedDB:', e);
  }
}

export function onCustomImagesChange(callback: () => void): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function notifyListeners() {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch (e) {
      console.error(e);
    }
  });
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
