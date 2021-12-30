import { Typography, Divider } from "antd";
import { FieldValueTable } from "../component/FieldValueTable";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts/core";

const { Title, Paragraph, Text, Link } = Typography;

const huffmanTreeOption = (data, color = "#13acd9") => {
  return {
    tooltip: {
      trigger: "item",
      triggerOn: "mousemove",
    },
    series: [
      {
        type: "tree",
        data: [data],
        left: "2%",
        right: "2%",
        top: "8%",
        bottom: "20%",
        symbol: "emptyCircle",
        orient: "vertical",
        expandAndCollapse: true,
        label: {
          position: "right",
          //rotate: 0,
          //verticalAlign: "middle",
          //align: "right",
          fontSize: 12,
        },
        leaves: {
          label: {
            position: "bottom",
            align: "center",
            offset: [0, -1],
            fontWeight: "bolder",
            color: "#fff",
            backgroundColor: color,
            borderRadius: 4,
            padding: 6,
          },
        },
        lineStyle: { curveness: 0 },
        animationDurationUpdate: 750,
        initialTreeDepth: 4,
      },
    ],
  };
};

const lengthDistributeOption = (data) => {
  return {
    tooltip: {
      trigger: "axis",
      position: function (pt) {
        return [pt[0], "10%"];
      },
    },
    // title: {
    //   left: "center",
    //   text: "Large Area Chart",
    // },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: "none",
        },
        restore: {},
        saveAsImage: {},
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: data.map((v, k) => k),
    },
    yAxis: {
      type: "value",
      boundaryGap: [0, "100%"],
      max: "dataMax",
      splitNumber: 5,
    },
    dataZoom: [
      {
        type: "inside",
        startValue: 0,
        endValue: 64,
      },
      {
        start: 0,
        end: 20,
      },
    ],
    series: [
      {
        name: "Match Length",
        type: "bar",
        symbol: "none",
        sampling: "lttb",
        itemStyle: {
          color: "#1a936f",
        },

        data: data,
      },
    ],
  };
};
const BlockView = (props) => {
  console.log(props);
  let data = props.data;

  return (
    <Typography>
      <Title>{props.data.blockType}</Title>
      <Title level={2}>Block Header</Title>
      <Paragraph>
        <FieldValueTable
          dataSource={[
            { field: "BFINAL (1 bit)", value: data.BFINAL },
            { field: "BTYPE (2 bits)", value: data.BTYPE },
          ]}
        />
      </Paragraph>

      {data.BTYPE === 2 ? (
        <>
          <Title level={2}>Dynamic Block Header</Title>
          <Paragraph>
            <FieldValueTable
              dataSource={[
                {
                  field: "5 Bits: HLIT, # of Literal/Length codes - 257",
                  value: data.HLIT - 257,
                },
                {
                  field: "5 Bits: HDIST, # of Distance codes - 1",
                  value: data.HDIST - 1,
                },
                {
                  field: "4 Bits: HCLEN, # of Code Length codes - 4",
                  value: data.HCLEN - 4,
                },
              ]}
            />
          </Paragraph>

          <Title level={2}>Code Length</Title>
          <Title level={3}>Code Length Huffman Code</Title>
          <Paragraph>
            <FieldValueTable
              fieldTitle="Alphabet"
              valueTitle="Huffman Code"
              pagination={true}
              dataSource={data.codeLengthHuffmanCode.map((elem) => {
                let res = {};
                res.field = elem.alphabet;
                if (elem.alphabet === 16) {
                  res.field = "16: Copy the previous code length 3 - 6 times.";
                } else if (elem.alphabet === 17) {
                  res.field = "17: Repeat a code length of 0 for 3 - 10 times.";
                } else if (elem.alphabet === 18) {
                  res.field =
                    "18: Repeat a code length of 0 for 11 - 138 times.";
                }
                res.value = elem.code;
                return res;
              })}
            />
          </Paragraph>
          <Title level={3}>Code Length Huffman Tree</Title>
          <Paragraph>
            <ReactECharts
              option={huffmanTreeOption(data.codeLengthTree, "#118ab2")}
              style={{ height: "500px" }}
            />
          </Paragraph>
        </>
      ) : (
        <></>
      )}

      {data.BTYPE !== 0 ? (
        <>
          {/** Literal Length */}
          <Title level={2}>Literal and Length</Title>
          <Title level={3}>Literal and Length Huffman Code</Title>
          <Paragraph>
            <FieldValueTable
              fieldTitle="Alphabet"
              valueTitle="Huffman Code"
              pagination={true}
              dataSource={data.litLengthHuffmanCode.map((elem) => {
                let res = {};
                res.field = elem.alphabet;
                res.value = elem.code;
                return res;
              })}
            />
          </Paragraph>
          <Title level={3}>Literal and Length Huffman Tree</Title>
          <Paragraph>
            <ReactECharts
              option={huffmanTreeOption(data.litLengthTree, "#ef476f")}
              style={{ height: "500px" }}
            />
          </Paragraph>
          <Title level={3}>Match Length Distribution</Title>
          <Paragraph>
            <ReactECharts
              option={lengthDistributeOption(data.lengthDistribute)}
              style={{ height: "500px" }}
            />
          </Paragraph>

            {/** Distance */}
        </>
      ) : (
        <></>
      )}
    </Typography>
  );
};

export { BlockView };
