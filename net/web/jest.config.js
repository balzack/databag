/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  modulePaths: [
        "<rootDir>/src/"
      ],
      testMatch: [
        "**/test/**"
      ],
      moduleNameMapper: {
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/mock/fileMock.js",
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
        // "(.*)": "<rootDir>/src/$1",
      }
};