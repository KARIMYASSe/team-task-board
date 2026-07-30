import { IsMongoId, IsNotEmpty } from 'class-validator';

export class AddMemberDto {
  @IsNotEmpty()
  @IsMongoId()
  userId: string;
}