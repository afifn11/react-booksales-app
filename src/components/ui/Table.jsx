import React from 'react';

const Table = ({ children, className = '' }) => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className={`w-full text-sm text-left text-gray-500 ${className}`}>
        {children}
      </table>
    </div>
  );
};

const TableHead = ({ children }) => {
  return (
    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
      <tr>{children}</tr>
    </thead>
  );
};

const TableBody = ({ children }) => {
  return <tbody>{children}</tbody>;
};

const TableRow = ({ children, className = '' }) => {
  return <tr className={`bg-white border-b hover:bg-gray-50 ${className}`}>{children}</tr>;
};

const TableHeader = ({ children, className = '' }) => {
  return (
    <th scope="col" className={`px-6 py-3 ${className}`}>
      {children}
    </th>
  );
};

const TableCell = ({ children, className = '' }) => {
  return (
    <td className={`px-6 py-4 ${className}`}>
      {children}
    </td>
  );
};

Table.Head = TableHead;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Header = TableHeader;
Table.Cell = TableCell;

export default Table;