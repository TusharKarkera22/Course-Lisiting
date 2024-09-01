import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createCourse } from '../redux/slices/coursesSlice';
import { AppDispatch, RootState } from '../redux/store';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CreateCourse: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [instructor, setInstructor] = useState<string>('');
  const [enrollmentStatus, setEnrollmentStatus] = useState<'Open' | 'Closed' | 'In Progress'>('Open');
  const [duration, setDuration] = useState<string>('');
  const [schedule, setSchedule] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [prerequisites, setPrerequisites] = useState<string[]>([]);

 
  const [week, setWeek] = useState<number>(1);
  const [topic, setTopic] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [syllabus, setSyllabus] = useState<{ week: number; topic: string; content: string }[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const loading = useSelector((state: RootState) => state.courses.loading);
  const error = useSelector((state: RootState) => state.courses.error);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleAddSyllabus = () => {
    if (topic && content) {
      setSyllabus(prevSyllabus => [
        ...prevSyllabus,
        { week, topic, content }
      ]);
  
      setWeek(prevWeek => prevWeek + 1);
      setTopic('');
      setContent('');
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !price || !instructor || !duration || !schedule || !location) {
      alert('Please fill in all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('instructor', instructor);
    formData.append('enrollmentStatus', enrollmentStatus);
    formData.append('duration', duration);
    formData.append('schedule', schedule);
    formData.append('location', location);
    formData.append('prerequisites', JSON.stringify(prerequisites));
    formData.append('syllabus', JSON.stringify(syllabus));
    if (image) formData.append('imageLink', image);
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
  }
  console.log('Syllabus:', syllabus);

    try {
      const response = await dispatch(createCourse(formData)).unwrap();
      console.log('Course created successfully:', response);
      navigate('/login');
    } catch (err) {
      console.error('Failed to create course:', err);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-lg mx-auto p-6 bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-2xl">Create Course</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateCourse} className="space-y-4">
            <div>
              <Label htmlFor="title">Course Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Course Title"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Course Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Course Description"
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Course Price</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Course Price"
                required
              />
            </div>
            <div>
              <Label htmlFor="instructor">Instructor</Label>
              <Input
                id="instructor"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                placeholder="Instructor"
                required
              />
            </div>
            <div>
              <Label htmlFor="enrollmentStatus">Enrollment Status</Label>
              <Select onValueChange={(value) => setEnrollmentStatus(value as 'Open' | 'Closed' | 'In Progress')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select enrollment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Duration"
                required
              />
            </div>
            <div>
              <Label htmlFor="schedule">Schedule</Label>
              <Input
                id="schedule"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                placeholder="Schedule"
                required
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                required
              />
            </div>
            <div>
              <Label htmlFor="prerequisites">Prerequisites</Label>
              <Textarea
                id="prerequisites"
                value={prerequisites.join(', ')}
                onChange={(e) => setPrerequisites(e.target.value.split(',').map(p => p.trim()))}
                placeholder="Prerequisites (comma separated)"
              />
            </div>
            <div>
              <Label htmlFor="syllabus">Syllabus</Label>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="week">Week</Label>
                  <Input
                    id="week"
                    type="number"
                    value={week}
                    onChange={(e) => setWeek(Number(e.target.value))}
                    placeholder="Week"
                  />
                </div>
                <div>
                  <Label htmlFor="topic">Topic</Label>
                  <Input
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Topic"
                  />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Content"
                  />
                </div>
                <Button type="button" onClick={handleAddSyllabus}>Add Syllabus</Button>
                <ul>
                  {syllabus.map((entry, index) => (
                    <li key={index}>{`Week ${entry.week}: ${entry.topic} - ${entry.content}`}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <Label htmlFor="image">Course Image</Label>
              <Input
                id="image"
                type="file"
                onChange={handleImageChange}
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Course'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateCourse;
