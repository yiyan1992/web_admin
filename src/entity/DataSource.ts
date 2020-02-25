import {SysUser} from "@/entity/Sys";

export class DataSourceLog {

    public id!: bigint;

    public dataSourceId!: bigint;

    public title!: string;

    public createTime!: Date;

    public user!: SysUser;
}