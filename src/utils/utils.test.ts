import { formatNationalId, capitalizeFirstLetter } from '.';

test('expect "1" to be format as "001"', () => {
  expect(formatNationalId('1')).toBe('001');
});

test('expect "test" to be format as "Test"', () => {
  expect(capitalizeFirstLetter('test'));
});
