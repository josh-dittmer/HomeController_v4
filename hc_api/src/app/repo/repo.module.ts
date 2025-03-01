import { Module } from "@nestjs/common";
import { DBModule } from "../db/db.module.js";
import { RepoService } from "./services/repo.service.js";

@Module({
    imports: [DBModule],
    providers: [RepoService.register()],
    exports: [RepoService],
})
export class RepoModule { };