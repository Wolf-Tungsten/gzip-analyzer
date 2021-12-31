import { Typography, Divider, Statistic, Row, Col, Space, Alert } from "antd";
import { FieldValueTable } from "../component/FieldValueTable";

const { Title, Paragraph, Text, Link } = Typography;

const TrailerView = (props) => {
  console.log(props);
  let data = props.data;
  let overview = props.overview;

  return (
    <Typography>
      <Title>Member Trailer</Title>
      <FieldValueTable
        dataSource={[
          { field: "CRC", value: "0x" + data.CRC32.toString(16) },
          { field: "ISIZE", value: data.ISIZE },
        ]}
      />

      <Title>Member Overview</Title>
      <>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Statistic
              title="Compressed Length (bytes)"
              value={(overview.compressedLength / 8).toFixed(2)}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Uncompressed Length (bytes)"
              value={(overview.uncompressedLength / 8).toFixed(0)}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Compression Ratio"
              value={(overview.uncompressedLength / overview.compressedLength).toFixed(
                2
              )}
            />
          </Col>

          <Col span={8}>
            <Statistic title="Match Length (bytes)" value={overview.matchLength} />
          </Col>
          <Col span={8}>
            <Statistic
              title="Literal Length (bytes)"
              value={overview.literalLength}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Match Coverage"
              value={
                (
                  (overview.matchLength / (overview.uncompressedLength / 8)) *
                  100
                ).toFixed(2) + "%"
              }
            />
          </Col>

          <Col span={8}>
            <Statistic
              title="Average Match Length"
              value={overview.averageLength.toFixed(2)}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Average Match Distance"
              value={overview.averageDist.toFixed(2)}
            />
          </Col>
          <Col span={8}></Col>
        </Row>
      </>
    </Typography>
  );
};

export { TrailerView };
