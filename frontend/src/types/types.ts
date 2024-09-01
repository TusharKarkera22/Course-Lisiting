export interface Course {
  _id: string; 
  title: string;
  description: string;
  price: number;
  imageLink: string;
  instructor: string;
  enrollmentStatus: 'Open' | 'Closed' | 'In Progress';
  duration: string;
  schedule: string;
  location: string;
  prerequisites: string[];
  syllabus: {
    week: number; 
    topic: string;
    content: string;
  }[];
  students: {
    id: number; 
    name: string;
    email: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse {
  statusCode: number;
  message: string;
  data: Course[]; 
  success: boolean;
}
export interface ApiResponseIndividual{
  statusCode: number;
  message: string;
  data: Course; 
  success: boolean;
}

export interface User {
  username: string;
  password: string;
  token?: string;
}
export interface UserCourse {
  courseId: string;
  status: string;
  progress: number; 
}
