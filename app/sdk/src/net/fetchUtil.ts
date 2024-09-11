const TIMEOUT = 15000;

//await new Promise(r => setTimeout(r, 2000));

export function checkResponse(code: number) {
  if(code >= 400 && code < 600) {
    throw new Error(code.toString());
  }
}

export async function fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
  return Promise.race<Response>([
    fetch(url, options).catch(err => { throw new Error(url + ' failed'); }),
    new Promise((_, reject) => setTimeout(() => reject(new Error(url + ' timeout')), TIMEOUT))
  ]);
}

export async function fetchWithCustomTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
  return Promise.race<Response>([
    fetch(url, options).catch(err => { throw new Error(url + ' failed'); }),
    new Promise((_, reject) => setTimeout(() => reject(new Error(url + ' timeout')), timeout))
  ]);
}

