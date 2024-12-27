import { Injectable } from '@nestjs/common';
import { CoursesRepository } from './courses.repository';
import { CreateCourseDTO } from 'src/models/courses/dtos/create-course.dto';
import { UpdateCourseDTO } from 'src/models/courses/dtos/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(private readonly coursesRepository: CoursesRepository) {}
  getAll() {
    return this.coursesRepository.getAll();
  }

  getById(id: number) {
    return this.coursesRepository.getById(id);
  }

  create(course: CreateCourseDTO) {
    return this.coursesRepository.create(course);
  }

  update(id: number, course: UpdateCourseDTO) {
    return this.coursesRepository.update(id, course);
  }

  getAllCourseClass(courseId: number, options?: any) {
    return this.coursesRepository.getAllCourseClass(courseId, options);
  }

  // getAllCourseClassWithOption(courseId: number, options: any) {
  //   return this.coursesRepository.getAllCourseClassWithOptions(courseId, options);
  // }

  createCourseClass(courseId: number, data: any) {
    return this.coursesRepository.createCourseClass(courseId, data);
  }

  updateCourseClass(courseId: number, class_id, data: any) {
    return this.coursesRepository.updateCourseClass(courseId, class_id, data);
  }

  deleteCourseClass(courseId: number, class_id) {
    return this.coursesRepository.deleteCourseClass(courseId, class_id);
  }
}
