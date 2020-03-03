import {SysUser} from "@/entity/Sys";
import {DataPage} from "@/entity/Base";
import {Algorithm} from "@/entity/Algorithm";

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

    public createTime!: string;

    public user!: SysUser;
}

export class DataTable {

    public id!: bigint;

    public tableName!: string;

    public update!: string;

    public updateType!: number;

    public status: string = "全量";
}

export class DataTableColumnMapping {

    public id!: bigint;

    public dataSource!: DataSource;

    public tableName!: string;

    public columnName!:string;

    public columnTypeName!:string;

    public targetTableName!:string;

    public targetColumnName!:string;
    
    public algorithm:Algorithm=new Algorithm();
}


