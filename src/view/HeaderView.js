import { Typography, Divider, Statistic, Row, Col, Space, Alert } from "antd";
import { FieldValueTable } from "../component/FieldValueTable";

const { Title, Paragraph, Text, Link } = Typography;

const HeaderView = (props) => {
  console.log(props);
  let data = props.data;

  return (
    <Typography>
      <Title>Member Header</Title>
      {data.error ? (
        <Alert
          message="Error"
          description="An error occurred while decoding header. Incomplete data presented. "
          type="error"
          showIcon
        />
      ) : (
        <></>
      )}
      <Title level={2}>Member Overview</Title>
      <>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Statistic
              title="Compressed Length (bytes)"
              value={(data.compressedLength / 8).toFixed(2)}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Uncompressed Length (bytes)"
              value={(data.uncompressedLength / 8).toFixed(0)}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Compression Ratio"
              value={(data.uncompressedLength / data.compressedLength).toFixed(
                2
              )}
            />
          </Col>

          <Col span={8}>
            <Statistic title="Match Length (bytes)" value={data.matchLength} />
          </Col>
          <Col span={8}>
            <Statistic
              title="Literal Length (bytes)"
              value={data.literalLength}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Match Coverage"
              value={
                (
                  (data.matchLength / (data.uncompressedLength / 8)) *
                  100
                ).toFixed(2) + "%"
              }
            />
          </Col>

          <Col span={8}>
            <Statistic
              title="Average Match Length"
              value={data.averageLength.toFixed(2)}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Average Match Distance"
              value={data.averageDist.toFixed(2)}
            />
          </Col>
          <Col span={8}></Col>
        </Row>
      </>
      <Title level={2}>Header Field</Title>
      <Paragraph>
        <FieldValueTable
          dataSource={[
            { field: "ID1", value: "0x" + data.ID1.toString(16) },
            { field: "ID2", value: "0x" + data.ID2.toString(16) },
            { field: "CM (deflate=8)", value: data.CM },
            {
              field: "FLG",
              value: (
                <FieldValueTable
                  fieldTitle="FLG Field"
                  dataSource={[
                    { field: "FTEXT", value: data.FLG.FTEXT },
                    { field: "FHCRC", value: data.FLG.FHCRC },
                    { field: "FEXTRA", value: data.FLG.FEXTRA },
                    { field: "FNAME", value: data.FLG.FNAME },
                    { field: "FCOMMENT", value: data.FLG.FCOMMENT },
                    { field: "reserved0", value: data.FLG.reserved0 },
                    { field: "reserved1", value: data.FLG.reserved1 },
                    { field: "reserved2", value: data.FLG.reserved2 },
                  ]}
                />
              ),
            },
            { field: "MTIME", value: data.MTIME },
            { field: "XFL", value: data.XFL },
            { field: "OS", value: data.OS },
          ]}
        />
      </Paragraph>

      {data.FLG.FEXTRA ? (
        <>
          <Title level={3}>FLG.FEXTRA</Title>
          <Paragraph>
            <FieldValueTable
              dataSource={[
                { field: "XLEN", value: data.XLEN },
                { field: "EXTRAFIELD", value: data.EXTRAFIELD },
              ]}
            />
          </Paragraph>
        </>
      ) : (
        <></>
      )}

      {data.FLG.FNAME ? (
        <>
          <Title level={3}>FLG.FNAME</Title>
          <Paragraph>
            <FieldValueTable
              dataSource={[{ field: "FILENAME", value: data.FILENAME }]}
            />
          </Paragraph>
        </>
      ) : (
        <></>
      )}

      {data.FLG.FCOMMENT ? (
        <>
          <Title level={3}>FLG.COMMENT</Title>
          <Paragraph>
            <FieldValueTable
              dataSource={[{ field: "COMMENT", value: data.FCOMMENT }]}
            />
          </Paragraph>
        </>
      ) : (
        <></>
      )}

      {data.FLG.FHCRC ? (
        <>
          <Title level={3}>FLG.FHCRC</Title>
          <Paragraph>
            <FieldValueTable
              dataSource={[{ field: "Header CRC16", value: data.HEADER_CRC16 }]}
            />
          </Paragraph>
        </>
      ) : (
        <></>
      )}
    </Typography>
  );
};

export { HeaderView };
