import { FilterFn, FilterMeta, Row } from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';

export const fuzzyFilter: FilterFn<any> = (
  row: Row<Record<string, unknown>>,
  columnId: string,
  filterValue: string,
  addMeta: (meta: FilterMeta) => void
): boolean => {
  if (columnId === 'Name') {
    const itemRank = rankItem(row.getValue(columnId), filterValue);

    addMeta({
      itemRank,
    });

    return itemRank.passed;
  }
  return false;
};

export const fuzzyTypesFilter: FilterFn<any> = (
  row,
  columnId,
  value,
  addMeta
) => {
  if (columnId === 'Types') {
    const itemRank = rankItem(row.getValue(columnId), value);

    addMeta({
      itemRank,
    });

    return itemRank.passed;
  }
  return false;
};

export function formatNationalId(id: string) {
  let formattedId = `${id}`;
  while (formattedId.length < 3) {
    formattedId = `0${formattedId}`;
  }
  return formattedId;
}

export function capitalizeFirstLetter(s: string) {
  return s
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
