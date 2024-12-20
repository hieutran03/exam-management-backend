import {
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';


export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  username: string;
  
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNumber()
  role_id: number;
}

export default RegisterDto;
