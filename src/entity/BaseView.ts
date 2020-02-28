import {Vue} from "vue-property-decorator";

export default class BaseView extends Vue {

    protected form: any;

    protected searchForm(form: string) {

    }


    handleSizeChange(val: number) {
        this.form.size = val - 1;
        this.searchForm("form");
    }

    handleCurrentChange(val: number) {
        this.form.page = val - 1;
        this.searchForm("form");
    }
}