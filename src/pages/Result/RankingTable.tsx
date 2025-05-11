import {
	type MRT_ColumnDef,
	MaterialReactTable,
	useMaterialReactTable,
} from "material-react-table";
import { useMemo } from "react";
import type { PlayerInfo } from "../../App";

type RankingTableProps = {
	scores: PlayerInfo[];
	myRank: number | null;
};

export default function RankingTable({ scores, myRank }: RankingTableProps) {
	const footerStyle: { [key: string]: string } = {
		display: "flex",
		justifyContent: "flex-start",
		alignItems: "center",
		// padding: "8px 32px",
		color: "#2B2B2B",
		fontSize: "0.9rem",
		gap: "8px",
	};

	const footerEmojiStyle: { [key: string]: string } = {
		fontSize: "1.4rem",
	};
	const bottomToolbar = (
		<div style={footerStyle}>
			{myRank !== null && myRank === 1 && (
				<>
					<span style={footerEmojiStyle}>🀄</span>
					<span>もうあなたが麻雀です</span>
				</>
			)}
			{myRank !== null && myRank > 1 && myRank <= 10 && (
				<>
					<span style={footerEmojiStyle}>🎉</span>
					<span>非常に優秀な成績です！この調子で頑張りましょう！</span>
				</>
			)}
			{myRank !== null && myRank > 10 && (
				<>
					<span style={footerEmojiStyle}>🀄</span>
					<span>これから勉強していきましょう！</span>
				</>
			)}
		</div>
	);
	const columns = useMemo<MRT_ColumnDef<PlayerInfo>[]>(
		() => [
			{
				accessorKey: "rank",
				header: "rank",
			},
			{
				accessorKey: "name",
				header: "name",
			},
			{
				accessorKey: "score",
				header: "score",
			},
		],
		[],
	);

	const table = useMaterialReactTable({
		columns,
		data: scores,
		enableRowPinning: true,
		enablePagination: false,
		enableStickyHeader: true,
		enableFullScreenToggle: false,
		enableDensityToggle: false,
		enableColumnFilters: false,
		enableColumnOrdering: false,
		enableGlobalFilter: false,
		enableHiding: false,
		enableSorting: false,
		enableColumnActions: false,
		enableRowSelection: false,
		getRowId: (row) => `rank-${row.rank ?? ""}`,
		initialState: {
			rowPinning: {
				top: myRank !== null && myRank > 3 ? [`rank-${myRank}`] : [],
			},
			columnVisibility: {
				"mrt-row-pin": false,
			},
		},
		muiTableContainerProps: {
			sx: {
				maxHeight: "200px",
			},
		},
		muiTablePaperProps: {
			sx: {
				borderRadius: "10px",
				boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
				width: "100%",
			},
		},
		muiTableBodyRowProps: ({ row, table }) => {
			const { density } = table.getState();
			return {
				sx: {
					// Set a fixed height for pinned rows
					height: row.getIsPinned()
						? `${
								// Default mrt row height estimates. Adjust as needed.
								density === "compact" ? 37 : density === "comfortable" ? 53 : 69
							}px`
						: undefined,
					backgroundColor: row.getIsPinned() ? "#FFF7F2" : undefined,
					"& td:after": {
						backgroundColor: "transparent !important",
					},
				},
			};
		},
		muiTableBodyCellProps: ({ row }) => {
			return {
				sx: {
					borderBottom: "none",
					padding: "0.8em 0em",
					textAlign: "center",
					fontSize: "1rem",
					color: row.getIsPinned() ? "#FD903C" : "#2B2B2B",
				},
			};
		},
		muiTableHeadCellProps: {
			sx: {
				display: "none",
			},
		},
		muiTopToolbarProps: {
			sx: {
				display: "none",
			},
		},
		muiBottomToolbarProps: {
			sx: {
				padding: "0px 16px",
				display: "flex",
				justifyContent: "flex-end",
			},
		},
		renderBottomToolbarCustomActions: () => bottomToolbar,
	});

	return <MaterialReactTable table={table} />;
}
