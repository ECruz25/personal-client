import TableColumnProps from "./TableColumnsProps";

type TableProps = {
  columns: TableColumnProps[];
  items: any[];
  onRow?: any;
};

export default TableProps;
