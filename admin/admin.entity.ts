import { Session } from '@nestjs/common/decorators';
import { PersonalIdentificationNumberEntity } from './../Admin_NID_Card_Entity/Admin_NID_Card_Entity';
import {
  OneToOne,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Generated,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { MemberEntity } from 'src/member/member.entity';

@Entity('Admin')
export class AdminEntity {
  @PrimaryGeneratedColumn()
  adminID: number;
  @Column()
  name: string;
  @Column()
  email: string;
  @Column()
  password: string;
  
  personalIdentificationNumberID: number;
  @Column({ nullable: true })
  phone: number;
  @Column({ nullable: true })
  filename: string;

  
  @OneToOne(
    () => PersonalIdentificationNumberEntity,
    (personalIdentificationNumber) => personalIdentificationNumber.admin,
  )
  @JoinColumn()
  personalIdentificationNumber: PersonalIdentificationNumberEntity;

  @OneToMany(() => ProductEntity, (product) => product.admin)
  products: ProductEntity[];
  
  @OneToMany(() => MemberEntity, (member) => member.admin)
  members: MemberEntity[];

  
  @ManyToOne(() => AdminEntity, (admin) => admin.members)
  admin: AdminEntity;
}

@Entity('admin_product')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  productID: number;
  @Column({nullable:true})
  adminID: number;
  @Column()
  name: string;
  @Column({ nullable: true })
  code: string;
  @Column({ nullable: true })
  description:string;
  @Column({ nullable: true })
  category: string ;


  @ManyToOne(() => AdminEntity, (admin) => admin.products)
  admin: AdminEntity;
}

@Entity('Product Image')
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  email: string;
  @Column()
  password: string;
  @Column()
  Product_code: string;
  @Column()
  filename: string;
}

@Entity('Blog')
export class BlogPost {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  post: string;
}
