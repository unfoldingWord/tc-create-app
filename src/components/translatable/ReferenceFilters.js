import React, { useState } from "react";
import { FormControl, TextField, Box } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

export const ReferenceFilters = ({
  filterList,
  onChange,
  index,
  values,
  column
}) => {
  const { refSelected, cvSelected } = filterList[index].reduce(
    (values, filter) => {
      const [type, value] = filter.split("|")
      if (type === "ref") {
        values.refSelected.push(value);
      }
      if (type === "cv") {
        values.cvSelected.push(value);
      }
      return values;
    },
    { cvSelected: [], refSelected: [] }
  );

  const [c, v] = cvSelected?.[0]?.split(":") || [];

  const [references, setReferences] = useState(refSelected || []);
  const [chapter, setChapter] = useState(c || "All");
  const [verses, setVerses] = useState(v || "All");

  const buildCv = (c, v) => {
    if (c === "All") return [];
    const ref = v === "All" ? `${c}` : `${c}:${v}`;
    return [`cv|${ref}`];
  };

  const handleChange = (cv, references) => {
    const ref = references.map((value) => (`ref|${value}`));
    filterList[index] = cv.length || ref.length ? [...cv, ...ref] : [];
    onChange(filterList[index], index, column);
  };

  const handleChangeReferences = (event, newValue) => {
    setReferences(newValue);
    const cv = buildCv(chapter, verses);
    handleChange(cv, newValue);
  };

  const handleChangeChapter = (event, newValue) => {
    const newChapter = newValue || "All";
    setChapter(newChapter);
    setVerses("All");
    const cv = buildCv(newChapter, verses);
    handleChange(cv, references);
  };

  const handleChangeVerse = (event, newValue) => {
    const newVerses = newValue || "All";
    setVerses(newVerses);
    const cv = buildCv(chapter, newVerses);
    handleChange(cv, references);
  };

  return (
    <>
      <FormControl>
        <Autocomplete
          onChange={handleChangeReferences}
          id="reference-filter"
          value={references || []}
          freeSolo
          multiple
          options={values.raw}
          renderInput={(params) => (
            <TextField {...params} label={column.label} />
          )}
        />
      </FormControl>
      <FormControl>
        <Box
          sx={{
            mt:"1em",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "58px"
          }}
        >
          <Autocomplete
            value={chapter}
            style={{ overflow: "visible" }}
            options={["All", ...Object.keys(values.cv)]}
            getOptionLabel={(option) => `${option}`}
            onChange={handleChangeChapter}
            handleHomeEndKeys
            renderInput={(params) => (
              <TextField {...params} label={"Chapter"} />
            )}
          />
          <Autocomplete
            value={verses}
            style={{ overflow: "visible" }}
            options={["All", ...(values.cv[chapter] || [])]}
            getOptionLabel={(option) => `${option}`}
            onChange={handleChangeVerse}
            handleHomeEndKeys
            renderInput={(params) => <TextField {...params} label={"Verses"} />}
          />
        </Box>
      </FormControl>
    </>
  );
};
