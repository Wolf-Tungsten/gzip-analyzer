import { Table } from "antd";

const FieldValueTable = (props) => {
  let fieldTitle = props.fieldTitle ? props.fieldTitle : "Field"
  let valueTitle = props.valueTitle ? props.valueTitle : "Value"
  return (
    <Table
      size="small"
      bordered
      columns={[
        { title: fieldTitle, dataIndex: "field", key: "field" },
        { title: valueTitle, dataIndex: "value", key: "value" },
      ]}
      pagination={!!props.pagination}
      dataSource={props.dataSource.map((elem) => {
          elem.key = elem.field;
          return elem
      })}
    ></Table>
  );
};

export { FieldValueTable }