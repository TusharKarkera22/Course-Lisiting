import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createCourse } from '../redux/slices/coursesSlice';
import { AppDispatch, RootState } from '../redux/store';
import { useNavigate } from 'react-router-dom';

const CreateCourse: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const loading = useSelector((state: RootState) => state.courses.loading);
  const error = useSelector((state: RootState) => state.courses.error);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    if (image) formData.append('imageLink', image);

    try {
      await dispatch(createCourse(formData)).unwrap();
      navigate('/courses');
    } catch (err) {
      console.error('Failed to create course:', error);
    }
  };

  return (
    <div>
      <h2>Create Course</h2>
      <form onSubmit={handleCreateCourse}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Course Title"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Course Description"
          required
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Course Price"
          required
        />
        <input
          type="file"
          onChange={handleImageChange}
          required
        />
        <button type="submit" disabled={loading}>Create Course</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default CreateCourse;
