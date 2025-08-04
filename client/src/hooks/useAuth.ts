import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Business } from '@shared/schema';

interface AuthResponse {
  business: Business;
}

interface SignInData {
  email: string;
  password: string;
}

interface SignUpData {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

const apiRequest = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
};

export const useAuth = () => {
  const queryClient = useQueryClient();

  // Query to get current authenticated business
  const { data: authData, isLoading, error } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => apiRequest('/api/auth/me'),
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Sign in mutation
  const signInMutation = useMutation({
    mutationFn: (data: SignInData) => apiRequest('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: (data: AuthResponse) => {
      queryClient.setQueryData(['auth', 'me'], data);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });

  // Sign up mutation
  const signUpMutation = useMutation({
    mutationFn: (data: SignUpData) => apiRequest('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: (data: AuthResponse) => {
      queryClient.setQueryData(['auth', 'me'], data);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });

  // Sign out mutation
  const signOutMutation = useMutation({
    mutationFn: () => apiRequest('/api/auth/signout', {
      method: 'POST',
    }),
    onSuccess: () => {
      queryClient.setQueryData(['auth', 'me'], null);
      queryClient.clear();
    },
  });

  const business = authData?.business;
  const isAuthenticated = !!business;

  return {
    business,
    isAuthenticated,
    isLoading,
    error,
    signIn: signInMutation.mutateAsync,
    signUp: signUpMutation.mutateAsync,
    signOut: signOutMutation.mutateAsync,
    isSigningIn: signInMutation.isPending,
    isSigningUp: signUpMutation.isPending,
    isSigningOut: signOutMutation.isPending,
    signInError: signInMutation.error,
    signUpError: signUpMutation.error,
  };
};