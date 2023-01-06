import { FormControl, InputLabel, ListItemText, MenuItem, Select, Box } from "@material-ui/core";
import React, { useState } from "react";
import { useDeepCompareCallback } from "use-deep-compare";

const SelectSimple = ({options,onChange,label,value,...props}) => {
  return (
    <FormControl {...props}>
      <InputLabel htmlFor='select-multiple-chip'>
        {label}
      </InputLabel>
      <Select
        value={value}
        renderValue={selected => selected}
        onChange={onChange}
      >
        {options.map(item => (
          <MenuItem key={item} value={item}>
            <ListItemText primary={item} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

const column = { name: "Reference", filterType: "custom" };

const ChapterVerseFilters = ({ cvData, filters, onChange, index }) => {
  const [chapter, setChapter] = useState("All");
  const [verse, setVerse] = useState("All");

  const handleChapterChange = useDeepCompareCallback((event) => {
    event.preventDefault();
    const chapter = event.target.value;
    const verse = "All";
    setChapter(chapter);
    setVerse(verse);
    if (chapter === "All") {
      onChange([], index, column);
      return;
    }
    filters[index] = cvData[chapter].map((verse) => `${chapter}:${verse}`)
    onChange(filters[index], index, column)
  }, [onChange,index,filters,cvData])

  const handleVerseChange = useDeepCompareCallback((event) => {
    event.preventDefault()
    if (chapter === "All") return;
    const verse = event.target.value;
    filters[index] = [`${chapter}:${verse}`]
    onChange(filters[index], index, column)
    setVerse(verse);
  }, [onChange,index,filters,chapter])

  return (
    <Box sx={{display:"grid", gridTemplateColumns: "1fr 1fr", gap: "17px"}}>
      <SelectSimple
        value={chapter}
        label={"Chapter"}
        onChange={handleChapterChange}
        options={["All", ...Object.keys(cvData)]}
      />
      <SelectSimple
        value={verse}
        label={"Verse"}
        onChange={handleVerseChange}
        options={["All", ...(cvData[chapter] || [])]}
      />
    </Box>
  )
}

export default ChapterVerseFilters;