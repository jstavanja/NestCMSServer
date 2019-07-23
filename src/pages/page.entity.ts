import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Page {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  title: string;

  @Column('text')
  permalink: string;

  @Column()
  content: string;

  @Column()
  isPublished: boolean;
}
