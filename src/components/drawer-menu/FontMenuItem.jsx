import React, { useState } from "react";
import { PropTypes } from "prop-types";
import { Popover, Typography } from "@material-ui/core";

export default function FontMenuItem({ font }) {
	const [anchorEl, setAnchorEl] = useState(null);
	const [previewFont, setPreviewFont] = useState("Arial" );

	const handlePopoverOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handlePopoverClose = () => {
		setAnchorEl(null);
	};

	const styles = {
		menuItem: {
			width: "14rem",
			display: "flex",
			justifyContent: "space-between"
		},
		previewltr: {
			fontFamily: previewFont,
			fontSize: "1em",
			maxWidth: "35vw",
			direction: "LTR"
		},
		previewrtl: {
			fontFamily: previewFont,
			fontSize: "1em",
			maxWidth: "35vw",
			direction: "RTL"
		}
	};

	const open = Boolean(anchorEl);

	return (
		<div style={(styles.menuItem, { borderBottom: "1px outset" })}>
			<div
				style={styles.menuItem}
				aria-owns={open ? "mouse-over-popover" : undefined}
				aria-haspopup="true"
				onMouseEnter={(e) => {
					handlePopoverOpen(e);
					setPreviewFont(font);
				}}
				onMouseLeave={handlePopoverClose}
			>
				<Typography variant="body2" component="div">
					{font}&nbsp;
				</Typography>
				<Typography
					style={{ width: "100%", fontFamily: font}}
					noWrap
					variant="body2"
					component="div"
				>
					{font}
				</Typography>
			</div>
			<Popover
				id="mouse-over-popover"
				sx={{ pointerEvents: "none" }}
				open={open}
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: "top",
					horizontal: "right"
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "left"
				}}
				onClose={handlePopoverClose}
				disableRestoreFocus
			>
				<Typography sx={{ p: 1 }} style={styles.previewltr}>
					Angel Blind Clique Dunce Enact Furlong Gnome Human Inlet Justin Knoll
					Linden Milliner Number Onset Pneumo Quanta Rhone Snout Tundra Uncle
					Vulcan Whale Xenon Young Zodiac.
				</Typography>
				<hr style={{ width: "90%" }} />
				<Typography sx={{ p: 1 }} style={styles.previewrtl}>
					فِي ٱلْبَدْءِ كَانَ ٱلْكَلِمَةُ، وَٱلْكَلِمَةُ كَانَ عِنْدَ ٱللهِ،
					وَكَانَ ٱلْكَلِمَةُ ٱللهَ. هَذَا كَانَ فِي ٱلْبَدْءِ عِنْدَ ٱللهِ.
					كُلُّ شَيْءٍ بِهِ كَانَ، وَبِغَيْرِهِ لَمْ يَكُنْ شَيْءٌ مِمَّا كَانَ.
					فِيهِ كَانَتِ ٱلْحَيَاةُ، وَٱلْحَيَاةُ كَانَتْ نُورَ ٱلنَّاسِ،
					وَٱلنُّورُ يُضِيءُ فِي ٱلظُّلْمَةِ، وَٱلظُّلْمَةُ لَمْ تُدْرِكْهُ.
				</Typography>
			</Popover>
		</div>
	);
}

FontMenuItem.propTypes = {
	font: PropTypes.string
};
