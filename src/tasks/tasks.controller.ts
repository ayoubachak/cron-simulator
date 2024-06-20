import { Controller, Get, Post, Param, Body, UseGuards, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Body() task: Task): Promise<Task> {
    try {
      return await this.tasksService.create(task);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create task');
    }
  }

  @Get()
  async findAll(): Promise<Task[]> {
    try {
      return await this.tasksService.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve tasks');
    }
  }

  @Post(':id/execute')
  async execute(@Param('id') id: number): Promise<void> {
    try {
      const task = await this.tasksService.findOne(id);
      if (!task) {
        throw new NotFoundException(`Task with id ${id} not found`);
      }
      await this.tasksService.executeTask(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to execute task');
    }
  }
}
