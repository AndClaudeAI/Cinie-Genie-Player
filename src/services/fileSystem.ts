export interface LocalFile {
  name: string;
  size: number;
  type: string;
  handle: FileSystemFileHandle;
}

const VIDEO_EXTENSIONS = new Set([
  'mp4', 'webm', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'ts', 'm4v', 'ogv',
]);

const SUBTITLE_EXTENSIONS = new Set(['srt', 'vtt']);

function getExtension(name: string): string {
  return name.split('.').pop()?.toLowerCase() ?? '';
}

export function isVideoFile(name: string): boolean {
  return VIDEO_EXTENSIONS.has(getExtension(name));
}

export function isSubtitleFile(name: string): boolean {
  return SUBTITLE_EXTENSIONS.has(getExtension(name));
}

export function supportsFileSystemAccess(): boolean {
  return 'showOpenFilePicker' in window && 'showDirectoryPicker' in window;
}

export async function pickVideoFiles(): Promise<LocalFile[]> {
  if (supportsFileSystemAccess()) {
    try {
      const handles = await window.showOpenFilePicker({
        multiple: true,
        types: [
          {
            description: 'Video files',
            accept: {
              'video/*': ['.mp4', '.webm', '.mkv', '.avi', '.mov', '.m4v', '.ts', '.ogv'],
            },
          },
          {
            description: 'Subtitle files',
            accept: {
              'text/*': ['.srt', '.vtt'],
            },
          },
        ],
      });
      return Promise.all(
        handles.map(async (handle) => {
          const file = await handle.getFile();
          return { name: file.name, size: file.size, type: file.type, handle };
        })
      );
    } catch {
      return [];
    }
  }
  return pickVideoFilesFallback();
}

function pickVideoFilesFallback(): Promise<LocalFile[]> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'video/*,.srt,.vtt';
    input.onchange = () => {
      const files = Array.from(input.files ?? []);
      resolve(
        files.map((f) => ({
          name: f.name,
          size: f.size,
          type: f.type,
          handle: null as unknown as FileSystemFileHandle,
          _file: f,
        }))
      );
    };
    input.oncancel = () => resolve([]);
    input.click();
  });
}

export async function pickDirectory(): Promise<LocalFile[]> {
  if (!supportsFileSystemAccess()) {
    return pickDirectoryFallback();
  }

  try {
    const dirHandle = await window.showDirectoryPicker({ mode: 'read' });
    return scanDirectory(dirHandle);
  } catch {
    return [];
  }
}

async function scanDirectory(
  dirHandle: FileSystemDirectoryHandle,
  prefix = ''
): Promise<LocalFile[]> {
  const files: LocalFile[] = [];

  for await (const entry of dirHandle.values()) {
    const path = prefix ? `${prefix}/${entry.name}` : entry.name;

    if (entry.kind === 'file' && isVideoFile(entry.name)) {
      const fileHandle = entry as FileSystemFileHandle;
      const file = await fileHandle.getFile();
      files.push({
        name: path,
        size: file.size,
        type: file.type,
        handle: fileHandle,
      });
    } else if (entry.kind === 'directory') {
      const subDir = entry as FileSystemDirectoryHandle;
      const subFiles = await scanDirectory(subDir, path);
      files.push(...subFiles);
    }
  }

  return files.sort((a, b) => a.name.localeCompare(b.name));
}

function pickDirectoryFallback(): Promise<LocalFile[]> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'video/*';
    input.setAttribute('webkitdirectory', '');
    input.onchange = () => {
      const files = Array.from(input.files ?? []).filter((f) =>
        isVideoFile(f.name)
      );
      resolve(
        files.map((f) => ({
          name: f.webkitRelativePath || f.name,
          size: f.size,
          type: f.type,
          handle: null as unknown as FileSystemFileHandle,
          _file: f,
        }))
      );
    };
    input.oncancel = () => resolve([]);
    input.click();
  });
}

export async function getFileUrl(localFile: LocalFile): Promise<string> {
  if (localFile.handle) {
    const file = await localFile.handle.getFile();
    return URL.createObjectURL(file);
  }
  const fallback = localFile as LocalFile & { _file?: File };
  if (fallback._file) {
    return URL.createObjectURL(fallback._file);
  }
  throw new Error('Cannot create URL for file');
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}
