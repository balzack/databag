const TIMEOUT = 15000;

//await new Promise(r => setTimeout(r, 2000));

export function createWebsocket(url) {
console.log("HERE");
  return new WebSocket(url);
}

export function checkResponse(response) {
  if(response.status >= 400 && response.status < 600) {
    throw new Error(response.url + " failed");
  }
}

export async function fetchWithTimeout(url, options) {
  return Promise.race([
    fetch(url, options).catch(err => { throw new Error(url + ' failed'); }),
    new Promise((_, reject) => setTimeout(() => reject(new Error(url + ' timeout')), TIMEOUT))
  ]);
}

export async function fetchWithCustomTimeout(url, options, timeout) {
  return Promise.race([
    fetch(url, options).catch(err => { throw new Error(url + ' failed'); }),
    new Promise((_, reject) => setTimeout(() => reject(new Error(url + ' timeout')), timeout))
  ]);
}

