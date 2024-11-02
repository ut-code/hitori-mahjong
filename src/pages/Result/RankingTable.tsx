import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import { PlayerInfo } from "../../App";

type RankingTableProps = {
	scores: PlayerInfo[];
};

export default function RankingTable({ scores }: RankingTableProps) {
  const columns = useMemo<MRT_ColumnDef<PlayerInfo>[]>(
    () => [
			{
				accessorKey: 'rank',
				header: 'rank',
			},
      {
        accessorKey: 'name',
        header: 'name',
      },
      {
        accessorKey: 'score',
        header: 'score',
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
    getRowId: (row) => `${row.rank}`,
    initialState: {
      rowPinning: {
        top: [],
        bottom: [],
      },
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: '210px',
      },
    },
		muiTablePaperProps: {
			sx: {
				borderRadius: "10px",
				boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
			},
    },
    muiTableBodyRowProps: ({ row, table }) => {
      const { density } = table.getState();
      return {
        sx: {
          //Set a fixed height for pinned rows
          height: row.getIsPinned()
            ? `${
                //Default mrt row height estimates. Adjust as needed.
                density === 'compact' ? 37 : density === 'comfortable' ? 53 : 69
              }px`
            : undefined,
        },
      };
    },
		muiTableBodyCellProps: {
			sx: {
				borderBottom: "none",
			},
		},
    muiTableHeadCellProps: {
			sx: {
				display: 'none',
			},
    },
		muiTopToolbarProps: {
			sx: {
				display: "none",
			},
		},
  });

  return <MaterialReactTable table={table} />;
};
