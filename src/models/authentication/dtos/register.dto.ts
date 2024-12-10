import {
  IsNotEmpty,
  IsString,
} from 'class-validator';


export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  username: string;
  
  @IsString()
  @IsNotEmpty()
  password: string;

}

export default RegisterDto;
