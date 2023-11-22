
import { Injectable, NotFoundException } from '@nestjs/common';
import { AddressDTO, BookDTO, OrderDTO, SellerDTO } from './seller.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In } from 'typeorm';
import { AddressEntity, BookEntity,  OrderEntity, SellerEntity } from './seller.entity';
import { plainToClass } from 'class-transformer';
import * as bcrypt from 'bcrypt';



@Injectable()
export class SellerService {
    
    constructor(
        @InjectRepository(SellerEntity) private sellerRepository: Repository<SellerEntity>,
        @InjectRepository(BookEntity) private bookRepository: Repository<BookEntity>,
        @InjectRepository(AddressEntity) private addressRepository: Repository<AddressEntity>,
        @InjectRepository(OrderEntity) private orderRepository: Repository<OrderEntity>,
     
        )
        
        {}

    
    
    

//  BOOK
    current_book_info : BookDTO
  

    async AddBooks(Email: string, book_info: BookDTO): Promise<BookEntity> {
        const seller_info = await this.sellerRepository.findOneBy({ Email: Email });
        const bookEntity = this.bookRepository.create(book_info);
        bookEntity.seller = seller_info; // Assign the entire seller_info object
        console.log(seller_info.Seller_ID); // Working
        console.log("Email = "+Email);
        return this.bookRepository.save(bookEntity); // Save the bookEntity, not book_info
      }

     async ViewAllBooks(email): Promise<SellerEntity[]> {
        
        const data = await  this.sellerRepository.find({
            where: { Email: email },
            relations: {
                books: true
            }
            });
            console.log(data);
            return data;
    }


    async ViewSingleBook(id: number): Promise<BookEntity> {
        return this.bookRepository.findOneBy({Book_ID: id});
        
    }

    async UpdateBookInfo(b_id:number, updated_data: BookDTO): Promise<BookEntity> {
        await this.bookRepository.update(b_id, updated_data); // Where to Update , Updated Data
        return this.bookRepository.findOneBy({Book_ID: b_id});

    }

    DeleteBookInfo(id: number): any {
        this.bookRepository.delete(id);
        return {"Success":"Book Deleted Successfully"};
    }

  

    async getBookImages(id: number, res: any): Promise<any> {

        const currentBook = await this.bookRepository.findOneBy({ Book_ID: id });
        const currentBookDTO: BookDTO = plainToClass(BookDTO, currentBook);
        if (currentBook) {
            const currentBookDTO: BookDTO = plainToClass(BookDTO, currentBook);
            console.log(currentBookDTO);
            return res.sendFile(currentBookDTO.Book_Image, {
              root: './assets/book_images',
            });
          } else {
            return null;
          }

    }



    // getBookData

    async getBookData(sellerEmail: string, searchType: string, searchItem: string): Promise<BookEntity[]> {
        
        const seller = await this.sellerRepository.findOne({ where: { Email: sellerEmail } });
    
        if (!seller) {
          throw new NotFoundException('Seller not found');
        }
    
        const queryBuilder = this.bookRepository.createQueryBuilder('book')
          .where('book.seller.Seller_ID = :sellerId', { sellerId: seller.Seller_ID });
    
        if (searchType === 'Title') {
          queryBuilder.andWhere('book.Title LIKE :searchItem', {
            searchItem: `%${searchItem}%`,
          });
        } else if (searchType === 'Author') {
          queryBuilder.andWhere('book.Author LIKE :searchItem', {
            searchItem: `%${searchItem}%`,
          });
        } else if (searchType === 'ISBN') {
          queryBuilder.andWhere('book.ISBN LIKE :searchItem', {
            searchItem: `%${searchItem}%`,
          });
        } else if (searchType === 'Condition') {
          queryBuilder.andWhere('book.Condition LIKE :searchItem', {
            searchItem: `%${searchItem}%`,
          });
        } else if (searchType === 'Price') {
          // Assuming the Price column is of type string
          queryBuilder.andWhere('book.Price = :searchItem', {
            searchItem,
          });
        }
    
        return queryBuilder.getMany();
      }


    


//  SELLER


    async Signup(seller_info: SellerDTO): Promise<SellerEntity> {
        seller_info.Profile_Picture = "temp.svg";
        const salt = await bcrypt.genSalt();
        seller_info.Password = await bcrypt.hash(seller_info.Password, salt);
        return this.sellerRepository.save(seller_info);
    }

    async ViewSellerProfile(email : string): Promise<SellerEntity> {
        return this.sellerRepository.findOneBy({Email: email});
    }
        


    async Login(seller_info: SellerDTO): Promise<SellerEntity> {
        const saved_seller = await this.sellerRepository.findOneBy({Email: seller_info.Email});
        console.log(saved_seller)
        if(saved_seller != null){
            const match : boolean = await bcrypt.compare(seller_info.Password, saved_seller.Password);

            if (match) {
                return saved_seller;
            }else{
                return null;
            }
        }
        return null;
    }

    async UploadSellerImage(email:string,image:string): Promise<SellerEntity> {
        
        const current_seller = this.sellerRepository.findOneBy({Email: email});
        if(current_seller){
            (await current_seller).Profile_Picture = image;
            await this.sellerRepository.update((await current_seller).Seller_ID,(await current_seller));
            return this.sellerRepository.findOneBy({Seller_ID: (await current_seller).Seller_ID});
        }
        
    }

    async getSellerImages(email:string, res: any): Promise<any> {

        const current_seller = this.sellerRepository.findOneBy({Email: email});
        // console.log("Current seller Image Getting = "+(await current_seller).Profile_Picture) // Working
        if(current_seller){
            res.sendFile((await current_seller).Profile_Picture,{ root: './assets/profile_images' })
        }
    }


    // ADDRESS 

    async AddAddress(Seller_Email: string, address_info: AddressDTO) : Promise<AddressEntity> {
        const seller_info = await this.sellerRepository.findOneBy({Email: Seller_Email});
        if(seller_info != null){
            const addressEntity = this.addressRepository.create(address_info);
            addressEntity.seller = seller_info;
            return this.addressRepository.save(addressEntity);
        }else{
            return null;
        }
    }

    async ViewSellerAddress(Seller_Email: string): Promise<AddressEntity[]> {
        return this.addressRepository.find({
            where: { seller: { Email: Seller_Email } },
            relations: {
                seller: true,
            }
            });
    }


    async UpdateAddress(Seller_Email: any, updated_data: AddressDTO) : Promise<AddressDTO> {
      console.log("Current seller mail = "+Seller_Email);
        const seller_info = await this.sellerRepository.findOneBy({Email: Seller_Email});
        console.log("Seller ID = "+ (await seller_info).Seller_ID)
        const old_address = await this.addressRepository.findOne({
          where: { seller: await seller_info },
        });
        if(old_address != undefined && old_address != null){
          //  Data Available
          console.log("Address ID = "+ old_address.Address_ID)
          updated_data.Address_ID = old_address.Address_ID;
          await this.addressRepository.update(old_address.Address_ID, updated_data); // Where to Update , Updated Data
        }else{
          // Create a address
          const addressEntity = this.addressRepository.create(updated_data);
            addressEntity.seller = seller_info;
            await this.addressRepository.save(addressEntity);
          
        }
        const address = await this.addressRepository.findOneBy({seller: (await seller_info)});
        if (address) {
            return address;
        } else {
            return null;
        }
    }

    async DeleteAddress(Seller_Email: any) : Promise<any> {
        const seller_info = await this.sellerRepository.findOneBy({Email: Seller_Email});
        const decision = await this.addressRepository.delete({seller: (await seller_info)});
        if(decision){
            return null;
        }else{
            return {"Error":"Address is not Available"};
        }
    }

    // ORDER
    async ViewAllOrders(Seller_Email: string): Promise<any> {
        // Get the seller information based on the email
        const seller = await this.sellerRepository.findOneBy({ Email: Seller_Email });
      
        console.log("Seller Information = "+seller); // Working
      
        // Get the seller's ID
        const sellerId = seller.Seller_ID; 
        // console.log("Seller ID = "+sellerId); // Working


        const orders = await this.orderRepository.find({
            where: {
                seller: { Seller_ID: sellerId },
                Order_Status: Not(In(['Delivered', 'Cancelled'])),
              },
              relations: ['seller'],
            });

      
        if(orders != null) {
            return orders;
      }else{
            return null;
      }
    }

    async ViewSingleOrder(id: number) : Promise<OrderEntity>{
        const order = await this.orderRepository.findOneBy({Order_ID: id});
        if(order != null) {
            return order;
        }else{
            return null;
        }
    }


    async Update_Order_Status(id: number, update_status:string) : Promise<boolean> {
        const order = await this.orderRepository.findOneBy({Order_ID: id});
        if(order != null) {
            if(update_status == "Delivered"){
                order.Order_Status = "Delivered";
                
                
            }else if(update_status == "Cancelled"){
                order.Order_Status = "Cancelled";
            }else{
                order.Order_Status = "Pending";
            }
            const decision = await this.orderRepository.update(id, order);
            if (decision.affected !== undefined && decision.affected > 0) {return true;} else {return false;}
        }else{
            return false;
        }
    }

   
  }

