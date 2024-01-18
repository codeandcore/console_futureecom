import { pathsToModuleNameMapper } from 'ts-jest'
import type { JestConfigWithTsJest } from 'ts-jest'

import { compilerOptions } from './tsconfig.json'

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  maxWorkers: '4',
  testEnvironment: '@happy-dom/jest-environment',
  roots: ['<rootDir>'],
  rootDir: './',
  moduleDirectories: ['<rootDir>', 'node_modules'],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: {
    '\\.(css|less|scss|sass|jpg|jpeg|png|gif|webp|svg)$': 'identity-obj-proxy',
    '^uuid': require.resolve('uuid'),
    ...pathsToModuleNameMapper(compilerOptions.paths)
  },
  testMatch: ['<rootDir>/**/*.(test|spec).ts'],
  transformIgnorePatterns: ['/node_modules/(?!vue-flag-icon|@babel|vuetify)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.vue$': '@vue/vue2-jest'
  },
  moduleFileExtensions: ['js', 'ts', 'json', 'vue'],
  setupFilesAfterEnv: ['jest-extended/all', '@testing-library/jest-dom', '<rootDir>/jestSetup.ts'],
  collectCoverage: true,
  collectCoverageFrom: ['./src/**'],
  coverageReporters: ['json', 'html']
}

export default config
