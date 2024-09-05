"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { PageTransition } from './page-transition';
import { useDarkMode } from './dark-mode-context';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
    </g>
  </svg>
);

export function LandingPage() {
  const router = useRouter();
  const [isTitleHovered, setIsTitleHovered] = useState(false);
  const [user, loading] = useAuthState(auth);
  const { darkMode } = useDarkMode();

  const signIn = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      await setDoc(doc(db, "users", result.user.uid), {
        name: result.user.displayName,
        email: result.user.email,
      }, { merge: true });
      router.push('/todo');
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  useEffect(() => {
    const generateParticles = () => {
      const particlesContainer = document.querySelector('.particles-container');
      if (particlesContainer) {
        particlesContainer.innerHTML = '';
        for (let i = 0; i < 50; i++) {
          const particle = document.createElement('div');
          particle.className = 'particle';
          particle.style.left = `${Math.random() * 100}%`;
          particle.style.top = `${Math.random() * 100}%`;
          particle.style.setProperty('--x', `${Math.random() * 200 - 100}px`);
          particle.style.setProperty('--y', `${Math.random() * 200 - 100}px`);
          particle.style.animationDelay = `${Math.random() * 10}s`;
          particlesContainer.appendChild(particle);
        }
      }
    };

    // Generate particles immediately
    generateParticles();

    // Re-generate particles when the window is resized
    window.addEventListener('resize', generateParticles);

    // Use MutationObserver to detect when the particles container is added to the DOM
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const particlesContainer = document.querySelector('.particles-container');
          if (particlesContainer && particlesContainer.innerHTML === '') {
            generateParticles();
          }
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('resize', generateParticles);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <PageTransition>
      <div className={`relative flex flex-col items-center justify-center min-h-screen overflow-hidden ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
        {/* Dark gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 animate-gradient-xy" />

        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="particles-container" />
        </div>

        {/* Content */}
        {!loading && (
          <div className="relative z-10 text-center">
            <h1 
              className="text-6xl md:text-8xl font-extrabold text-white mb-8 transition-all duration-300 ease-in-out"
              style={{
                fontFamily: "'Pacifico', cursive",
                textShadow: isTitleHovered ? '0 0 10px rgba(255,255,255,0.8)' : 'none',
                transform: isTitleHovered ? 'scale(1.05)' : 'scale(1)'
              }}
              onMouseEnter={() => setIsTitleHovered(true)}
              onMouseLeave={() => setIsTitleHovered(false)}
            >
              TaskMaster
            </h1>
            {user ? (
              <div className="flex justify-center">
                <div className={`bg-white/10 backdrop-blur-md rounded-lg p-8 shadow-xl max-w-md w-full ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-purple-500 flex items-center justify-center text-white text-3xl font-bold mr-4">
                      {user.displayName ? user.displayName[0].toUpperCase() : '?'}
                    </div>
                    <div className="text-left">
                      <h2 className="text-2xl font-semibold text-white">{user.displayName}</h2>
                      <p className="text-gray-300 text-sm">{user.email}</p>
                    </div>
                  </div>
                  <p className="text-white mb-6">Welcome back! You're currently logged in.</p>
                  <div className="flex flex-col space-y-4">
                    <Button
                      onClick={() => router.push('/todo')}
                      className={`font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg mx-auto w-3/4 
                        ${darkMode 
                          ? 'bg-teal-600 hover:bg-teal-700 text-white dark:bg-teal-500 dark:hover:bg-teal-600' 
                          : 'bg-teal-400 hover:bg-teal-500 text-white'
                        }`}
                    >
                      Go to Todo List
                    </Button>
                    <Button
                      onClick={handleLogout}
                      className={`font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg mx-auto w-3/4 
                        ${darkMode 
                          ? 'bg-rose-600 hover:bg-rose-700 text-white dark:bg-rose-500 dark:hover:bg-rose-600' 
                          : 'bg-rose-400 hover:bg-rose-500 text-white'
                        }`}
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <Button
                  onClick={signIn}
                  className="bg-white text-gray-900 font-semibold py-4 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 flex items-center shadow-md hover:shadow-lg hover:bg-gray-100"
                >
                  <GoogleIcon />
                  <span className="ml-2 text-lg">Sign in with Google</span>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </PageTransition>
  );
}