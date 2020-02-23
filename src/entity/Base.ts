import {AxiosResponse} from "axios";

export class DataPage {

    public page: number = 0;

    public size: number = 10

}

export class JpaPage {

    //总条数
    public totalElements: number = 0;

    public last: boolean = false;

    //总页数
    public totalPages: number = 0;

    //当前页
    public number: number = 0;

    //页条数
    public size: number = 10;

}

export class Result {

    constructor(result: any) {
        this.code = result.data.code;
        this.msg = result.data.msg;
        this.data = result.data.data;
    }


    public code: number = 200;

    public msg!: string;

    public data!: any;

    public translateJpa(): JpaPage {
        let page = new JpaPage();
        if (this.code == 200) {
            page.totalElements = this.data.totalElements;
            page.totalPages = this.data.totalPages;
            page.number = this.data.number + 1;
            page.size = this.data.size;
            return page;
        }
        return page;
    }
}