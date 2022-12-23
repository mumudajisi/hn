<template>
    <div class="nodeEcharts">
        <div class="text">培训班统计</div>
        <div ref="trainEcharts" style="width: 100%; height: 100%" />
    </div>
</template>

<script>
import echarts from "echarts"
export default {
    name: "TrainEcharts",
    props: {
        trainsList: {
            type: Array,
            default() {
                return []
            }
        }
    },
    data() {
        return {
            dataX: [],
            VALUE: []
        }
    },
    mounted() {
        this.trainsList.forEach(item => {
            this.dataX.push(item.split(":")[0])
            this.VALUE.push(item.split(":")[1])
        })
        this.$nextTick(() => {
            this.init()
        })
    },
    methods: {
        init() {
            const that = this
            const charts = echarts.init(this.$refs["trainEcharts"]);
            const option = {
                // backgroundColor: "rbg(40,46,72)",
                grid: {
                    left: "5%",
                    right: "5%",
                    top: "5%",
                    bottom: "5%",
                    containLabel: true
                },
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "line",
                        lineStyle: {
                            color: "rgba(50, 216, 205, 1)"
                        },
                    }
                },
                xAxis: [{
                    type: "category",
                    boundaryGap: 1,
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
                        color: "#000000"
                    },
                    splitLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    data: that.dataX
                }],
                yAxis: [{
                    type: "value",
                    name: "",
                    padding: 5,
                    // max: 1000,
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: "#000000",
                            type: "dashed"
                        }
                    },
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
                        show: true,
                        margin: 10,
                        textStyle: {
                            color: "#000000"

                        }
                    },
                    axisTick: {
                        show: false
                    }
                },

                ],
                series: [
                    {
                        name: "总数",
                        type: "line",
                        // smooth: true,
                        stack: "总数",
                        symbolSize: 8,
                        showSymbol: true,
                        itemStyle: {
                            normal: {
                                color: "#23D0C4",
                                lineStyle: {
                                    color: "#23D0C4",
                                    width: 2
                                },
                            }
                        },
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    {
                                        offset: 0,
                                        color: "rgba(50, 216, 205, 1)"
                                    },
                                    {
                                        offset: 1,
                                        color: "rgba(255, 255, 255, 0.2)"
                                    }
                                ], false),
                            }
                        },
                        data: that.VALUE
                    },

                ]
            };

            charts.setOption(option, true);
        }
    }
}
</script>

<style lang="scss" scoped>
.nodeEcharts {
    height: 520px;
    .text {
        margin: 20px auto 30px 0;
        color: #707070;
        text-align: left;
        font-size: 24px;
        font-weight: bolder;
    }
}
</style>
