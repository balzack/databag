export interface WebStore {
  getValue(key: string): string;
  setValue(key: string, value: string): void;
  clearValue(key: string): void;
  clearAll(): void;
}
