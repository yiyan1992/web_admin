import {DataSource} from "@/entity/DataSource";
import {SysUser} from "@/entity/Sys";

export class Chart {

    public id!: bigint;

    public name!: string;

    public dir: boolean = true;

    public parentId!: bigint;

    public sysUser: SysUser = new SysUser();

    public dataSource: DataSource = new DataSource();

    public tableName!: string;

    public targetTableName!:string;

    public ranking!: number;

    public children: Chart[] = [];
}