export interface MountedFile {
  content: string;
  filepath: string;
}

export interface FileNode {
  filepath: string;
  name: string;
  extension?: string;
}

export interface DirNode {
  name: string;
  files: FileNode;
}
