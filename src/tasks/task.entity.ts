import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  taskId: number;

  @Column()
  title: string;

  @Column("int", { array: true })
  daysOfWeek: number[];

  @Column()
  time: string;

  @Column()
  timezone: string;

  @Column({ default: false })
  executed: boolean;
}
