import { Typography, Divider, Statistic, Row, Col, Space, Alert } from "antd";
import { FieldValueTable } from "../component/FieldValueTable";

const { Title, Paragraph, Text, Link } = Typography;

const TrailerView = (props) => {
  console.log(props);
  let data = props.data;

  return (
    <Typography>
      <Title>Member Trailer</Title>
      <FieldValueTable
          dataSource={[
            { field: "CRC", value: "0x"+data.CRC32.toString(16) },
            { field: "ISIZE", value: data.ISIZE },
          ]}
        />
    </Typography>
  );
};

export { TrailerView };
