import { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { PlayerInfo } from "../../App";

type RankingTableProps = {
  scores: PlayerInfo[];
  customToolbarActions?: React.ReactNode;
  myRank: number | null;
};

export default function RankingTable({
  scores,
  customToolbarActions,
  myRank,
}: RankingTableProps) {
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
        top: myRank ? [`rank-${myRank}`] : [],
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
    renderBottomToolbarCustomActions: () => customToolbarActions,
  });

  return <MaterialReactTable table={table} />;
}
