Refactor TODOs

Things to prioritize:

## IN PROGRESS:

Cypress tests
- Ensure Cypress tests run and continue to run during refactor
- New tests?
- Stepper
  - invalid login on stepper expects to behave normally
  - click through steps at each progress
  - back/next button after each progress

Other issues noted:
- The row toolbar is missing.
  - obs-sq
  - obs-sn
  - obs-tn
  - obs-tq
- obs-sn issues:
  - includes SupportReference by default. Default should only be the Note column

## LATER:

Confusing Naming conventions
- saveCache?
- stateValues?

Console Errors
- Go through each error and warning and address each one

Borrow, Bend, Break, Begat, Build
- Build a new DatatableTranslatable not on MUI Datatables

Dependency updates
- Material UI v5.x (latest would remove @mui/labs)

## DONE:

Consistent Functional Design patterns
- remove React.memo from class based React Components

Confusing Naming conventions
- QuoteSelector? => ScriptureHeader

KISS: Keep It Stupid Simple
- Reduce complexity of data flow
- Shortened long files by abstracting portions
- State management?
- Nested Contexts?
- Prop drilling?

Performance bottleneck:
- makeStyles. Can we find an alternative or reduce renders?
- Explore one scripture pane at a time
- React Waypoint, isVisible trigger rendering

Shorten files <125 lines to reduce cognitive load
- Workspace.js
  - Dialogs for critical errors
- App.js
  - headroom functions
  - resumed state
  - dialog: autosave
  - dialog: source file validation
- Translatable.js
  - authentication dialog
  - saveRetry()
  - saveOnTranslation()
  - autoSaveOnEdit()
  - useStyles
- TranslatableTSV.js
  - abstracted useValidation.js
- App.context.js
  - abstracted useGiteReactToolkit.js
- FilesHeader.js
  - abstracted to smaller components
- ApplicationStepper.js
  - abstracted lifecycle/state to useApplicationStepper
  - abstracted NetlifyBadge

DRY: Don't Repeat Yourself
- Reduce Copies of Translatable
  - what are the columns (can we automate?)
  - default row columns (can we simplify?)
- Reduce copies of RowHeader
  - Scripture or not

Bugs to Address
- Stepper
  - click on step doesn't take you there
  - authenticaiton error goes to File step without anything else
  - back button crashes

- Validation
  - ensure all validation that worked before works

- Must use the uw-tsv-parser package to parse TSV files; these cases noted:
  - SQ is not previewing correctly.
  - SN is not previewing correctly.
  - obs-sq is not previewing correctly.
