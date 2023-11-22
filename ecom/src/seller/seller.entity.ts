
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne, JoinColumn } from "typeorm";

@Entity("seller")
export class SellerEntity{
    @PrimaryGeneratedColumn()
    Seller_ID: number;

    @Column()
    Name: string;

    @Column()
    Email: string;

    @Column()
    Password: string;

    @Column()
    Phone: string;

    @Column()
    Profile_Picture : string;

    // One to Many Relationships. One Seller Can have many Books
    @OneToMany(()=>BookEntity, book=>book.seller)
    books: BookEntity[];

    // One to Many Relationships. One Seller Can have many orders
    @OneToMany(()=>OrderEntity, order=>order.seller)
    orders: OrderEntity[];


}



@Entity("address")
export class AddressEntity{

    @PrimaryGeneratedColumn()
    Address_ID : number;

    @Column()
    Street : string;

    @Column()
    Building : string;

    @Column()
    City : string;

    @Column()
    Country : string;

    @Column()
    ZIP : string;

    //  One to One Relationships. One Seller can have only one Address
    @OneToOne(() => SellerEntity)
    @JoinColumn()
    seller: SellerEntity;
    
}



@Entity("book")
export class BookEntity{

    @PrimaryGeneratedColumn()
    Book_ID: number;

    @Column()
    Title: string;

    @Column()
    Author: string;

    @Column()
    ISBN: string;

    @Column()
    Condition: string;

    @Column()
    Price: string;

    @Column()
    Book_Image: string;

    @ManyToOne(()=> SellerEntity)
    seller: SellerEntity;
}


@Entity("order")
export class OrderEntity{

    @PrimaryGeneratedColumn()
    Order_ID : number;

    @Column()
    Order_Date : string;

    @Column()
    Order_Status : string;

    @Column()
    Book_Name : string;

    @Column()
    Book_Price : string;

    // Relationships 

    @ManyToOne(()=> SellerEntity)
    seller: SellerEntity;
    

}
