import { useState } from 'react';
import { useDeepCompareEffect } from 'use-deep-compare';
import { usePermalinks } from '@gwdevs/permalinks-hooks';

export default function useQueryOptions({defaultOptions,columnNames}) {
  const { query } = usePermalinks({});
  const [extraColumns, setExtraColumns] = useState([]);
  const [options, setOptions] = useState(defaultOptions);

  useDeepCompareEffect(() => {
    const exludedFromSearch = ['columns', 'check'];

    if (!query) return;

    Object.keys(query).forEach((key) => {
      if (!exludedFromSearch.includes(key)) {
        setOptions((options) => ({ ...options, searchText: query[key] }));
      }
    });

  },[query]);

  useDeepCompareEffect(() => {
    if (query && columnNames) {
      const queryColumns = query.columns?.split(',');
      const validColumns = columnNames.map(column => queryColumns && queryColumns.includes(column) && column) || [];

      const columnsShowDefault = columnNames.map(column =>
        query[column] && column
      );
      setExtraColumns([
        ...columnsShowDefault,
        ...validColumns,
      ]);
    }
  }, [query, columnNames]);
  
  return {options,extraColumns}
}
