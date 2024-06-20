import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;
  let repository: Repository<Task>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a task', async () => {
      const task = new Task();
      jest.spyOn(service, 'create').mockImplementation(async () => task);

      expect(await controller.create(task)).toBe(task);
    });
  });

  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      const result = [new Task()];
      jest.spyOn(service, 'findAll').mockImplementation(async () => result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('execute', () => {
    it('should execute a task', async () => {
      const task = new Task();
      jest.spyOn(service, 'findOne').mockImplementation(async () => task);
      jest.spyOn(service, 'executeTask').mockImplementation(async () => undefined);

      await controller.execute(1);
      expect(service.executeTask).toHaveBeenCalledWith(1);
    });

    it('should throw a NotFoundException if the task does not exist', async () => {
      jest.spyOn(service, 'findOne').mockImplementation(async () => undefined);

      await expect(controller.execute(1)).rejects.toThrow(NotFoundException);
    });
  });
});
