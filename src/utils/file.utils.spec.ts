import { describe, expect, it } from 'vitest';

import { getFileName } from './file.utils.js';

describe('file.utils', () => {
  describe('getFileName', () => {
    it('delivers empty infos on empty paths', () => {
      const info = getFileName('');
      expect(info).toHaveProperty('name', '');
      expect(info).toHaveProperty('base', '');
      expect(info).toHaveProperty('extension', '');
    });

    it('delivers empty infos on blank paths', () => {
      const info = getFileName(' ');
      expect(info).toHaveProperty('name', '');
      expect(info).toHaveProperty('base', '');
      expect(info).toHaveProperty('extension', '');
    });

    it('delivers correct results for files without nested paths', () => {
      const info = getFileName('foo-bar.txt');
      expect(info).toHaveProperty('name', 'foo-bar.txt');
      expect(info).toHaveProperty('base', 'foo-bar');
      expect(info).toHaveProperty('extension', '.txt');
    });

    it('delivers correct results for files without nested paths and extension', () => {
      const info = getFileName('foo-bar');
      expect(info).toHaveProperty('name', 'foo-bar');
      expect(info).toHaveProperty('base', 'foo-bar');
      expect(info).toHaveProperty('extension', '');
    });

    it.each`
      platform     | path
      ${'unix'}    | ${'/path/to/foo-bar.txt'}
      ${'windows'} | ${'C:\\path\\to\\foo-bar.txt'}
    `('delivers an object with file info on $platform', ({ path }) => {
      const info = getFileName(path);
      expect(info).toBeTypeOf('object');
      expect(info).toHaveProperty('name', 'foo-bar.txt');
      expect(info).toHaveProperty('base', 'foo-bar');
      expect(info).toHaveProperty('extension', '.txt');
    });

    it.each`
      platform     | path
      ${'unix'}    | ${'/path/to/foo-bar'}
      ${'windows'} | ${'C:\\path\\to\\foo-bar'}
    `('delivers correct results for files without extension on $platform', ({ path }) => {
      const info = getFileName(path);
      expect(info).toHaveProperty('name', 'foo-bar');
      expect(info).toHaveProperty('base', 'foo-bar');
      expect(info).toHaveProperty('extension', '');
    });

    it.each`
      platform     | path
      ${'unix'}    | ${'/path/to/'}
      ${'windows'} | ${'C:\\path\\to\\'}
    `('delivers empty infos about directories on $platform', ({ path }) => {
      const info = getFileName(path);
      expect(info).toHaveProperty('name', '');
      expect(info).toHaveProperty('base', '');
      expect(info).toHaveProperty('extension', '');
    });

    it.each`
      platform     | path
      ${'unix'}    | ${'/'}
      ${'windows'} | ${'C:\\'}
    `('delivers empty infos about root on $platform', ({ path }) => {
      const info = getFileName(path);
      expect(info).toHaveProperty('name', '');
      expect(info).toHaveProperty('base', '');
      expect(info).toHaveProperty('extension', '');
    });

    it.each`
      platform     | path
      ${'unix'}    | ${'/path/to/foo-bar.txt'}
      ${'windows'} | ${'C:\\path\\to\\foo-bar.txt'}
    `('can handle optional custom extensions on $platform', ({ path }) => {
      const info = getFileName(path, '.txt');
      expect(info).toHaveProperty('name', 'foo-bar.txt');
      expect(info).toHaveProperty('base', 'foo-bar');
      expect(info).toHaveProperty('extension', '.txt');
    });

    it.each`
      platform     | path
      ${'unix'}    | ${'/path/to/foo-bar.tar.gz'}
      ${'windows'} | ${'C:\\path\\to\\foo-bar.tar.gz'}
    `('does exact match custom extensions on $platform', ({ path }) => {
      const info = getFileName(path, '.gz');
      expect(info).toHaveProperty('name', 'foo-bar.tar.gz');
      expect(info).toHaveProperty('base', 'foo-bar.tar');
      expect(info).toHaveProperty('extension', '.gz');
    });

    it.each`
      platform     | path
      ${'unix'}    | ${'/path/to/foo-bar.tar.gz'}
      ${'windows'} | ${'C:\\path\\to\\foo-bar.tar.gz'}
    `('does skip custom extensions if not matching exactly on $platform', ({ path }) => {
      const info = getFileName(path, '.tar');
      expect(info).toHaveProperty('name', 'foo-bar.tar.gz');
      expect(info).toHaveProperty('base', 'foo-bar.tar.gz');
      expect(info).toHaveProperty('extension', '');
    });
  });
});
