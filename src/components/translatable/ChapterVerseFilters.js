import { Box, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React, { useState } from "react";
import { useDeepCompareCallback } from "use-deep-compare";

const SelectSimple = ({options,onChange,label,value,...props}) => {
  return (
    <Autocomplete
      value={value}
      style={{overflow: 'visible'}}
      options={options}
      getOptionLabel={(option) => `${option}`}
      onChange={onChange}
      handleHomeEndKeys
      renderInput={(params) => <TextField {...params} label={label}
      />}
    />
  )
}

const column = { name: "Reference", filterType: "custom" };

const ChapterVerseFilters = ({ cvData, filters, onChange, index }) => {
  const [chapter, setChapter] = useState("All");
  const [verse, setVerse] = useState("All");

  const chapterOptions = ["All", ...Object.keys(cvData)];
  const verseOptions = ["All", ...(cvData[chapter] || [])];

  const getVersesInChapter = useDeepCompareCallback((chapter) => cvData[chapter]?.map((verse) => `${chapter}:${verse}`), [cvData]);

  const handleChapterChange = useDeepCompareCallback((event, newValue) => {
    event.preventDefault();
    const chapter = newValue;
    const verse = "All";
    setChapter(chapter);
    setVerse(verse);
    if (chapter === "All" || chapter === null) {
      onChange([], index, column);
      return;
    }
    filters[index] = getVersesInChapter(chapter)
    onChange(filters[index], index, column)
  }, [onChange,index,filters,getVersesInChapter])

  const handleVerseChange = useDeepCompareCallback((event,newValue) => {
    event.preventDefault()
    if (chapter === "All") return;
    const verse = newValue;
    setVerse(verse);
    if (verse === "All") {
      filters[index] = getVersesInChapter(chapter);
      onChange([], index, column);
      return;
    }
    filters[index] = verse ? [`${chapter}:${verse}`] : [];
    onChange(filters[index], index, column)
  }, [onChange,index,filters,chapter,getVersesInChapter])

  return (
    <Box sx={{display:"grid", gridTemplateColumns: "1fr 1fr", gap: "17px"}}>
      <SelectSimple
        value={chapter}
        label={"Chapter"}
        onChange={handleChapterChange}
        options={chapterOptions}
      />
      <SelectSimple
        value={verse}
        label={"Verse"}
        onChange={handleVerseChange}
        options={verseOptions}
      />
    </Box>
  )
}

export default ChapterVerseFilters;