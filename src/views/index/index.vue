<template>
    <div v-if="list" class="home">
        <Overview :view-list="list.showList" />
        <TrainEcharts :trains-list="list.trains" />
    </div>
</template>

<script>
import Overview from "@/views/index/components/Overview";
import TrainEcharts from "@/views/index/components/TrainEcharts";
import { home } from "@/api/index"

export default {
    name: "Index",
    components: { Overview, TrainEcharts },
    data() {
        return {
            list: null,
        };
    },
    mounted() {
        this.getList()
    },
    methods: {
        getList() {
            const params = {
                busiCode: 1003,
                tranCode: 331000
            }
            home.getDataShow(params).then(res => {
                if (res.respType === 1) {
                    this.list = {
                        showList: {
                            myTrainsCount: res.respData.myTrainsCount,
                            resourcesCount: res.respData.resourcesCount,
                            triansCount: res.respData.triansCount,
                        },
                        trains: res.respData.trains
                    }
                }
            })
        }
    }
};
</script>

<style scoped lang="scss">
.home {
    height: 100%;
    padding: 1px 20px 0 20px;
}
</style>
