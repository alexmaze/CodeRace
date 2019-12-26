import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ResourceEntity } from "./resource.entity"
import { MediaService } from "./media.service"
import { ResourceService } from "./resource.service"

@Module({
  imports: [TypeOrmModule.forFeature([ResourceEntity])],
  providers: [MediaService, ResourceService],
  exports: [MediaService, ResourceService]
})
export class MediaModule {}
