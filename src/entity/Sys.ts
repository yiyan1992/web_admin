import {DataPage} from "@/entity/Base";

export class SysMenu extends DataPage {
    public id!: bigint;

    public name!: string;

    public url!: string;

    public permission!: string;

    public description!: string;

    public parent!: SysMenu;
}

export class SysRole extends DataPage {

    public id!: bigint;

    public name!: string;

    public description!: string;

    public menus!: Set<SysMenu>;

}

export class SysUser extends DataPage {


}