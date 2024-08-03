import { WebStore } from 'databag-client-sdk'

export class SessionStore implements WebStore {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getValue(key: string): Promise<any> {
    console.log('web store get: ', key)
    const value = localStorage.getItem(key)
    if (!value) {
      return null
    }
    return JSON.parse(value)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async setValue(key: string, value: any): Promise<void> {
    localStorage.setItem(key, JSON.stringify(value))
  }

  public async clearValue(key: string): Promise<void> {
    localStorage.removeItem(key)
  }

  public async clearAll(): Promise<void> {
    localStorage.clear()
  }
}
