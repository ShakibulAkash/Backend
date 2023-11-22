import { AdminEntity } from './../admin/admin.entity';
import {
  OneToOne,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';

@Entity('personal_identification_number')
export class PersonalIdentificationNumberEntity {
  @PrimaryGeneratedColumn()
  personalIdentificationNumberID: number;

  @Column({ type: 'varchar', length: 150 })
  Nationality: string;

  @Column({ type: 'varchar', length: 150 })
  Passport_Number: string;
  @Column()
  NID_Card_Number: number;

  @OneToOne(() => AdminEntity, (admin) => admin.personalIdentificationNumber)
  @JoinColumn()
  admin: AdminEntity;
}
