'use client';
import { Button, Flex, Form, FormProps, Input, Modal, Select } from "antd";
import { SearchDataType } from "./search_results";
import { PromptCategories } from "@/public/consts/prompt-category";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DataContext } from "../page";

const styled = {
  span: 250,
};

type FieldType = {
  title: string;
  category: string;
  body: string;
};

const findItem = (arr: SearchDataType[], key: string) => {
  return arr.find(item => key === item.key) || null;
};

type BodyVarListType = {
  key: string, value: string, fullKey: string
};

const getBodyVarList = (body: string): BodyVarListType[] => {
  let result: BodyVarListType[] = [];
  const varRegex = /\{(.*?)\}/g;
  let tempBody = body;
  let checkNext = varRegex.exec(tempBody) ?? { done: true };
  while(!checkNext?.done || checkNext?.length > 1) {
    result.push({
      key: checkNext[1],
      fullKey: checkNext[0],
      value: "",
    });
    tempBody = tempBody.slice(checkNext[0].length + checkNext[2], tempBody.length);

    console.log("tempBody: ", {tempBody, checkNext});
    checkNext = varRegex.exec(tempBody) ?? { done: true };
  }
  console.log("getBodyVarList result: ", result);
  return result;
}

const PromptModal = (props: {
  propKey: string, 
  isModalOpen: boolean, 
  setIsModalOpen: (open: boolean) => void 
}) => {
  const {
    propKey,
    isModalOpen,
    setIsModalOpen
  } = props;

  const [form] = Form.useForm();
  const bodyValue = Form.useWatch('body', form);
  const { allData, setAllData } = useContext(DataContext);
  const [paintedBodyVariables, setPaintedBodyVariables] = useState<BodyVarListType[]>([]);
  const [paintedBody, setPaintedBody] = useState<string>('');
  const [bodyForm] = Form.useForm();

  const prop = useMemo(() => {
    return findItem(allData, propKey);
  }, [allData, propKey]);

  const handleOk = useCallback(async () => {
    form.submit();
    setIsModalOpen(false);
  }, [form, setIsModalOpen, setAllData]);

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  
  const onFinish: FormProps<FieldType>['onFinish'] = useCallback((values: FieldType) => {
    if(!allData?.length) return;
      const updated = allData.map((item: SearchDataType) => {
      if (item.key === propKey) {
        return { ...item, ...values };
      }
      return item;
    });
    setAllData(updated);
  }, [propKey, setAllData, allData]);

  const paintOnFinish: FormProps<any>['onFinish'] = useCallback((values: any) => {
    let newBody = bodyValue;
    paintedBodyVariables.forEach((item) => {
      newBody = newBody.replace(item.fullKey, values[item.key] || '');
    });
    setPaintedBody(newBody);
  }, [paintedBodyVariables, bodyValue]);

  useEffect(() => {
    form.setFieldsValue({
      title: prop?.title,
      category: prop?.category,
      body: prop?.body,
    });
    setPaintedBody(prop?.body ?? "");
    bodyForm.resetFields();
  }, [prop]);

  useEffect(() => {
    if(!bodyValue) return;
    setPaintedBodyVariables(getBodyVarList(bodyValue));
  }, [bodyValue]);

  return (
    <>
      <Modal
        title="Basic Modal"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={handleOk}
        okText="Save"
        onCancel={handleCancel}
      >
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
            title: prop?.title,
            category: prop?.category,
          }}
          onFinish={onFinish}
        >
          <Flex wrap>
          <Form.Item
            label="Title"
            name="title"
            rules={[
              { required: true, message: 'Please input a Title'},
              { min: 3, message: 'Min length is 3 characters' },
            ]}
          >
            <Input placeholder="title" />
          </Form.Item>
          <Form.Item
            label="Category"
            name="category"
            rules={[
              { required: true, message: 'Please input a Category'},
            ]}
          >
            <Select
              style={{ width: `${styled.span}px` }}
              placeholder="Category"
              options={PromptCategories}
              allowClear
            />
          </Form.Item>
          <Form.Item
            label="Body"
            name="body"
            rules={[
              { required: true, message: 'Please input a Body'},
              { min: 10, message: 'Min length is 10 characters' },
            ]}
          >
            <Input.TextArea
              style={{ width: `${styled.span * 1.5}px`, height: '150px' }}
              placeholder="Body"
              
            />
          </Form.Item>
          </Flex>
        </Form>
        
        <Form
          layout={'inline'}
          labelCol={{
            span: styled.span
          }}
          wrapperCol={{
            span: styled.span * 1.5,
          }}
          form={bodyForm}
          onFinish={paintOnFinish}
        >
          <Flex vertical wrap>
          {
            paintedBodyVariables?.length > 0 &&
            <>
              <Flex wrap>
              {
                paintedBodyVariables.map((item) => {
                  return (
                    <Form.Item
                      key={item.key}
                      label={`Variable "${item.key}"`}
                      name={item.key}
                    >
                      <Input placeholder="" />
                    </Form.Item>
                  );
                })
              }
              </Flex>
              <Form.Item>
                <Button type="primary" htmlType="submit">Preview with Values</Button>
              </Form.Item>
            </>
          }
          </Flex>
        </Form>
        <h4>Preview:</h4>
        <p>{paintedBody}</p>
      </Modal>
    </>
  );
}

export default PromptModal;