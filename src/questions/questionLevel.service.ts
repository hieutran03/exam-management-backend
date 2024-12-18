import { Injectable } from "@nestjs/common";
import { QuestionLevelRepository } from "./questionLevel.repository";

@Injectable()
export class QuestionLevelService {
  constructor(private readonly questionLevelRepository: QuestionLevelRepository) {
  }

  async findAll() {
    return await this.questionLevelRepository.findAll().catch((error) => {
      throw error;
    });
  }

  async findById(id: number) {
    return await this.questionLevelRepository.findById(id).catch((error) => {
      throw error;
    });
  }

  async create(name: string) {
    return await this.questionLevelRepository.create(name).catch((error) => {
      throw error;
    });
  }

  async update(id: number, name: string) {
    return await this.questionLevelRepository.update(id, name).catch((error) => {
      throw error;
    });
  }

  async delete(id: number) {
    return await this.questionLevelRepository.delete(id).catch((error) => {
      throw error;
    });
  }
}