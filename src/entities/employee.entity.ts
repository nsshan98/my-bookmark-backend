import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true, length: 255 })
  email: string;

  @Column({ default: true })
  show_email: boolean;

  @Column({ nullable: true, length: 20 })
  official_phone: string;

  @Column({ default: true })
  show_official_phone: boolean;

  @Column({ nullable: true, length: 20 })
  personal_phone: string;

  @Column({ default: true })
  show_personal_phone: boolean;

  @Column()
  designation: string;

  @Column()
  department: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  serial: number;

  @Column({ nullable: true })
  sorting_order: number;

  @Column({ default: true })
  is_published: boolean;

  @Column('json', { nullable: true })
  image: {
    image_url: string;
    image_public_id: string;
  } | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.employees)
  user: User;
}
