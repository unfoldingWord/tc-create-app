import React from "react";
import { doesReferenceContain } from "bible-reference-range";
import { ReferenceFilters } from "./ReferenceFilters";

const doCleanRef = (dirtyRef) => dirtyRef.split("\t").find(ref => /[\w\d]+:[\w\d]+/.test(ref))

export const referenceFilterOptions = 
  {
    filterType: "custom",
    customFilterListOptions: {
      render: (filters) => filters.map((f) => `Reference: ${f.split("|")[1]}`),
      update: (filterList, filterPos, index) => {
        filterList[index].splice(filterPos, 1);
        return filterList;
      }
    },
    filterOptions: {
      logic: (location, filters) => {
        try {
          const references = filters.map((filter) => filter.split("|")[1]);
          const cleanLocation = doCleanRef(location);
          const baseReference = references.join(";")
          if (filters.length) {
            return !doesReferenceContain(baseReference, cleanLocation);
          };
          return false;
        } catch (error) {
          console.log({location, filters})
          throw(error);
        }
      },
      display: (filterList, onChange, index, column, columns) => {
        const cvObject = columns[index].reduce((cvObject, ref) => {
          const cleanRef = doCleanRef(ref);
          const [chapter, verse] = cleanRef.split(":")
          if (!cvObject[chapter]) cvObject[chapter] = new Set();
          cvObject[chapter].add(verse);
          return cvObject;
        },{});

        const values = Object.keys(cvObject).reduce((refs, key) => {
          const sorted = [...cvObject[key]].sort(function (a, b) {
            if(isNaN(a) || isNaN(b)) return -1;
            const x = parseInt(a);
            const y = parseInt(b);
            if (x < y) return -1;
            if (x > y) return 1;
            return 0;
          });
          sorted.forEach(v => {
            refs.raw.push(`${key}:${v}`)
          })
          refs.cv[key] = sorted;
          return refs
        },{raw: [], cv: {}})

        return (
        <ReferenceFilters
          {...{ filterList, onChange, index, column, values }}
        />
      )},
      fullWidth: true
    }
  }