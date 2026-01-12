'use client';
import { Table } from 'antd';
import type { TableProps } from 'antd';

export interface SearchDataType {
  key: string;
  title: string;
  category: string;
  body: string;
}

const columns: TableProps<SearchDataType>['columns'] = [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    render: (text) => <p>{text}</p>,
  },
  {
    title: 'Category',
    key: 'category',
    dataIndex: 'category',
  },
];

const SearchResults = (props: { data: SearchDataType[], handeClickRow?: (record: SearchDataType) => void }) => {
  const { data, handeClickRow = () => {} } = props;
  
  return (
    <Table<SearchDataType>
      columns={columns} 
      dataSource={data} 
      onRow={(record) => ({
        style: { cursor: 'pointer' },
        onClick: (e) => {
          e.preventDefault();
          handeClickRow(record)
        },
      })}
    />
  );
};

export default SearchResults;