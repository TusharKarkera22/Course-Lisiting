import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Course, ApiResponse, ApiResponseIndividual } from '../../types/types';

interface CourseState {
  courses: Course[];
  courseDetails: Course | null;
  userCourses: Course[]; 
  loading: boolean;
  error: string | null;
}

interface ErrorResponse {
  message: string;
}

export const fetchCourses = createAsyncThunk<Course[], void, { rejectValue: ErrorResponse }>(
  'courses/fetchCourses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<ApiResponse>('http://localhost:8080/users/courses', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
        },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchCourseDetails = createAsyncThunk<Course, string, { rejectValue: ErrorResponse }>(
  'courses/fetchCourseDetails',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await axios.post<ApiResponseIndividual>(
        `http://localhost:8080/users/courses/${courseId}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
          },
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createCourse = createAsyncThunk<Course, FormData, { rejectValue: ErrorResponse }>(
  'courses/createCourse',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post<Course>('http://localhost:8080/admin/courses', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const purchaseCourse = createAsyncThunk<Course, string, { rejectValue: ErrorResponse }>(
  'courses/purchaseCourse',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await axios.post<Course>(`http://localhost:8080/users/purchase/${courseId}`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchMyCourses = createAsyncThunk<Course[], void, { rejectValue: ErrorResponse }>(
  'courses/fetchMyCourses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<ApiResponse>(
        'http://localhost:8080/users/mycourses',
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
          },
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const searchCourses = createAsyncThunk<Course[], string, { rejectValue: ErrorResponse }>(
  'courses/searchCourses',
  async (title, { rejectWithValue }) => {
    try {
      const response = await axios.get<ApiResponse>(
        `http://localhost:8080/users/search-courses?title=${title}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
          },
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const markCourseAsCompleted = createAsyncThunk<void, string, { rejectValue: ErrorResponse }>(
  'courses/markCourseAsCompleted',
  async (courseId, { rejectWithValue }) => {
    try {
      await axios.post('http://localhost:8080/courses/complete', { courseId }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
        },
      });
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);


const initialState: CourseState = {
  courses: [],
  courseDetails: null,
  userCourses: [],
  loading: false,
  error: null,
};

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourses.fulfilled, (state, action: PayloadAction<Course[]>) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch courses';
      })
      .addCase(fetchCourseDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourseDetails.fulfilled, (state, action: PayloadAction<Course>) => {
        state.loading = false;
        state.courseDetails = action.payload;
      })
      .addCase(fetchCourseDetails.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch course details';
      })
      .addCase(markCourseAsCompleted.pending, (state) => {
        state.loading = true;
      })
      .addCase(markCourseAsCompleted.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(markCourseAsCompleted.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to mark course as completed';
      });
  },
});

export default coursesSlice.reducer;
