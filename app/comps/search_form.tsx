'use client';
import type { FormProps } from 'antd';
import { Button, Form, Input, Select } from 'antd';
import { PromptCategories } from '../../public/consts/prompt-category';

const styled = {
  span: 250,
};

type FieldType = {
  title?: string;
  category?: string[];
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

const SearchForm = (props: { initialFilters: any, setFilters: any }) => {
  const {
    initialFilters,
    setFilters,
  } = props;

  const [form] = Form.useForm();

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
    setFilters(values);
  };

  return (
    <Form
      layout={'inline'}
      labelCol={{
        span: styled.span
      }}
      wrapperCol={{
        span: styled.span * 1.5,
      }}
      form={form}
      initialValues={{
        ...initialFilters,
      }}
      onFinish={onFinish}
    >
      <Form.Item
        label="Title"
        name="title"
      >
        <Input placeholder="prompt title" />
      </Form.Item>
      <Form.Item
        label="Category"
        name="category"
      >
        <Select
          mode="multiple"
          maxCount={5}
          style={{ width: `${styled.span}px` }}
          placeholder="Category"
          options={PromptCategories}
          allowClear
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">Search</Button>
      </Form.Item>
    </Form>
  );
}

export default SearchForm;