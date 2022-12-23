<template>
    <div>
        <div class="text">数据总览</div>
        <div class="overview">
            <div class="overview-box" :style="{backgroundImage: `url(${knowledgeImg})`}">
                <div class="overview-box-title">
                    仿真资源
                </div>
                <div class="overview-box-num">
                    总数：{{ viewList.resourcesCount }}
                </div>
            </div>
            <!--<div class="overview-box1" />-->
            <div class="overview-box" :style="{backgroundImage: `url(${modelImg})`}">
                <div class="overview-box-title">
                    培训班
                </div>
                <div class="overview-box-num">
                    总数：{{ viewList.triansCount }}
                </div>
            </div>
            <div class="overview-box" :style="{backgroundImage: `url(${lineImg})`}">
                <div class="overview-box-title">
                    我的培训
                </div>
                <div class="overview-box-num">
                    总数：{{ viewList.myTrainsCount }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Overview",
    props: {
        viewList: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    data() {
        return {
            knowledgeImg: require("../../../assets/images/index/knowledge.png"),
            lineImg: require("../../../assets/images/index/line.png"),
            modelImg: require("../../../assets/images/index/model.png")
        }
    }
}
</script>

<style lang="scss" scoped>
.text {
    margin: 10px auto 20px 0;
    color: #707070;
    text-align: left;
    font-size: 24px;
    font-weight: bolder;
}
.overview {
    display: flex;
    justify-content: space-around;
    &-box {
        width: 30%;
        line-height: 40px;
        border-radius: 10px;
        padding: 20px 30px;
        box-shadow: #d5dae3 0 0 5px 5px;
        background-size: 82px;
        background-repeat: no-repeat;
        background-position: 90%;
        &-title {
            font-size: 20px;
            font-weight: bolder;
        }
        &-num {
            font-size: 20px;
            font-weight: bolder;
            color: #1c84c6;
        }
    }
}
</style>
