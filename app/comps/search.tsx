'use client';
import { Flex } from "antd";
import { 
  SearchForm,
  SearchResults,
} from "../comps";
import { useContext, useEffect, useState } from "react";
import { SearchDataType } from "./search_results";
import PromptModal from "./prompt-modal";
import { DataContext } from "../page";

type initialFiltersType = {
  title: string;
  category: string[];
}
const initialFilters: initialFiltersType = {
  title: '',
  category: [],
};

const filterByFun = (arr: any[], filterFunc: (item: any) => boolean): SearchDataType[] => {
  let result: any[] = [];
  for (const key in arr) {
    const item = arr[key];
    if (filterFunc(item)) {
      result.push(item);
    }
  }
  return result;
}

const Search = () => {
  const [filters, setFilters] = useState(initialFilters);
  const [data, setData] = useState<SearchDataType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<SearchDataType | null>(null);
  const { allData } = useContext(DataContext);

  useEffect(() => {
    let filteredData = [...allData];
    
    for (const searchKey in filters) {
      switch (searchKey) {
        case 'title':
          filteredData = filterByFun(filteredData, (item: SearchDataType) => 
            item.title.toLowerCase().includes(filters[searchKey].toLowerCase()));
          break;
        case 'category':
          filteredData = filterByFun(filteredData, (item: SearchDataType) => {
            if (filters[searchKey].length === 0) return true;
            return filters[searchKey].includes(item.category);
          });
          break;
        default:
          break;
      }
    }
    
    setData(filteredData);
  }, [filters, allData]);

  return (
    <Flex 
      gap="middle"
      vertical
      style={{
        padding: "0 .2rem 0 .2rem",
      }}
    >
      <SearchForm
        initialFilters={initialFilters}
        setFilters={setFilters}
      />
      <SearchResults
        data={data}
        handeClickRow={(rec) => {
          setSelectedPrompt(rec);
          setIsModalOpen(true);
        }}
      />
      {selectedPrompt && <PromptModal
        propKey={selectedPrompt.key}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />}
    </Flex>
  );
}

export default Search;