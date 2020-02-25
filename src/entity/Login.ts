import {SysMenu, SysUser} from "@/entity/Sys";
import {Company, Department} from "@/entity/Company";

export class Login {

    public username!: string;

    public password!: string;

    public remember: boolean = false;
}

export class CheckTokenResponse {

    public user!: SysUser;

    public menus!: Set<SysMenu>;

    public company!: Company;

    public departments!: Set<Department>;

    public positions!: Set<Position>;

}