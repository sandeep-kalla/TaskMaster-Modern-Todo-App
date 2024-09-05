"use client";
import React, { useState, useEffect } from 'react'
import { Moon, Sun, Plus, Check, Trash2, ArrowLeft, LogOut } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useRouter } from 'next/navigation'
import { auth, db } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { collection, doc, setDoc, onSnapshot, deleteDoc } from "firebase/firestore";
import { PageTransition } from './page-transition';
import { useDarkMode } from './dark-mode-context';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

const pastelColors = [
  'bg-red-200', 'bg-yellow-200', 'bg-green-200', 'bg-blue-200', 'bg-indigo-200', 'bg-purple-200', 'bg-pink-200'
]

const darkPastelColors = [
  'bg-red-400/30', 'bg-yellow-400/30', 'bg-green-400/30', 'bg-blue-400/30', 'bg-indigo-400/30', 'bg-purple-400/30', 'bg-pink-400/30'
]

export default function TodoPage() {
  const { darkMode, setDarkMode } = useDarkMode();
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')
  const router = useRouter()
  const [user, loading] = useAuthState(auth);
  const [isFadingIn, setIsFadingIn] = useState(true);

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : 'light'
  }, [darkMode])

  useEffect(() => {
    if (!user && !loading) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(collection(db, `users/${user.uid}/tasks`), (snapshot) => {
        setTasks(snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Task)));
      });
      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingIn(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const addTask = async () => {
    if (newTask.trim() && user) {
      const taskRef = doc(collection(db, `users/${user.uid}/tasks`));
      await setDoc(taskRef, { text: newTask, completed: false });
      setNewTask('');
    }
  }

  const toggleTask = async (id: string) => {
    if (user) {
      const taskRef = doc(db, `users/${user.uid}/tasks`, id);
      const task = tasks.find(t => t.id === id);
      if (task) {
        await setDoc(taskRef, { completed: !task.completed }, { merge: true });
      }
    }
  }

  const deleteTask = async (id: string) => {
    if (user) {
      await deleteDoc(doc(db, `users/${user.uid}/tasks`, id));
    }
  }

  const handleLogout = () => {
    setIsFadingIn(true);
    setTimeout(() => {
      signOut(auth);
      router.push('/');
    }, 500);
  }

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <PageTransition>
      <div className={`min-h-screen relative overflow-hidden ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'} transition-colors duration-300`}>
        {/* Animated gradient background */}
        <div className="absolute inset-0 z-0">
          <div 
            className={`absolute inset-0 bg-gradient-to-br ${
              darkMode 
                ? 'from-purple-900/20 via-blue-900/20 to-teal-900/20' 
                : 'from-purple-200/40 via-blue-200/40 to-teal-200/40'
            } animate-gradient-xy`}
          ></div>
          
          {/* Geometric shapes */}
          <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-60 h-60 bg-gradient-to-tr from-blue-400/20 to-teal-400/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse"></div>
          
          {/* Animated dotted grid overlay */}
          <div 
            className="absolute inset-0 animate-slide-dots"
            style={{
              backgroundImage: `radial-gradient(${darkMode ? '#ffffff11' : '#00000011'} 1px, transparent 1px)`,
              backgroundSize: '20px 20px'
            }}
          ></div>
        </div>

        {/* Main content */}
        <div className="relative z-10 container mx-auto p-4 max-w-4xl">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => router.push('/')}
                className="mr-4 hover:bg-transparent"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">TaskMaster</h1>
            </div>
            <div className="flex items-center">
              <div className="flex items-center mr-4">
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold mr-2">
                  {user.displayName ? user.displayName[0].toUpperCase() : '?'}
                </div>
                <span className="hidden md:inline">{user.displayName}</span>
              </div>
              <Button onClick={handleLogout} variant="ghost" className="mr-4">
                <LogOut className="w-5 h-5" />
              </Button>
              <div className="flex items-center bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm rounded-full p-1 shadow-lg">
                <Sun className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-yellow-400'}`} />
                <Switch 
                  checked={darkMode} 
                  onCheckedChange={setDarkMode}
                  className="mx-2"
                />
                <Moon className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-gray-400'}`} />
              </div>
            </div>
          </div>
          <div className="mb-6">
            <div className="flex items-center bg-white/70 dark:bg-gray-800/50 rounded-full shadow-lg backdrop-blur-sm p-1 pr-1 overflow-hidden">
              <Input
                type="text"
                placeholder="Add a new task"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="flex-grow bg-transparent border-none focus:ring-0 focus:outline-none rounded-l-full px-6 py-3 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                style={{ boxShadow: 'none' }}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
              />
              <Button 
                onClick={addTask} 
                className="bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white rounded-full p-3 transition-colors duration-200"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.map((task, index) => (
              <li 
                key={task.id} 
                className={`${darkMode ? darkPastelColors[index % darkPastelColors.length] : pastelColors[index % pastelColors.length]} p-4 rounded-lg flex items-center justify-between transition-all duration-300 ease-in-out ${task.completed ? 'opacity-60' : ''} transform hover:scale-102 hover:shadow-md backdrop-blur-sm h-full`}
              >
                <div className="flex items-center w-full">
                  <Button 
                    variant="ghost" 
                    onClick={() => toggleTask(task.id)}
                    className={`mr-3 rounded-full flex-shrink-0 ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
                  >
                    <Check className={`w-5 h-5 ${task.completed ? 'text-green-500' : 'text-gray-500'}`} />
                  </Button>
                  <span className={`${task.completed ? 'line-through' : ''} ${darkMode ? 'text-gray-200' : 'text-gray-800'} transition-all duration-300 flex-grow break-words`}>
                    {task.text}
                  </span>
                  <Button 
                    variant="ghost" 
                    onClick={() => deleteTask(task.id)}
                    className={`rounded-full flex-shrink-0 ${darkMode ? 'hover:bg-gray-800 text-gray-400 hover:text-red-400' : 'hover:bg-gray-200 text-gray-600 hover:text-red-600'}`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PageTransition>
  )
}