import {DataPage} from "@/entity/Base";

export class SysMenu {
    public id!: bigint;

    public name!: string;

    public button: boolean = false;

    public ranking!: number;

    public url!: string;

    public permission!: string;

    public description!: string;

    public parentId!: bigint | null;

    public children: SysMenu[] = [];
}

export class SysRole extends DataPage {

    public id!: bigint;

    public name!: string;

    public description!: string;

    public menus!: Set<SysMenu>;

}

export class SysUser extends DataPage {

    public id!: bigint;

    public name!: string;

    public username!: string;

    public email!: string;

    public phone!: string;

    public lastLoginTime!: Date;

    public lastLoginIp!: string;

    public roles!: Array<SysRole>;

    public companyId !: bigint;

}

export class ResetPwd {


    public oldPwd!: string;

    public newPwd!: string;

    public newPwdAgain!: string;

}

