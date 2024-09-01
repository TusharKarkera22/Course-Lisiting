import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { adminRegister } from '../redux/slices/authSlice';
import { AppDispatch, RootState } from '../redux/store';
import { useNavigate,Link } from 'react-router-dom';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AdminSignup: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const loading = useSelector((state: RootState) => state.auth.loading);
  const signupError = useSelector((state: RootState) => state.auth.error);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await dispatch(adminRegister({ username, password })).unwrap();
      navigate('/admin/login');
    } catch (err) {
      setError(signupError || 'Registration failed');
    }
  };

  return (
    <Card className="mx-auto  max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Admin SignUp</CardTitle>
        <CardDescription>
          Enter your Admin username and password to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              type="password"
              placeholder="Password"
              required
            />
          </div>
          <Button type="submit" onClick={handleSignup} className="w-full">
            SignUp
          </Button>
          
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="underline">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminSignup;
