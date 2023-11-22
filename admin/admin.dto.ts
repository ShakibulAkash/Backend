import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  IsEmail,
} from 'class-validator';

export class AdminDTO {
  
  adminID : number;
  @IsString({ message: 'Invalid name !' })
  @Matches(/^[a-zA-Z]+$/, { message: 'enter a proper name' })
  name: string;
  @IsString({ message: 'Invalid email' })
  email: string;
  @IsString()
  password: string;

}
export class SignDTO {
  @IsString()
  name: string;
  @IsString()
  @IsNotEmpty({ message: 'Name should not be empty.' })
  @IsEmail()
  email: string;
  @IsString()
  @IsNotEmpty({ message: 'Review should not be empty.' })
  password: string;
  phone: number;
  filename : string;
}
export class BlogDto {
  @IsNotEmpty({ message: 'Email should not be empty.' })
  @IsString({ message: 'Post must be a string' })
  name: string;

  @IsNotEmpty({ message: 'Post should not be empty.' })
  @IsString({ message: 'Post must be a string' })
  post: string;
}
export class AdminUpdateDTO {
  id: number;
  name: string;
  email: string;
  password: string;
}

export class ProductDTO {
  adminID: number;
  AdminEmail: string;
  @IsString()
  @IsNotEmpty({ message: 'Name should not be empty.' })
  name: string;
  @IsString()
  code: string;
  @IsString()
  description:string;
  @IsString()
  category: string ;
}

export class NID_DTO {
  @IsString()
  @IsNotEmpty({ message: 'Nationality should not be empty.' })
  Nationality: string;
  @IsString()
  @IsNotEmpty({ message: 'Password should not be empty.' })
  Passport_Number: string;
  @IsNumber()
  @IsNotEmpty({ message: 'NID Card Number should not be empty.' })
  NID_Card_Number: number;
}

export class Product_Image {
  @IsString({ message: 'invalid name' })
  @Matches(/^[a-zA-Z]+$/, { message: 'enter a proper name' })
  name: string;

  @IsEmail({}, { message: 'invalid email' })
  email: string;
  password: string;
  Product_code: number;
  filenames: string;
}

export class Admin_login_Dto {
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
}
