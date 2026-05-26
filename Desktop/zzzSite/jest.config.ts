import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(webp|png|jpg|jpeg|mp4|svg)$': '<rootDir>/__mocks__/fileMock.ts',
    '^next/image$': '<rootDir>/__mocks__/nextImageMock.tsx',
    '^next/link$': '<rootDir>/__mocks__/nextLinkMock.tsx',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: { jsx: 'react-jsx' } }],
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  cacheDirectory: '<rootDir>/.jest-cache',
}

export default config
