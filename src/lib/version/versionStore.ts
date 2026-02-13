// In-memory version store (resets on server restart)
// In production, this would be a database

export interface StoredVersion {
  id: number;
  timestamp: Date;
  userPrompt: string;
  code: string;
  explanation: string;
  componentsUsed: string[];
}

class VersionStore {
  private versions: Map<number, StoredVersion> = new Map();

  getAll(): StoredVersion[] {
    return Array.from(this.versions.values());
  }

  get(id: number): StoredVersion | undefined {
    return this.versions.get(id);
  }

  add(data: Omit<StoredVersion, "id" | "timestamp">): StoredVersion {
    const id = this.versions.size + 1;
    const version: StoredVersion = {
      ...data,
      id,
      timestamp: new Date(),
    };
    this.versions.set(id, version);
    return version;
  }

  size(): number {
    return this.versions.size;
  }
}

export const versionStore = new VersionStore();
