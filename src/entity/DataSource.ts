import {SysUser} from "@/entity/Sys";
import {DataPage} from "@/entity/Base";

export class DataSource extends DataPage {

    public id!: bigint;

    public user!: SysUser;

    public name !: string;

    public type !: bigint;

    public parentId !: bigint;

    public url!: string;

    public serverAddress !: string;

    public databaseName !: string;

    public port !: bigint;

    public username !: string;

    public password !: string;

    public driverClass !: string;

    public sId!: string

}


export class DataSourceLog {

    public id!: bigint;

    public dataSourceId!: bigint;

    public title!: string;

    public createTime!: Date;

    public user!: SysUser;
}

