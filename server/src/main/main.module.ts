import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ArticleEntity } from "./article.entity"
import { MediaModule } from "../media/media.module"
import { ArticleService } from "./article.service"

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity]), MediaModule],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class MainModule {}
