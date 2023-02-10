import React from "react";
import { TextField, Box } from "@material-ui/core";
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

  const [chapter = "All", verses = "All"] = cvSelected?.[0]?.split(":") || [];

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
    const cv = buildCv(chapter, verses);
    handleChange(cv, newValue);
  };

  const handleChangeChapter = (event, newValue) => {
    const newChapter = newValue || "All";
    const cv = buildCv(newChapter, verses);
    handleChange(cv, refSelected);
  };

  const handleChangeVerse = (event, newValue) => {
    const newVerses = newValue || "All";
    const cv = buildCv(chapter, newVerses);
    handleChange(cv, refSelected);
  };

  return (
    <>
      <Box>
        <Autocomplete
          onChange={handleChangeReferences}
          id="reference-filter"
          value={refSelected || []}
          freeSolo
          multiple
          options={values.raw}
          renderInput={(params) => (
            <TextField {...params} label={column.label} />
          )}
        />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2rem",
            mt:"2rem",
          }}
        >
          <Autocomplete
            value={chapter}
            style={{ overflow: "visible" }}
            options={["All", ...Array.from(values.cv.keys())]}
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
            options={["All", ...(values.cv.get(chapter) || [])]}
            getOptionLabel={(option) => `${option}`}
            onChange={handleChangeVerse}
            handleHomeEndKeys
            renderInput={(params) => <TextField {...params} label={"Verses"} />}
          />
        </Box>
      </Box>
    </>
  );
};
