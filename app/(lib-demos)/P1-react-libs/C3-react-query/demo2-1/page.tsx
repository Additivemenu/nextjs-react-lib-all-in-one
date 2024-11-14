"use client";

import React from "react";
import { useMutation } from "@tanstack/react-query";
import { UserPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";

interface UserDto {
  name: string;
  email: string;
  role: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

const UserForm: React.FC = () => {
  const [formData, setFormData] = React.useState<UserDto>({
    name: "",
    email: "",
    role: "",
  });

  // ! Simulated API call
  const createUser = async (userData: UserDto): Promise<UserData> => {
    // Simulate API endpoint
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.5) {
          // Success case
          resolve({
            ...userData,
            id: Math.random().toString(36).substr(2, 9), // Simulate generated ID
          });
        } else {
          // Error case
          reject({
            message: "Failed to create user",
            code: "USER_CREATION_FAILED",
            details: {
              timestamp: new Date().toISOString(),
              attemptedData: userData,
            },
          });
        }
      }, 1000);
    });
  };

  const mutation = useMutation({
    mutationFn: (userData: UserDto) => createUser(userData),
    onSuccess: (data) => {
      toast("Success", {
        description: `User ${data.name} was successfully created`,
      });
      setFormData({ name: "", email: "", role: "" });
    },
    onError: (error) => {
      console.error("Error creating user", error);

      toast("Error", {
        description: `${error.message}. Please try again.`,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData); // ! mutate here!
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Create New User
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Input
              name="role"
              placeholder="Role"
              value={formData.role}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create User"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserForm;
