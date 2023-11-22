import { AdminEntity, ProductEntity } from './admin.entity';
import {
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  UploadedFile,
  Res,
  ValidationPipe,
  UsePipes,
  ParseIntPipe,
  Session,
  UseGuards,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { Body, Delete, Put, Query } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  AdminDTO,
  AdminUpdateDTO,
  ProductDTO,
  NID_DTO,
  Product_Image,
} from './admin.dto';
import { AdminService } from './admin.service';
import { MulterError, diskStorage } from 'multer';
import { SignDTO, Admin_login_Dto, BlogDto } from './admin.dto';
import { SessionGuard } from './session.guard';
@Controller('/admin')
export class AdminController {
  constructor(public readonly adminservice: AdminService) {}
  //done crud
  @Get('/getadmincrud')
  //@UseGuards(SessionGuard)
  getadmincrud(): any {
    return this.adminservice.getadmincrud();
  }
  //blog post show
  @Get('/Blog')
  //@UseGuards(SessionGuard)
  GetBlogPost() {
    return this.adminservice.GetBlogPost();
  }
  //done normal
  @Get('/getIndex')
  //@UseGuards(SessionGuard)
  getIndex(): any {
    return this.adminservice.getIndex();
  }
  // search done
  @Get('/search/:id')
  //@UseGuards(SessionGuard)
  async getAdminbyID(@Param('id', ParseIntPipe) id: any): Promise<AdminEntity> {
    const res = await this.adminservice.getAdminbyID(id);

    if (res !== null) {
      console.log(res);
      return res;
    } else {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'result fail',
      });
    }
  }
  //admincrudSearch //product search

  @Get('/admincrudsearch/:id')
  //@UseGuards(SessionGuard)
  @UsePipes(new ValidationPipe())
  async admincrudSearch(
    @Query() qury: any,
    @Session() session,
  ): Promise<ProductEntity> {
    console.log(session);
    const res = await this.adminservice.admincrudSearch(
      qury.id,
      qury.name,
      qury.code,
    );

    if (res !== null) {
      console.log(res);
      return res;
    } else {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'Product not found ',
      });
    }
  }

  ///add admin database Done

  @Post('/addadmin')
  @UsePipes(new ValidationPipe())
  //@UseGuards(SessionGuard)
  async addadmin(
    @Body() data: AdminDTO,
    @Session() session,
  ): Promise<AdminEntity> {
    console.log(session);
    const res = this.adminservice.addadmin(data);

    if (res !== null) {
      return res;
    } else {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        Message: 'addmin cannot insert ',
      });
    }
  }
//member
  @Get('member') 
  getAllMembers() {
   
  }

  @Post('member') 
  createMember(@Body() memberData: any) {
    
  }


  //product add to 
  @Post('/admincrud')
  @UsePipes(new ValidationPipe())
  //@UseGuards(SessionGuard)
  async admincrud(
    @Body() data: ProductDTO,
    @Session() session,
  ): Promise<ProductEntity> {
    console.log(session.email);
    const adminemail = session.email;
    const res = await this.adminservice.admincrud(data);

    if (res !== null) {
      return res;
    } else {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        Message: 'Product not found ',
      });
    }
  }
  //update admin
 
  @Put('/adminUpdate/:adminID')
  //@UseGuards(SessionGuard)
  updateAdmin(@Param('adminID') adminID :number, @Body() data : AdminDTO): object {
    

    return this.adminservice.updateAdmin(adminID, data);
  }

  //session check
  @Post('/sessionCheck')
  //@UseGuards(SessionGuard)
  sessioncheck(@Session() session): any {
    console.log(session.email);
    console.log(session.password);
    return 'sucess';
  }

  //update crud//work 
  @Put('/adminCrudUpdate/:productID')

  //@UseGuards(SessionGuard)
  updateAdminById(@Param() productID :number ,@Body() data : ProductDTO): object {

    return this.adminservice.updateAdminById(productID ,data);
  }

  //sir 
  @Put('/updateproduct/:id')
  @UsePipes(new ValidationPipe())
  updateAdminbyID(@Param() id: number, @Body() data: ProductDTO): object {
    return this.adminservice.updateAdminById(id, data);
  }

  //delete admin

  @Delete('/adminDelete/:adminID')
  @UseGuards(SessionGuard)
  adminDelete(@Param('adminID') adminID: number, @Session() session: { email?: string }): any {
    console.log(session.email);

    return this.adminservice.adminDelete(adminID);
  }

  //delete Product

  @Delete('/productDelete/:productID')
  //@UseGuards(SessionGuard)
  
  productdelete(@Param() productID: any): any {
    return this.adminservice.productdelete(productID);
  }

  //file Upload

  // @Post('/upload')
  // @UseInterceptors(FileInterceptor('file'))
  // UploadedFile(@UploadedFile() file: Express.Multer.File) {
  // console.log(file);
  // return 'success';
  // }

  @Post('/blogpost')
  //@UseGuards(SessionGuard)
  Blogpost(@Body() data: BlogDto) {
    return this.adminservice.Blogpost(data);
  }

  @Post('uploads')
  @UseInterceptors(
    FileInterceptor('myfile', {
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
          cb(null, true);
        else {
          cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
        }
      },
      limits: { fileSize: 3000000 },
      storage: diskStorage({
        destination: './uploads',
        filename: function (req, file, cb) {
          cb(null, Date.now() + file.originalname);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() myfileobj: Express.Multer.File): object {
    console.log(myfileobj);
    return { message: 'file uploaded' };
  }

  @Get('/getimage/:name')
  getImages(@Param('name') name, @Res() res) {
    res.sendFile(name, { root: './uploads' });
  }


  //NID add  data

  @Post('/NID')
  @UsePipes(new ValidationPipe())
  NID_add(@Body() data: NID_DTO) {
    return this.adminservice.NID_add(data);
  }

  @Get('/NID_Search/:id')
  nid_search(@Param() id: any) {
    return this.adminservice.nid_search(id);
  }

  @Post('/signup')
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
          cb(null, true);
        else {
          cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
        }
      },
      limits: { fileSize: 3000000 },
      storage: diskStorage({
        destination: './uploads',
        filename: function (req, file, cb) {
          cb(null, Date.now() + file.originalname);
        },
      }),
    }),
  )
  @UsePipes(new ValidationPipe())
  signup(@Body() data: SignDTO, @UploadedFile() imageobj: Express.Multer.File) {
    console.log(data);

    console.log(imageobj.filename);
    data.filename = imageobj.filename;
    console.log(data.filename);
    return this.adminservice.signup(data);
  }

  @Post('/signin')
  @UsePipes(new ValidationPipe())
  signIn(@Body() data: Admin_login_Dto, @Session() session) {
    const result = this.adminservice.adminlogin(data);
    if (result) {
      session.email = data.email;
      console.log(session.email);
    }
    return result;
    
  }

  //Product_img

  @Post('/Product_img')
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
          cb(null, true);
        else {
          cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
        }
      },
      limits: { fileSize: 300000000000 },
      storage: diskStorage({
        destination: './uploads',
        filename: function (req, file, cb) {
          cb(null, Date.now() + file.originalname);
        },
      }),
    }),
  )
  @UsePipes(new ValidationPipe())
  product_image(
    @Body() mydata: Product_Image,
    @UploadedFile() imageobj: Express.Multer.File,
  ) {
    console.log(mydata);
    console.log(imageobj.filename);
    mydata.filenames = imageobj.filename;
    // return this.adminservice.signup(data);
  }
  @Post('/sendemail')
  sendEmail(@Body() mydata: object) {
    return this.adminservice.sendEmail(mydata);
  }
}
