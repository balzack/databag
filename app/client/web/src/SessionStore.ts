import { WebStore } from 'databag-client-sdk'

export class SessionStore implements WebStore {
  public async getValue (key: string): Promise<any> {
    console.log('web store get: ', key)
    const value = localStorage.getItem(key)
    if (!value) {
      return null
    }
    return JSON.parse(value)
  }

  public async setValue (key: string, value: any): Promise<void> {
    localStorage.setItem(key, JSON.stringify(value))
  }

  public async clearValue (key: string): Promise<void> {
    localStorage.removeItem(key)
  }

  public async clearAll (): Promise<void> {
    localStorage.clear()
  }
}
