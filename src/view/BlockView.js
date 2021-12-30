import { Typography, Divider, Statistic, Row, Col, Space } from "antd";
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
        itemStyle: {
          color,
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

const distDistributeOption = (data) => {
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
        endValue: 32768,
      },
      {
        start: 0,
        end: 20,
      },
    ],
    series: [
      {
        name: "Match Distance",
        type: "bar",
        //symbol: "none",
        //sampling: "lttb",
        // itemStyle: {
        //   color: "#118ab2",
        // },
        // itemStyle: {
        //     color: 'rgb(255, 70, 131)'
        //   },
        //   lineStyle:{
        //       width:0,
        //       type:"solid"
        //   },
        //   areaStyle: {
        //     color:'#000'
        //   },
        data: data,
        large: true,
      },
    ],
  };
};

const matchHeatMapOption = (data) => {
  let distMax = 0;
  let lenMax = 0;
  let plotData = [];
  Object.keys(data).forEach((k) => {
    let [_, len, dist] = k.split("_");
    len = parseInt(len);
    dist = parseInt(dist);
    if (len > lenMax) {
      lenMax = len;
    }
    if (dist > distMax) {
      distMax = dist;
    }
    for (let i = 0; i < data[k]; i++) {
      plotData.push([dist, len]);
    }
  });
  let xData = [];
  let yData = [];
  for (let i = 0; i <= distMax; i++) {
    xData.push(i);
  }
  for (let i = 0; i <= lenMax; i++) {
    yData.push(i);
  }

  return {
    tooltip: {
      position: "top",
    },
    xAxis: {
      name: "Distance",
      nameLocation: "center",
      nameTextStyle: { padding: 5 },
    },
    yAxis: {
      name: "Length",
      nameLocation: "center",
      nameTextStyle: { padding: 10 },
    },
    dataZoom: [
      {
        type: "inside",
        startValue: 0,
        endValue: distMax,
      },
      {
        type: "slider",
        //showDataShadow: false,
        //handleIcon:
        //"path://M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
        //handleSize: "80%",
      },
      {
        type: "inside",
        orient: "vertical",
        startValue: 0,
        endValue: lenMax,
      },
      {
        type: "slider",
        orient: "vertical",
        //showDataShadow: false,
        //handleIcon:
        //"path://M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
        //handleSize: "80%",
      },
    ],
    series: [
      {
        symbolSize: 3,
        data: plotData,
        type: "scatter",
        encode: { tooltip: [0, 1] },
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


      {data.BTYPE !== 0 ? (
        <>
          <Title level={2}>Overview</Title>
          <Row gutter={[16,16]}>
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
                value={(data.uncompressedLength / data.compressedLength).toFixed(2)}
              />
            </Col>

            <Col span={8}>
              <Statistic
                title="Match Length (bytes)"
                value={data.matchLength}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Literal Length (bytes)"
                value={data.literalLength}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Match Ratio"
                value={(data.matchLength / (data.uncompressedLength/8) * 100).toFixed(2)}
              />
            </Col>

            <Col span={8}>
              <Statistic
                title="Average Match Length"
                value={(data.lengthDistribute.map((v, idx) => (v * idx)).reduce((a, b) => (a + b)) / data.lengthDistribute.reduce((a, b) => (a + b))).toFixed(2)}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Average Match Distance"
                value={(data.distDistribute.map((v, idx) => (v * idx)).reduce((a, b) => (a + b)) / data.lengthDistribute.reduce((a, b) => (a + b))).toFixed(2)}
              />
            </Col>
            <Col span={8}></Col> 

          </Row>
        </>
      ) : (
        <></>
      )}


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
              fieldTitle="Length Alphabet"
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
          <Title level={2}>Distance</Title>
          <Title level={3}>Distance Huffman Code</Title>
          <Paragraph>
            <FieldValueTable
              fieldTitle="Distance Alphabet"
              valueTitle="Huffman Code"
              pagination={true}
              dataSource={data.distHuffmanCode.map((elem) => {
                let res = {};
                res.field = elem.alphabet;
                res.value = elem.code;
                return res;
              })}
            />
          </Paragraph>
          <Title level={3}>Distance Huffman Tree</Title>
          <Paragraph>
            <ReactECharts
              option={huffmanTreeOption(data.distTree, "#f77f00")}
              style={{ height: "500px" }}
            />
          </Paragraph>
          <Title level={3}>Distance Distribution</Title>
          <Paragraph>
            <ReactECharts
              option={distDistributeOption(data.distDistribute)}
              style={{ height: "500px" }}
            />
          </Paragraph>

          <Title level={2}>Match Length Distance Distribution</Title>
          <Paragraph>
            <ReactECharts
              option={matchHeatMapOption(data.heatMap)}
              style={{ height: "500px" }}
            />
          </Paragraph>
        </>
      ) : (
        <></>
      )}
    </Typography>
  );
};

export { BlockView };
