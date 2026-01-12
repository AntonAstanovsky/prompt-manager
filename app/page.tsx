'use client';
import { createContext, useEffect, useState } from "react";
import { 
  Search,
} from "./comps";
import { Button, Flex, Layout } from 'antd';
import { SearchDataType } from "./comps/search_results";
import { PromptCategories } from "@/public/consts/prompt-category";

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  backgroundColor: 'transparent',
  height: 'auto',
};

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  minHeight: 120,
  lineHeight: '120px',
};

const { Header, Content } = Layout;
const initData: SearchDataType[] = [
  {
    key: '1',
    title: 'prompt with values 1,2',
    category: PromptCategories[0].label,
    body: 'Sample body text for a prompt with values. {value 1} and {value 2}',
  },
  {
    key: '2',
    title: 'prompt without values',
    category: PromptCategories[1].label,
    body: 'Sample body text for a prompt without values.',
  },
  {
    key: '3',
    title: 'prompt with values 4,1',
    category: PromptCategories[2].label,
    body: 'Sample body text for a prompt with values. {value 4} and {value 1}',
  },
  {
    key: '4',
    title: 'prompt with values 4,1',
    category: PromptCategories[2].label,
    body: 'Sample body text for a prompt with values. {value 4} and {value 1}',
  },
];

export const DarkModeContext = createContext(false);
export const DataContext = createContext({ allData: initData, setAllData: (data: SearchDataType[]): any => null });

export default function Home() {
  const [darkMode, setDarkMode] =  useState(false);
  const [allData, setAllData] = useState<SearchDataType[]>([]);

  useEffect(() => {
    const savedData = window.localStorage.getItem('allData');
    if (savedData) {
      setAllData(JSON.parse(savedData));
    } else {
      setAllData(initData);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('allData', JSON.stringify(allData));
  }, [allData]);

  return (
    <DarkModeContext.Provider value={darkMode}>
      <Flex gap="middle" wrap>
        <Layout
          className={darkMode ? 'dark' : ''}
        >
          <Header
            style={headerStyle}
          >
            <h1>AI Prompt Manager</h1>
            Set Dark Mode: 
            <Button
              type="text"
              onClick={() => setDarkMode(!darkMode)}
              style={{ width: '120px' }}
            >
              {!darkMode ? "Light Mode" : "Dark Mode"}
            </Button>
          </Header>
          <Content
            className="main"
            style={contentStyle}
          >
            <DataContext.Provider value={{ allData, setAllData }}>
              <Search />
            </DataContext.Provider>
          </Content>
      </Layout>
      </Flex>
    </DarkModeContext.Provider>
  );
}
