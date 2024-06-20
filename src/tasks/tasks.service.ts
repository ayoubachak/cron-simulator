// src/tasks/tasks.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  create(task: Task): Promise<Task> {
    return this.tasksRepository.save(task);
  }

  findAll(): Promise<Task[]> {
    return this.tasksRepository.find();
  }

  findOne(id: number): Promise<Task> {
    return this.tasksRepository.findOneBy({ taskId: id });
  }

  async executeTask(id: number): Promise<void> {
    const task = await this.findOne(id);
    if (task) {
      task.executed = true;
      await this.tasksRepository.save(task);
      console.log(`Task ${task.taskId} executed`);
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    const tasks = await this.tasksRepository.find();
    const currentDate = new Date();
    tasks.forEach(task => {
      const taskDate = new Date();
      taskDate.setHours(parseInt(task.time.split(':')[0]), parseInt(task.time.split(':')[1]), 0);
      if (task.daysOfWeek.includes(currentDate.getDay()) && currentDate.getTime() === taskDate.getTime()) {
        this.executeTask(task.taskId);
      }
    });
  }
}
