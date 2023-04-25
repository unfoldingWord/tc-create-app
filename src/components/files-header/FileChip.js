import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Chip, Tooltip } from '@material-ui/core';
import { License } from 'scripture-resources-rcl';

import { localString } from '../../core/localStrings';

export default function FileChip({
  label: _label,
  onDelete,
  style,
  onClick,
  deleteIcon: _deleteIcon,
  iconTooltip,
  deleteIconTooltip,
  licenseLink,
}) {
  const classes = useStyles();

  const icon = (
    <License rights='View License' licenseLink={licenseLink} />
  );

  const label = (
    <Tooltip title={localString(iconTooltip)} arrow><span>{_label}</span></Tooltip>
  );

  const deleteIcon = (
    <Tooltip title={deleteIconTooltip} arrow><span>{_deleteIcon}</span></Tooltip>
  );

  const dataTestId = `file-chip-${label}`;

  const props = {
    onClick,
    icon,
    label,
    onDelete,
    deleteIcon,
    variant: 'outlined',
    className: classes.header,
    style,
  };

  return (
    <Chip {...props} data-test-id={dataTestId} />
  );
};

const useStyles = makeStyles(theme => ({
  header: {
    cursor: 'pointer',
    justifyContent: 'space-between',
    width: '100%',
  },
}));