import {DataPage} from "@/entity/Base";
import {SysUser} from "@/entity/Sys";


export class Company extends DataPage {

    public id!: string;

    public name!: string;

    public description!: string;

    public user!: SysUser;

    public users!: Set<SysUser>;

}

export class Department extends DataPage {

    public id!: bigint;

    public name!: string;

    public description!: string;

    public company!: Company;

    public parentId!: bigint;

    public users!: Set<SysUser>;

}

export class Position extends DataPage {

    public id!: bigint;

    public name!: string;

    public description!: string;

    public department: Department = new Department();

    public users: SysUser[] = [];

}

export class Project extends DataPage {

    public id!: bigint;

    public name!: string;

    public description!: string;

    public user!: SysUser;

    public createTime!: string;

    private company!: Company;

    private users!: Set<SysUser>;

}
