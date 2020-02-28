import {DataPage} from "@/entity/Base";
import {Company} from "@/entity/Company";

export class Algorithm extends DataPage {

    public id!: bigint;

    public name!: string;

    public description!: string;

    public expression!: string;

    public company!: Company;

    public parameter!: string;

    public result!: number | string;
}